"use client";

import React, { useState, useEffect } from "react";
import Preloader from "./components/Preloader";
import BackgroundVideo from "./components/BackgroundVideo";
import Navbar from "./components/Navbar";
import HomeSection from "./components/HomeSection";
import GallerySection from "./components/GallerySection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { trackWebsiteVisit } from "@/lib/stats";

export default function Home() {
  const [activeTab, setActiveTab] = useState<number>(1);

  useEffect(() => {
    trackWebsiteVisit();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-primary-dynamic selection:text-black">
      {/* Pure White Blank Preloader before content loads */}
      <Preloader />

      {/* Fixed Autoplay Fullscreen Video Background */}
      <BackgroundVideo />

      {/* Main Top Header & Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tabbed Content Container */}
      <main className="flex-1 flex items-center justify-center my-6">
        {activeTab === 1 && (
          <HomeSection onViewGallery={() => setActiveTab(2)} />
        )}
        {activeTab === 2 && <GallerySection />}
        {activeTab === 3 && <AboutSection />}
        {activeTab === 4 && <ContactSection />}
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}
