import React, { useState } from "react";
import z from "zod";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";
import { API_PATHS, baseUrl } from "../utility/apiPaths";

const updateSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Minimum password length is 8 characters"),
  fullname: z.string().min(3, "Fullname is required"),
  bio: z.string().optional(),
});
const UpdateUser = ({ user, updateUser, setOpenUpdateModal }) => {
  const [username, setUsername] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState(user?.fullname);
  const [loading, setLoading] = useState(false);

  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    fullname: "",
    bio: "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setLoading(true);
    setUpdateSuccess("");
    setErrors({
      username: "",
      password: "",
      fullname: "",
      bio: "",
    });

    const updateDetails = { username, password, fullname, bio };
    const parsedData = updateSchema.safeParse(updateDetails);

    if (!parsedData.success) {
      const fieldErrors = parsedData.error.format();
      setErrors({
        username: fieldErrors.username?._errors?.[0] || "",
        password: fieldErrors.password?._errors?.[0] || "",
        fullname: fieldErrors.fullname?._errors?.[0] || "",
        bio: fieldErrors.bio?._errors?.[0] || "",
      });
      setLoading(false);
      return;
    }
    try {
      const p = new Promise((resolve) => setTimeout(resolve, 3000));
      await p;
      const formData = {
        username,
        password,
        fullname,
        bio,
      };
      console.log("updating user with new fields ", formData);

      const resp = await axios.post(
        baseUrl + API_PATHS.user.UPDATE_PROFILE,
        formData,
        {
          withCredentials: true,
        }
      );
      if (resp.data.status === 200) {
        updateUser(resp.data.user);
        setUpdateSuccess("Successfully updated Profile");
      }
    } catch (err) {
      console.log(err.response.error);
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";

      setUpdateError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white min-w-[300px]">
      <div className="space-y-7">
        <div className="flex flex-col space-y-1">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            className="bg-white/5 rounded-lg p-2 text-lg   "
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="fullname" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="fullname"
            className="bg-white/5 rounded-lg p-2 text-lg   "
            placeholder="Enter your full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          {errors.fullname && (
            <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="bio" className="text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            className="bg-white/5 rounded-lg p-2 text-lg  resize-none "
            placeholder="Tell us about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Current Password
          </label>
          <input
            id="password"
            type="password"
            className="bg-white/5 rounded-lg p-2 text-lg  resize-none "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
      </div>
      <div className="flex justify-center text-red-500 w-full text-sm my-2">
        {updateError}
      </div>
      <div className="flex justify-center text-green-500 w-full text-sm my-2">
        {updateSuccess}
      </div>
      <div className="flex w-full mt-2 ">
        <button
          disabled={loading}
          className="w-1/2 hover:bg-white/20 rounded-lg p-2 cursor-pointer"
          onClick={handleUpdate}
        >
          {loading ? <LoadingSpinner></LoadingSpinner> : "Update"}
        </button>
        <button
          className="w-1/2 hover:bg-white/20 rounded-lg p-2 cursor-pointer"
          onClick={() => setOpenUpdateModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateUser;
