import { createContext, useEffect, useState } from "react";
import {doctors} from "../assets/doctorsData"

export const AppContext = createContext();


const AppContextProvider = (props) => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const fetchedToken = localStorage.getItem("token")

    if (fetchedToken) {
      setToken(true)
    } else {
      setToken(false)
    }
  }, [])
  const value = {
    doctors, token, setToken
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
};

export default AppContextProvider;
