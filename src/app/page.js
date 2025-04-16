"use client";
import React, { useEffect, useState } from "react";

// 🔁 Utility to get data from IndexedDB
const openDb = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("imageDatabase", 1);

    request.onerror = (event) => {
      reject("Error opening IndexedDB");
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" });
      }
    };
  });
};

// Save image to IndexedDB
const saveImageToIndexedDB = async (id, base64Image) => {
  const db = await openDb();
  const transaction = db.transaction("images", "readwrite");
  const store = transaction.objectStore("images");

  store.put({ id, image: base64Image });
  await transaction.complete;
};

// Retrieve image from IndexedDB
const getImageFromIndexedDB = async (id) => {
  const db = await openDb();
  const transaction = db.transaction("images", "readonly");
  const store = transaction.objectStore("images");

  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result ? request.result.image : null);
    request.onerror = () => reject("Error retrieving image from IndexedDB");
  });
};

// 🔁 Child: Single Image Slider
const ImageSlider = ({ id, images, updateImages, deleteContainer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      const updated = [...images, base64Image];

      // Save image to IndexedDB
      await saveImageToIndexedDB(id, base64Image);

      updateImages(id, updated);
      setCurrentIndex(updated.length - 1); // Jump to new image
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
    <div className="relative w-full h-full rounded shadow-md">
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

// 🔁 Main App
export default function App() {
  const [containers, setContainers] = useState([]);

  // 🔃 Load from IndexedDB on first load
  useEffect(() => {
    const loadImagesFromDb = async () => {
      const savedImages = [];
      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const imagePromises = container.images.map((imageId) => getImageFromIndexedDB(imageId));
        const imagesData = await Promise.all(imagePromises);
        savedImages.push({ ...container, images: imagesData });
      }
      setContainers(savedImages);
    };

    loadImagesFromDb();
  }, []);

  // 🔄 Save to IndexedDB on containers change
  useEffect(() => {
    const saveAllImages = async () => {
      for (const container of containers) {
        for (const image of container.images) {
          await saveImageToIndexedDB(container.id, image);
        }
      }
    };

    saveAllImages();
  }, [containers]);

  const addNewContainer = () => {
    const newContainer = { id: Date.now(), images: [] };
    setContainers((prev) => [...prev, newContainer]);
  };

  const deleteContainer = (idToRemove) => {
    setContainers((prev) => prev.filter((c) => c.id !== idToRemove));
  };

  const updateImages = (id, updatedImages) => {
    setContainers((prev) =>
      prev.map((container) =>
        container.id === id ? { ...container, images: updatedImages } : container
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold">Persistent Image Sliders</h1>

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
        className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition"
      >
        ➕ Add New Container
      </button>
    </div>
  );
}
