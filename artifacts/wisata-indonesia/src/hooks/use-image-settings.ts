/**
 * useImageSettings – hook untuk membaca/menulis URL gambar dari localStorage.
 * Di halaman Admin: digunakan untuk menyimpan pengaturan.
 * Di halaman Frontend: digunakan untuk membaca URL gambar yang tersimpan.
 */

export const IMAGE_SETTINGS_KEY = "wisata_image_settings";

export const DEFAULT_IMAGE_SETTINGS: Record<string, string> = {
  heroImage: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?auto=format&fit=crop&q=80&w=2000",
  heroBannerAlt: "Pemandangan indah Danau Toba Sumatera Utara",
  logoUrl: "",
  faviconUrl: "",
  ogImageUrl: "",
  region1Image: "https://images.unsplash.com/photo-1599408913599-71e0ea9283fa?w=600",
  region2Image: "https://images.unsplash.com/photo-1601152264065-0cbf24fc4820?w=600",
  region3Image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
  region4Image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600",
  region5Image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600",
  region6Image: "https://images.unsplash.com/photo-1591301490041-d527bc63b07c?w=600",
  aboutImage: "",
  ctaBgImage: "",
};

export function loadImageSettings(): Record<string, string> {
  try {
    const stored = localStorage.getItem(IMAGE_SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_IMAGE_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {}
  return { ...DEFAULT_IMAGE_SETTINGS };
}

export function saveImageSettings(settings: Record<string, string>): void {
  try {
    localStorage.setItem(IMAGE_SETTINGS_KEY, JSON.stringify(settings));
    // Trigger storage event sehingga tab/komponen lain bisa update
    window.dispatchEvent(new Event("wisata-image-settings-changed"));
  } catch {}
}

import { useState, useEffect } from "react";

export function useImageSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(loadImageSettings);

  useEffect(() => {
    const handler = () => setSettings(loadImageSettings());
    window.addEventListener("wisata-image-settings-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("wisata-image-settings-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const updateSettings = (newSettings: Record<string, string>) => {
    setSettings(newSettings);
    saveImageSettings(newSettings);
  };

  const get = (key: string): string =>
    settings[key] || DEFAULT_IMAGE_SETTINGS[key] || "";

  return { settings, updateSettings, get };
}
