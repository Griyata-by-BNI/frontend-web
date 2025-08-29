// app/error.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void; // retry render segmen yang error
}) {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  // Optional: kirim ke logger / Sentry
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Client error captured in app/error.tsx:", error);
  }, [error]);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const detail = useMemo(() => {
    // Saat production, jangan tampilkan detail sensitif
    return process.env.NODE_ENV === "development" ? error.message : undefined;
  }, [error.message]);

  const handleHardReload = () => window.location.reload();
  const handleSoftRefresh = () => router.refresh(); // re-fetch tanpa full reload

  return (
    <div
      role="alert"
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <Image
        src="/images/error.png"
        alt="Terjadi kesalahan"
        width={400}
        height={400}
        priority
      />

      <h1 className="mt-6 text-3xl md:text-4xl font-bold text-gray-800">
        Terjadi Kesalahan
      </h1>

      <p className="mt-3 text-gray-600 max-w-md" aria-live="polite">
        {isOnline
          ? "Ups! Ada masalah saat memuat halaman."
          : "Kamu sedang offline. Periksa koneksi internetmu, lalu coba lagi."}
        {detail ? (
          <span className="block mt-2 text-xs text-gray-500">({detail})</span>
        ) : null}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 !text-white font-medium shadow hover:from-teal-600 hover:to-teal-700 transition"
        >
          Kembali ke Beranda
        </Link>

        <button
          onClick={handleHardReload}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium shadow hover:bg-gray-50 transition"
        >
          Muat Ulang
        </button>
      </div>
    </div>
  );
}
