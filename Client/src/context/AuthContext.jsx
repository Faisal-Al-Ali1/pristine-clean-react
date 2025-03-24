// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getMe } from '../api/users'; 

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app load, check if we have an active session
    const checkAuth = async () => {
      try {
        // Use credentials for cookies
        const  data  = await getMe();
        // If successful, store the user object
        setUser(data.user);
      } catch (error) {
        // If 401 or any error, user is not logged in
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
