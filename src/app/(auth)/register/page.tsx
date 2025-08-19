"use client"; // Directive Next.js 13+ untuk menandai ini sebagai Client Component

import React from "react"; // Import library React untuk membuat component
import Link from "next/link"; // Import Link component dari Next.js untuk navigasi
import { Form, Input, Button, Checkbox, Alert } from "antd"; // Import komponen UI dari Ant Design
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"; // Import icon untuk show/hide password
import { useRouter } from "next/navigation"; // Hook Next.js untuk navigasi programmatik
import { FormData } from "./types"; // Import interface TypeScript untuk type checking
import { useRegister } from "@/services/authServices"; // Import custom hook untuk registrasi

// Functional Component dengan TypeScript
const RegisterForm: React.FC = ({}) => {
  // Hook untuk navigasi halaman
  const router = useRouter();
  
  // Hook Ant Design untuk mengontrol form
  const [form] = Form.useForm();
  
  // Custom hook untuk registrasi - mengembalikan fungsi mutateAsync, status, dan error
  const { mutateAsync: register, status, error } = useRegister();

  // Function untuk handle submit form
  const handleSubmit = async (values: FormData) => {
    try {
      // Panggil API registrasi dengan data yang sudah di-trim (hapus spasi di awal/akhir)
      await register({
        fullName: values.fullName.trim(),
        phoneNumber: values.phoneNumber.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
      });

      // Jika berhasil, redirect ke halaman verifikasi email
      router.push("/(auth)/register/verify-email");
    } catch (err) {
      // Jika error, tidak ada handling khusus (error sudah di-handle oleh useRegister)
    }
  };

  // Variable untuk cek apakah sedang loading
  const loading = status === "pending";

  return (
    // Container utama dengan styling Tailwind CSS
    <div className="w-full max-w-md mx-auto bg-white p-6 my-8 md:my-12 sm:p-8 rounded-2xl shadow-2xl border border-gray-200">
      
      {/* Header Section */}
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-teal-600 mb-2">
          Daftar Akun Griyata
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Masukkan identitas diri untuk mendaftar
        </p>
      </div>

      {/* Error Alert - hanya muncul jika ada error */}
      {error && (
        <Alert
          message={"Terjadi kesalahan. Silakan coba lagi."}
          type="error"
          className="mb-4"
        />
      )}

      {/* Form Component dari Ant Design */}
      <Form 
        form={form}              // Instance form yang dicontrol
        onFinish={handleSubmit}  // Function yang dipanggil saat form berhasil disubmit
        layout="vertical"        // Layout form vertikal (label di atas input)
      >
        
        {/* Input Nama Lengkap */}
        <Form.Item
          className="!mb-3"      // Margin bottom dengan important (!mb-3)
          label={"Nama Lengkap"} // Label form
          name="fullName"        // Nama field untuk binding data
          rules={[               // Aturan validasi
            { required: true, message: "Nama lengkap wajib diisi" },
            { min: 2, message: "Nama minimal 2 karakter" },
            {
              pattern: /^[a-zA-Z\s]+$/, // Regex: hanya huruf dan spasi
              message: "Nama hanya boleh berisi huruf dan spasi",
            },
          ]}
        >
          <Input 
            placeholder="Nama lengkap" 
            disabled={loading}  // Disable input saat loading
          />
        </Form.Item>

        {/* Input Nomor Handphone */}
        <Form.Item
          className="!mb-3"
          label={"Nama Handphone"} // Note: ini mungkin typo, seharusnya "Nomor Handphone"
          name="phoneNumber"
          rules={[
            { required: true, message: "Nomor handphone wajib diisi" },
            {
              pattern: /^\d{10,13}$/, // Regex: 10-13 digit angka
              message: "Nomor handphone harus 10-13 digit angka",
            },
            {
              // Custom validator untuk cek format nomor Indonesia
              validator: (_, value) => {
                if (
                  !value ||
                  value.startsWith("08") ||
                  value.startsWith("62")
                ) {
                  return Promise.resolve(); // Valid
                }
                return Promise.reject(
                  new Error("Nomor handphone harus dimulai dengan 08 atau 62")
                );
              },
            },
          ]}
        >
          <Input
            placeholder="Nomor handphone (08xxxxxxxxx)"
            disabled={loading}
          />
        </Form.Item>

        {/* Input Email */}
        <Form.Item
          className="!mb-3"
          label={"Email"}
          name="email"
          rules={[
            { required: true, message: "Email wajib diisi" },
            { type: "email", message: "Format email tidak valid" }, // Built-in email validation
          ]}
        >
          <Input 
            placeholder="Alamat email" 
            disabled={loading} 
          />
        </Form.Item>

        {/* Input Password */}
        <Form.Item
          className="!mb-3"
          label={"Kata Sandi"}
          name="password"
          rules={[
            { required: true, message: "Kata Sandi wajib diisi" },
            { min: 8, message: "Kata Sandi minimal 8 karakter" },
            {
              pattern: /(?=.*[a-z])/, // Regex: harus ada huruf kecil
              message: "Kata Sandi harus mengandung huruf kecil",
            },
            {
              pattern: /(?=.*[A-Z])/, // Regex: harus ada huruf besar
              message: "Kata Sandi harus mengandung huruf besar",
            },
            {
              pattern: /(?=.*\d)/, // Regex: harus ada angka
              message: "Kata Sandi harus mengandung angka",
            },
            {
              pattern: /(?=.*[!@#$%^&*(),.?":{}|<>])/, // Regex: harus ada karakter khusus
              message: "Kata Sandi harus mengandung karakter khusus",
            },
          ]}
        >
          <Input.Password
            placeholder="Kata sandi"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            } // Icon untuk show/hide password
            disabled={loading}
          />
        </Form.Item>

        {/* Input Konfirmasi Password */}
        <Form.Item
          className="!mb-3"
          label={"Konfirmasi Kata Sandi"}
          name="confirmPassword"
          dependencies={["password"]} // Field ini depend pada field password
          rules={[
            { required: true, message: "Konfirmasi kata sandi wajib diisi" },
            ({ getFieldValue }) => ({
              // Custom validator untuk memastikan password sama
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve(); // Valid jika kosong atau sama dengan password
                }
                return Promise.reject(
                  new Error("Konfirmasi password tidak sama dengan password")
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Ulangi kata sandi"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            disabled={loading}
          />
        </Form.Item>

        {/* Checkbox Persetujuan */}
        <Form.Item
          className="!mb-3"
          name="agreeToTerms"
          valuePropName="checked" // Untuk checkbox, value prop adalah "checked"
          rules={[
            {
              // Custom validator untuk memastikan checkbox dicentang
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Anda harus menyetujui syarat dan ketentuan")
                    ),
            },
          ]}
        >
          <Checkbox disabled={loading}>
            Saya setuju dengan{" "}
            <Link
              href="/terms"
              className="!text-teal-600 hover:!text-teal-700 font-medium underline"
            >
              syarat dan ketentuan
            </Link>{" "}
            yang berlaku
          </Checkbox>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="!mb-3">
          <Button
            type="primary"        // Style button primary (warna utama)
            htmlType="submit"     // Type submit untuk trigger form submission
            loading={loading}     // Tampilkan loading spinner saat sedang submit
            className="w-full"    // Full width
            size="large"          // Size besar
          >
            Daftar Sekarang
          </Button>
        </Form.Item>

        {/* Link ke halaman login */}
        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="!text-teal-600 hover:!text-teal-800 font-medium underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;

/*
FLOW APLIKASI:
1. User mengisi form dengan data personal
2. Saat user klik "Daftar Sekarang", form akan divalidasi
3. Jika validasi berhasil, handleSubmit dipanggil
4. Data dikirim ke API via useRegister hook
5. Jika registrasi berhasil, user diarahkan ke halaman verifikasi email
6. Jika gagal, error message ditampilkan

KONSEP PENTING:
- TypeScript Interface: Mendefinisikan struktur data yang konsisten
- Form Validation: Memastikan data user sesuai format yang diinginkan
- State Management: Menggunakan hooks untuk manage state
- Responsive Design: Menggunakan Tailwind CSS untuk styling responsive
- User Experience: Loading states, error handling, dan feedback yang jelas
*/
