"use client"

import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import { TbContainerOff } from "react-icons/tb";

export default function ImageSlider({ id, images = [], updateImages, deleteContainer }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...images, reader.result];
      updateImages(id, updated);  // <- call updateImages correctly
      setCurrentIndex(updated.length - 1);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    if (images.length === 0) return;
    const updated = images.filter((_, idx) => idx !== currentIndex);
    updateImages(id, updated);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const showPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full overflow-hidden shadow-lg bg-black">
      {/* Image Display */}
      <div className="w-full h-full flex items-center justify-center ">
        {images.length > 0 ? (
          <img
            src={images[currentIndex]}
            loading="lazy"
            alt="Slide"
            className="w-full h-full transition-all duration-700 object-contain"
          />
        ) : (
          <span className="text-white text-lg sm:text-xl">No Image</span>
        )}
      </div>

      {/* Navigation Arrows */}
      {images.length > 0 && (
        <>
          <button onClick={showPrev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-[#c9c9c975] bg-opacity-30 hover:bg-opacity-50 text-black rounded-full transition text-lg max-lg:text-sm p-2 max-lg:p-1">
            <IoIosArrowBack />
          </button>
          <button onClick={showNext} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#c9c9c975] bg-opacity-30 hover:bg-opacity-50 text-black rounded-full transition text-lg max-lg:text-sm p-2 max-lg:p-1">
            <IoIosArrowForward />
          </button>
        </>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-1 right-2 flex sm:flex-row gap-2 sm:gap-3">
        {/* Add Image */}
        <label className="bg-green-600 hover:bg-green-700 flex justify-center items-center text-white px-1 sm:px-4 sm:py-2 rounded-md cursor-pointer text-lg shadow text-center">
          <IoMdAdd />
          <input type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
        </label>

        {/* Delete Image */}
        <button
          onClick={handleDeleteImage}
          className="bg-red-600 hover:bg-red-700 text-white px-1 py-1 sm:px-4 sm:py-2 rounded-md text-lg shadow"
        >
          <MdOutlineDeleteForever />
        </button>
      </div>

      {/* Delete Container */}
      {images.length > 0 && (
        <div className="absolute bottom-1 left-10 max-lg:left-6 transform -translate-x-1/2">
          <button
            onClick={() => deleteContainer(id)}
            className="bg-red-500 hover:bg-red-600 text-white p-3 max-lg:p-1 rounded-full text-lg shadow text-center"
          >
            <TbContainerOff />
          </button>
        </div>
      )}
    </div>
  );
}
