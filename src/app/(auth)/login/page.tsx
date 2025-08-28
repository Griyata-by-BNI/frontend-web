"use client";
import { useAuth } from "@/contexts/authContext";
import { useLogin } from "@/services/authServices";
import "@ant-design/v5-patch-for-react-19";
import { Alert, AlertProps, App, Button, Checkbox, Form, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

type ReasonKey =
  | "manual"
  | "expired"
  | "idle"
  | "unauthenticated"
  | "invalid-token"
  | "forbidden"
  | "revoked"
  | "network";

const REASON_MAP: Record<
  ReasonKey,
  { type: AlertProps["type"]; title: string; desc?: string }
> = {
  manual: {
    type: "info",
    title: "Anda telah keluar.",
    desc: "Silakan masuk kembali untuk melanjutkan.",
  },
  expired: {
    type: "warning",
    title: "Sesi berakhir.",
    desc: "Demi keamanan, Anda perlu login kembali.",
  },
  idle: {
    type: "warning",
    title: "Anda otomatis keluar karena tidak aktif.",
    desc: "Silakan login lagi untuk melanjutkan.",
  },
  unauthenticated: {
    type: "info",
    title: "Silakan login untuk mengakses dashboard.",
  },
  "invalid-token": {
    type: "error",
    title: "Token tidak valid.",
    desc: "Silakan login ulang.",
  },
  forbidden: {
    type: "error",
    title: "Akses ditolak.",
    desc: "Akun Anda tidak memiliki izin untuk halaman tersebut.",
  },
  revoked: {
    type: "error",
    title: "Sesi dicabut.",
    desc: "Silakan login kembali.",
  },
  network: {
    type: "error",
    title: "Gangguan jaringan.",
    desc: "Coba login kembali setelah koneksi stabil.",
  },
};

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();
  const { mutateAsync: loginApi, status } = useLogin();
  const searchParams = useSearchParams();

  const reasonParam = searchParams.get("reason") as ReasonKey | null;
  const from = searchParams.get("from") || "";

  const reasonAlert = useMemo(() => {
    if (!reasonParam) return undefined;
    return REASON_MAP[reasonParam];
  }, [reasonParam]);

  const [showReason, setShowReason] = useState(Boolean(reasonAlert));

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

  // Styling map untuk dekorasi
  const alertDecorMap: Record<
    NonNullable<AlertProps["type"]>,
    { ring: string; grad: string; bg: string }
  > = {
    info: {
      ring: "ring-blue-200",
      grad: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
    },
    warning: {
      ring: "ring-amber-200",
      grad: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
    },
    error: {
      ring: "ring-rose-200",
      grad: "from-rose-500 to-red-500",
      bg: "bg-rose-50",
    },
    success: {
      ring: "ring-emerald-200",
      grad: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
    },
  };

  const deco = alertDecorMap[reasonAlert?.type || "info"] ?? alertDecorMap.info;

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
            {reasonAlert && showReason && (
              <div
                className={`
              relative mb-6 rounded-xl ${deco.bg}
              ring-1 ${deco.ring} shadow-sm transition-all duration-300
            `}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${deco.grad}`}
                />
                <Alert
                  showIcon
                  type={reasonAlert.type}
                  message={
                    <div className="font-semibold">{reasonAlert.title}</div>
                  }
                  description={
                    reasonAlert.desc ||
                    (from ? `Halaman sebelumnya: ${from}` : undefined)
                  }
                  banner
                  closable
                  onClose={() => setShowReason(false)}
                  className="!bg-transparent !border-0 !px-4 !py-3 pl-6"
                />
              </div>
            )}

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
