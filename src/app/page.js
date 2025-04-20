import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-8 flex flex-col gap-10">
      
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome to WebsiteUI</h1>
        <p className="text-sm sm:text-base text-gray-300">Smart solutions for modern hospital websites</p>
      </header>

      {/* Hero CTA Button */}
      <div className="flex justify-center">
        <Link
          href="/hospital-website"
          className="px-6 py-3 rounded-xl bg-purple-700 text-white text-lg sm:text-xl font-semibold shadow-lg hover:bg-purple-800 hover:scale-105 transition-all duration-300"
        >
          Hospital Website Design
        </Link>
      </div>

      {/* Features Section */}
      <section className="text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
          <div className="bg-slate-700 p-4 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">Responsive Design</h3>
            <p className="text-sm text-gray-300">Fully mobile-friendly layouts that work on all devices.</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">Modern UI/UX</h3>
            <p className="text-sm text-gray-300">Sleek and intuitive designs with user-first principles.</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">Fast Performance</h3>
            <p className="text-sm text-gray-300">Optimized for speed and smooth navigation.</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">Customizable</h3>
            <p className="text-sm text-gray-300">Easily adaptable for different hospital needs.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-xs mt-10">
        © 2025 WebsiteUI. All rights reserved.
      </footer>
    </div>
  )
}
