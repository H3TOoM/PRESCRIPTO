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


const App = () => {
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
        <Route path="/Appointment/:docId" element={<Appointment />} />
        <Route path="/inquiries" element={<Inquiries/>}/>
        <Route path="/edit-appointment" element={<EditAppointment/>}/>
      </Routes>
      <InquiriesBtn/>
      <Footer/>
    </div>
  );
};

export default App;
