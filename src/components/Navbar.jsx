import React, { useState } from "react";
import { assets } from "../assets/assets";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const  Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setMenu] = useState(false);
  const [token, setToken] = useState(true);

  return (
    <section className="flex item-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 uppercase">
      <a href="/prescripto">
        <img className="w-40 cursor-pointer" src={assets.logo} alt="" onClick={()=> navigate('/prescripto')}/>
      </a>
      <ul className="hidden md:flex gap-4 font-medium ml-[220px] mx-auto items-center">
        <NavLink to='/prescripto'>
          <li className="py-1">Home</li>
          <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-[#5F6FFF] hidden" />
        </NavLink>

        <NavLink to='/doctors'>
          <li className="py-1">All Doctors</li>
          <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-[#5F6FFF] hidden" />
        </NavLink>

        <NavLink to='/about'>
          <li className="py-1">About</li>
          <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-[#5F6FFF] hidden" />
        </NavLink>

        <NavLink to='/contact'>
          <li className="py-1">Contact</li>
          <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-[#5F6FFF] hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img src={assets.profile_pic} alt="" className="w-8 rounded-full"/>
            <img src={assets.dropdown_icon} alt="" className="w-2.5"/>
            <div className="absolute top-0 right-0 pt-15 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p className="hover:text-black cursor-pointer" onClick={() => navigate("my-profile")}>My Profile</p>
                <p className="hover:text-black cursor-pointer" onClick={() => navigate("my-appointment")}>Appointment</p>
                <p className="hover:text-black cursor-pointer" onClick={() => setToken(false)}>Log Out</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="bg-[#5F6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer text-medium hover:opacity-[0.8]"
            onClick={() => navigate("/login")}
          >
            Create Account
          </button>
        )}
        <img src={assets.menu_icon} alt="" className="w-6 md:hidden" onClick={() => setMenu(true)}/>
        {/* Menu for mobile */}
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transtion-all duration-300`}>
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} alt="" className="w-36"/>
            <img src={assets.cross_icon} alt="" onClick={() => setMenu(false)} className="w-7"/>
          </div>
          <ul className="flex flex-col items-center gap-2 px-5 text-lg font-medium">
            <NavLink onClick={() => showMenu(false)} className="px-4 py-2 rounded inline-block" to='/prescripto'>Home</NavLink>
            <NavLink onClick={() => showMenu(false)} className="px-4 py-2 rounded inline-block" to='/doctors'>All Doctors</NavLink>
            <NavLink onClick={() => showMenu(false)} className="px-4 py-2 rounded inline-block" to='/about'>About</NavLink>
            <NavLink onClick={() => showMenu(false)} className="px-4 py-2 rounded inline-block" to='/contact'>Contact</NavLink>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Navbar;
