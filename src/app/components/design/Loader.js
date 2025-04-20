import React from "react";
import { ImSpinner10 } from "react-icons/im";

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black gap-2">
      <div className="text-6xl text-blue-500 flex justify-center items-center animate-spin">
        <ImSpinner10 />
      </div>
      <p className="text-white text-xl">Loading...</p>
    </div>
  );
}
