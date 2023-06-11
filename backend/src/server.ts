require('dotenv').config();

import express = require('express');
import path = require('path');
import cors = require('cors');
import cookieParser = require('cookie-parser');
import Logins from './logins';
import { Request, Response } from 'express';
import Database from './database';
import { Token, LoginAttempt, LoginCookie } from '@shared/servertypes';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3001;
const LOGGING = true;

function validateCookieToken(authToken:string) {
  
  LOGGING && console.log("Client attempted to access secure page.");
  
  if (authToken) {
    const serializedCookie:Token = JSON.parse(authToken).value.token;
    const result = Logins.tryCookieLogin(serializedCookie.id);

    if (result.isSuccessful) {
      LOGGING && console.log("Cookie login succeeded!")
      return true;
    }
    LOGGING && console.log("Cookie login failed.");
    return false;
  } 

  LOGGING && console.log("No cookie found.");
  return false;
}

app.get('/login', (req:Request, res:Response) => {
  res.sendFile(path.join(__dirname, './../../client/build/index.html'));
});

app.get(['/', '/dashboard'], (req:Request, res:Response) => {
  const { authToken } = req.cookies;

  if (validateCookieToken(authToken)) {
    LOGGING && console.log("Serving secure content.");
    res.sendFile(path.join(__dirname, './../../client/build/index.html'));
  } else {
    LOGGING && console.log("Redirecting to login page.");
    res.redirect('/login');
  }    
});

app.use(express.static(path.join(__dirname, './../../client/build')));

app.post('/login', async (req: Request, res: Response) => {
  LOGGING && console.log("Attempting login...");

  const { username, password, realm} = req.body;
  const result:LoginAttempt = await Logins.tryDatabaseLogin(username, password, realm);
  
  if (result.isSuccessful) {
    LOGGING && console.log("Login credentials validated against the server successfully!");
    const token:Token = Logins.generateToken();
    const cookie:LoginCookie = Logins.generateCookie(token, result.user.access_level, result.user.id);

    Logins.add(result.user, token);
    console.log(Logins.loggedInUsers)

    res.send({ 
      isSuccessful: result.isSuccessful, 
      message: result.message, 
      cookie: cookie,
      user: {
        access_level: result.user.access_level
      }
    });
  } else {
    res.send({
      isSuccessful: result.isSuccessful, 
      message: result.message
    });
  }
});

app.post('/get', async (req: Request, res: Response) => {
  const { token_id, table } = req.body;
  console.log(token_id)
  const user = Logins.getLoggedInUserByToken(token_id);
  console.log(user)
  if(!user) {
    res.redirect("/login");
    /*
    res.send({
      isSuccessful: false,
      message: "User not logged in."
    });*/
    return;
  } 

  const validationResult = Database.validateRequest(user, table, "get");
  if (!validationResult.isSuccessful) {
    res.send({
      isSuccessful: false,
      message: validationResult.message
    });
    return;
  } 
  let queryString = `SELECT * FROM ${table}`;
  let expectSingularResult = false;

  switch(table) {
    case "realm": 
      queryString = `SELECT founding_date, name, address FROM realms
      WHERE id = ${user.realm_id} LIMIT 1`;
      expectSingularResult = true;
    break;
  }

  const data = await Database.query(
    queryString, expectSingularResult 
  );

  res.send({
    isSuccessful: true,
    message: "Successfully fetched data.",
    data: data
  });
});

// Error handling middleware
app.use((err: any, res: Response) => {
  LOGGING && console.error(err);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

