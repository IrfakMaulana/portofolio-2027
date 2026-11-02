"use client";

import React, { useEffect, useRef } from "react";
import { useConfig } from "@/lib/ConfigContext";
import { convertGoogleDriveUrl } from "@/lib/utils";

export default function BackgroundVideo() {
  const { config } = useConfig();
  const bgMedia = config.theme?.bgMedia;
  const videoRef = useRef<HTMLVideoElement>(null);

  const isImageMode = bgMedia?.type === "image";
  const customMediaUrl = bgMedia?.customUrl ? convertGoogleDriveUrl(bgMedia.customUrl) : "";
  const imageSrc = customMediaUrl || "/img/tm-astro-bg.jpg";
  const videoSrc = (bgMedia?.type === "video" && customMediaUrl) ? customMediaUrl : "/video/gfp-astro-timelapse.mp4";

  // Trigger video load & playback whenever video source changes dynamically
  useEffect(() => {
    if (!isImageMode && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay may need user gesture in strict browser contexts
      });
    }
  }, [videoSrc, isImageMode]);

  return (
    <div className="bg-video-container">
      <div className="bg-video-fallback" />

      {isImageMode ? (
        // Render custom image background (supports Google Drive links)
        <img
          key={imageSrc}
          src={imageSrc}
          alt="Custom Background"
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/img/tm-astro-bg.jpg";
          }}
        />
      ) : (
        // Render video background (local or custom URL)
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          poster="/img/tm-astro-bg.jpg"
          aria-hidden="true"
          className="w-full h-full object-cover transition-opacity duration-500"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

