import './i18n';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import React from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="455266084217-ddbk4ku310ijlog5bilvjqmqli08ipra.apps.googleusercontent.com">
    <BrowserRouter>
      <AppContextProvider>
        <AuthProvider><App /></AuthProvider>
      </AppContextProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
