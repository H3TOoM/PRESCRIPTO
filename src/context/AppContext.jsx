import { createContext,useState } from "react";
import { doctors } from "../assets/assets";


export const AppContext = createContext();


const AppContextProvider = (props) => {
  const [token, setToken] = useState(false);
  const value = {
    doctors,token,setToken
  };

  return(
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  )
};

export default AppContextProvider;
