import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import About from "./pages/About";
import MyProfile from "./pages/MyProfile";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VerifyOTP from "./pages/VerifyOTP";
import InquiriesBtn from "./components/InquiriesBtn";
import Inquiries from "./pages/Inquiries";
import EditAppointment from "./pages/EditAppointment";
import ForgotPassword2 from "./pages/ForgotPassword2";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const App = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/My-Appointment" element={<MyAppointment />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/inquiries" element={<Inquiries/>}/>
        <Route path="/edit-appointment" element={<EditAppointment/>}/>
        
        {/* ForgotPassword2 Routes */}
        <Route path="/forgot-password2" element={<ForgotPassword2 />} />
        <Route path="/forgot-password2/:step" element={<ForgotPassword2 />} />
      </Routes>
      <InquiriesBtn/>
      <Footer/>
    </div>
  );
};

export default App;
