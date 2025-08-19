"use client"; // Directive Next.js untuk Client Component

// Import custom hooks khusus untuk forgot password flow
import {
  useResendOtpForgotPassword,  // Hook untuk resend OTP forgot password
  useVerifyOtpForgotPassword,  // Hook untuk verify OTP forgot password
} from "@/services/authServices";

// Import icon dari Ant Design
import { CheckCircleOutlined, MailOutlined } from "@ant-design/icons";

// Import komponen UI dari Ant Design
import {
  Alert,      // Alert component
  Button,     // Button component
  Card,       // Card container
  Input,      // Input component (termasuk Input.OTP)
  Space,      // Spacing component
  Spin,       // Loading spinner
  Typography, // Typography components
  message,    // Global notification
} from "antd";

import clsx from "clsx"; // Library untuk conditional className
import Link from "next/link"; // Next.js Link component (imported tapi tidak digunakan)
import { useRouter, useSearchParams } from "next/navigation"; // Next.js hooks
import React, { useCallback, useEffect, useMemo, useState } from "react"; // React hooks

// Destructuring Typography
const { Title, Text } = Typography;

const OTPForgotPasswordPage: React.FC = () => {
  // Hook untuk navigasi
  const router = useRouter();
  
  // Hook untuk membaca URL parameters
  const searchParams = useSearchParams();
  
  // Ambil email dari URL parameter (datang dari halaman forgot-password sebelumnya)
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);

  // State untuk menyimpan kode OTP yang diinput user
  const [otp, setOtp] = useState("");
  
  // State untuk countdown resend OTP (dalam detik)
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // State untuk track apakah OTP sudah terverifikasi
  const [isVerified, setIsVerified] = useState(false);
  
  // State untuk menyimpan reset token yang didapat dari server setelah OTP verified
  // Token ini akan digunakan untuk reset password di halaman berikutnya
  const [resetToken, setResetToken] = useState("");

  // Custom hooks untuk API calls - khusus untuk forgot password flow
  const verifyOtpMutation = useVerifyOtpForgotPassword(); // Verify OTP
  const resendOtpMutation = useResendOtpForgotPassword(); // Resend OTP

  // useEffect untuk countdown timer resend OTP (sama seperti di verify email)
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Function untuk handle perubahan input OTP (sanitize input)
  const handleOtpChange = (value: string) => {
    // Hapus semua karakter non-digit dan limit 4 karakter
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 4);
    setOtp(sanitizedValue);
  };

  // Function untuk handle verifikasi OTP
  const handleVerify = useCallback(async () => {
    verifyOtpMutation.mutate(
      { email, otp }, // Data yang dikirim ke API
      {
        // Callback jika verifikasi berhasil
        onSuccess: (data) => {
          // Extract reset token dari berbagai kemungkinan key response
          // Server bisa return dengan key yang berbeda: tokenReset, token, atau resetToken
          const token = data.tokenReset || data.token || data.resetToken || "";

          // Tampilkan success message
          message.success(data.message || "OTP berhasil diverifikasi!");
          
          // Simpan reset token ke state
          setResetToken(token);
          
          // Set verified state ke true
          setIsVerified(true);

          // Delay 1.5 detik lalu redirect ke halaman reset password
          // Bawa email dan token sebagai URL parameters
          setTimeout(() => {
            router.push(
              `/forgot-password/reset-password?email=${encodeURIComponent(
                email
              )}&token=${encodeURIComponent(token)}`
            );
          }, 1500);
        },
        
        // Callback jika verifikasi gagal
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            "Terjadi kesalahan. Silakan coba lagi.";

          message.error(errorMessage);
          setOtp(""); // Reset OTP input
        },
      }
    );
  }, [email, otp, router, verifyOtpMutation]);

  // Function untuk resend OTP (sama seperti di verify email)
  const handleResendOtp = useCallback(async () => {
    resendOtpMutation.mutate(email, {
      onSuccess: (data) => {
        setOtp(""); // Reset OTP input
        setResendCooldown(60); // Start countdown 60 detik
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Gagal mengirim kode verifikasi.";
        message.error(errorMessage);
      },
    });
  }, [email, resendOtpMutation]);

  // Computed values untuk enable/disable buttons
  const canVerify = otp.length === 4 && !verifyOtpMutation.isPending;
  const canResend = resendCooldown === 0 && !resendOtpMutation.isPending;

  return (
    // Main container dengan gradient background
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      
      {/* Card container */}
      <Card
        className="w-full max-w-md shadow-2xl shadow-gray-500/20 !border-gray-200"
        style={{ borderRadius: 16 }}
      >
        
        {/* Header section */}
        <div className="text-center mb-4">
          
          {/* Icon container dengan conditional icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            {isVerified ? (
              <CheckCircleOutlined className="text-2xl !text-white" /> // Icon check jika verified
            ) : (
              <MailOutlined className="text-2xl !text-white" />        // Icon mail jika belum verified
            )}
          </div>

          {/* Title dengan conditional text */}
          <Title level={3} className="!text-primary-tosca !mb-2">
            {isVerified ? "OTP Terverifikasi!" : "Verifikasi Kode OTP"}
          </Title>

          {/* Subtitle dengan conditional text dan tampilkan email */}
          <Text type="secondary" className="block mb-4">
            {isVerified
              ? "Kode OTP berhasil diverifikasi. Anda akan dialihkan ke halaman reset password."
              : `Masukkan kode verifikasi 4 digit yang telah dikirim ke: ${email}`}
          </Text>
        </div>

        {/* Conditional rendering berdasarkan verification status */}
        {!isVerified ? (
          // Tampilan form OTP jika belum verified
          <Space direction="vertical" size="large" className="w-full">
            
            {/* OTP Input section */}
            <div className="flex flex-col items-center">
              <Input.OTP
                length={4}                                    // 4 digit OTP
                value={otp}                                   // Controlled value
                onChange={handleOtpChange}                    // Change handler
                size="large"                                  // Large size
                disabled={verifyOtpMutation.isPending}       // Disable saat loading
                separator={<span>-</span>}                    // Separator antar digit
              />
            </div>

            {/* Verify button */}
            <Button
              type="primary"                                  // Primary style
              size="large"                                    // Large size
              block                                           // Full width
              loading={verifyOtpMutation.isPending}          // Loading state
              disabled={!canVerify}                           // Disable jika belum bisa verify
              onClick={handleVerify}                          // Click handler
              className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 h-12"
            >
              {verifyOtpMutation.isPending
                ? "Memverifikasi..."      // Text saat loading
                : "Verifikasi Kode"}      // Text normal
            </Button>

            {/* Resend OTP section */}
            <div className="text-center flex gap-2 items-center justify-center">
              <Text type="secondary">Tidak menerima kode?</Text>

              <Button
                type="link"                                   // Link style button
                loading={resendOtpMutation.isPending}        // Loading state
                disabled={!canResend}                         // Disable berdasarkan cooldown
                onClick={handleResendOtp}                     // Click handler
                className={clsx("!p-0 h-max", {              // Conditional styling
                  "!text-primary-tosca hover:!text-dark-tosca": 
                    !resendOtpMutation.isPending || resendCooldown < 1,
                  "!text-gray-400": 
                    resendOtpMutation.isPending || resendCooldown > 0,
                })}
              >
                {/* Loading spinner saat resend */}
                {resendOtpMutation.isPending ? (
                  <Spin size="small" className="mr-1" />
                ) : null}

                {/* Text dengan countdown atau normal */}
                {resendCooldown > 0
                  ? `Kirim ulang dalam ${resendCooldown}s`    // Countdown text
                  : "Kirim ulang kode"}                       // Normal text
              </Button>
            </div>
          </Space>
        ) : (
          // Tampilan success alert jika sudah verified
          <Alert
            message="Verifikasi Berhasil!"
            description="Kode OTP telah berhasil diverifikasi. Anda akan dialihkan ke halaman reset password dalam beberapa saat."
            type="success"                                    // Success type (green)
            showIcon                                          // Show success icon
            icon={<CheckCircleOutlined />}                    // Custom icon
            className="text-center"
          />
        )}
      </Card>
    </div>
  );
};

