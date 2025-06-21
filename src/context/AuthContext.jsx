import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { assets } from '../assets/assets';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          const pictureData = await authService.getCurrentProfilePicture();
          
          setCurrentUser({
            ...userData,
            image: pictureData.success ? pictureData.fileUrl : assets.profile_pic,
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Token might be invalid, so log out
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (userData, accessToken) => {
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUser = (newUserData) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...newUserData
    }));
  };

  const value = {
    currentUser,
    token,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};