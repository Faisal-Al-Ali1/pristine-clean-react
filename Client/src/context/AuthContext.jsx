import React, { createContext, useState, useEffect } from 'react';
import { getMe } from '../api/users'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const checkAuth = async () => {
      try {
        const  data  = await getMe();
        setUser(data.user);
      } catch (error) {
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
