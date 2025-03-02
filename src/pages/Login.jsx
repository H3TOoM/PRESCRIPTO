import React from "react";
import { useState } from "react";
import "./style.css";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };
  return (
    <form className="min-h-[80vh] flex items-center">
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
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className="border border-zinc-300 rounded w-full p-2 mt-1 outline-0"
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1 outline-0"
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1 outline-0"
          />
        </div>
        <button className="create text-white w-full py-2 rounded-md text-base mt-3 cursor-pointer">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>
            Already Have An Account?{" "}
            <span
              className="text-blue-400 underline cursor-pointer"
              onClick={() => setState("Login")}
            >
              {" "}
              Login Here
            </span>
          </p>
        ) : (
          <p>
            Create An Account?{" "}
            <span
              className="text-blue-400 underline cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
