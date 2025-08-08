"use client";

import { useFormStatus } from "react-dom";

const AddPostButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-solid border-current border-e-transparent" />
          <span>Posting...</span>
        </div>
      ) : (
        "Post"
      )}
    </button>
  );
};

export default AddPostButton;
