import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handlerChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const storedData = JSON.parse(localStorage.getItem("UserData"));

    if (state === "Sign Up") {
      localStorage.setItem("UserData", JSON.stringify(userInfo));
      Swal.fire({
        title: "Sign Up Successful",
        icon: "success",
      });
      navigate("/");
      location.reload();
    } else {
      if (
        storedData &&
        storedData.email === userInfo.email &&
        storedData.password === userInfo.password
      ) {
        Swal.fire({
          title: "Login Successful",
          icon: "success",
        });
        navigate("/");
        location.reload();
      } else {
        Swal.fire({
          title: "Login Failed",
          text: "Invalid email or password",
          icon: "warning",
        });
      }
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 rounded-lg text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "login"} to book appointment
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              type="text"
              name="name"
              onChange={handlerChange}
              value={userInfo.name}
              required
              className="border border-zinc-300 rounded w-full p-2 mt-1 outline-0"
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            name="email"
            onChange={handlerChange}
            value={userInfo.email}
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1 outline-0"
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            name="password"
            onChange={handlerChange}
            value={userInfo.password}
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1 outline-0"
          />
        </div>

        <button className="bg-[#5F6FFF] text-white px-8 py-3 rounded-md font-light md:block cursor-pointer text-medium hover:opacity-[0.8] m-auto mt-5">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              className="text-blue-400 underline cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login Here
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span
              className="text-blue-400 underline cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
