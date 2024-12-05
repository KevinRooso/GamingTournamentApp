import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const isAuthenticated = localStorage.getItem('token'); // Check authentication status
    return isAuthenticated ? <WrappedComponent {...props} /> : <Navigate to="/" />;
  };
};

export default withAuth;
