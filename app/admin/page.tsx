"use client";

import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, signOut, updatePassword, User } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useConfig } from "@/lib/ConfigContext";
import { SiteConfig, ProjectItem, AboutCard } from "@/lib/types";
import { convertGoogleDriveUrl } from "@/lib/utils";
import {
  Save,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Palette,
  Compass,
  Home as HomeIcon,
  FolderGit2,
  Info,
  Mail,
  CheckCircle,
  Video,
  AlertCircle,
  Link as LinkIcon,
  FileText,
  Award,
  Linkedin,
  Instagram,
  Twitter,
  Github,
  KeyRound,
  Eye,
  EyeOff,
  BarChart3,
  Users,
  HardDriveDownload,
  Clock,
  Film,
  Play,
  Image as ImageIcon,
  Lock,
  Download,
  UploadCloud,
  FileJson,
  Database,
  FileUp,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { config: globalConfig, saveConfig, loading: configLoading } = useConfig();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "stats" | "theme" | "nav" | "home" | "gallery" | "about" | "contact" | "security"
  >("stats");

  const [formData, setFormData] = useState<SiteConfig>(globalConfig);
  const [saving, setSaving] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Statistics State
  const [stats, setStats] = useState<{
    pageViews: number;
    uniqueVisits: number;
    totalDownloadsKB: number;
    lastVisitedAt?: any;
  }>({
    pageViews: 0,
    uniqueVisits: 0,
    totalDownloadsKB: 0,
  });

  // Password Change State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Database Backup / Restore State
  const [downloadingDatabase, setDownloadingDatabase] = useState(false);
  const [importingDatabase, setImportingDatabase] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  // Auth Guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setAuthLoading(false);
      } else {
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Real-time Firestore Stats Listener
  useEffect(() => {
    const statsDocRef = doc(db, "stats", "website");
    const unsubscribeStats = onSnapshot(
      statsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStats({
            pageViews: data.pageViews || 0,
            uniqueVisits: data.uniqueVisits || 0,
            totalDownloadsKB: data.totalDownloadsKB || 0,
            lastVisitedAt: data.lastVisitedAt,
          });
        }
      },
      (error) => {
        console.warn("Firestore stats snapshot error:", error);
      }
    );
    return () => unsubscribeStats();
  }, []);

  // Sync state with globalConfig when loaded
  useEffect(() => {
    if (globalConfig) {
      setFormData(globalConfig);
    }
  }, [globalConfig]);

  if (authLoading || configLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm font-light text-gray-300">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const handleSave = async () => {
    setSaving(true);
    setToastMessage(null);
    setErrorMessage(null);
    try {
      await saveConfig(formData);
      setToastMessage("Configuration saved successfully to Cloud Firestore!");
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.error("Firestore save error:", err);
      setErrorMessage(err.message || "Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleClearAllContent = async () => {
    setClearing(true);
    setToastMessage(null);
    setErrorMessage(null);
    try {
      const cleanConfig: SiteConfig = {
        theme: {
          primaryColor: formData.theme?.primaryColor || "#99ff66",
          bgMedia: {
            type: "video",
            customUrl: "/video/gfp-astro-timelapse.mp4",
          },
        },
        nav: {
          brandName: "",
          homeLabel: "Home",
          galleryLabel: "Projects",
          aboutLabel: "About",
          contactLabel: "Contact",
        },
        footer: {
          copyrightText: "",
          designerName: "TemplateMo",
          designerUrl: "https://templatemo.com",
        },
        home: {
          title: "",
          paragraph1: "",
          paragraph2: "",
          buttonText: "",
          resumeUrl: "",
          certificateUrl: "",
          img1: "",
          img2: "",
        },
        gallery: {
          title: "",
          subtitle: "",
          items: [],
        },
        about: {
          title: "",
          paragraph1: "",
          paragraph2: "",
          cards: [],
        },
        contact: {
          title: "",
          description: "",
          email: "",
          tel: "",
          location: "",
          mapQuery: "",
          formspreeUrl: "",
          socials: {
            linkedin: "",
            instagram: "",
            twitter: "",
            github: "",
          },
        },
      };

      setFormData(cleanConfig);
      await saveConfig(cleanConfig);
      setShowClearModal(false);
      setToastMessage("Seluruh teks dan gambar contoh berhasil dikosongkan secara permanen!");
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.error("Clear all content error:", err);
      setErrorMessage(err.message || "Gagal mengosongkan konten website.");
    } finally {
      setClearing(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setUpdatingPassword(true);
    setToastMessage(null);
    setErrorMessage(null);

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setToastMessage("Admin password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err: any) {
      console.error("Password update error:", err);
      if (err.code === "auth/requires-recent-login") {
        setErrorMessage(
          "For security reasons, please log out and log back in before updating your password."
        );
      } else {
        setErrorMessage(err.message || "Failed to update admin password.");
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Database Backup / Export Handler
  const handleDownloadDatabase = async () => {
    setDownloadingDatabase(true);
    setToastMessage(null);
    setErrorMessage(null);
    try {
      let currentConfig = formData;
      let currentStats = stats;

      try {
        const configSnap = await getDoc(doc(db, "settings", "siteConfig"));
        if (configSnap.exists()) {
          currentConfig = configSnap.data() as SiteConfig;
        }
      } catch (e) {
        console.warn("Could not fetch latest Firestore config snapshot, using local form data:", e);
      }

      try {
        const statsSnap = await getDoc(doc(db, "stats", "website"));
        if (statsSnap.exists()) {
          currentStats = statsSnap.data() as any;
        }
      } catch (e) {
        console.warn("Could not fetch latest Firestore stats snapshot, using local stats:", e);
      }

      const exportPayload = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        settings: {
          siteConfig: currentConfig,
        },
        stats: {
          website: currentStats,
        },
      };

      const dataBlob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const downloadUrl = URL.createObjectURL(dataBlob);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = downloadUrl;
      downloadAnchor.download = "database.json";
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(downloadUrl);

      setToastMessage("Database berhasil diekspor dan diunduh sebagai database.json!");
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.error("Export database error:", err);
      setErrorMessage("Gagal mendownload database: " + (err.message || "Unknown error"));
    } finally {
      setDownloadingDatabase(false);
    }
  };

  // Database Restore / Import Handler
  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportingDatabase(true);
    setToastMessage(null);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        if (!content || !content.trim()) {
          throw new Error("File JSON kosong.");
        }

        const parsed = JSON.parse(content);
        if (!parsed || typeof parsed !== "object") {
          throw new Error("Format file JSON tidak valid.");
        }

        let configToImport: any = null;
        let statsToImport: any = null;

        if (parsed.settings?.siteConfig) {
          configToImport = parsed.settings.siteConfig;
          statsToImport = parsed.stats?.website;
        } else if (parsed.siteConfig) {
          configToImport = parsed.siteConfig;
          statsToImport = parsed.stats?.website;
        } else if (parsed.theme || parsed.home || parsed.gallery || parsed.nav || parsed.about || parsed.contact) {
          configToImport = parsed;
        } else {
          throw new Error(
            "Format database.json tidak dikenali. File harus memiliki properti 'settings.siteConfig' atau konfigurasi website."
          );
        }

        // Save new config to Firestore and update global state / local cache / BroadcastChannel
        await saveConfig(configToImport);
        setFormData(configToImport);

        // If stats are included in the backup, restore stats to Firestore and state
        if (statsToImport && typeof statsToImport === "object") {
          try {
            const statsRef = doc(db, "stats", "website");
            await setDoc(statsRef, statsToImport, { merge: true });
            setStats({
              pageViews: statsToImport.pageViews || 0,
              uniqueVisits: statsToImport.uniqueVisits || 0,
              totalDownloadsKB: statsToImport.totalDownloadsKB || 0,
              lastVisitedAt: statsToImport.lastVisitedAt,
            });
          } catch (statsErr) {
            console.warn("Stats import warning:", statsErr);
          }
        }

        setToastMessage("database.json berhasil diimpor dan diterapkan ke Cloud Firestore secara real-time!");
        setTimeout(() => setToastMessage(null), 5000);
      } catch (err: any) {
        console.error("Import database error:", err);
        setErrorMessage("Gagal mengimpor database: " + (err.message || "File JSON tidak valid"));
      } finally {
        setImportingDatabase(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
      setErrorMessage("Gagal membaca file JSON.");
      setImportingDatabase(false);
    };

    reader.readAsText(file);
  };

  // Projects Handlers (Prepend new projects to the top)
  const handleAddProjectItem = () => {
    const newItem: ProjectItem = {
      id: Date.now().toString(),
      src: "/img/gallery-img-01.jpg",
      title: "New Project Title",
      description: "Detailed description of the new project.",
      tag: "Web App",
      demoUrl: "",
    };
    setFormData((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: [newItem, ...prev.gallery.items],
      },
    }));
  };

  const handleUpdateProjectItem = (index: number, key: keyof ProjectItem, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.gallery.items];
      updated[index] = { ...updated[index], [key]: value };
      return {
        ...prev,
        gallery: { ...prev.gallery, items: updated },
      };
    });
  };

  const handleDeleteProjectItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: prev.gallery.items.filter((_, i) => i !== index),
      },
    }));
  };

  // About Cards Handlers (Prepend new cards to the top)
  const handleAddAboutCard = () => {
    const newCard: AboutCard = {
      id: Date.now().toString(),
      title: "New Feature Title",
      description: "Feature details and description.",
      iconName: "ShieldCheck",
    };
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        cards: [newCard, ...prev.about.cards],
      },
    }));
  };

  const handleUpdateAboutCard = (index: number, key: keyof AboutCard, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.about.cards];
      updated[index] = { ...updated[index], [key]: value };
      return {
        ...prev,
        about: { ...prev.about, cards: updated },
      };
    });
  };

  const handleDeleteAboutCard = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        cards: prev.about.cards.filter((_, i) => i !== index),
      },
    }));
  };

  // Reordered Admin Navigation Menu List
  const tabList = [
    { id: "stats", label: "Website Statistic", icon: BarChart3 },
    { id: "theme", label: "Primary Theme & Media", icon: Palette },
    { id: "nav", label: "Navigation & Footer", icon: Compass },
    { id: "home", label: "Home Section & Links", icon: HomeIcon },
    { id: "gallery", label: "Project Showcase", icon: FolderGit2 },
    { id: "about", label: "About Section & Cards", icon: Info },
    { id: "contact", label: "Contact & Socials", icon: Mail },
    { id: "security", label: "Password Security", icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Responsive Top Admin Header */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-white/10 sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl font-light text-white tracking-wide">
            Astro Motion <span className="text-primary-dynamic font-normal">Admin CMS</span>
          </h1>
          <span className="text-[11px] bg-white/10 text-gray-300 px-2.5 py-0.5 rounded-full border border-white/10 hidden md:inline-block">
            {user?.email}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg transition-all border border-white/10"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Live Site</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-red-100 border border-red-800/50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95"
            title="Hapus / Kosongkan Seluruh Teks dan Gambar Contoh"
          >
            <Trash2 size={13} className="text-red-400" />
            <span className="hidden md:inline">Hapus Semua Teks & Gambar</span>
            <span className="md:hidden">Hapus Semua</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-primary-dynamic text-slate-950 font-semibold px-3.5 py-1.5 rounded-lg hover:opacity-90 transition-all text-xs shadow-md active:scale-95 disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? "Saving..." : "Save All"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-red-300 hover:text-red-100 bg-red-950/40 hover:bg-red-900/60 px-2.5 py-1.5 rounded-lg border border-red-800/40 transition-all"
            title="Sign Out"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Toast Banners */}
      {toastMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-600 text-emerald-200 px-4 sm:px-6 py-3 text-xs flex items-center gap-2 animate-slide-down">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-950/90 border-b border-red-600 text-red-200 px-4 sm:px-6 py-3 text-xs flex items-center gap-2 animate-slide-down">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Mobile Horizontal Scrollable Tab Bar */}
      <div className="lg:hidden bg-slate-900/60 px-4 py-2.5 border-b border-white/10 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {tabList.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs shrink-0 transition-all border ${
                isActive
                  ? "bg-primary-dynamic text-slate-950 font-semibold border-primary-dynamic"
                  : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Admin Main Layout */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Desktop Sidebar Nav (Sticky) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-2 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
          {tabList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all border ${
                  isActive
                    ? "bg-white/10 text-primary-dynamic font-medium border-primary-dynamic/50 shadow-sm"
                    : "text-gray-300 hover:bg-white/5 border-transparent hover:border-white/10"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Editor Panel */}
        <main className="lg:col-span-9 glass-panel p-4 sm:p-8 rounded-2xl border border-white/20">
          {/* TAB 1: Theme & Media */}
          {activeTab === "theme" && (
            <div className="space-y-6 animate-slide-down">
              <div>
                <h2 className="text-xl font-light text-white mb-1">Theme & Background Setup</h2>
                <p className="text-xs text-gray-400 font-light">
                  Customize the website's primary accent color and background media.
                </p>
              </div>

              <div className="bg-black/40 p-5 rounded-xl border border-white/10 space-y-4">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Palette size={16} className="text-primary-dynamic" />
                  Primary Accent Color
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.theme?.primaryColor || "#99ff66"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        theme: { ...formData.theme, primaryColor: e.target.value },
                      })
                    }
                    className="w-12 h-12 rounded cursor-pointer border border-white/30 bg-transparent shrink-0"
                  />
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Hex Color Code</label>
                    <input
                      type="text"
                      placeholder="#99ff66"
                      value={formData.theme?.primaryColor || "#99ff66"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          theme: { ...formData.theme, primaryColor: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-5 rounded-xl border border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white flex items-center gap-2">
                    <Video size={16} className="text-primary-dynamic" />
                    Background Media Setup
                  </h3>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {formData.theme?.bgMedia?.type === "image" ? "Image Mode" : "Video Loop Mode"}
                  </span>
                </div>

                {/* Media Type Selector */}
                <div className="space-y-2">
                  <label className="block text-xs text-gray-300 font-medium">Tipe Media Latar Belakang</label>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          theme: {
                            ...formData.theme,
                            bgMedia: { ...formData.theme?.bgMedia, type: "video" },
                          },
                        })
                      }
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all ${
                        formData.theme?.bgMedia?.type !== "image"
                          ? "border-primary-dynamic bg-primary-dynamic/15 text-primary-dynamic shadow-[0_0_15px_rgba(153,255,102,0.15)]"
                          : "border-white/10 bg-slate-900/60 text-gray-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <Film size={15} />
                      <span>Video Loop</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          theme: {
                            ...formData.theme,
                            bgMedia: { ...formData.theme?.bgMedia, type: "image" },
                          },
                        })
                      }
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all ${
                        formData.theme?.bgMedia?.type === "image"
                          ? "border-primary-dynamic bg-primary-dynamic/15 text-primary-dynamic shadow-[0_0_15px_rgba(153,255,102,0.15)]"
                          : "border-white/10 bg-slate-900/60 text-gray-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <ImageIcon size={15} />
                      <span>Custom Image / Drive</span>
                    </button>
                  </div>
                </div>

                {/* VIDEO LOOP MODE */}
                {formData.theme?.bgMedia?.type !== "image" && (() => {
                  const currentCustomUrl = formData.theme?.bgMedia?.customUrl || "";
                  const isDefaultSelected =
                    !currentCustomUrl ||
                    currentCustomUrl === "/video/gfp-astro-timelapse.mp4";
                  const isVideo2Selected = currentCustomUrl === "/video/video_2.mp4";
                  const isVideo3Selected = currentCustomUrl === "/video/video_3.mp4";
                  const isVideo4Selected = currentCustomUrl === "/video/video_4.mp4";
                  const isVideo5Selected = currentCustomUrl === "/video/video_5.mp4";
                  const isCustomUrlVideo =
                    !isDefaultSelected &&
                    !isVideo2Selected &&
                    !isVideo3Selected &&
                    !isVideo4Selected &&
                    !isVideo5Selected;

                  const previewVideoSrc = currentCustomUrl
                    ? convertGoogleDriveUrl(currentCustomUrl)
                    : "/video/gfp-astro-timelapse.mp4";

                  const videoPresets = [
                    {
                      id: "default",
                      name: "Default Video",
                      sub: "gfp-astro-timelapse.mp4",
                      path: "/video/gfp-astro-timelapse.mp4",
                      active: isDefaultSelected,
                    },
                    {
                      id: "video_2",
                      name: "Video 2",
                      sub: "video_2.mp4",
                      path: "/video/video_2.mp4",
                      active: isVideo2Selected,
                    },
                    {
                      id: "video_3",
                      name: "Video 3",
                      sub: "video_3.mp4",
                      path: "/video/video_3.mp4",
                      active: isVideo3Selected,
                    },
                    {
                      id: "video_4",
                      name: "Video 4",
                      sub: "video_4.mp4",
                      path: "/video/video_4.mp4",
                      active: isVideo4Selected,
                    },
                    {
                      id: "video_5",
                      name: "Video 5",
                      sub: "video_5.mp4",
                      path: "/video/video_5.mp4",
                      active: isVideo5Selected,
                    },
                  ];

                  return (
                    <div className="space-y-5 pt-2 border-t border-white/10">
                      <div>
                        <label className="block text-xs text-gray-300 font-medium mb-1">
                          Pilihan Background Video Lokal (public/video)
                        </label>
                        <p className="text-[11px] text-gray-400 font-light mb-3">
                          Pilih salah satu video loop berikut untuk diterapkan sebagai background utama website:
                        </p>

                        {/* 5 Video Preset Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                          {videoPresets.map((vid) => (
                            <button
                              key={vid.id}
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  theme: {
                                    ...formData.theme,
                                    bgMedia: {
                                      ...formData.theme?.bgMedia,
                                      type: "video",
                                      customUrl: vid.path,
                                    },
                                  },
                                })
                              }
                              className={`relative text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                                vid.active
                                  ? "border-primary-dynamic bg-primary-dynamic/10 shadow-[0_0_20px_rgba(153,255,102,0.15)] ring-1 ring-primary-dynamic/50"
                                  : "border-white/10 bg-slate-900/50 hover:bg-slate-900 hover:border-white/30 text-gray-300"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                      vid.active
                                        ? "bg-primary-dynamic text-black font-semibold shadow-sm"
                                        : "bg-white/10 text-gray-300"
                                    }`}
                                  >
                                    <Play size={14} className={vid.active ? "fill-black" : ""} />
                                  </div>
                                  <div>
                                    <div
                                      className={`text-xs font-semibold ${
                                        vid.active ? "text-primary-dynamic" : "text-white"
                                      }`}
                                    >
                                      {vid.name}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-mono">
                                      {vid.sub}
                                    </div>
                                  </div>
                                </div>
                                {vid.active && (
                                  <CheckCircle size={16} className="text-primary-dynamic shrink-0" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Live Video Preview Box */}
                      <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-52 aspect-video rounded-lg overflow-hidden border border-white/20 bg-black shrink-0 shadow-md">
                          <video
                            key={previewVideoSrc}
                            src={previewVideoSrc}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-primary-dynamic font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-dynamic animate-pulse" />
                            Live Preview
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="text-white font-medium flex items-center gap-2">
                            <span className="text-gray-300">Video Aktif:</span>
                            <span className="text-primary-dynamic font-mono font-semibold">
                              {isVideo2Selected
                                ? "Video 2 (/video/video_2.mp4)"
                                : isVideo3Selected
                                ? "Video 3 (/video/video_3.mp4)"
                                : isVideo4Selected
                                ? "Video 4 (/video/video_4.mp4)"
                                : isVideo5Selected
                                ? "Video 5 (/video/video_5.mp4)"
                                : isCustomUrlVideo
                                ? "Custom Video URL"
                                : "Default Video (/video/gfp-astro-timelapse.mp4)"}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                            Video ini akan otomatis diputar berulang-ulang (loop) secara fullscreen di latar belakang halaman depan website.
                          </p>
                        </div>
                      </div>

                      {/* Custom Video URL input (Optional / Advanced) */}
                      <div className="pt-2 border-t border-white/5">
                        <label className="block text-xs text-gray-400 mb-1">
                          Atau Gunakan Custom Video URL (External MP4 / Google Drive Video)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Contoh: https://example.com/loop.mp4 atau /video/video_5.mp4"
                            value={formData.theme?.bgMedia?.customUrl || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                theme: {
                                  ...formData.theme,
                                  bgMedia: { ...formData.theme?.bgMedia, customUrl: e.target.value },
                                },
                              })
                            }
                            className="flex-1 bg-slate-900 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic font-mono text-xs"
                          />
                          {formData.theme?.bgMedia?.customUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  theme: {
                                    ...formData.theme,
                                    bgMedia: {
                                      ...formData.theme?.bgMedia,
                                      customUrl: "/video/gfp-astro-timelapse.mp4",
                                    },
                                  },
                                })
                              }
                              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-gray-300 rounded-lg border border-white/10 transition-colors shrink-0"
                              title="Reset ke Default Video"
                            >
                              Reset Default
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Tip: Memilih salah satu dari 5 tombol kartu video di atas akan otomatis memperbarui nilai di kolom ini.
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* IMAGE MODE */}
                {formData.theme?.bgMedia?.type === "image" && (
                  <div className="space-y-4 pt-2 border-t border-white/10">
                    <div>
                      <label className="block text-xs text-gray-300 font-medium mb-1">
                        Custom Image / Google Drive URL
                      </label>
                      <p className="text-[11px] text-gray-400 font-light mb-2">
                        Masukkan URL gambar langsung atau link Google Drive yang diset public "Anyone with link".
                      </p>
                      <input
                        type="text"
                        placeholder="Contoh: /img/tm-astro-bg.jpg atau https://drive.google.com/file/d/..."
                        value={formData.theme?.bgMedia?.customUrl || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            theme: {
                              ...formData.theme,
                              bgMedia: { ...formData.theme?.bgMedia, customUrl: e.target.value },
                            },
                          })
                        }
                        className="w-full bg-slate-900 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic font-mono text-xs"
                      />
                    </div>

                    {formData.theme?.bgMedia?.customUrl && (
                      <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-52 aspect-video rounded-lg overflow-hidden border border-white/20 bg-black shrink-0 shadow-md">
                          <img
                            src={convertGoogleDriveUrl(formData.theme?.bgMedia?.customUrl)}
                            alt="Custom Background Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/img/tm-astro-bg.jpg";
                            }}
                          />
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="text-white font-medium">Preview Gambar Background</div>
                          <p className="text-[11px] text-gray-400 font-light">
                            Gambar ini akan menggantikan video loop sebagai latar belakang statis di website.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Navigation & Footer */}
          {activeTab === "nav" && (
            <div className="space-y-6 animate-slide-down">
              <div>
                <h2 className="text-xl font-light text-white mb-1">Navigation & Footer Text</h2>
                <p className="text-xs text-gray-400 font-light">
                  Edit site title, menu labels, and footer copyright information.
                </p>
              </div>

              <div className="bg-black/40 p-5 rounded-xl border border-white/10 space-y-4">
                <h3 className="text-sm font-medium text-white">Brand & Navigation Labels</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Brand Title Text</label>
                    <input
                      type="text"
                      placeholder="Contoh: ASTRO MOTION"
                      value={formData.nav?.brandName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nav: { ...formData.nav, brandName: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Home Tab Label</label>
                    <input
                      type="text"
                      placeholder="Contoh: Home"
                      value={formData.nav?.homeLabel || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nav: { ...formData.nav, homeLabel: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Projects Tab Label</label>
                    <input
                      type="text"
                      placeholder="Contoh: Projects"
                      value={formData.nav?.galleryLabel || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nav: { ...formData.nav, galleryLabel: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">About Tab Label</label>
                    <input
                      type="text"
                      placeholder="Contoh: About"
                      value={formData.nav?.aboutLabel || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nav: { ...formData.nav, aboutLabel: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Contact Tab Label</label>
                    <input
                      type="text"
                      placeholder="Contoh: Contact"
                      value={formData.nav?.contactLabel || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nav: { ...formData.nav, contactLabel: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-5 rounded-xl border border-white/10 space-y-4">
                <h3 className="text-sm font-medium text-white">Footer Text & Links</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Copyright Text</label>
                    <input
                      type="text"
                      placeholder="Contoh: Copyright © 2026 Astro Motion. All rights reserved."
                      value={formData.footer?.copyrightText || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          footer: { ...formData.footer, copyrightText: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                    />
                  </div>

                  {/* Locked Designer Attribution */}
                  <div className="p-3.5 bg-slate-900/80 rounded-lg border border-white/10 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="text-gray-300 font-medium flex items-center gap-1.5">
                        <span>Designer Attribution:</span>
                        <span className="text-primary-dynamic font-semibold">Designed by TemplateMo</span>
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        https://templatemo.com/
                      </div>
                    </div>
                    <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1 shrink-0">
                      <Lock size={11} /> Locked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Home Section */}
          {activeTab === "home" && (
            <div className="space-y-6 animate-slide-down">
              <div>
                <h2 className="text-xl font-light text-white mb-1">Home Section & Button Links</h2>
                <p className="text-xs text-gray-400 font-light">
                  Edit titles, text paragraphs, Resume/Certificate Drive links, and showcase images.
                </p>
              </div>

              <div className="bg-black/40 p-5 rounded-xl border border-white/10 space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Main Heading</label>
                  <input
                    type="text"
                    placeholder="Contoh: Introducing Astro Motion Web Portfolio"
                    value={formData.home?.title || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Paragraph 1</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan kalimat pembuka atau ringkasan pengenalan profil Anda di sini..."
                    value={formData.home?.paragraph1 || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, paragraph1: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Paragraph 2</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan deskripsi lanjutan, keahlian utama, atau informasi lainnya di sini..."
                    value={formData.home?.paragraph2 || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, paragraph2: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic resize-none"
                  />
                </div>

                {/* Resume & Certificate Link Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-xs text-gray-300 font-medium mb-1 flex items-center gap-1.5">
                      <FileText size={14} className="text-primary-dynamic" />
                      <span>Resume Link (Google Drive / Direct URL) - WAJIB</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://drive.google.com/file/d/... (Link share Google Drive untuk Resume/CV)"
                      value={formData.home?.resumeUrl || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          home: { ...formData.home, resumeUrl: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-dynamic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 font-medium mb-1 flex items-center gap-1.5">
                      <Award size={14} className="text-primary-dynamic" />
                      <span>Certificate Link (Google Drive / Direct URL) - OPSIONAL</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://drive.google.com/file/d/... (Link share Google Drive untuk Sertifikat - opsional)"
                      value={formData.home?.certificateUrl || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          home: { ...formData.home, certificateUrl: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-dynamic"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Bottom CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="Contoh: Explore My Work / View Portfolio"
                    value={formData.home?.buttonText || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, buttonText: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 flex items-center justify-between">
                      <span>Image 1 URL (Google Drive Supported)</span>
                      <LinkIcon size={12} className="text-primary-dynamic" />
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: /img/tm-astro-bg.jpg atau link Google Drive"
                      value={formData.home?.img1 || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          home: { ...formData.home, img1: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-dynamic"
                    />
                    {formData.home?.img1 && (
                      <div className="mt-2 h-24 relative rounded border border-white/10 overflow-hidden bg-black/40">
                        <img
                          src={convertGoogleDriveUrl(formData.home.img1)}
                          alt="Preview 1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 flex items-center justify-between">
                      <span>Image 2 URL (Google Drive Supported)</span>
                      <LinkIcon size={12} className="text-primary-dynamic" />
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: /img/tm-astro-bg.jpg atau link Google Drive"
                      value={formData.home?.img2 || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          home: { ...formData.home, img2: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-dynamic"
                    />
                    {formData.home?.img2 && (
                      <div className="mt-2 h-24 relative rounded border border-white/10 overflow-hidden bg-black/40">
                        <img
                          src={convertGoogleDriveUrl(formData.home.img2)}
                          alt="Preview 2"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Projects Showcase */}
          {activeTab === "gallery" && (
            <div className="space-y-6 animate-slide-down">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-light text-white mb-1">Projects Showcase Management</h2>
                  <p className="text-xs text-gray-400 font-light">
                    Add, edit, or delete items in the Projects section. Each project includes title, tag, image, and detailed description popup.
                  </p>
                </div>

                <button
                  onClick={handleAddProjectItem}
                  className="flex items-center gap-1.5 bg-primary-dynamic text-slate-950 font-semibold px-3 py-1.5 rounded text-xs shadow hover:opacity-90 transition-all"
                >
                  <Plus size={16} /> Add Project
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Section Title</label>
                  <input
                    type="text"
                    placeholder="Contoh: Featured Projects & Portfolio"
                    value={formData.gallery?.title || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gallery: { ...formData.gallery, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kumpulan proyek terbaik dan karya pilihan yang telah saya selesaikan"
                    value={formData.gallery?.subtitle || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gallery: { ...formData.gallery, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {formData.gallery?.items?.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-semibold text-primary-dynamic">
                        Project #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteProjectItem(idx)}
                        className="text-red-400 hover:text-red-200 p-1 text-xs flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove Project
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-3 h-32 relative rounded overflow-hidden border border-white/15 bg-black/60">
                        <img
                          src={convertGoogleDriveUrl(item.src)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/img/gallery-img-01.jpg";
                          }}
                        />
                      </div>

                      <div className="sm:col-span-9 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Judul Proyek (Contoh: E-Commerce Platform)"
                            value={item.title}
                            onChange={(e) => handleUpdateProjectItem(idx, "title", e.target.value)}
                            className="bg-slate-900 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Tag / Kategori (Contoh: Web App, Cosmos)"
                            value={item.tag}
                            onChange={(e) => handleUpdateProjectItem(idx, "tag", e.target.value)}
                            className="bg-slate-900 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>

                        <input
                          type="text"
                          placeholder="Link Gambar atau Google Drive URL (Contoh: /img/gallery-img-01.jpg)"
                          value={item.src}
                          onChange={(e) => handleUpdateProjectItem(idx, "src", e.target.value)}
                          className="w-full bg-slate-900 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white"
                        />

                        <input
                          type="text"
                          placeholder="Link Demo Website / GitHub (Contoh: https://myproject.com)"
                          value={item.demoUrl || ""}
                          onChange={(e) => handleUpdateProjectItem(idx, "demoUrl", e.target.value)}
                          className="w-full bg-slate-900 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white"
                        />

                        <textarea
                          rows={2}
                          placeholder="Deskripsi lengkap tentang proyek, fitur utama, dan teknologi yang digunakan..."
                          value={item.description}
                          onChange={(e) =>
                            handleUpdateProjectItem(idx, "description", e.target.value)
                          }
                          className="w-full bg-slate-900 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: About Section */}
          {activeTab === "about" && (
            <div className="space-y-6 animate-slide-down">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-light text-white mb-1">About Section & Feature Cards</h2>
                  <p className="text-xs text-gray-400 font-light">
                    Edit about section paragraphs and manage highlight cards.
                  </p>
                </div>

                <button
                  onClick={handleAddAboutCard}
                  className="flex items-center gap-1.5 bg-primary-dynamic text-slate-950 font-semibold px-3 py-1.5 rounded text-xs shadow hover:opacity-90 transition-all"
                >
                  <Plus size={16} /> Add Card
                </button>
              </div>

              <div className="bg-black/40 p-5 rounded-xl border border-white/10 space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">About Heading</label>
                  <input
                    type="text"
                    placeholder="Contoh: About Astro Motion & Background"
                    value={formData.about?.title || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Paragraph 1</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan latar belakang pendidikan, perjalanan karir, atau keahlian Anda di sini..."
                    value={formData.about?.paragraph1 || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, paragraph1: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Paragraph 2</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan visi, metodologi kerja, atau fokus teknologi Anda di sini..."
                    value={formData.about?.paragraph2 || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, paragraph2: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white">Feature Cards</h3>
                {formData.about?.cards?.map((card, idx) => (
                  <div
                    key={card.id || idx}
                    className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-semibold text-primary-dynamic">
                        Card #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteAboutCard(idx)}
                        className="text-red-400 hover:text-red-200 p-1 text-xs flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove Card
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Judul Keahlian / Fitur (Contoh: Fast Performance)"
                        value={card.title}
                        onChange={(e) => handleUpdateAboutCard(idx, "title", e.target.value)}
                        className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-xs text-white"
                      />
                      <textarea
                        rows={2}
                        placeholder="Deskripsi singkat keahlian, pengalaman, atau keunggulan layanan..."
                        value={card.description}
                        onChange={(e) => handleUpdateAboutCard(idx, "description", e.target.value)}
                        className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-xs text-white resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Contact, Formspree & Socials */}
          {activeTab === "contact" && (
            <div className="space-y-6 animate-slide-down">
              <div>
                <h2 className="text-xl font-light text-white mb-1">Contact, Formspree & Social Links</h2>
                <p className="text-xs text-gray-400 font-light">
                  Edit contact details, Formspree endpoint, and optional social media profile links (LinkedIn, Instagram, Twitter/X, GitHub).
                </p>
              </div>

              <div className="bg-black/40 p-5 rounded-xl border border-white/10 space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Formspree Endpoint Link</label>
                  <input
                    type="text"
                    placeholder="Contoh: https://formspree.io/f/your_form_id"
                    value={formData.contact?.formspreeUrl || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, formspreeUrl: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic font-mono"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Enter your Formspree endpoint URL. All user contact form submissions will be routed directly to your email!
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Contact Section Title</label>
                  <input
                    type="text"
                    placeholder="Contoh: Get In Touch / Hubungi Saya"
                    value={formData.contact?.title || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description Paragraph</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan pesan ajakan kerjasama, ketersediaan proyek, atau informasi kontak..."
                    value={formData.contact?.description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, description: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Email Address (WAJIB)</label>
                    <input
                      type="email"
                      placeholder="Contoh: email@anda.com"
                      value={formData.contact?.email || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, email: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Telephone Number (OPSIONAL)</label>
                    <input
                      type="text"
                      placeholder="Contoh: +62 812-3456-7890 (Kosongkan jika ingin disembunyikan)"
                      value={formData.contact?.tel || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, tel: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Location Address Text (OPSIONAL)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta, Indonesia (Kosongkan jika ingin disembunyikan)"
                    value={formData.contact?.location || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, location: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Google Maps Query String (OPSIONAL)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Monas, Jakarta Pusat (Kosongkan jika ingin disembunyikan)"
                    value={formData.contact?.mapQuery || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, mapQuery: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic"
                  />
                </div>

                {/* Social Media Links Inputs */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-semibold text-primary-dynamic flex items-center gap-1.5">
                    <span>Social Media Profile Links (OPSIONAL)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1 flex items-center gap-1">
                        <Linkedin size={12} className="text-primary-dynamic" /> LinkedIn URL
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: https://linkedin.com/in/username"
                        value={formData.contact?.socials?.linkedin || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              socials: {
                                ...formData.contact?.socials,
                                linkedin: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-900 border border-white/20 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-dynamic"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1 flex items-center gap-1">
                        <Instagram size={12} className="text-primary-dynamic" /> Instagram URL
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: https://instagram.com/username"
                        value={formData.contact?.socials?.instagram || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              socials: {
                                ...formData.contact?.socials,
                                instagram: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-900 border border-white/20 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-dynamic"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1 flex items-center gap-1">
                        <Twitter size={12} className="text-primary-dynamic" /> Twitter / X URL
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: https://twitter.com/username"
                        value={formData.contact?.socials?.twitter || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              socials: {
                                ...formData.contact?.socials,
                                twitter: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-900 border border-white/20 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-dynamic"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1 flex items-center gap-1">
                        <Github size={12} className="text-primary-dynamic" /> GitHub URL
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: https://github.com/username"
                        value={formData.contact?.socials?.github || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              socials: {
                                ...formData.contact?.socials,
                                github: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-900 border border-white/20 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-dynamic"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Website Statistics */}
          {activeTab === "stats" && (
            <div className="space-y-6 animate-slide-down">
              <div>
                <h2 className="text-xl font-light text-white mb-1">Website Traffic & Analytics</h2>
                <p className="text-xs text-gray-400 font-light">
                  Real-time statistics recorded via Cloud Firestore.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black/40 p-5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-primary-dynamic">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Total Page Views
                    </span>
                    <BarChart3 size={20} />
                  </div>
                  <div className="text-3xl font-light text-white">{stats.pageViews}</div>
                  <p className="text-[11px] text-gray-400">Total website hits</p>
                </div>

                <div className="bg-black/40 p-5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-primary-dynamic">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Unique Sessions
                    </span>
                    <Users size={20} />
                  </div>
                  <div className="text-3xl font-light text-white">{stats.uniqueVisits}</div>
                  <p className="text-[11px] text-gray-400">Unique browser sessions</p>
                </div>

                <div className="bg-black/40 p-5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-primary-dynamic">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Est. Data Transfer
                    </span>
                    <HardDriveDownload size={20} />
                  </div>
                  <div className="text-3xl font-light text-white">
                    {(stats.totalDownloadsKB / 1024).toFixed(2)} MB
                  </div>
                  <p className="text-[11px] text-gray-400">Cumulative payload download</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Password Security & Database Backup */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-slide-down">
              <div>
                <h2 className="text-xl font-light text-white mb-1">
                  Password Security & Database Management
                </h2>
                <p className="text-xs text-gray-400 font-light">
                  Kelola keamanan kata sandi login admin dan lakukan backup / restore database Cloud Firestore.
                </p>
              </div>

              {/* SECTION 1: Firestore Database Backup & Restore */}
              <div className="bg-black/40 p-6 rounded-xl border border-white/10 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-dynamic/10 border border-primary-dynamic/30 flex items-center justify-center text-primary-dynamic">
                      <Database size={17} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Firestore Database Backup & Restore
                      </h3>
                      <p className="text-[11px] text-gray-400 font-light">
                        Unduh atau impor seluruh database konfigurasi website (<code className="text-primary-dynamic font-mono">database.json</code>)
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white/10 text-gray-300 px-2.5 py-1 rounded-full border border-white/15 font-mono">
                    Cloud Firestore JSON
                  </span>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 text-xs text-gray-300 font-light leading-relaxed space-y-2">
                  <p>
                    Fitur ini memungkinkan Anda untuk mengunduh snapshot lengkap seluruh pengaturan website (tema, warna, background, teks halaman, galeri proyek, kartu fitur, dan kontak) serta data statistik kunjungan ke dalam file <strong>database.json</strong>.
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    Anda juga dapat mengunggah kembali file <strong>database.json</strong> untuk memulihkan atau menyinkronkan data website secara instan dan real-time.
                  </p>
                </div>

                {/* Hidden File Input for JSON Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportDatabase}
                  accept=".json,application/json"
                  className="hidden"
                />

                {/* Download & Upload Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Download Button */}
                  <button
                    type="button"
                    onClick={handleDownloadDatabase}
                    disabled={downloadingDatabase || importingDatabase}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-white/15 hover:border-primary-dynamic/60 text-white transition-all shadow-md group active:scale-[0.98] disabled:opacity-50 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-primary-dynamic/20 group-hover:text-primary-dynamic text-gray-200 flex items-center justify-center shrink-0 transition-colors">
                        {downloadingDatabase ? (
                          <RefreshCw size={18} className="animate-spin text-primary-dynamic" />
                        ) : (
                          <Download size={18} />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-primary-dynamic transition-colors">
                          {downloadingDatabase ? "Mengekspor Data..." : "Download database.json"}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                          Backup Cloud Firestore
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 group-hover:text-white bg-white/5 px-2 py-1 rounded border border-white/10 shrink-0 self-end sm:self-center font-mono">
                      .JSON
                    </span>
                  </button>

                  {/* Upload / Import Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importingDatabase || downloadingDatabase}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-primary-dynamic/15 hover:bg-primary-dynamic/25 border border-primary-dynamic/50 hover:border-primary-dynamic text-primary-dynamic transition-all shadow-md group active:scale-[0.98] disabled:opacity-50 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-dynamic text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-sm">
                        {importingDatabase ? (
                          <RefreshCw size={18} className="animate-spin" />
                        ) : (
                          <UploadCloud size={18} />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-primary-dynamic transition-colors">
                          {importingDatabase ? "Mengimpor Data..." : "Upload & Import database.json"}
                        </div>
                        <div className="text-[11px] text-primary-dynamic/80 font-mono mt-0.5">
                          Restore ke Cloud Firestore
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-950 bg-primary-dynamic font-semibold px-2 py-1 rounded shrink-0 self-end sm:self-center">
                      Upload
                    </span>
                  </button>
                </div>
              </div>

              {/* SECTION 2: Admin Password Management */}
              <div className="bg-black/40 p-6 rounded-xl border border-white/10 max-w-lg space-y-4">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white">
                    <KeyRound size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Admin Password Management</h3>
                    <p className="text-[11px] text-gray-400 font-light">
                      Perbarui kata sandi login admin Firebase Authentication.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-light text-gray-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Masukkan kata sandi baru (minimal 6 karakter)"
                        className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-light text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Masukkan ulang kata sandi baru"
                        className="w-full bg-slate-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-dynamic pr-10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="flex items-center gap-2 bg-primary-dynamic text-slate-950 font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-all text-xs shadow active:scale-95 disabled:opacity-50 mt-2"
                  >
                    <KeyRound size={15} />
                    <span>{updatingPassword ? "Updating..." : "Update Admin Password"}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal: Clear All Content */}
      {showClearModal && (
        <div
          onClick={() => setShowClearModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up text-left"
          >
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-700/50 flex items-center justify-center shrink-0">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Hapus Seluruh Teks & Gambar?</h3>
                <p className="text-xs text-gray-400">Tindakan ini akan mengosongkan semua data konten</p>
              </div>
            </div>

            <div className="bg-black/50 p-3.5 rounded-xl border border-white/10 text-xs text-gray-300 space-y-2 font-light">
              <p>
                Tindakan ini akan <strong>menghapus & mengosongkan</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px]">
                <li>Semua judul, paragraf, dan tombol di halaman Home</li>
                <li>Semua gambar showcase & link resume/sertifikat</li>
                <li>Semua item kartu proyek di Gallery Section</li>
                <li>Semua kartu fitur di About Section</li>
                <li>Semua teks kontak, email, nomor telpon, dan link sosmed</li>
              </ul>
              <p className="text-amber-400/90 text-[11px] pt-1 border-t border-white/10">
                ⚠️ Warna aksen tema dan background video utama tetap dipertahankan. Website akan langsung 100% bersih dan siap diisi dari awal.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                disabled={clearing}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-gray-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleClearAllContent}
                disabled={clearing}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold text-white rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                <Trash2 size={14} />
                <span>{clearing ? "Menghapus..." : "Ya, Hapus Semua Konten"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
