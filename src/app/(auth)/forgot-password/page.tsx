"use client"; // Directive Next.js untuk Client Component

// Import custom hook untuk forgot password API
import { useForgotPassword } from "@/services/authServices";

// Import icon dari Ant Design
import { KeyOutlined, MailOutlined } from "@ant-design/icons";

// Import patch untuk kompatibilitas React 19
import "@ant-design/v5-patch-for-react-19";

// Import komponen UI dari Ant Design
import {
  Alert,      // Komponen alert untuk notifikasi
  Button,     // Tombol
  Card,       // Container dengan styling
  Form,       // Form component
  Input,      // Input field
  Space,      // Spacing component
  Typography, // Typography components
  message,    // Global message notification
} from "antd";

import { useRouter } from "next/navigation"; // Next.js router hook
import React, { useCallback, useState } from "react"; // React hooks

// Destructuring Typography components
const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
  // Hook untuk navigasi programmatik
  const router = useRouter();
  
  // Hook Ant Design untuk mengontrol form
  const [form] = Form.useForm();
  
  // State untuk track apakah email berhasil dikirim
  const [isSuccess, setIsSuccess] = useState(false);
  
  // State untuk menyimpan email yang diinput (untuk ditampilkan di success message)
  const [email, setEmail] = useState("");

  // Custom hook untuk forgot password API call
  const forgotPasswordMutation = useForgotPassword();

  // Function untuk handle form submission
  const handleSubmit = useCallback(
    async (values: { email: string }) => {
      // Trim whitespace dari email input
      const emailValue = values.email.trim();
      
      // Simpan email ke state untuk ditampilkan nanti
      setEmail(emailValue);

      // Panggil API forgot password
      forgotPasswordMutation.mutate(emailValue, {
        // Callback jika API berhasil
        onSuccess: (data) => {
          // Tampilkan success message
          message.success(data.message || "Kode verifikasi berhasil dikirim!");
          
          // Set state success ke true (akan mengubah tampilan)
          setIsSuccess(true);

          // Delay 1.5 detik lalu redirect ke halaman OTP
          setTimeout(() => {
            router.push(
              `/forgot-password/otp?email=${encodeURIComponent(emailValue)}`
            );
          }, 1500);
        },
        
        // Callback jika API gagal
        onError: (error: any) => {
          // Extract error message dari response atau gunakan default
          const errorMessage =
            error.response?.data?.message ||
            "Terjadi kesalahan. Silakan coba lagi.";
          
          // Tampilkan error message
          message.error(errorMessage);
        },
      });
    },
    [router, forgotPasswordMutation] // Dependencies untuk useCallback
  );

  return (
    // Main container dengan gradient background dan center alignment
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      
      {/* Card component sebagai container utama */}
      <Card
        className="w-full max-w-md shadow-2xl shadow-gray-500/20 !border-gray-200"
        style={{ borderRadius: 16 }} // Inline style untuk border radius
      >
        
        {/* Header section - selalu ditampilkan */}
        <div className="text-center mb-8">
          
          {/* Icon container dengan icon key */}
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <KeyOutlined className="text-2xl !text-white" />
          </div>

          {/* Title */}
          <Title level={3} className="!text-primary-black !mb-2">
            Lupa Password?
          </Title>

          {/* Subtitle dengan instruksi */}
          <Text type="secondary" className="block mb-4">
            Masukkan alamat email Anda dan kami akan mengirimkan kode verifikasi
            untuk mereset password
          </Text>
        </div>

        {/* Conditional rendering berdasarkan status success */}
        {isSuccess ? (
          // Tampilan jika email berhasil dikirim
          <Alert
            message="Kode Berhasil Dikirim!"
            description={`Kode verifikasi telah dikirim ke ${email}. Anda akan dialihkan ke halaman verifikasi dalam beberapa saat.`}
            type="success"     // Success alert type (hijau)
            showIcon           // Tampilkan icon success
            className="text-center"
          />
        ) : (
          // Tampilan form input email (default state)
          <Space direction="vertical" className="w-full">
            
            {/* Form component */}
            <Form
              form={form}                                    // Form instance
              layout="vertical"                              // Layout vertikal (label di atas input)
              onFinish={handleSubmit}                        // Handler saat form submit
              disabled={forgotPasswordMutation.isPending}   // Disable seluruh form saat loading
            >
              
              {/* Email input field */}
              <Form.Item
                name="email"                    // Nama field untuk data binding
                className="!mb-8"               // Margin bottom dengan !important
                label="Alamat Email"            // Label form
                rules={[                        // Aturan validasi
                  { required: true, message: "Email harus diisi" },        // Required validation
                  { type: "email", message: "Format email tidak valid" },  // Email format validation
                ]}
              >
                <Input
                  prefix={<MailOutlined />}     // Icon di depan input
                  placeholder="contoh@email.com" // Placeholder text
                  size="large"                  // Size besar
                  autoComplete="email"          // HTML autocomplete attribute
                />
              </Form.Item>

              {/* Submit button */}
              <Form.Item noStyle> {/* noStyle untuk tidak ada margin/styling default */}
                <Button
                  type="primary"                                // Style primary button
                  htmlType="submit"                             // HTML type submit
                  size="large"                                  // Size besar
                  block                                         // Full width
                  loading={forgotPasswordMutation.isPending}   // Loading state
                >
                  {forgotPasswordMutation.isPending
                    ? "Mengirim Kode..."                        // Text saat loading
                    : "Kirim Kode Verifikasi"}                  // Text normal
                </Button>
              </Form.Item>
            </Form>
          </Space>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;

/*
FLOW APLIKASI FORGOT PASSWORD:
1. User mengakses halaman forgot password
2. User input email address
3. Form validation berjalan (required + email format)
4. User klik "Kirim Kode Verifikasi"
5. API dipanggil untuk kirim kode reset ke email
6. Jika berhasil: tampilkan success alert + redirect ke halaman OTP
7. Jika gagal: tampilkan error message

PERBEDAAN DENGAN HALAMAN SEBELUMNYA:

REGISTER PAGE:
- Form kompleks dengan banyak field
- Validasi password yang ketat
- Checkbox agreement
- Redirect ke verify-email

VERIFY EMAIL PAGE:
- Input OTP 4 digit
- Countdown timer untuk resend
- Multiple states (normal, loading, success)
- Real-time input sanitization

FORGOT PASSWORD PAGE:
- Form sederhana hanya 1 field (email)
- Validasi basic (required + email format)
- 2 states saja (form vs success)
- Auto redirect dengan delay

KONSEP BARU:
- encodeURIComponent(): Encode URL parameter untuk keamanan
- Form.Item noStyle: Hilangkan default styling
- Input prefix: Icon di dalam input field
- Conditional rendering yang lebih sederhana
- autoComplete attribute untuk UX yang lebih baik

PATTERN YANG KONSISTEN:
- useCallback untuk optimize performance
- Custom hooks untuk API calls
- Error handling dengan user-friendly messages
- Loading states di semua interactive elements
- Success states dengan auto redirect + delay
- Consistent styling dengan gradient background + card layout
*/