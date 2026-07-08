"use client";

import { useEffect } from "react";

export default function PWAProvider() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
        console.log("Fluido Credit PWA registered");
      } catch (error) {
        console.error("PWA registration failed:", error);
      }
    });
  }, []);

  return null;
}