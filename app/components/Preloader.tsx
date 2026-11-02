"use client";

import React, { useEffect, useState } from "react";

export default function Preloader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (loaded) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-700 pointer-events-auto ${
        loaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Sleek Slate Loading Spinner on Pure White Background */}
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <span className="text-xs font-medium tracking-[0.25em] text-slate-800 uppercase animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
}
