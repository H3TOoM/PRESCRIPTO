import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm"> 
        {/* left section */}
        <div>
          <img src={assets.logo} alt="" className="mb-5 w-40"/>
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* center section */}
        <div>
          <p className="uppercase font-medium mb-5 text-xl">Company</p>
          <ul className="capitilaze flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* right section */}
        <div>
          <p className="uppercase font-medium mb-5 text-xl">Get In Touch</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>prescripto@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* copy right text */}
      <div>
        <hr className="text-gray-600"/>
        <p className="capitilaze text-center text-md py-5">Copyright © 2025 Prescripto - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
