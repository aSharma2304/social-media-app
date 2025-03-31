import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import Modal from "./Modal";
import CommentDelete from "./CommentDelete";
import { set } from "zod";
import axios from "axios";
import { API_PATHS, baseUrl } from "../utility/apiPaths";

const Comment = ({
  content,
  avatar = "",
  username,
  isAuthor,
  commentId,
  setCommentsData,
  commentData,
}) => {
  const [openConfirmCommentDelete, setOpenConfirmCommentDelete] =
    useState(false);

  const handleCommentDelete = async (commentId) => {
    let todelete = commentData.find((comment) => comment.id == commentId);
    setCommentsData((prev) =>
      prev.filter((comment) => comment.id != commentId)
    );
    try {
      const res = await axios.delete(
        baseUrl + API_PATHS.post.DELETE_COMMENT + "/" + commentId,
        {
          withCredentials: true,
        }
      );
      setOpenConfirmCommentDelete(false);
    } catch (err) {
      console.log("error while deleting comment");
      setCommentsData((prev) => [...prev, todelete]);
    }
  };

  return (
    <div className="w-full rounded-lg border border-white/5 bg-[#111111] p-4  m-2 h-fit text-white/90 flex flex-col space-y-4">
      <header className="text-lg flex justify-between   items-center ">
        <Link
          to={"/profile/" + username}
          className="font-semibold cursor-pointer"
        >
          {username || "got no username"}{" "}
        </Link>
        {isAuthor && (
          <button
            onClick={() => setOpenConfirmCommentDelete(true)}
            className="rounded-lg hover:bg-white/10 p-2 text-white  cursor-pointer "
          >
            <AiOutlineDelete className="size-5"></AiOutlineDelete>
          </button>
        )}
      </header>
      <Modal
        open={openConfirmCommentDelete}
        onClose={() => setOpenConfirmCommentDelete(false)}
      >
        <CommentDelete
          handleCommentDelete={() => {
            handleCommentDelete(commentId);
          }}
          setOpenConfirmCommentDelete={setOpenConfirmCommentDelete}
        ></CommentDelete>
      </Modal>
      <p>{content}</p>
    </div>
  );
};

export default Comment;
