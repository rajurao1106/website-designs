"use client"
import React, { useEffect, useState } from 'react';

// Child: Single Image Slider
const ImageSlider = ({ id, images, updateImages, deleteContainer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...images, reader.result];
      updateImages(id, updated);
      setCurrentIndex(updated.length - 1); // jump to new image
    };
    reader.readAsDataURL(file);
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
    <div className="relative w-full h-full bg-black rounded shadow-md">
      <button
        onClick={() => deleteContainer(id)}
        className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
      >
        Delete Container
      </button>

      <div className="flex items-center">
        <button
          onClick={showPrev}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Left
        </button>

        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          {images.length > 0 ? (
            <img
              src={images[currentIndex]}
              alt="preview"
              className="w-full h-full"
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
            Right
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

// Main App
export default function App() {
  const [containers, setContainers] = useState([]);

  // Load containers from MongoDB
  useEffect(() => {
    const loadContainers = async () => {
      const res = await fetch('/api/containers');
      const data = await res.json();
      setContainers(data);
    };
    loadContainers();
  }, []);

  // Add new container
  const addNewContainer = async () => {
    const res = await fetch('/api/containers', { method: 'POST' });
    const newContainer = await res.json();
    setContainers((prev) => [...prev, newContainer]);
  };

  // Delete container
  const deleteContainer = async (id) => {
    await fetch(`/api/containers/${id}`, { method: 'DELETE' });
    setContainers((prev) => prev.filter((c) => c._id !== id));
  };

  // Update container images
  const updateImages = async (id, updatedImages) => {
    await fetch(`/api/containers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: updatedImages }),
    });
    setContainers((prev) =>
      prev.map((c) => (c._id === id ? { ...c, images: updatedImages } : c))
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold">Persistent Image Sliders</h1>

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
        className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition"
      >
        ➕ Add New Container
      </button>
    </div>
  );
}
