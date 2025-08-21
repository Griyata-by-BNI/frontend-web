'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Clock, Star, Shield, LogOut, Edit } from 'lucide-react';
import { useRouter, redirect } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import axiosInstance from '@/utils/axios';

// Types
interface UserData {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface ProfilePageProps {
  user?: UserData;
  onEditProfile?: () => void;
  onNavigateToHistory?: () => void;
  onNavigateToPolicy?: () => void;
  onLogout?: () => void;
}

// Skeleton Loader Component
const ProfileSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-gray-200" />
    </div>
  </div>
);

// Avatar Component
const Avatar: React.FC<{ user?: UserData }> = ({ user }) => {
  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
      {user?.avatar ? (
        <img 
          src={user.avatar} 
          alt={`${user.name || 'User'} avatar`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-white font-bold text-lg">
          {getInitials(user?.name)}
        </span>
      )}
    </div>
  );
};

// Profile Card Component
const ProfileCard: React.FC<{
  user?: UserData;
  onEditProfile?: () => void;
}> = ({ user, onEditProfile }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <Avatar user={user} />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {user?.name || '-'}
            </h2>
            <p className="text-teal-600 truncate">
              {user?.email || '-'}
            </p>
          </div>
        </div>
        <button
          onClick={onEditProfile}
          className="p-3 text-teal-600 hover:bg-teal-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          aria-label="Edit Profile"
        >
          <Edit className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Logout Button Component
const LogoutButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
    >
      <LogOut className="w-5 h-5" />
      <span className="text-lg">Keluar Akun</span>
    </button>
  );
};

// Footer Component
const Footer: React.FC = () => (
  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center py-6 flex-shrink-0">
    <p className="text-sm font-medium opacity-90 mb-1">Butuh Informasi Lebih Lanjut?</p>
    <p className="text-xl font-bold">BNI Call - 1500046</p>
  </div>
);

// Version Info Component
const VersionInfo: React.FC = () => (
  <div className="text-center py-4">
    <p className="text-sm text-gray-400">
      Griyata by BNI - version 1.0.0
    </p>
  </div>
);

// MAIN COMPONENT
const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onEditProfile,
  onNavigateToHistory,
  onNavigateToPolicy,
  onLogout,
}) => {
  const router = useRouter();
  const { user: savedData, token } = useAuth();
  const [profile, setProfile] = useState<UserData | undefined>(user);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔥 Fetch Profile API
  useEffect(() => {
    const fetchProfile = async () => {
      if (!savedData?.userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get(`/profiles/${savedData.userId}`, {headers: {
          Authorization: `Bearer ${token}`,
        }});
        const data = res.data?.data?.profile;

        if (data) {
          setProfile({
            id: data.userId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            avatar: data.photoUrl,
          });
        } else {
          setProfile(undefined);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setProfile(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [savedData]);

  if (!savedData) {
    redirect('/');
  }

  // Handlers
  const handleEditProfile = useCallback(() => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      router.push('/profile/edit');
    }
  }, [onEditProfile, router]);

  const handleHistoryClick = useCallback(() => {
    if (onNavigateToHistory) {
      onNavigateToHistory();
    } else {
      router.push('/profile/history');
    }
  }, [onNavigateToHistory, router]);

  const handlePolicyClick = useCallback(() => {
    if (onNavigateToPolicy) {
      onNavigateToPolicy();
    } else {
      router.push('/profile/policy');
    }
  }, [onNavigateToPolicy, router]);

    const handleFavoriteClick = useCallback(() => {
    if (onNavigateToPolicy) {
      onNavigateToPolicy();
    } else {
      router.push('/favorite');
    }
  }, [onNavigateToPolicy, router]);

  const handleLogout = useCallback(() => {
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar dari akun?');
    if (confirmed && onLogout) {
      onLogout();
    } else if (confirmed) {
      console.log('Logging out...');
    }
  }, [onLogout]);

  return (
    <div className="mb-[-90px] ml-[-160px] mr-[-160px] min-h-screen bg-gray-500 flex flex-col justify-between">
      {/* Header */}
      <div className="w-full mt-[-48px] bg-gradient-to-br from-teal-400 to-teal-600 h-22 relative overflow-hidden"></div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-6 -mt-15">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="mb-6">
            {loading ? (
              <ProfileSkeleton />
            ) : (   
              <ProfileCard user={profile} onEditProfile={handleEditProfile} />
            )}
          </div>

          {/* Menu Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 mb-6">
            <div className="space-y-">
              <button
                onClick={handleHistoryClick}
                className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-gray-800 font-semibold text-lg group-hover:text-teal-600 transition-colors">
                    Riwayat Pengajuan KPRmu
                  </h3>
                </div>
              </button>

              <hr className="border-gray-100" />

              <button
                onClick={handlePolicyClick}
                className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-gray-800 font-semibold text-lg group-hover:text-teal-600 transition-colors">
                    Kebijakan Aplikasi
                  </h3>
                </div>
              </button>

              <hr className="border-gray-100" />

              <button
                onClick={handleFavoriteClick}
                className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                  <Star className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-gray-800 font-semibold text-lg group-hover:text-teal-600 transition-colors">
                    Favorit
                  </h3>
                </div>
              </button>
              
            </div>
          </div>

          {/* Logout Button */}
          <div className="mb-8">
            <LogoutButton onClick={handleLogout} />
          </div>

          {/* Version Info */}
          <VersionInfo />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-[10px]">
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
