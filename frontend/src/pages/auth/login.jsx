import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import z from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utility/apiPaths";
import { baseUrl } from "../../utility/apiPaths";
import { useUser } from "../../context/userContext";

// Zod Schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Minimum password length is 8 characters"),
});

const Login = () => {
  const navigate = useNavigate();

  const { updateUser } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Instead of a single error string, we use an object to hold per-field errors
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    setErrors({ username: "", password: "" }); // Clear old errors

    const userDetails = { username, password };
    const parsedData = loginSchema.safeParse(userDetails);

    if (!parsedData.success) {
      // Extract Zod errors into { email, password } object
      const fieldErrors = parsedData.error.format();
      setErrors({
        username: fieldErrors.username?._errors?.[0] || "",
        password: fieldErrors.password?._errors?.[0] || "",
      });
      setLoading(false);
      return;
    }

    // const res = await console.log("Form Data:", userDetails);
    // setLoading(false);
    // navigate("/dashboard");

    try {
      const response = await axios.post(
        baseUrl + API_PATHS.auth.LOGIN,
        userDetails,
        {
          withCredentials: true,
        }
      );

      const { user } = response.data;
      // console.log(user);

      if (user) {
        // localStorage.setItem("jwt-token", token);
        console.log(user);
        updateUser(user);
        localStorage.setItem("thread-user", user);
        setLoading(false);
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setLoginError(err.response.data.message);
      } else {
        setLoginError("Something went wrong while loggin in");
        console.log(err);
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm mx-auto overflow-hidden  shadow-xl bg-[#101010] rounded-lg ">
        <div className="px-6 py-4">
          <h3 className="mt-3 text-xl font-medium text-center text-white">
            Welcome Back
          </h3>
          <p className="mt-1 text-center text-white/40">
            Login or create account
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="w-full mt-4">
              <input
                value={username}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, username: "" }));
                  setUsername(e.target.value);
                }}
                className="block w-full px-4 py-2 mt-2 text-white placeholder-white/60 bg-white/10 rounded-lg outline-none focus:ring focus:ring-white/50"
                autoComplete="false"
                placeholder="Username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="w-full mt-4">
              <input
                value={password}
                autoComplete="false"
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, password: "" }));
                  setPassword(e.target.value);
                }}
                className="block w-full px-4 py-2 mt-2 text-white placeholder-white/60 bg-white/10 rounded-lg outline-none focus:ring focus:ring-white/50"
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className={` flex items-center justify-center cursor-pointer px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform ${
                  loading
                    ? "bg-gray-200/70 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-400"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50`}
              >
                {loading ? (
                  <div
                    className="animate-spin inline-block size-4 border-3 border-current border-t-transparent text-gray-800 rounded-full "
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
              <div className="text-xl text-red-500 ">{loginError}</div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center py-4 text-center mt-3 bg-black">
          <span className="text-sm text-white/50">Don't have an account? </span>
          <Link
            to="/signup"
            className="mx-2 text-sm font-bold text-blue-500 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
