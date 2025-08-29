"use client";

import Navbar from "@/components/navbar";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.replace("/"); // redirect server-only diganti router di client
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Area konten mengisi sisa tinggi */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer terdorong ke bawah oleh mt-auto / struktur flex */}
      <footer className="mt-auto bg-teal-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white mb-1">Butuh Informasi Lebih Lanjut?</p>
          <h3 className="text-xl font-bold text-white">BNI Call - 1500046</h3>
        </div>
      </footer>
    </div>
  );
}