export default OTPForgotPasswordPage;

/*
FLOW APLIKASI OTP FORGOT PASSWORD:
1. User datang dari halaman forgot-password dengan email di URL
2. Halaman menampilkan form input OTP 4 digit
3. User input OTP → handleOtpChange untuk sanitize
4. User klik "Verifikasi Kode" → handleVerify dipanggil
5. API verify OTP dipanggil dengan email + otp
6. Jika berhasil: 
   - Simpan reset token dari response
   - Tampilkan success state
   - Redirect ke reset-password dengan email + token di URL
7. Jika gagal: tampilkan error + reset OTP input

PERBEDAAN DENGAN VERIFY EMAIL PAGE:

VERIFY EMAIL (Register Flow):
- Tujuan: Aktivasi akun baru
- Setelah success: redirect ke /login
- Token: tidak ada (langsung aktivasi)

OTP FORGOT PASSWORD (Reset Password Flow):
- Tujuan: Verifikasi untuk reset password
- Setelah success: redirect ke /forgot-password/reset-password
- Token: ada reset token untuk authorize reset password
- URL parameters: email + token dibawa ke halaman berikutnya

KONSEP BARU:
1. Reset Token Management:
   - Server return token setelah OTP verified
   - Token disimpan di state dan dibawa ke halaman berikutnya
   - Token digunakan untuk authorize reset password

2. Multiple Token Key Handling:
   const token = data.tokenReset || data.token || data.resetToken || "";
   - Handle berbagai kemungkinan response key dari backend

3. URL Parameter Chaining:
   - Forgot Password → OTP (bawa email)
   - OTP → Reset Password (bawa email + token)

SECURITY CONSIDERATIONS:
- Token hanya valid setelah OTP verified
- Token dibawa via URL parameter (perlu HTTPS)
- Email dan token di-encode untuk URL safety
- OTP input disanitize untuk keamanan

REUSABLE PATTERNS:
- OTP input dengan sanitization
- Countdown timer untuk resend
- Conditional rendering untuk states
- Error handling yang consistent
- Loading states di semua interactions
*/