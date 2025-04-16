"use client";
import React, { useEffect, useState } from "react";

// Cloudinary Config
const CLOUD_NAME = "drpyepp9t";
const UPLOAD_PRESET = "rajurao"; // Your unsigned preset name

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Upload failed:", data);
    throw new Error(data?.error?.message || "Upload failed");
  }

  return data.secure_url;
};

const getSavedContainers = () => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("imageContainers");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load containers:", e);
    return [];
  }
};

const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem("imageContainers", JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
};

const ImageSlider = ({ id, images, updateImages, deleteContainer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      const updated = [...images, uploadedUrl];
      updateImages(id, updated);
      setCurrentIndex(updated.length - 1); // Jump to new image
    } catch (err) {
      alert("Image upload failed. Please try again.");
    }
  };

  const handleDelete = () => {
    if (images.length === 0) return;
    const updated = images.filter((_, idx) => idx !== currentIndex);
    updateImages(id, updated);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const showPrev = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNext = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-full rounded shadow-md my-4">
      <button
        onClick={() => deleteContainer(id)}
        className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
      >
        Delete Container
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={showPrev}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ⬅️
        </button>

        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          {images.length > 0 ? (
            <img
              key={images[currentIndex]} // 🔥 Ensures proper image re-render
              src={images[currentIndex]}
              alt="preview"
              className="w-full h-auto max-h-[300px] object-contain"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Delete
          </button>

          <button
            onClick={showNext}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            ➡️
          </button>

          <label className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer text-center">
            Add Image
            <input
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    const saved = getSavedContainers();
    setContainers(saved);
  }, []);

  const saveAndSetContainers = (updated) => {
    setContainers(updated);
    saveToLocalStorage(updated);
  };

  const addNewContainer = () => {
    const newContainer = { id: Date.now(), images: [] };
    const updated = [...containers, newContainer];
    saveAndSetContainers(updated);
  };

  const deleteContainer = (idToRemove) => {
    const updated = containers.filter((c) => c.id !== idToRemove);
    saveAndSetContainers(updated);
  };

  const updateImages = (id, updatedImages) => {
    const updated = containers.map((container) =>
      container.id === id
        ? { ...container, images: updatedImages }
        : container
    );
    saveAndSetContainers(updated);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Cloud-Persistent Image Sliders</h1>

      {containers.map((container) => (
        <ImageSlider
          key={container.id}
          id={container.id}
          images={container.images}
          updateImages={updateImages}
          deleteContainer={deleteContainer}
        />
      ))}

      <button
        onClick={addNewContainer}
        className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition mt-4"
      >
        ➕ Add New Container
      </button>
    </div>
  );
}
