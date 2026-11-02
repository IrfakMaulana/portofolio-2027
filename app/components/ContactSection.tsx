"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Linkedin, Instagram, Twitter, Github } from "lucide-react";
import { useConfig } from "@/lib/ConfigContext";

export default function ContactSection() {
  const { config } = useConfig();
  const contact = config.contact || {};
  const socials = contact.socials || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      if (contact.formspreeUrl && contact.formspreeUrl.trim().startsWith("http")) {
        const response = await fetch(contact.formspreeUrl.trim(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setStatus("success");
          setFormData({ name: "", email: "", message: "" });
        } else {
          const data = await response.json().catch(() => ({}));
          setErrorMessage(data.error || "Failed to send message via Formspree.");
          setStatus("error");
        }
      } else {
        // Fallback local simulation if Formspree URL is not set
        setTimeout(() => {
          setStatus("success");
          setFormData({ name: "", email: "", message: "" });
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please check your connection.");
      setStatus("error");
    }
  };

  const hasSocials =
    (socials.linkedin && socials.linkedin.trim()) ||
    (socials.instagram && socials.instagram.trim()) ||
    (socials.twitter && socials.twitter.trim()) ||
    (socials.github && socials.github.trim());

  const hasMapEmbed = contact.mapQuery && contact.mapQuery.trim().length > 0;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8 animate-slide-down">
      <div className="relative glass-panel rounded-xl p-6 sm:p-10 border-t border-white/40">
        {/* Corner Accents */}
        <div className="glowing-circle absolute -top-2.5 -left-2.5" />
        <div className="glowing-circle absolute -top-2.5 -right-2.5" />

        {contact.title && (
          <h2 className="text-3xl font-light text-white mb-8 text-center sm:text-left animate-slide-down">
            {contact.title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form Box with Load-In Animation */}
          <div className="bg-black/40 p-6 rounded-lg border border-white/10 animate-scale-up delay-100">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-primary-dynamic space-y-3 animate-fade-in">
                <CheckCircle2 size={48} />
                <h3 className="text-xl font-light text-white">Message Sent!</h3>
                <p className="text-sm text-gray-300">
                  Thank you for reaching out. We will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-xs underline text-white hover:text-primary-dynamic"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/40 p-3 rounded border border-red-800 animate-fade-in">
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-xs text-gray-300 font-light mb-1">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Name"
                    className="w-full bg-transparent border-b border-white/50 px-2 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-dynamic transition-colors text-base"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs text-gray-300 font-light mb-1">
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className="w-full bg-transparent border-b border-white/50 px-2 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-dynamic transition-colors text-base"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs text-gray-300 font-light mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Message"
                    className="w-full bg-transparent border-b border-white/50 px-2 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-dynamic transition-colors text-base resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3 hover:bg-primary-dynamic hover:text-black transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <Send size={18} />
                    {status === "submitting" ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact Details, Socials & Optional Map Box */}
          <div className="flex flex-col justify-between space-y-6 animate-scale-up delay-200">
            <div className="bg-black/40 p-6 rounded-lg border border-white/10 space-y-4">
              <p className="text-gray-200 text-sm font-light leading-relaxed animate-fade-in delay-300">
                {contact.description}
              </p>

              <div className="space-y-2.5 text-sm text-gray-300 pt-2 border-t border-white/10 animate-fade-in delay-400">
                {contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-primary-dynamic shrink-0" />
                    <span>Email: </span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-white hover:text-primary-dynamic transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}

                {/* Telephone (Opsional) */}
                {contact.tel && contact.tel.trim().length > 0 && (
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-primary-dynamic shrink-0" />
                    <span>Tel: </span>
                    <a
                      href={`tel:${contact.tel}`}
                      className="text-white hover:text-primary-dynamic transition-colors"
                    >
                      {contact.tel}
                    </a>
                  </div>
                )}

                {/* Location Address (Opsional) */}
                {contact.location && contact.location.trim().length > 0 && (
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-primary-dynamic shrink-0" />
                    <span>Location: {contact.location}</span>
                  </div>
                )}

                {/* Social Media Buttons */}
                {hasSocials && (
                  <div className="pt-3 border-t border-white/10 flex items-center gap-3 flex-wrap">
                    {socials.linkedin && socials.linkedin.trim() && (
                      <a
                        href={socials.linkedin.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-white/10 text-white hover:bg-primary-dynamic hover:text-black border border-white/20 transition-all active:scale-95"
                        aria-label="LinkedIn Profile"
                        title="LinkedIn"
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                    {socials.instagram && socials.instagram.trim() && (
                      <a
                        href={socials.instagram.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-white/10 text-white hover:bg-primary-dynamic hover:text-black border border-white/20 transition-all active:scale-95"
                        aria-label="Instagram Profile"
                        title="Instagram"
                      >
                        <Instagram size={18} />
                      </a>
                    )}
                    {socials.twitter && socials.twitter.trim() && (
                      <a
                        href={socials.twitter.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-white/10 text-white hover:bg-primary-dynamic hover:text-black border border-white/20 transition-all active:scale-95"
                        aria-label="Twitter Profile"
                        title="Twitter / X"
                      >
                        <Twitter size={18} />
                      </a>
                    )}
                    {socials.github && socials.github.trim() && (
                      <a
                        href={socials.github.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-white/10 text-white hover:bg-primary-dynamic hover:text-black border border-white/20 transition-all active:scale-95"
                        aria-label="GitHub Profile"
                        title="GitHub"
                      >
                        <Github size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Embedded Google Map (Opsional) */}
            {hasMapEmbed && (
              <div className="w-full h-64 rounded-lg overflow-hidden border border-white/20 shadow-md animate-scale-up delay-300">
                <iframe
                  title="Company Location Map"
                  width="100%"
                  height="100%"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    contact.mapQuery!
                  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="border-0 filter grayscale contrast-125 opacity-85 hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
