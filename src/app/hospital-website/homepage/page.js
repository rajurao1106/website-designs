"use client";
import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import ImageSlider from "../../components/ImageSlider";

// Main App
export default function Homepage() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContainers = async () => {
      try {
        const res = await fetch("/api/hospital-website");
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
    const res = await fetch("/api/hospital-website", { method: "POST" });
    const newContainer = await res.json();
    setContainers((prev) => [...prev, newContainer]);
  };

  const deleteContainer = async (id) => {
    await fetch(`/api/hospital-website/${id}`, { method: "DELETE" });
    setContainers((prev) => prev.filter((c) => c._id !== id));
  };

  const updateImages = async (id, updatedImages) => {
    await fetch(`/api/hospital-website/${id}`, {
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
