require('dotenv').config();

import express = require('express');
import path = require('path');
import cors = require('cors');
import cookieParser = require('cookie-parser');
import Logins from './logins';
import { Request, Response } from 'express';
import { Token, LoginAttempt, LoginCookie } from '@shared/servertypes';

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3001;
const LOGGING = false;

function validateCookieToken(req) {
  LOGGING && console.log("Client attempted to access secure page.");
  const { authToken } = req.cookies;

  if (authToken) {
    const serializedCookie = JSON.parse(JSON.parse(authToken).value);
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

app.get('/login', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, './../../client/build/index.html'));
});

app.get(['/', '/dashboard'], (req, res) => {
  if (validateCookieToken(req)) {
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
    const cookie:LoginCookie = Logins.generateCookie(token);

    Logins.add(result.user, token);
    res.send({ 
      isSuccessful: result.isSuccessful, 
      message: result.message, 
      cookie: cookie 
    });
  } else {
    res.send({
      isSuccessful: result.isSuccessful, 
      message: result.message
    })
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  LOGGING && console.error(err);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

