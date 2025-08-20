'use client';

import React, { useCallback } from 'react';
import { Clock, Shield, LogOut, Edit } from 'lucide-react';
import clsx from 'clsx';

// Types
interface UserData {
  id: string;
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

// Constants
const DEFAULT_USER: Partial<UserData> = {
  name: 'Nafira Elba',
  email: 'nafira.elba@gmail.com',
};

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
              {user?.name || DEFAULT_USER.name}
            </h2>
            <p className="text-teal-600 truncate">
              {user?.email || DEFAULT_USER.email}
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

// Menu Card Component
const MenuCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}> = ({ icon, title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-teal-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-left group"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-gray-800 font-semibold text-lg group-hover:text-teal-600 transition-colors">
            {title}
          </h3>
        </div>
        <svg 
          className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

// Logout Button Component
const LogoutButton: React.FC<{
  onClick?: () => void;
}> = ({ onClick }) => {
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

// MAIN COMPONENT - Web Layout matching mobile design
const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onEditProfile,
  onNavigateToHistory,
  onNavigateToPolicy,
  onLogout,
}) => {
  // Event handlers
  const handleEditProfile = useCallback(() => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      console.log('Navigate to edit profile page');
    }
  }, [onEditProfile]);

  const handleHistoryClick = useCallback(() => {
    if (onNavigateToHistory) {
      onNavigateToHistory();
    } else {
      console.log('Navigate to: Riwayat Pengajuan KPRmu');
    }
  }, [onNavigateToHistory]);

  const handlePolicyClick = useCallback(() => {
    if (onNavigateToPolicy) {
      onNavigateToPolicy();
    } else {
      console.log('Navigate to: Kebijakan Aplikasi');
    }
  }, [onNavigateToPolicy]);

  const handleLogout = useCallback(() => {
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar dari akun?');
    if (confirmed && onLogout) {
      onLogout();
    } else if (confirmed) {
      console.log('Logging out...');
    }
  }, [onLogout]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Teal Header Section */}
      <div className="mb-[-32px] mt-[-32px] ml-[-32px] mr-[-32px] bg-gradient-to-br from-teal-400 to-teal-600 h-32 relative overflow-hidden">
      </div>

      {/* Main Content Container */}
      <div className="flex-1 container mx-auto px-6 -mt-16">
        <div className="max-w-2xl mx-auto">
          
          {/* Profile Card - On white background */}
          <div className="mb-6">
            <ProfileCard 
              user={user} 
              onEditProfile={handleEditProfile} 
            />
          </div>

          {/* Combined Menu Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 mb-6">
            <div className="space-y-4">
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
      <Footer />
    </div>
  );
};

export default ProfilePage;