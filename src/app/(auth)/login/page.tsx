"use client"; // Directive Next.js untuk Client Component

// Import patch untuk kompatibilitas React 19 dengan Ant Design
import "@ant-design/v5-patch-for-react-19";
import React from "react";

// Import Next.js Image component untuk optimasi gambar
import Image from "next/image";

// Import komponen UI dari Ant Design
import { 
  Alert,    // Alert component untuk error message
  Button,   // Button component
  Checkbox, // Checkbox untuk "Remember Me"
  Form,     // Form component
  Input,    // Input component
  message   // Global notification
} from "antd";

// Import custom hook untuk login API
import { useLogin } from "@/services/authServices";

// Import Next.js Link component untuk navigasi
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";


const LoginPage: React.FC = () => {
  // Destructuring useLogin hook
  // mutateAsync: function untuk panggil API login (dengan alias 'login')
  // error: error state dari API call
  // status: status dari API call (idle, pending, success, error)
  const { mutateAsync: login, error, status } = useLogin();
  
  // Hook form dari Ant Design
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();
  const { mutateAsync: loginApi, status } = useLogin();

  // Function untuk handle form submission
  const handleSubmit = async (values: {
    email: string;
    password: string;
    rememberMe?: boolean; // Optional field - bisa undefined
  }) => {
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

  // Computed value untuk loading state
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

            {/* Error Alert - hanya tampil jika ada error */}
            {error && (
              <Alert 
                message={error.message}  // Error message dari API
                type="error"             // Error type (red alert)
                className="mb-4" 
              />
            )}

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
                  href="/forgot-password"   // Navigate ke forgot password page
                  className={`!text-teal-600 hover:!text-teal-700 font-medium ${
                    loading ? "pointer-events-none opacity-50" : "" // Disable link saat loading
                  }`}
                >
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
              <Form.Item>
                <Button
                  type="primary"           // Primary button style
                  htmlType="submit"        // Submit type
                  loading={loading}        // Loading state
                  className="w-full"       // Full width
                  size="large"             // Large size
                >
                  Masuk
                </Button>
              </Form.Item>

              {/* Register Link */}
              <p className="text-center text-gray-600 text-sm sm:text-base">
                Belum memiliki akun?{" "}
                <Link
                  href="/register"         // Navigate ke register page
                  className={`!text-teal-600 hover:!text-teal-800 font-semibold ${
                    loading ? "pointer-events-none opacity-50" : "" // Disable saat loading
                  }`}
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

/*
COMPLETE AUTHENTICATION FLOW - SEMUA BERUJUNG DI LOGIN:

1. REGISTER FLOW:
   Register Form → Verify Email → Login Page ✓

2. FORGOT PASSWORD FLOW:
   Forgot Password → OTP → Reset Password → Login Page ✓

3. DIRECT LOGIN:
   User langsung ke Login Page ✓

LOGIN PAGE FEATURES:

1. RESPONSIVE DESIGN:
   - Desktop: Split layout (image + form)
   - Mobile: Full width form only
   - Image hidden di mobile untuk UX yang lebih baik

2. REMEMBER ME FUNCTIONALITY:
   - Checkbox untuk simpan credential
   - Data disimpan di localStorage sebagai JSON
   - Auto-remove jika tidak dicentang

3. FORM VALIDATION:
   - Email: required + valid email format
   - Password: required + minimum 8 karakter
   - Validation lebih sederhana dibanding register

4. ERROR HANDLING:
   - API error dari useLogin hook
   - Manual error message di catch block
   - Visual feedback dengan Alert component

5. LOADING STATES:
   - Button loading state
   - Input fields disabled
   - Navigation links disabled

6. NAVIGATION:
   - Link ke forgot password
   - Link ke register page
   - Links disabled saat loading untuk UX

PERBEDAAN DENGAN HALAMAN LAIN:

COMPLEXITY LEVEL:
- Register: Most Complex (6 fields + validations)
- Reset Password: Medium (2 password fields + token validation)
- Login: Simplest (2 fields + remember me)

LAYOUT DESIGN:
- Other Pages: Centered card dengan gradient background
- Login: Split layout dengan image + form di desktop

VALIDATION:
- Register: Strict validation (password complexity, phone format, dll)
- Login: Basic validation (required + format check)

LOCAL STORAGE USAGE:
- Other Pages: No local storage
- Login: Remember me functionality dengan localStorage

KONSEP BARU DI LOGIN:

1. RESPONSIVE IMAGE:
   - Next.js Image component dengan fill prop
   - Hidden di mobile dengan responsive classes
   - Priority loading untuk performance

2. LOCAL STORAGE MANAGEMENT:
   - Save/remove credentials berdasarkan checkbox
   - JSON.stringify untuk convert object ke string
   - Security consideration: credentials di localStorage

3. SPLIT LAYOUT:
   - Flexbox responsive layout
   - Desktop: side-by-side image + form
   - Mobile: stacked layout

4. CONDITIONAL LINK STYLING:
   - Dynamic className berdasarkan loading state
   - pointer-events-none untuk disable interaction
   - Opacity untuk visual feedback

5. AUTO COMPLETE:
   - email: untuk email field
   - current-password: untuk existing password
   - Browser built-in form assistance

SECURITY CONSIDERATIONS:
- Credentials di localStorage (consider security implications)
- Password validation minimal (hanya required + min length)
- No password visibility toggle di login (berbeda dengan register)

UX IMPROVEMENTS:
- Large form size untuk better mobile experience
- Disabled states untuk prevent multiple submissions
- Clear error messages
- Visual loading feedback
- Responsive design
*/

/*
FLOW LOGIN PAGE:
1. User buka halaman login
2. User input email & password (opsional centang "Remember Me")
3. User klik "Masuk" → form validation berjalan
4. Jika validasi berhasil → handleSubmit dipanggil
5. API login dipanggil dengan credential
6. Jika login berhasil:
   - User redirect ke dashboard (handled by useLogin hook)
   - Jika "Remember Me" dicentang → simpan credential ke localStorage
7. Jika login gagal → tampilkan error message

DESAIN RESPONSIVE:
- Mobile: Form full width, gambar disembunyikan
- Tablet: Form tetap centered, gambar masih disembunyikan  
- Desktop: Split screen - gambar di kiri (50%), form di kanan (50%)

FITUR REMEMBER ME:
- Jika dicentang: simpan email + password ke localStorage
- Jika tidak: hapus credential dari localStorage
- CATATAN KEAMANAN: Menyimpan password di localStorage tidak aman!

PERBEDAAN DENGAN HALAMAN LAIN:

REGISTER:
- 6 fields (kompleks)
- Password complexity validation
- Agreement checkbox
- Redirect ke verify-email

LOGIN:
- 2 fields (sederhana)
- Basic validation (required + format)
- Remember me feature
- Redirect ke dashboard

FORGOT PASSWORD:
- 1 field (paling sederhana)
- Hanya email validation
- Redirect ke OTP verification

KONSEP BARU DI LOGIN PAGE:

1. RESPONSIVE LAYOUT DESIGN:
   - Split screen di desktop
   - Single column di mobile
   - CSS Grid/Flexbox untuk layout

2. IMAGE OPTIMIZATION:
   - Next.js Image component dengan optimasi otomatis
   - Priority loading untuk above-the-fold content
   - Responsive images

3. REMEMBER ME FUNCTIONALITY:
   - localStorage untuk persistent data
   - Checkbox dengan valuePropName="checked"

4. CONDITIONAL LINK STYLING:
   - Links disabled saat loading
   - pointer-events-none + opacity untuk visual feedback

5. FORM.ITEM NOSTYLE:
   - Hilangkan default margin untuk custom layout
   - Berguna untuk inline form elements

SECURITY CONSIDERATIONS:
⚠️  BAHAYA: Menyimpan password di localStorage
✅  AMAN: Menyimpan hanya email atau token
✅  GOOD: Auto logout setelah waktu tertentu
✅  GOOD: Clear localStorage saat logout

BEST PRACTICES:
- Responsive design dengan mobile-first approach
- Proper error handling dengan user-friendly messages
- Loading states untuk semua interactive elements
- Accessibility dengan proper labels dan alt text
- SEO friendly dengan semantic HTML structure
*/