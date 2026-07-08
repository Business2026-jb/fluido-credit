"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index++) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

export default function PushNotificationButton() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const isSupported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setSupported(isSupported);

    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, []);

  async function enablePush() {
    setMessage("");
    setLoading(true);

    try {
      if (!supported) {
        setMessage("Push notifications are not supported on this device.");
        return;
      }

      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== "granted") {
        setMessage("Notifications permission was not granted.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!vapidPublicKey) {
        setMessage("Missing VAPID public key.");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Unable to enable notifications.");
        return;
      }

      setEnabled(true);
      setMessage("Push notifications enabled.");
    } catch (error) {
      console.error("PUSH_BUTTON_ERROR:", error);
      setMessage("Unable to enable push notifications.");
    } finally {
      setLoading(false);
    }
  }

  if (!supported) return null;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-[#06183A]">
        Mobile notifications
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Receive important Fluido Credit alerts on your phone.
      </p>

      <button
        type="button"
        onClick={enablePush}
        disabled={loading || enabled || permission === "denied"}
        className="mt-4 w-full rounded-2xl bg-[#062B8C] px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-900/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Enabling notifications..."
          : enabled
          ? "Notifications enabled"
          : permission === "denied"
          ? "Notifications blocked"
          : "Enable notifications"}
      </button>

      {message && (
        <p className="mt-3 text-sm font-bold text-slate-500">{message}</p>
      )}

      {permission === "denied" && (
        <p className="mt-3 text-xs leading-5 text-red-600">
          Notifications are blocked in your browser settings. Enable them from
          your browser or phone settings to receive alerts.
        </p>
      )}
    </div>
  );
}