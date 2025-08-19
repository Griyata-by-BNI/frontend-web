"use client"; // Directive Next.js untuk Client Component

// Import patch untuk kompatibilitas React 19 dengan Ant Design
import "@ant-design/v5-patch-for-react-19";
import { useLogin } from "@/services/authServices";
import { App, Button, Checkbox, Form, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";


const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();
  const { mutateAsync: loginApi, status } = useLogin();

  const handleSubmit = async (values: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      // Destructuring values dari form
      const { email, password, rememberMe } = values;

      // Panggil API login dengan email dan password
      await login({ email, password });

      // FITUR "REMEMBER ME" - Local Storage Management
      if (rememberMe) {
        localStorage.setItem(
          "credential",
          JSON.stringify({ email, password })
        );
      } else {
        localStorage.removeItem("credential");
      }
    } catch (err) {
      // Manual error handling - tampilkan error message jika login gagal
      message.error("Login gagal. Mohon periksa email dan password anda!");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail) {
          form.setFieldsValue({ email: rememberedEmail, rememberMe: true });
        }
      } catch {
        // localStorage not available
      }
    }
  }, [form]);

  const loading = status === "pending";

  return (
    // Main container dengan full height
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Content container dengan responsive flex layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT SIDE - Image Section (Desktop Only) */}
        <div className="hidden lg:block lg:w-1/2 relative p-8">
          <Image
            src="/aset_login.jpg"        // Path gambar di public folder
            alt="Happy family"           // Alt text untuk accessibility
            fill                         // Fill parent container
            className="object-cover"     // CSS object-fit cover
            priority                     // Load image with high priority
          />
        </div>

        {/* RIGHT SIDE - Login Form Section */}
        <div className="flex-1 lg:w-1/2 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          
          {/* Form container dengan max width */}
          <div className="w-full max-w-md mx-auto">
            
            {/* Header Section */}
            <div className="mb-6">
              {/* Split title untuk styling yang berbeda */}
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-1 text-center">
                Masuk aplikasi
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-4 text-center">
                dengan akun anda
              </h3>

              {/* Subtitle */}
              <p className="text-gray-600 text-sm sm:text-base text-center">
                Masukkan email dan password untuk login
              </p>
            </div>

            {/* Form Component */}
            <Form
              form={form}              // Form instance
              onFinish={handleSubmit}  // Submit handler
              layout="vertical"        // Vertical layout (label di atas input)
              size="large"             // Large size untuk semua form items
            >
              
              {/* Email Input */}
              <Form.Item
                name="email"           // Field name untuk binding
                label="Email"          // Label
                rules={[               // Validation rules
                  { required: true, message: "Email wajib diisi" },
                  { type: "email", message: "Email tidak valid" },
                ]}
              >
                <Input
                  placeholder="Alamat email"      // Placeholder text
                  autoComplete="email"            // Browser autocomplete
                  disabled={loading}              // Disable saat loading
                />
              </Form.Item>

              {/* Password Input */}
              <Form.Item
                name="password"        // Field name
                label="Password"       // Label
                rules={[               // Validation rules
                  { required: true, message: "Password wajib diisi" },
                  { min: 8, message: "Password harus minimal 8 karakter" },
                ]}
              >
                <Input.Password
                  placeholder="Kata sandi"           // Placeholder
                  autoComplete="current-password"    // Browser autocomplete untuk existing password
                  disabled={loading}                 // Disable saat loading
                />
              </Form.Item>

              {/* Remember Me & Forgot Password Section */}
              <div className="flex items-center justify-between mb-4">
                
                {/* Remember Me Checkbox */}
                <Form.Item 
                  noStyle                    // No default styling (margin, etc)
                  name="rememberMe"          // Field name
                  valuePropName="checked"    // For checkbox, value prop adalah "checked"
                >
                  <Checkbox disabled={loading}>
                    Ingat Saya
                  </Checkbox>
                </Form.Item>

                {/* Forgot Password Link */}
                <Link
                  href="/forgot-password"
                  className={`!text-teal-600 hover:!text-teal-700 font-medium ${loading ? "pointer-events-none opacity-50" : ""}`}
                >
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full"
                  size="large"
                >
                  Masuk
                </Button>
              </Form.Item>

              {/* Register Link */}
              <p className="text-center text-gray-600 text-sm sm:text-base">
                Belum memiliki akun?{" "}
                <Link
                  href="/register"
                  className={`!text-teal-600 hover:!text-teal-800 font-semibold ${loading ? "pointer-events-none opacity-50" : ""}`}
                >
                  Daftar
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;