import { createContext, useState } from "react";
import { doctors } from "../assets/assets";


export const AppContext = createContext();


const AppContextProvider = (props) => {
  const [token, setToken] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const value = {
    doctors, token, setToken, backendUrl
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
};

export default AppContextProvider;
