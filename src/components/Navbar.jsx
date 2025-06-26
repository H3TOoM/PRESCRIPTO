import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, token, logout: authLogout, loading } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const { i18n, t } = useTranslation();

  const logout = () => {
    authLogout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <assets.logo
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        alt=""
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">{t("nav_home")}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">{t("nav_doctors")}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">{t("nav_about")}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">{t("nav_contact")}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : token && currentUser ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={currentUser.image || assets.profile_pic}
              alt="User Profile"
              onError={(e) => {
                e.target.src = assets.profile_pic;
              }}
            />
            <assets.dropdown_icon className="w-2.5" alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/profile")}
                  className="hover:text-black cursor-pointer"
                >
                  {t("nav_profile")}
                </p>
                <p
                  onClick={() => navigate("/My-Appointment")}
                  className="hover:text-black cursor-pointer"
                >
                  {t("nav_appointments")}
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  {t("nav_logout")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5F6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            {t("nav_create_account")}
          </button>
        )}
        <button
          onClick={() => {
            const newLang = i18n.language === "ar" ? "en" : "ar";
            i18n.changeLanguage(newLang);
            localStorage.setItem("i18nextLng", newLang);
          }}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
          title="Change Language"
        >
          <span role="img" aria-label="language">🌐</span>
        </button>
        <assets.menu_icon
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          alt=""
        />
        {/* ---------- Mobile Menu ---------- */}
        <div
          className={`${showMenu ? "fixed w-full" : "h-0 w-0"
            } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <assets.logo className="w-36" alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">{t("nav_home")}</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">{t("nav_doctors")}</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">{t("nav_about")}</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">{t("nav_contact")}</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;