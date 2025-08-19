"use client"; // Directive Next.js untuk Client Component

// Import custom hooks untuk API calls
import {
  useVerifyEmailRegister, // Hook untuk verifikasi OTP
  useResendOtpRegister,   // Hook untuk kirim ulang OTP
} from "@/services/authServices";

// Import icon dari Ant Design
import { CheckCircleOutlined, MailOutlined } from "@ant-design/icons";

// Import komponen UI dari Ant Design
import {
  Alert,      // Komponen untuk menampilkan pesan
  Button,     // Tombol
  Card,       // Container dengan border dan shadow
  Input,      // Input field (termasuk Input.OTP)
  Space,      // Komponen untuk spacing
  Spin,       // Loading spinner
  Typography, // Komponen typography (Title, Text)
  message,    // Global message notification
} from "antd";

import clsx from "clsx"; // Library untuk conditional className
import { useRouter, useSearchParams } from "next/navigation"; // Next.js hooks
import React, { useCallback, useEffect, useMemo, useState } from "react"; // React hooks

// Destructuring Typography components
const { Title, Text } = Typography;

const VerifyEmailPage: React.FC = () => {
  // Hook untuk navigasi
  const router = useRouter();
  
  // Hook untuk membaca query parameters dari URL
  const searchParams = useSearchParams();
  
  // useMemo untuk optimasi - hanya recalculate jika searchParams berubah
  // Mengambil email dari URL parameter, default empty string jika tidak ada
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);

  // State untuk menyimpan kode OTP yang diinput user
  const [otp, setOtp] = useState("");
  
  // State untuk countdown kirim ulang OTP (dalam detik)
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // State untuk track apakah email sudah terverifikasi
  const [isVerified, setIsVerified] = useState(false);

  // Custom hooks untuk API calls
  const verifyEmailMutation = useVerifyEmailRegister(); // Hook untuk verifikasi OTP
  const resendOtpMutation = useResendOtpRegister();     // Hook untuk resend OTP

  // useEffect untuk countdown timer resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      // Set timeout untuk mengurangi countdown setiap 1 detik
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      
      // Cleanup function untuk clear timeout saat component unmount
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]); // Dependency array - effect akan run jika resendCooldown berubah

  // Function untuk handle perubahan input OTP
  const handleOtpChange = (value: string) => {
    // Sanitize input: hapus semua karakter non-digit (\D) dan limit maksimal 4 karakter
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 4);
    setOtp(sanitizedValue);
  };

  // useCallback untuk optimasi - function tidak akan recreate jika dependency tidak berubah
  const handleVerify = useCallback(async () => {
    // Panggil mutation untuk verifikasi email
    verifyEmailMutation.mutate(
      { email, otp }, // Data yang dikirim ke API
      {
        // Callback jika API call berhasil
        onSuccess: (data) => {
          // Tampilkan success message
          message.success(data.message || "Email berhasil diverifikasi!");
          
          // Set state verifikasi berhasil
          setIsVerified(true);

          // Delay 1.5 detik lalu redirect ke login
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        },
        
        // Callback jika API call gagal
        onError: (error: any) => {
          // Extract error message dari response atau gunakan default
          const errorMessage =
            error.response?.data?.message ||
            "Terjadi kesalahan. Silakan coba lagi.";

          // Tampilkan error message
          message.error(errorMessage);
          
          // Reset OTP input
          setOtp("");
        },
      }
    );
  }, [email, otp, router, verifyEmailMutation]); // Dependencies untuk useCallback

  // Function untuk kirim ulang OTP
  const handleResendOtp = useCallback(async () => {
    resendOtpMutation.mutate(email, {
      onSuccess: (data) => {
        // Reset OTP dan mulai countdown 60 detik
        setOtp("");
        setResendCooldown(60);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Gagal mengirim kode verifikasi.";
        message.error(errorMessage);
      },
    });
  }, [email, resendCooldown, resendOtpMutation]);

  // Computed values untuk enable/disable buttons
  const canVerify = otp.length === 4 && !verifyEmailMutation.isPending; // Bisa verify jika OTP 4 digit dan tidak sedang loading
  const canResend = resendCooldown === 0 && !resendOtpMutation.isPending; // Bisa resend jika countdown habis dan tidak sedang loading

  return (
    // Main container dengan gradient background dan center alignment
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      
      {/* Card component sebagai container utama */}
      <Card
        className="w-full max-w-md shadow-2xl shadow-gray-500/20 !border-gray-200"
        style={{ borderRadius: 16 }} // Inline style untuk border radius
      >
        
        {/* Header section */}
        <div className="text-center mb-4">
          
          {/* Icon container dengan conditional icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            {isVerified ? (
              <CheckCircleOutlined className="text-2xl !text-white" /> // Icon centang jika verified
            ) : (
              <MailOutlined className="text-2xl !text-white" />        // Icon email jika belum verified
            )}
          </div>

          {/* Title dengan conditional text */}
          <Title level={3} className="!text-primary-tosca !mb-2">
            {isVerified ? "Email Terverifikasi!" : "Verifikasi Email Anda"}
          </Title>

          {/* Subtitle dengan conditional text */}
          <Text type="secondary" className="block mb-4">
            {isVerified
              ? "Akun Anda berhasil diverifikasi dan siap digunakan."
              : `Masukkan kode verifikasi 4 digit yang telah dikirim ke:  ${email}`}
          </Text>
        </div>

        {/* Conditional rendering berdasarkan status verifikasi */}
        {!isVerified ? (
          // Tampilan jika belum verified
          <Space direction="vertical" size="large" className="w-full">
            
            {/* OTP Input Section */}
            <div className="flex flex-col items-center">
              <Input.OTP
                length={4}                                    // 4 digit OTP
                value={otp}                                   // Controlled value
                onChange={handleOtpChange}                    // Handler untuk perubahan
                size="large"                                  // Size besar
                disabled={verifyEmailMutation.isPending}     // Disable saat loading
                separator={<span>-</span>}                    // Separator antar digit
              />
            </div>

            {/* Verify Button */}
            <Button
              type="primary"                                  // Style primary
              size="large"                                    // Size besar
              block                                           // Full width
              loading={verifyEmailMutation.isPending}        // Show loading spinner
              disabled={!canVerify}                           // Disable jika tidak bisa verify
              onClick={handleVerify}                          // Click handler
              className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 h-12"
            >
              {verifyEmailMutation.isPending
                ? "Memverifikasi..."                          // Text saat loading
                : "Verifikasi Email"}                         // Text normal
            </Button>

            {/* Resend OTP Section */}
            <div className="text-center flex gap-2 items-center justify-center">
              <Text type="secondary">Tidak menerima kode?</Text>

              <Button
                type="link"                                   // Style link button
                loading={resendOtpMutation.isPending}        // Loading state
                disabled={!canResend}                         // Disable berdasarkan cooldown
                onClick={handleResendOtp}                     // Click handler
                className={clsx("!p-0 h-max", {              // Conditional className menggunakan clsx
                  "!text-primary-tosca hover:!text-dark-tosca": // Style jika bisa resend
                    !resendOtpMutation.isPending || resendCooldown < 1,
                  "!text-gray-400":                           // Style jika tidak bisa resend
                    resendOtpMutation.isPending || resendCooldown > 0,
                })}
              >
                {/* Loading spinner jika sedang resend */}
                {resendOtpMutation.isPending ? (
                  <Spin size="small" className="mr-1" />
                ) : null}

                {/* Text dengan conditional berdasarkan cooldown */}
                {resendCooldown > 0
                  ? `Kirim ulang dalam ${resendCooldown}s`    // Show countdown
                  : "Kirim ulang kode"}                       // Normal text
              </Button>
            </div>
          </Space>
        ) : (
          // Tampilan jika sudah verified - Success Alert
          <Alert
            message="Verifikasi Berhasil!"
            description="Email Anda telah berhasil diverifikasi. Anda akan dialihkan ke halaman login dalam beberapa saat."
            type="success"                                    // Success alert type
            showIcon                                          // Show icon
            icon={<CheckCircleOutlined />}                    // Custom icon
            className="text-center"
          />
        )}
      </Card>
    </div>
  );
};

export default VerifyEmailPage;

/*
FLOW APLIKASI VERIFY EMAIL:
1. User datang dari halaman register dengan email di URL parameter
2. Halaman menampilkan form input OTP 4 digit
3. User input OTP → handleOtpChange dipanggil untuk sanitize input
4. User klik "Verifikasi Email" → handleVerify dipanggil
5. API dipanggil untuk verifikasi OTP
6. Jika berhasil: tampilkan success state + redirect ke login setelah 1.5 detik
7. Jika gagal: tampilkan error message + reset OTP

FITUR RESEND OTP:
1. User bisa klik "Kirim ulang kode" jika tidak menerima OTP
2. Setelah resend, ada cooldown 60 detik sebelum bisa resend lagi
3. Countdown ditampilkan secara real-time menggunakan useEffect + setTimeout

KONSEP PENTING:
- useMemo: Optimasi untuk nilai yang tidak sering berubah
- useCallback: Optimasi untuk function yang tidak sering berubah
- useEffect: Side effect untuk countdown timer
- Conditional Rendering: Tampilan berbeda berdasarkan state
- Error Handling: Proper error handling dengan user-friendly messages
- State Management: Multiple states untuk track berbagai kondisi
- Real-time Updates: Countdown dan loading states yang responsive
*/