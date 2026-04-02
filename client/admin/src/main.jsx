import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import LoginForm from './LoginForm';
import App from './App';
import Nicetry from './Nicetry';
import ProtectedRoute from './components/Layout/ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin" element={<ProtectedRoute><App /></ProtectedRoute>} />
        <Route path="/nicetry" element={<Nicetry />} />
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
