import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router';
import Register from './features/auth/pages/Register.jsx';
import Login from './features/auth/pages/login.jsx';



export const router = createBrowserRouter([
     {
        path : '/register',
        element : <Register />
     } ,
     {
        path : '/login',
        element : <Login />
     }
]);
  
