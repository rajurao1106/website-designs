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
      body: JSON.stringify({
        advertising_agency: {
          homepage: updatedImages,   // update homepage array inside advertising_agency
          about: [],
          service: [],
          contact: [],
        },
      }),
    });
    setContainers((prev) =>
      prev.map((c) =>
        c._id === id
          ? { ...c, advertising_agency: { about: updatedImages, about: [], service: [], contact: [] } }
          : c
      )
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center">
      {/* All Sliders */}
      {containers.map((container) => (
        <ImageSlider
          key={container._id}
          id={container._id}
          images={container.advertising_agency.about} // Pass homepage array
          updateImages={updateImages} // Pass function directly
          deleteContainer={deleteContainer}
        />
      ))}

      {/* Add New Button */}
      <button
        onClick={addNewContainer}
        className="my-4 bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-2xl font-semibold shadow-md transition"
      >
        ➕ Add New Slider
      </button>
    </div>
  );
}
