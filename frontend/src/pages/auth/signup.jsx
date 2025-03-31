import React, { useContext, useRef, useState } from "react";
import z from "zod";
import { CiSquareRemove } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";

import { API_PATHS, baseUrl } from "../../utility/apiPaths";
import { useUser } from "../../context/userContext";
import axios from "axios";

const signupSchema = z.object({
  fullname: z.string().min(3, "Fullname must be of at least 3 characters "),
  bio: z
    .string()
    .max(100, "Bio can be of length 100 characters at max")
    .optional(),
  username: z.string().min(1),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const Signup = () => {
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    fullname: "",
    bio: "",
    email: "",
    password: "",
  });
  const [previewUrl, setPreviewUrl] = useState("");

  const imageRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl("");
    if (imageRef.current) {
      imageRef.current.value = ""; // Clear the input value too
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");
    setErrors({ username: "", email: "", password: "", bio: "", fullname: "" });

    const formData = { username, email, password, bio, fullname };
    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const newErrors = {
        username: "",
        email: "",
        password: "",
        bio: "",
        fullname: "",
      };
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const signupData = new FormData();
      signupData.append("username", username);
      signupData.append("fullname", fullname);
      signupData.append("bio", bio);
      signupData.append("email", email);
      signupData.append("password", password);
      if (image) {
        signupData.append("avatar", image);
      }

      const response = await axios.post(
        baseUrl + API_PATHS.auth.SIGNUP,
        signupData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      const { user } = response.data;

      localStorage.setItem("thread-user", user);
      updateUser(user);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setSignupError(error.response.data.message);
      } else {
        setSignupError("Something went wrong while signing up");
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    imageRef.current.click();
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <div className="w-full max-w-[300px min-w-[400px] mx-auto overflow-hidden shadow-xl bg-[#101010] rounded-lg">
        <div className="px-6 py-4">
          <h3 className="mt-3 text-xl font-medium text-center text-white">
            Create an Account
          </h3>
          <p className="mt-1 text-center text-white/40">Join us today!</p>

          {/* Profile Image Upload */}
          <div className="flex justify-center mt-4 relative">
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div
              onClick={triggerFileInput}
              className="cursor-pointer flex items-center justify-center w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 relative"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="object-cover w-28 h-28"
                />
              ) : (
                <span className="text-white/60">Add Photo</span>
              )}
            </div>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-[#101010] rounded-full p-1 shadow-md hover:bg-gray-800"
              >
                <CiSquareRemove className="w-8 h-8 text-red-500 cursor-pointer" />
              </button>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="w-full">
              <input
                value={fullname}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, fullname: "" }));
                  setFullname(e.target.value);
                }}
                className="block w-full px-4 py-2 mt-2 text-white placeholder-white/60 bg-white/10 rounded-lg outline-none focus:ring focus:ring-white/50"
                type="text"
                placeholder="Fullname"
                autoComplete="off"
              />
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>
              )}
            </div>

            <div className="w-full mt-4">
              <input
                value={bio}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, bio: "" }));
                  setBio(e.target.value);
                }}
                className="block w-full px-4 py-2 mt-2 text-white placeholder-white/60 bg-white/10 rounded-lg outline-none focus:ring focus:ring-white/50"
                type="text"
                placeholder="Bio"
                autoComplete="off"
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
              )}
            </div>

            {/* Username */}
            <div className="w-full mt-4">
              <input
                value={username}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, username: "" }));
                  setUsername(e.target.value);
                }}
                className="block w-full px-4 py-2 mt-2 text-white placeholder-white/60 bg-white/10 rounded-lg outline-none focus:ring focus:ring-white/50"
                type="text"
                placeholder="Username"
                autoComplete="off"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="w-full mt-4">
              <input
                value={email}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, email: "" }));
                  setEmail(e.target.value);
                }}
                className="block w-full px-4 py-2 mt-2 text-white placeholder-white/60 bg-white/10 rounded-lg outline-none focus:ring focus:ring-white/50"
                type="email"
                placeholder="Email Address"
                autoComplete="off"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="w-full mt-4">
              <input
                value={password}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, password: "" }));
                  setPassword(e.target.value);
                }}
                className="block w-full px-4 py-2 mt-2 text-white placeholder-white/60 bg-white/10 rounded-lg outline-none focus:ring focus:ring-white/50"
                type="password"
                placeholder="Password"
                autoComplete="off"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className={` flex items-center justify-center cursor-pointer px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform ${
                  loading
                    ? "bg-gray-20/70 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-400"
                } rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50`}
              >
                {loading ? (
                  <div
                    className="animate-spin inline-block size-4 border-3 border-current border-t-transparent text-gray-800 rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
              <div className="text-xl text-red-500">{signupError}</div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center py-4 text-center mt-3 bg-black">
          <span className="text-sm text-white/50">
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="mx-2 text-sm font-bold text-blue-500 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
