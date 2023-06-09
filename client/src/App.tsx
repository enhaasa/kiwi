import React from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Dashboard />} path="/" />
        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<Login />} path="/login" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
