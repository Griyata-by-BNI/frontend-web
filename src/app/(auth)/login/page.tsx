"use client";
import { useAuth } from "@/contexts/authContext";
import { useLogin } from "@/services/authServices";
import "@ant-design/v5-patch-for-react-19";
import { App, Button, Checkbox, Form, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();
  const { mutateAsync: loginApi, status } = useLogin();

  const handleSubmit = async (values: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    try {
      const { email, password, rememberMe } = values;

      const response = await loginApi({ email, password });

      login(response.data.token);

      if (rememberMe) {
        // simpan hanya email, bukan password
        localStorage.setItem("lastEmail", email);
      } else {
        localStorage.removeItem("lastEmail");
      }
    } catch (err: any) {
      messageApi.error("Login gagal. Mohon periksa email dan password anda!");
    }
  };

  useEffect(() => {
    const lastEmail = localStorage.getItem("lastEmail");
    if (lastEmail) {
      form.setFieldsValue({
        email: lastEmail,
        password: "", // jangan isi password
        rememberMe: true,
      });
    }
  }, [form]);

  const loading = status === "pending";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-1/2 relative min-h-[600px]">
          <Image
            src="/aset_login.jpg"
            alt="Happy family"
            fill
            className="object-cover object-top"
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <div className="flex-1 lg:w-1/2 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-1 text-center">
                Masuk aplikasi
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-4 text-center">
                dengan akun anda
              </h3>

              <p className="text-gray-600 text-sm sm:text-base text-center">
                Masukkan email dan password untuk login
              </p>
            </div>

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Email wajib diisi" },
                  { type: "email", message: "Email tidak valid" },
                ]}
              >
                <Input
                  placeholder="Alamat email"
                  autoComplete="email"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Password wajib diisi" },
                  { min: 8, message: "Password harus minimal 8 karakter" },
                ]}
              >
                <Input.Password
                  placeholder="Kata sandi"
                  autoComplete="current-password"
                  disabled={loading}
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-4">
                <Form.Item noStyle name="rememberMe" valuePropName="checked">
                  <Checkbox disabled={loading}>Ingat Saya</Checkbox>
                </Form.Item>

                <Link
                  href="/forgot-password"
                  className={`!text-teal-600 hover:!text-teal-700 font-medium ${
                    loading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Lupa password?
                </Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full "
                  size="large"
                >
                  Masuk
                </Button>
              </Form.Item>

              <p className="text-center text-gray-600 text-sm sm:text-base">
                Belum memiliki akun?{" "}
                <Link
                  href="/register"
                  className={`!text-teal-600 hover:!text-teal-800 font-semibold ${
                    loading ? "pointer-events-none opacity-50" : ""
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
