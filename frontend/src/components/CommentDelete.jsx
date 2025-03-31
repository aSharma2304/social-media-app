export const CommentDelete = ({
  setOpenConfirmCommentDelete,
  handleCommentDelete,
}) => {
  return (
    <div className="text-center w-56 ">
      <div className="mx-auto my-4 w-48">
        <h3 className="text-lg font-semibold  text-gray-100">Confirm Delete</h3>
        <p className="text-sm text-white/50 mt-2">
          Are you sure you want to delete your comment ?
        </p>
      </div>
      <div className="flex gap-2">
        <button
          className=" w-1/2 hover:bg-white/10 rounded-lg p-2 cursor-pointer"
          onClick={() => {
            handleCommentDelete();
            setOpenConfirmCommentDelete(false);
          }}
        >
          Delete
        </button>
        <button
          className="w-1/2 hover:bg-white/10 rounded-lg p-2 cursor-pointer "
          onClick={() => setOpenConfirmCommentDelete(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CommentDelete;
