"use client";

import React, { useState, useRef, useCallback } from "react";
import { message } from "antd";

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

interface UserProfile {
  fullName: string;
  phoneNumber: string;
  email: string;
  profilePicture: string;
}

const EditProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "Nafira Elba",
    phoneNumber: "082156878987",
    email: "nafiraelba@mail.com",
    profilePicture: "https://placehold.co/200x200/34d399/ffffff?text=NE",
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleFileSelect = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicture: reader.result as string,
        }));
        message.success(
          'Foto profil berhasil diubah. Klik "Simpan" untuk menyimpan perubahan.'
        );
      };
      reader.readAsDataURL(file);
    } else {
      message.error("File tidak valid. Harap pilih file gambar.");
    }
  };

  const onUbahFotoClick = () => fileInputRef.current?.click();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFileSelect(files[0]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Menyimpan data profil:", profile);
    message.loading({ content: "Menyimpan...", key: "saving" });
    setTimeout(() => {
      message.success({
        content: "Profil berhasil disimpan!",
        key: "saving",
        duration: 2,
      });
    }, 1500);
  };

  return (
    <main className="bg-gray-50 w-full flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-xl font-bold text-gray-800 text-center mb-5">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit}>
          <div
            className={`flex flex-col items-center mb-5 transition-all duration-300 ${
              isDragging ? "scale-105" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div
              className={`relative w-28 h-28 rounded-full border-4 border-dashed ${
                isDragging ? "border-teal-500" : "border-gray-200"
              } flex items-center justify-center transition-colors duration-300`}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-teal-100 bg-opacity-50 rounded-full flex flex-col items-center justify-center z-10">
                  <UploadIcon />
                  <p className="text-xs font-semibold text-teal-700 mt-1">
                    Lepaskan untuk unggah
                  </p>
                </div>
              )}
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-full h-full rounded-full object-cover shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://placehold.co/200x200/cccccc/ffffff?text=Error";
                }}
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) =>
                handleFileSelect(e.target.files ? e.target.files[0] : null)
              }
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={onUbahFotoClick}
              className="mt-3 text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors duration-200 focus:outline-none"
            >
              Ubah Foto
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={profile.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-shadow text-sm"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                No. HP
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-shadow text-sm"
                placeholder="Contoh: 08123456789"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-shadow text-sm"
                placeholder="Masukkan alamat email Anda"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-teal-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 text-sm"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage;
