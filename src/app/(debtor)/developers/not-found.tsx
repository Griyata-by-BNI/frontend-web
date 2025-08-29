// app/not-found.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFoundDevelopers() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Gambar di tengah */}
      <Image
        src="/images/404.png"
        alt="Halaman tidak ditemukan"
        width={400}
        height={400}
        priority
      />

      <h1 className="mt-6 text-3xl md:text-4xl font-bold text-gray-800">
        404 — Halaman Tidak Ditemukan
      </h1>

      <p className="mt-3 text-gray-600 max-w-md">
        Ups! Sepertinya halaman yang kamu cari tidak tersedia atau sudah
        dipindahkan.
      </p>

      <div className="flex items-center gap-8 mt-6">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 !text-white font-medium shadow hover:from-teal-600 hover:to-teal-700 transition"
        >
          Kembali ke Beranda
        </Link>

        <button
          onClick={handleReload}
          className="px-6 py-3 rounded-lg border-2 border-primary-tosca text-primary-tosca font-medium shadow hover:border-dark-tosca cursor-pointer hover:bg-primary-tosca/20 transition"
        >
          Muat Ulang
        </button>
      </div>
    </div>
  );
}
