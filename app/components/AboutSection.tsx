"use client";

import React from "react";
import { Sparkles, ShieldCheck, Cpu } from "lucide-react";
import { useConfig } from "@/lib/ConfigContext";

export default function AboutSection() {
  const { config } = useConfig();
  const about = config.about || {};
  const cards = about.cards || [];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 animate-slide-down">
      <div className="relative glass-panel rounded-xl p-6 sm:p-10 border-y border-white/40">
        {/* Corner Accents */}
        <div className="glowing-circle absolute -top-2.5 -left-2.5" />
        <div className="glowing-circle absolute -top-2.5 -right-2.5" />
        <div className="glowing-circle absolute -bottom-2.5 -right-2.5" />
        <div className="glowing-circle absolute -bottom-2.5 -left-2.5" />

        <div className="bg-black/40 p-6 sm:p-8 rounded-lg border border-white/10 animate-fade-in delay-100">
          {about.title && (
            <h2 className="text-3xl font-light text-white mb-6 flex items-center gap-3 animate-slide-down">
              <Sparkles className="text-primary-dynamic" size={28} />
              {about.title}
            </h2>
          )}

          {about.paragraph1 && (
            <p className="text-lg font-light text-gray-200 leading-relaxed mb-6 animate-fade-in delay-200">
              {about.paragraph1}
            </p>
          )}

          {about.paragraph2 && (
            <p className="text-base font-light text-gray-300 leading-relaxed mb-8 animate-fade-in delay-300">
              {about.paragraph2}
            </p>
          )}

          {cards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/15 animate-scale-up delay-400">
              {cards.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/10 transition-transform duration-300 hover:-translate-y-1"
                >
                  <ShieldCheck className="text-primary-dynamic shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-medium text-white text-base">{card.title}</h3>
                    <p className="text-xs text-gray-400 font-light mt-1">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
