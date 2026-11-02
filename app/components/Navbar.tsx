"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useConfig } from "@/lib/ConfigContext";

interface NavbarProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { config } = useConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nav = config.nav || {
    brandName: "",
    homeLabel: "Home",
    galleryLabel: "Projects",
    aboutLabel: "About",
    contactLabel: "Contact",
  };

  const navItems = [
    { id: 1, label: nav.homeLabel || "Home" },
    { id: 2, label: nav.galleryLabel || "Projects" },
    { id: 3, label: nav.aboutLabel || "About" },
    { id: 4, label: nav.contactLabel || "Contact" },
  ];

  const handleSelectTab = (tabId: number) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-50 pt-5 pb-2 px-4 sm:px-8 max-w-7xl mx-auto animate-slide-down">
      {/* Responsive Navbar Gap: Mobile gap-55, Desktop lg:gap-3 */}
      <nav className="flex items-center justify-between gap-55 lg:gap-3 w-full pb-3 border-b border-white/20">
        {/* Brand Title Text */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleSelectTab(1);
          }}
          className="text-2xl sm:text-3xl font-light tracking-wide text-white hover:text-primary-dynamic transition-colors flex items-center shrink min-w-0 pr-2 lg:mr-10 leading-tight"
        >
          <span className="truncate">{nav.brandName || ""}</span>
        </a>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white border border-white/40 rounded focus:outline-none hover:bg-white/10 transition-transform active:scale-95 shrink-0 flex items-center justify-center"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? (
            <X size={22} className="animate-scale-up" />
          ) : (
            <Menu size={22} className="animate-scale-up" />
          )}
        </button>

        {/* Desktop Nav Items */}
        <ul className="hidden lg:flex items-center space-x-6 shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="relative group py-2">
                <button
                  onClick={() => handleSelectTab(item.id)}
                  style={{
                    color: isActive ? "var(--primary-color, #99ff66)" : undefined,
                    borderColor: isActive ? "var(--primary-color, #99ff66)" : undefined,
                  }}
                  className={`text-xl font-light px-8 py-3 transition-colors border-b ${
                    isActive
                      ? "border-b-2 font-normal"
                      : "text-white border-white/60 hover:text-primary-dynamic hover:border-primary-dynamic"
                  }`}
                >
                  {item.label}
                </button>

                {/* Nav Circle Indicator */}
                <div
                  style={{
                    backgroundColor: isActive ? "var(--primary-color, #99ff66)" : undefined,
                    boxShadow: isActive ? "0 0 12px var(--primary-color, #99ff66)" : undefined,
                  }}
                  className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all duration-300 ${
                    isActive ? "" : "bg-white group-hover:bg-primary-dynamic"
                  }`}
                />
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-4 glass-panel rounded-lg space-y-3 border border-white/20 animate-slide-down shadow-2xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                style={{
                  color: isActive ? "var(--primary-color, #99ff66)" : undefined,
                }}
                className={`w-full text-left py-2.5 px-4 rounded text-lg font-light transition-all active:scale-98 ${
                  isActive
                    ? "bg-white/10 font-normal border-l-4 border-primary-dynamic"
                    : "text-white hover:bg-white/10 hover:text-primary-dynamic"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
