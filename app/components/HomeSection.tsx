"use client";

import React from "react";
import { FileText, Award } from "lucide-react";
import { useConfig } from "@/lib/ConfigContext";
import { convertGoogleDriveUrl } from "@/lib/utils";

interface HomeSectionProps {
  onViewGallery: () => void;
}

export default function HomeSection({ onViewGallery }: HomeSectionProps) {
  const { config } = useConfig();
  const home = config.home || {};

  const img1Url = home.img1 ? convertGoogleDriveUrl(home.img1) : "";
  const img2Url = home.img2 ? convertGoogleDriveUrl(home.img2) : "";

  const resumeLink = home.resumeUrl ? home.resumeUrl.trim() : "";
  const certificateLink = home.certificateUrl ? home.certificateUrl.trim() : "";
  const hasImages = Boolean(img1Url || img2Url);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 animate-slide-down">
      <div className="relative glass-panel rounded-xl p-6 sm:p-10 border-y border-white/40">
        {/* Decorative corner circles */}
        <div className="glowing-circle absolute -top-2.5 -left-2.5" />
        <div className="glowing-circle absolute -top-2.5 -right-2.5" />
        <div className="glowing-circle absolute -bottom-2.5 -left-2.5" />
        <div className="glowing-circle absolute -bottom-2.5 -right-2.5" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Text Box */}
          <div className={`${hasImages ? "md:col-span-7" : "md:col-span-12"} bg-black/40 p-6 sm:p-8 rounded-lg border border-white/10 animate-fade-in delay-100`}>
            {home.title && (
              <h1 className="text-3xl sm:text-4xl font-light mb-4 text-white animate-slide-down">
                {home.title}
              </h1>
            )}
            {home.paragraph1 && (
              <p className="text-gray-200 leading-relaxed mb-4 font-light text-lg animate-fade-in delay-200">
                {home.paragraph1}
              </p>
            )}
            {home.paragraph2 && (
              <p className="text-gray-300 leading-relaxed text-base font-light mb-6 animate-fade-in delay-300">
                {home.paragraph2}
              </p>
            )}

            {/* Resume (Required) & Certificate (Optional) Buttons */}
            {(resumeLink || certificateLink) && (
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/15 animate-scale-up delay-400">
                {resumeLink && (
                  <a
                    href={resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-primary-dynamic text-primary-dynamic font-medium px-5 py-2.5 rounded-md hover:bg-primary-dynamic hover:text-slate-950 transition-all text-sm shadow-md active:scale-95"
                  >
                    <FileText size={16} />
                    <span>Resume</span>
                  </a>
                )}

                {certificateLink && (
                  <a
                    href={certificateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-5 py-2.5 rounded-md hover:border-primary-dynamic hover:text-primary-dynamic transition-all text-sm shadow-md active:scale-95"
                  >
                    <Award size={16} />
                    <span>Certificate</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Image Grid */}
          {hasImages && (
            <div className="md:col-span-5 flex flex-col gap-4 animate-scale-up delay-200">
              {img1Url && (
                <div className="relative h-44 w-full overflow-hidden rounded-lg border border-white/20 shadow-lg group bg-black/40">
                  <img
                    src={img1Url}
                    alt="Home Showcase Image 1"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              {img2Url && (
                <div className="relative h-44 w-full overflow-hidden rounded-lg border border-white/20 shadow-lg group bg-black/40">
                  <img
                    src={img2Url}
                    alt="Home Showcase Image 2"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {home.buttonText && (
        <div className="text-center mt-8 animate-scale-up delay-300">
          <button
            onClick={onViewGallery}
            className="inline-block bg-white text-gray-900 font-semibold px-8 py-3.5 text-lg rounded-none hover:bg-primary-dynamic hover:text-black transition-all shadow-lg active:scale-95"
          >
            {home.buttonText}
          </button>
        </div>
      )}
    </section>
  );
}
