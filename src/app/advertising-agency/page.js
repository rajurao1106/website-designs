import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-10 flex flex-col items-center justify-center gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Hospital Website UI
        </h1>
        <p className="text-gray-300 text-sm sm:text-base">
          Explore beautifully crafted homepage layouts for your hospital site.
        </p>
      </div>

      {/* CTA Links */}
      <div className="flex flex-col gap-4 text-center">
        <Link
          href="/advertising-agency/homepage"
          className="px-6 py-3 rounded-xl bg-purple-700 text-white text-lg font-semibold shadow-md hover:bg-purple-800 hover:scale-105 transition-all duration-300"
        >
          Homepage
        </Link>

        <Link
          href="/advertising-agency/about"
          className="px-6 py-3 rounded-xl bg-purple-700 text-white text-lg font-semibold shadow-md hover:bg-purple-800 hover:scale-105 transition-all duration-300"
        >
          About
        </Link>

        <Link
          href="/advertising-agency/services"
          className="px-6 py-3 rounded-xl bg-purple-700 text-white text-lg font-semibold shadow-md hover:bg-purple-800 hover:scale-105 transition-all duration-300"
        >
          Services
        </Link>

        <Link
          href="/advertising-agency/doctors"
          className="px-6 py-3 rounded-xl bg-purple-700 text-white text-lg font-semibold shadow-md hover:bg-purple-800 hover:scale-105 transition-all duration-300"
        >
          Doctors
        </Link>

        <Link
          href="/advertising-agency/contact"
          className="px-6 py-3 rounded-xl bg-purple-700 text-white text-lg font-semibold shadow-md hover:bg-purple-800 hover:scale-105 transition-all duration-300"
        >
          Contact
        </Link>

        <Link
          href="/advertising-agency/appointment"
          className="px-6 py-3 rounded-xl bg-purple-700 text-white text-lg font-semibold shadow-md hover:bg-purple-800 hover:scale-105 transition-all duration-300"
        >
          Book Appointment
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-xs text-gray-400 text-center mt-10">
        © 2025 WebsiteUI. Crafted with ❤️
      </footer>
    </div>
  );
}
