import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainPage from './pages/MainPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/LoginPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <MainPage />
  },
  {
    path: "/login",
    element: 
      <Login />

  }
])


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


