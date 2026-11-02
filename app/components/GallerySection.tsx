"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Info, Sparkles } from "lucide-react";
import { useConfig } from "@/lib/ConfigContext";
import { convertGoogleDriveUrl } from "@/lib/utils";

export default function GallerySection() {
  const { config } = useConfig();
  const gallery = config.gallery || {};
  const items = gallery.items || [];

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openProjectDetail = (index: number) => {
    setSelectedImageIndex(index);
    // Smooth scroll to top of view
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeProjectDetail = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null && items.length > 0) {
      setSelectedImageIndex((selectedImageIndex + 1) % items.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null && items.length > 0) {
      setSelectedImageIndex((selectedImageIndex - 1 + items.length) % items.length);
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") closeProjectDetail();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, items.length]);

  // FULL PAGE PROJECT DETAIL VIEW (When a project is clicked)
  if (selectedImageIndex !== null && items[selectedImageIndex]) {
    const currentProject = items[selectedImageIndex];
    const imageSrc = convertGoogleDriveUrl(currentProject.src);
    const prevIndex = (selectedImageIndex - 1 + items.length) % items.length;
    const nextIndex = (selectedImageIndex + 1) % items.length;

    return (
      <section className="w-full max-w-5xl mx-auto px-4 py-6 animate-fade-in">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/15 flex-wrap">
          <button
            onClick={closeProjectDetail}
            className="flex items-center gap-2 text-sm text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all border border-white/20 shadow-md active:scale-95 group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-primary-dynamic" />
            <span>Back to Projects Showcase</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              Project {selectedImageIndex + 1} of {items.length}
            </span>

            {items.length > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevImage}
                  className="p-2 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/15 active:scale-90"
                  aria-label="Previous Project"
                  title="Previous Project"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImage}
                  className="p-2 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/15 active:scale-90"
                  aria-label="Next Project"
                  title="Next Project"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 1 Full-Page Container Card */}
        <div className="relative glass-panel rounded-2xl p-6 sm:p-10 border-t border-white/40 shadow-2xl space-y-8 animate-slide-down">
          {/* Corner Glowing Accents */}
          <div className="glowing-circle absolute -top-2.5 -left-2.5" />
          <div className="glowing-circle absolute -top-2.5 -right-2.5" />
          <div className="glowing-circle absolute -bottom-2.5 -left-2.5" />
          <div className="glowing-circle absolute -bottom-2.5 -right-2.5" />

          {/* Full Resolution Hero Image Presentation */}
          <div className="relative w-full min-h-[300px] max-h-[60vh] sm:max-h-[68vh] rounded-xl overflow-hidden border border-white/25 shadow-2xl bg-black/70 flex items-center justify-center group">
            <img
              src={imageSrc}
              alt={currentProject.title}
              className="w-full h-full max-h-[68vh] object-contain object-center transition-all duration-300"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/img/gallery-img-01.jpg";
              }}
            />
          </div>

          {/* Project Details Content Section */}
          <div className="space-y-6 bg-black/40 p-6 sm:p-8 rounded-xl border border-white/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  {currentProject.tag && (
                    <span className="text-xs font-semibold text-slate-950 bg-primary-dynamic px-3.5 py-1 rounded-full shadow-sm tracking-wide">
                      {currentProject.tag}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 font-mono">
                    ID: #{currentProject.id?.slice(-4) || selectedImageIndex + 1}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-light text-white tracking-wide">
                  {currentProject.title}
                </h1>
              </div>

              {currentProject.demoUrl && (
                <div className="shrink-0 pt-2 sm:pt-0">
                  <a
                    href={currentProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm font-semibold text-slate-950 bg-primary-dynamic hover:opacity-90 px-6 py-3 rounded-lg shadow-lg hover:shadow-primary-dynamic/20 transition-all active:scale-95"
                  >
                    <ExternalLink size={16} />
                    <span>Live Project Demo</span>
                  </a>
                </div>
              )}
            </div>

            {/* Description Body */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-primary-dynamic uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> Project Overview & Details
              </h2>
              {currentProject.description ? (
                <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed whitespace-pre-line">
                  {currentProject.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No detailed description provided for this project.
                </p>
              )}
            </div>
          </div>

          {/* Bottom Prev / Next Navigation Footer */}
          {items.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/15">
              <button
                type="button"
                onClick={() => setSelectedImageIndex(prevIndex)}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
              >
                <ChevronLeft size={20} className="text-primary-dynamic transition-transform group-hover:-translate-x-1" />
                <div className="overflow-hidden">
                  <div className="text-[11px] text-gray-400 uppercase font-mono">Previous Project</div>
                  <div className="text-xs sm:text-sm font-medium text-white truncate">
                    {items[prevIndex].title || `Project #${prevIndex + 1}`}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedImageIndex(nextIndex)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-right transition-all group"
              >
                <div className="overflow-hidden">
                  <div className="text-[11px] text-gray-400 uppercase font-mono">Next Project</div>
                  <div className="text-xs sm:text-sm font-medium text-white truncate">
                    {items[nextIndex].title || `Project #${nextIndex + 1}`}
                  </div>
                </div>
                <ChevronRight size={20} className="text-primary-dynamic transition-transform group-hover:translate-x-1 shrink-0 ml-3" />
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // DEFAULT GRID VIEW
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 animate-slide-down">
      <div className="relative glass-panel rounded-xl p-6 sm:p-10 border-t border-white/40">
        {/* Corner Accents */}
        <div className="glowing-circle absolute -top-2.5 -left-2.5" />
        <div className="glowing-circle absolute -top-2.5 -right-2.5" />

        {(gallery.title || gallery.subtitle) && (
          <div className="text-center mb-8">
            {gallery.title && (
              <h2 className="text-3xl font-light tracking-wide text-white mb-2">
                {gallery.title}
              </h2>
            )}
            {gallery.subtitle && (
              <p className="text-gray-300 font-light text-sm max-w-xl mx-auto">
                {gallery.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Projects Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, idx) => {
              const imageSrc = convertGoogleDriveUrl(item.src);
              return (
                <div
                  key={item.id || idx}
                  onClick={() => openProjectDetail(idx)}
                  className="effect-julia cursor-pointer group rounded-lg border border-white/20 shadow-md bg-black/30 transition-transform duration-300 hover:-translate-y-1 animate-scale-up"
                >
                  <div className="relative h-64 w-full bg-black/40 overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <figcaption className="flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <div className="flex items-center justify-between text-xs font-semibold mt-1.5 text-primary-dynamic">
                      <span>{item.tag || ""}</span>
                      <span className="flex items-center gap-1 font-normal text-white/80">
                        <Info size={14} /> View Details
                      </span>
                    </div>
                  </figcaption>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

