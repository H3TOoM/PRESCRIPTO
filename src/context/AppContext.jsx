import { createContext, useEffect, useState } from "react";
import doctorService from "../services/doctorService";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [token, setToken] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchedToken = localStorage.getItem("token");
    if (fetchedToken) {
      setToken(true);
    } else {
      setToken(false);
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        setDoctors(data);
      } catch (error) {
        setDoctors([]); // Show nothing if API fails
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const value = {
    doctors,
    token,
    setToken,
    loadingDoctors,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
