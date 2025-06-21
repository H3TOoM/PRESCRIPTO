import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  // const formik = useFormik()

  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: email,
      password: password,
      confirmPassword: password,
      gender: gender,
      role: 2,
      rememberMe: true,
    },
    validationSchema: Yup.object({
      ...(state === "Sign Up" && {
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        gender: Yup.string().required('Gender is required'),

      }),
      email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(12, state === "Sign Up" ? 'Password must be at least 12 characters' : undefined)
        .matches(/[A-Z]/, state === "Sign Up" ? 'Password must contain at least one uppercase letter' : undefined)
        .matches(/[a-z]/, state === "Sign Up" ? 'Password must contain at least one lowercase letter' : undefined)
        .matches(/[0-9]/, state === "Sign Up" ? 'Password must contain at least one number' : undefined)
        .matches(/[^A-Za-z0-9]/, state === "Sign Up" ? 'Password must contain at least one special character' : undefined)
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');

      try {
        if (state === "Sign Up") {
          const registerData = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            gender: values.gender === 'Male' ? 0 : 1,
            role: values.role === 'Doctor' ? 1 : 2
          };

          const response = await authService.register(registerData);
          if (response.success) {
            navigate('/verify-otp', {
              state: {
                email: values.email,
                password: values.password
              }
            });
          } else {
            setError(response.message || 'Registration failed');
          }
        } else {
          const loginData = {
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe
          };
          const response = await authService.login(loginData);

          if (response.success || response.accessToken) {
            login(response, response.accessToken);

            navigate('/profile');
            location.reload();
            return;
          }

          setError(response.message || 'Login failed');
        }
      } catch (err) {
        setError(err.response?.data?.message || `${state} failed`);
      } finally {
        setLoading(false);
      }
    },
  });

  const switchMode = () => {
    setState(state === "Login" ? "Sign Up" : "Login");
    formik.resetForm();
    setError('');
  };

  return (
    <form onSubmit={formik.handleSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-5 min-w-[340px] sm:min-w-96 border border-gray-200 rounded-lg text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state === "Sign Up" ? "Create Account" : "Login"}</p>
        <p>Please {state.toLowerCase()} to book appointment</p>

        {error && (
          <div className="w-full p-3 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}        {state === "Sign Up" && (
          <>
            <div className="w-full">
              <p>First Name</p>
              <input
                type="text"
                name="firstName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                className={`border rounded w-full p-2 mt-1 outline-0 ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : 'border-zinc-300'
                  }`}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
              )}
            </div>
            <div className="w-full">
              <p>Last Name</p>
              <input
                type="text"
                name="lastName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                className={`border rounded w-full p-2 mt-1 outline-0 ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : 'border-zinc-300'
                  }`}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
              )}
            </div>
          </>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`border rounded w-full p-2 mt-1 outline-0 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-zinc-300'
              }`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
          )}
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={`border rounded w-full p-2 mt-1 outline-0 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-zinc-300'
              }`}
          />          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
          )}
        </div>



        {state === "Sign Up" && (
          <>
            <div className="w-full">
              <p>Gender</p>
              <select
                name="gender"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.gender}
                className={`border rounded w-full p-2 mt-1 outline-0 ${formik.touched.gender && formik.errors.gender ? 'border-red-500' : 'border-zinc-300'
                  }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.gender}</div>
              )}
            </div>
          </>
        )}
        {state !== "Sign Up" && (
          <div className="w-full flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
              className="mr-2"
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#5F6FFF] text-white px-8 py-3 rounded-md font-light md:block cursor-pointer text-medium hover:opacity-[0.8] disabled:opacity-50 m-auto mt-5"
        >
          {loading ? 'Please wait...' : (state === "Sign Up" ? "Create Account" : "Login")}
        </button>

        {state === "Sign Up" ? (
          <p className="text-center w-full">
            Already have an account?{" "}
            <span
              className="text-blue-400 underline cursor-pointer"
              onClick={switchMode}
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className="text-center w-full">
            Don't have an account?{" "}
            <span
              className="text-blue-400 underline cursor-pointer"
              onClick={switchMode}
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