import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-gray-400 rounded-full"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
