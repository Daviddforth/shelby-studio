"use client";

import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  function toggleTheme() {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  }

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">

        <div>

          <h1 className="text-3xl font-bold">
            Shelby NFT Metadata Manager
          </h1>

          <p className="text-blue-100 mt-1">
            Professional NFT Metadata Creation Toolkit
          </p>

        </div>

        <button
          onClick={toggleTheme}
          className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition"
        >
          {darkMode ? <FaSun size={20}/> : <FaMoon size={20}/>}
        </button>

      </div>
    </header>
  );
}