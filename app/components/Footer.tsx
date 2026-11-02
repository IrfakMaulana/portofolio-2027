"use client";

import React from "react";
import { useConfig } from "@/lib/ConfigContext";

export default function Footer() {
  const { config } = useConfig();
  const footer = config.footer || {};

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 py-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between text-sm font-light text-gray-300 border-t border-white/10 pt-4 gap-2">
        <div>
          {footer.copyrightText || ""}
        </div>
        <div>
          Designed by{" "}
          <a
            href={footer.designerUrl || "https://templatemo.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-dynamic transition-colors underline underline-offset-4"
          >
            {footer.designerName || "TemplateMo"}
          </a>
        </div>
      </div>
    </footer>
  );
}

