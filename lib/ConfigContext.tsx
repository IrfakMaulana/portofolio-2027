"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { SiteConfig } from "./types";
import { defaultConfig } from "./defaultConfig";

const LOCAL_STORAGE_CACHE_KEY = "astro_site_config_v1";
const BROADCAST_CHANNEL_NAME = "astro_site_config_sync";

interface ConfigContextType {
  config: SiteConfig;
  loading: boolean;
  saveConfig: (newConfig: SiteConfig) => Promise<void>;
}

export function mergeWithDefault(data: any): SiteConfig {
  if (!data || typeof data !== "object") return defaultConfig;
  return {
    ...defaultConfig,
    ...data,
    theme: {
      ...defaultConfig.theme,
      ...(data.theme || {}),
      bgMedia: {
        ...defaultConfig.theme.bgMedia,
        ...(data.theme?.bgMedia || {}),
      },
    },
    nav: { ...defaultConfig.nav, ...(data.nav || {}) },
    footer: { ...defaultConfig.footer, ...(data.footer || {}) },
    home: { ...defaultConfig.home, ...(data.home || {}) },
    gallery: {
      ...defaultConfig.gallery,
      ...(data.gallery || {}),
      items: Array.isArray(data.gallery?.items) ? data.gallery.items : defaultConfig.gallery.items,
    },
    about: {
      ...defaultConfig.about,
      ...(data.about || {}),
      cards: Array.isArray(data.about?.cards) ? data.about.cards : defaultConfig.about.cards,
    },
    contact: {
      ...defaultConfig.contact,
      ...(data.contact || {}),
      socials: {
        ...(defaultConfig.contact.socials || {}),
        ...(data.contact?.socials || {}),
      },
    },
  };
}

function getCachedConfig(): SiteConfig {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return mergeWithDefault(parsed);
      }
    } catch (e) {
      console.warn("Failed to parse cached site configuration:", e);
    }
  }
  return defaultConfig;
}

function applyBrandMeta(brandName?: string) {
  if (typeof document !== "undefined") {
    if (brandName && brandName.trim()) {
      document.title = `${brandName} | Portfolio & Showcase`;
    }
    let iconLink: HTMLLinkElement | null = document.querySelector("link[rel='icon']");
    if (!iconLink) {
      iconLink = document.createElement("link");
      iconLink.rel = "icon";
      iconLink.type = "image/png";
      iconLink.href = "/img/favicon.png";
      document.head.appendChild(iconLink);
    }
  }
}

function applyPrimaryColor(color?: string) {
  if (typeof document !== "undefined") {
    const primaryColor = color || defaultConfig.theme.primaryColor || "#99ff66";
    document.documentElement.style.setProperty("--primary-color", primaryColor);
  }
}

const ConfigContext = createContext<ConfigContextType>({
  config: defaultConfig,
  loading: true,
  saveConfig: async () => {},
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initialization with instant local cache (0ms delay on refresh)
  const [config, setConfig] = useState<SiteConfig>(getCachedConfig);
  const [loading, setLoading] = useState<boolean>(true);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Apply primary color and brand meta on mount and whenever config changes
  useEffect(() => {
    applyPrimaryColor(config.theme?.primaryColor);
    applyBrandMeta(config.nav?.brandName);
  }, [config.theme?.primaryColor, config.nav?.brandName]);

  useEffect(() => {
    // Re-verify local cache on client mount
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const merged = mergeWithDefault(parsed);
        setConfig(merged);
        applyPrimaryColor(merged.theme?.primaryColor);
      }
    } catch {}

    // Setup BroadcastChannel for instant 0ms cross-tab real-time updates
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === "CONFIG_SYNC" && event.data?.config) {
          const merged = mergeWithDefault(event.data.config);
          setConfig(merged);
          applyPrimaryColor(merged.theme?.primaryColor);
        }
      };
    }

    // Storage event fallback for cross-tab updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_CACHE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const merged = mergeWithDefault(parsed);
          setConfig(merged);
          applyPrimaryColor(merged.theme?.primaryColor);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // Real-time listener for Firestore configuration changes (live across devices and sessions)
    const docRef = doc(db, "settings", "siteConfig");
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const mergedConfig = mergeWithDefault(data);
          setConfig(mergedConfig);
          applyPrimaryColor(mergedConfig.theme?.primaryColor);

          // Sync local cache
          try {
            localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(mergedConfig));
          } catch {}
        } else {
          setConfig(defaultConfig);
          applyPrimaryColor(defaultConfig.theme.primaryColor);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore snapshot listener error:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorage);
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
    };
  }, []);

  const saveConfig = async (newConfig: SiteConfig) => {
    const merged = mergeWithDefault(newConfig);
    setConfig(merged);
    applyPrimaryColor(merged.theme?.primaryColor);

    // Save to local cache immediately
    try {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(merged));
    } catch {}

    // Broadcast immediately to all other open tabs in the browser
    try {
      if (channelRef.current) {
        channelRef.current.postMessage({ type: "CONFIG_SYNC", config: merged });
      }
    } catch {}

    // Persist to Cloud Firestore
    const docRef = doc(db, "settings", "siteConfig");
    await setDoc(docRef, merged, { merge: true });
  };

  return (
    <ConfigContext.Provider value={{ config, loading, saveConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);

