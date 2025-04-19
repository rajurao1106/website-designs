"use client";
import React, { useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { TbContainerOff } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";




// Loader Spinner
const Loader = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-black gap-2">
    <div className="text-6xl text-blue-500 flex justify-center items-center animate-spin" ><ImSpinner10/></div>
    <p className="text-white text-xl">Loading...</p>
  </div>
);

// Image Slider Component
const ImageSlider = ({ id, images, updateImages, deleteContainer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...images, reader.result];
      updateImages(id, updated);
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
   <div className="relative w-full bg-gray-800 overflow-hidden shadow-lg">
  {/* Image Display */}
  <div className="w-full h-full flex items-center justify-center bg-black">
    {images.length > 0 ? (
      <img
        src={images[currentIndex]}
        alt="Slide"
        className="w-full h-full transition-all duration-700"
      />
    ) : (
      <span className="text-white text-lg sm:text-xl">No Image</span>
    )}
  </div>

  {/* Navigation Arrows */}
  {images.length > 0 && (
    <>
      <button
        onClick={showPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-[#c9c9c975] bg-opacity-30 hover:bg-opacity-50 text-black rounded-full transition text-lg max-lg:text-sm p-2 max-lg:p-1"
      >
        <IoIosArrowBack/>
      </button>
      <button
        onClick={showNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#c9c9c975] bg-opacity-30 hover:bg-opacity-50 text-black rounded-full transition text-lg max-lg:text-sm p-2 max-lg:p-1"
      >
        <IoIosArrowForward/>
      </button>
    </>
  )}

  {/* Top-Right Action Buttons */}
  <div className="absolute bottom-0 right-2 flex sm:flex-row gap-2 sm:gap-3">
    <label className="bg-green-600 hover:bg-green-700 flex justify-center items-center text-white px-1 sm:px-4 sm:py-2 rounded-md cursor-pointer text-lg shadow text-center">
      <IoMdAdd/>
      <input
        type="file"
        accept="image/*"
        onChange={handleAddImage}
        className="hidden"
      />
    </label>
    <button
      onClick={handleDeleteImage}
      className="bg-red-600 hover:bg-red-700 text-white px-1 py-1 sm:px-4 sm:py-2 rounded-md text-lg shadow"
    >
      <MdOutlineDeleteForever/>
    </button>
  </div>

  {/* Bottom Center Delete Image Button */}
  {images.length > 0 && (
    <div className="absolute bottom-0 left-10 max-lg:left-6 transform -translate-x-1/2">
      <button
        onClick={() => deleteContainer(id)}
        className="bg-red-500 hover:bg-red-600 text-white p-1 sm:px-6 sm:py-2 rounded-full text-lg shadow text-center"
      >
      <TbContainerOff/>
      </button>
    </div>
  )}
</div>

  );
};

// Main App
export default function App() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContainers = async () => {
      try {
        const res = await fetch("/api/containers");
        const data = await res.json();
        setContainers(data);
      } catch (error) {
        console.error("Failed to fetch containers", error);
      } finally {
        setLoading(false);
      }
    };
    loadContainers();
  }, []);

  const addNewContainer = async () => {
    const res = await fetch("/api/containers", { method: "POST" });
    const newContainer = await res.json();
    setContainers((prev) => [...prev, newContainer]);
  };

  const deleteContainer = async (id) => {
    await fetch(`/api/containers/${id}`, { method: "DELETE" });
    setContainers((prev) => prev.filter((c) => c._id !== id));
  };

  const updateImages = async (id, updatedImages) => {
    await fetch(`/api/containers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: updatedImages }),
    });
    setContainers((prev) =>
      prev.map((c) => (c._id === id ? { ...c, images: updatedImages } : c))
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center">
      {/* <h1 className="text-4xl font-bold mb-10 text-center">Hero Image Slider</h1> */}

      {containers.map((container) => (
        <ImageSlider
          key={container._id}
          id={container._id}
          images={container.images}
          updateImages={updateImages}
          deleteContainer={deleteContainer}
        />
      ))}

      <button
        onClick={addNewContainer}
        className="my-4 bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-2xl font-semibold shadow-md transition"
      >
        ➕ Add New Slider
      </button>
      
    </div>
  );
}
