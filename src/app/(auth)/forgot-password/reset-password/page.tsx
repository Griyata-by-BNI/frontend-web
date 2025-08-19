"use client"; // Directive Next.js untuk Client Component

// Import custom hook untuk reset password API
import { useResetPassword } from "@/services/authServices";

// Import icon dari Ant Design
import { CheckCircleOutlined, LockOutlined } from "@ant-design/icons";

// Import komponen UI dari Ant Design
import { 
  Alert,      // Alert component
  Button,     // Button component
  Card,       // Card container
  Form,       // Form component
  Input,      // Input component
  Typography, // Typography components
  message     // Global notification
} from "antd";

// Import Next.js navigation hooks
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react"; // React hooks

// Destructuring Typography
const { Title, Text } = Typography;

const ResetPasswordPage: React.FC = () => {
  // Hook untuk navigasi
  const router = useRouter();
  
  // Hook untuk membaca URL parameters
  const searchParams = useSearchParams();
  
  // Ambil email dari URL parameter (dibawa dari halaman OTP sebelumnya)
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  
  // Ambil reset token dari URL parameter (didapat setelah OTP verified)
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  // Hook form dari Ant Design
  const [form] = Form.useForm();
  
  // State untuk track apakah reset password berhasil
  const [isSuccess, setIsSuccess] = useState(false);

  // Custom hook untuk reset password API call
  const resetPasswordMutation = useResetPassword();

  // Function untuk handle reset password
  const handleResetPassword = useCallback(
    async (values: { password: string; confirmPassword: string }) => {
      // Validasi parameter email dan token harus ada
      if (!email || !token) {
        message.error(
          "Parameter tidak valid. Silakan ulangi proses reset password."
        );
        return; // Stop execution jika parameter tidak valid
      }

      // Panggil API reset password
      resetPasswordMutation.mutate(
        {
          email,                    // Email user
          token,                    // Reset token dari OTP verification
          newPassword: values.password, // Password baru dari form
        },
        {
          // Callback jika reset berhasil
          onSuccess: (data) => {
            // Tampilkan success message
            message.success(data.message || "Password berhasil direset!");
            
            // Set success state ke true
            setIsSuccess(true);

            // Delay 1.5 detik lalu redirect ke login
            setTimeout(() => {
              router.push("/login");
            }, 1500);
          },
          
          // Callback jika reset gagal
          onError: (error: any) => {
            const errorMessage =
              error.response?.data?.message ||
              "Terjadi kesalahan. Silakan coba lagi.";

            message.error(errorMessage);
          },
        }
      );
    },
    [email, token, router, resetPasswordMutation] // Dependencies
  );

  // Guard clause: Redirect ke login jika tidak ada email atau token
  // Ini mencegah user mengakses halaman ini tanpa melalui flow yang benar
  if (!email || !token) {
    redirect("/login");
  }

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
            {isSuccess ? (
              <CheckCircleOutlined className="text-2xl !text-white" /> // Icon check jika success
            ) : (
              <LockOutlined className="text-2xl !text-white" />        // Icon lock untuk reset password
            )}
          </div>

          {/* Title dengan conditional text */}
          <Title level={3} className="!text-primary-tosca !mb-2">
            {isSuccess ? "Password Berhasil Direset!" : "Reset Password"}
          </Title>

          {/* Subtitle dengan conditional text dan tampilkan email */}
          <Text type="secondary" className="block mb-4">
            {isSuccess
              ? "Password Anda berhasil direset. Anda akan dialihkan ke halaman login."
              : `Masukkan password baru untuk akun: ${email}`}
          </Text>
        </div>

        {/* Conditional rendering berdasarkan success status */}
        {!isSuccess ? (
          // Tampilan form reset password jika belum success
          <Form 
            form={form} 
            onFinish={handleResetPassword}  // Submit handler
            layout="vertical"               // Layout vertikal
          >
            
            {/* Input Password Baru */}
            <Form.Item
              name="password"         // Field name
              label="Password Baru"   // Label
              rules={[                // Validation rules (sama seperti di register)
                { required: true, message: "Password wajib diisi" },
                { min: 8, message: "Password minimal 8 karakter" },
                {
                  // Regex untuk password complexity
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: "Password harus mengandung huruf besar, kecil, angka, dan karakter khusus",
                },
              ]}
            >
              <Input.Password
                size="large"                              // Large size
                placeholder="Masukkan password baru"      // Placeholder
                disabled={resetPasswordMutation.isPending} // Disable saat loading
              />
            </Form.Item>

            {/* Input Konfirmasi Password */}
            <Form.Item
              name="confirmPassword"     // Field name
              label="Konfirmasi Password" // Label
              dependencies={["password"]} // Depend pada field password
              rules={[
                {
                  required: true,
                  message: "Konfirmasi password wajib diisi",
                },
                ({ getFieldValue }) => ({
                  // Custom validator untuk memastikan password sama
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve(); // Valid
                    }
                    return Promise.reject(new Error("Password tidak cocok"));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"                              // Large size
                placeholder="Konfirmasi password baru"    // Placeholder
                disabled={resetPasswordMutation.isPending} // Disable saat loading
              />
            </Form.Item>

            {/* Submit Button */}
            <Button
              type="primary"                              // Primary style
              size="large"                                // Large size
              block                                       // Full width
              htmlType="submit"                           // Submit type
              loading={resetPasswordMutation.isPending}  // Loading state
              className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 h-12"
            >
              {resetPasswordMutation.isPending
                ? "Mereset Password..."  // Loading text
                : "Reset Password"}     // Normal text
            </Button>
          </Form>
        ) : (
          // Tampilan success alert jika reset berhasil
          <Alert
            message="Reset Password Berhasil!"
            description="Password Anda telah berhasil direset. Anda akan dialihkan ke halaman login dalam beberapa saat."
            type="success"                      // Success type (green)
            showIcon                            // Show success icon
            icon={<CheckCircleOutlined />}      // Custom icon
            className="text-center"
          />
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordPage;

/*
COMPLETE FORGOT PASSWORD FLOW:

1. FORGOT PASSWORD PAGE:
   - User input email
   - API kirim OTP ke email
   - Redirect ke OTP page dengan email parameter

2. OTP FORGOT PASSWORD PAGE:
   - User input OTP 4 digit
   - API verify OTP + email
   - Jika valid: dapat reset token
   - Redirect ke reset password dengan email + token

3. RESET PASSWORD PAGE (Current):
   - User input password baru + konfirmasi
   - API reset password dengan email + token + newPassword
   - Jika berhasil: redirect ke login

SECURITY FLOW:
- Email validation → OTP verification → Token authorization → Password reset
- Token hanya valid setelah OTP verified
- Token biasanya expire dalam beberapa menit
- Setelah password reset, token menjadi invalid

PARAMETER VALIDATION:
- Guard clause: if (!email || !token) redirect("/login")
- Runtime validation: if (!email || !token) show error message
- Mencegah akses langsung tanpa melalui flow yang benar

PERBEDAAN DENGAN REGISTER PASSWORD:
REGISTER:
- Password + confirm password + checkbox agreement
- Lebih banyak validasi (nama, phone, email, dll)
- Tujuan: buat akun baru

RESET PASSWORD:
- Hanya password + confirm password
- Fokus pada password strength validation
- Tujuan: ubah password existing account
- Butuh authorization token

PATTERN YANG SAMA:
- Password complexity validation (8 char, uppercase, lowercase, number, special)
- Confirm password validation
- Loading states
- Success state dengan auto redirect
- Error handling

PATTERN YANG BERBEDA:
- Token-based authorization
- Guard clause untuk parameter validation
- Simpler form (hanya 2 field)
- Different API endpoint dan payload

KONSEP KEAMANAN:
1. Token Authorization: Hanya user yang verify OTP yang dapat reset
2. Parameter Validation: Cegah akses langsung
3. Password Strength: Sama seperti register untuk konsistensi
4. One-time Token: Token expire setelah digunakan
*/