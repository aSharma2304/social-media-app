import React, { useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";
import { API_PATHS, baseUrl } from "../utility/apiPaths";

const NewPost = ({ user, setOpenPostModal, setUserPosts }) => {
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const triggerFileInput = () => {
    imageRef.current.click();
  };

  const handleCreatePost = async () => {
    setLoading(true);
    setContentError("");

    if (content === "") {
      setLoading(false);
      setContentError("Cannot create a empty post");
      return;
    }
    try {
      const res = await axios.post(
        baseUrl + API_PATHS.post.CREATE_POST,
        {
          text: content,
          image: image,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;
      setUserPosts((prev) => [data.post, ...prev]);

      console.log("success post");
      setOpenPostModal(false);
    } catch (err) {
      console.log("error while creating post", err);
      setContentError("Something went wrong while creating post");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col space-y-3 min-w-[300px]">
      <div className="flex flex-col space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Content
        </label>
        <textarea
          id="content"
          className="bg-white/5 rounded-lg p-3 text-lg  resize-none "
          placeholder="What's on your mind today?"
          value={content}
          onChange={(e) => {
            if (contentError) {
              setContentError("");
            }
            setContent(e.target.value);
          }}
          rows="3"
        />
        {contentError && (
          <p className="mt-1 text-sm text-red-500">{contentError}</p>
        )}
      </div>
      <div className="flex flex-col space-y-2 ">
        <label htmlFor="image" className="text-sm font-medium">
          Image
        </label>
        <input
          id="image"
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <div
          onClick={triggerFileInput}
          className="cursor-pointer flex items-center justify-center w-full rounded-xl h-36 overflow-hidden border-2 border-white/20 bg-white/10 relative"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Image Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-white/60">Add Photo</span>
          )}
        </div>
      </div>
      {previewUrl && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="bg-red-500/70 hover:bg-red-400/70 rounded-xl p-2 text-center text-lg w-full shadow-lg transition-all duration-200 ease-in-out text-white cursor-pointer font-medium"
        >
          Remove Image
        </button>
      )}

      <div className="flex w-full mt-2 ">
        <button
          disabled={loading}
          className="w-1/2 hover:bg-white/20 rounded-lg p-2 cursor-pointer"
          onClick={handleCreatePost}
        >
          {loading ? <LoadingSpinner></LoadingSpinner> : "Create"}
        </button>
        <button
          className="w-1/2 hover:bg-white/20 rounded-lg p-2 cursor-pointer"
          onClick={() => setOpenPostModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewPost;
