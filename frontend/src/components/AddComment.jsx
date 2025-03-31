import React, { useState } from "react";
import { API_PATHS, baseUrl } from "../utility/apiPaths";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const AddComment = ({ setOpenAddCommentModal, setCommentsData, postId }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState("");
  const [commentError, setCommentError] = useState("");

  const handleCreateComment = async () => {
    setLoading(true);
    setCommentError("");

    if (comment === "") {
      setLoading(false);
      setCommentError("Cannot create a empty comment");
      return;
    }
    try {
      const res = await axios.post(
        baseUrl + API_PATHS.post.ADD_COMMENT + "/" + postId,
        {
          content: comment,
        },
        {
          withCredentials: true,
        }
      );

      const data = res.data;
      setCommentsData((prev) => [data.comment, ...prev]);

      console.log("success comment");

      setOpenAddCommentModal(false);
    } catch (err) {
      console.log("error while adding comment", err);
      setCommentError("Something went wrong while adding comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3 min-w-[300px]">
      <div className="flex flex-col space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          Comment
        </label>
        <textarea
          id="comment"
          className="bg-white/5 rounded-lg p-3 text-lg  resize-none "
          placeholder="Share your opinion here "
          value={comment}
          onChange={(e) => {
            if (commentError) {
              setCommentError("");
            }
            setComment(e.target.value);
          }}
          rows="3"
        />
        {commentError && (
          <p className="mt-1 text-sm text-red-500">{commentError}</p>
        )}
      </div>

      <div className="flex w-full mt-2 ">
        <button
          disabled={loading}
          className="w-1/2 hover:bg-white/20 rounded-lg p-2 cursor-pointer"
          onClick={handleCreateComment}
        >
          {loading ? <LoadingSpinner></LoadingSpinner> : "Add"}
        </button>
        <button
          className="w-1/2 hover:bg-white/20 rounded-lg p-2 cursor-pointer"
          onClick={() => setOpenAddCommentModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddComment;
