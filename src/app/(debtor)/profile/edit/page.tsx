"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
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

const DEFAULT_PROFILE_PICTURE =
  "data:image/svg+xml,%3csvg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='100' cy='100' r='100' fill='%23E5E7EB'/%3e%3ccircle cx='100' cy='80' r='30' fill='%239CA3AF'/%3e%3cpath d='M150 160H50C50 132.386 72.3858 110 100 110C127.614 110 150 132.386 150 160Z' fill='%239CA3AF'/%3e%3c/svg%3e";

const EditProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    phoneNumber: "",
    email: "",
    profilePicture: "",
  });

  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = "https://44040cdf10f5.ngrok-free.app";
  const USER_ID = "16";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/profiles/${USER_ID}`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );

        if (response.data?.data?.profile) {
          const profileData = response.data.data.profile;
          const fetchedProfile = {
            fullName: profileData.name || "",
            phoneNumber: profileData.phone || "",
            email: profileData.email || "",
            profilePicture: profileData.photoUrl || DEFAULT_PROFILE_PICTURE,
          };
          setProfile(fetchedProfile);
          setInitialProfile(fetchedProfile);
        } else {
          const defaultProfile = {
            ...profile,
            profilePicture: DEFAULT_PROFILE_PICTURE,
          };
          setProfile(defaultProfile);
          setInitialProfile(defaultProfile);
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
        message.error("Gagal memuat data profil.");
        const defaultProfile = {
          ...profile,
          profilePicture: DEFAULT_PROFILE_PICTURE,
        };
        setProfile(defaultProfile);
        setInitialProfile(defaultProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log({ name, value });
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      message.error(
        "Format file tidak valid. Harap pilih file PNG, JPG, atau JPEG."
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prevProfile) => ({
        ...prevProfile,
        profilePicture: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const isProfileDataChanged =
      initialProfile &&
      (profile.fullName !== initialProfile.fullName ||
        profile.phoneNumber !== initialProfile.phoneNumber ||
        profile.email !== initialProfile.email);

    const isPhotoChanged = selectedFile !== null;

    if (!isProfileDataChanged && !isPhotoChanged) {
      message.info("Tidak ada perubahan untuk disimpan.");
      return;
    }

    setIsSaving(true);
    message.loading({ content: "Menyimpan...", key: "saving" });

    try {
      const formData = new FormData();
      formData.append("name", profile.fullName);
      formData.append("phoneNumber", profile.phoneNumber);

      if (selectedFile) {
        formData.append("profilePhoto", selectedFile);
      }
      axios.put(`${BASE_URL}/api/v1/profiles/${USER_ID}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success({
        content: "Profil berhasil diperbarui!",
        key: "saving",
        duration: 2,
      });

      setInitialProfile(profile);
      setSelectedFile(null);
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
      let errorMessage = "Terjadi kesalahan saat menyimpan profil.";
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          errorMessage = "Pengguna tidak ditemukan.";
        } else if (error.response.status === 400) {
          errorMessage = "Data yang dikirim tidak valid.";
        }
      }
      message.error({ content: errorMessage, key: "saving", duration: 3 });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-gray-50 w-full flex items-center justify-center p-4 min-h-screen mt-[-48px] mb-[-48px]">
        <div className="text-gray-600">Memuat data profil...</div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 w-full flex items-center justify-center p-4 min-h-screen mt-[-48px] mb-[-48px]">
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
                  target.src = DEFAULT_PROFILE_PICTURE;
                }}
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) =>
                handleFileSelect(e.target.files ? e.target.files[0] : null)
              }
              accept="image/png, image/jpeg, image/jpg"
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
              disabled={isSaving}
              className="w-full bg-teal-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage;
