import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const PrivateRoute = ({ children }) => {
    return auth.currentUser ? children : <Navigate to="/" />;
};

export default PrivateRoute;
