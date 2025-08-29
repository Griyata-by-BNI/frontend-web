"use client";

import TermsAndConditionsModal from "@/components/TermsAndConditionsModal";
import { useRegister } from "@/services/authServices";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import { App, Button, Checkbox, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FormData } from "./types";

const RegisterForm: React.FC = ({}) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { mutateAsync: register, status, error } = useRegister();
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk kontrol modal

  const handleSubmit = async (values: FormData) => {
    try {
      await register({
        fullName: values.fullName.trim(),
        phoneNumber: values.phoneNumber.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
      });

      router.push(`/register/verify-email?email=${values.email}`);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.status?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";

      message.error(errorMessage);
    }
  };

  const loading = status === "pending";

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 my-8 sm:p-8 rounded-2xl shadow-2xl border border-gray-200">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-teal-600 mb-2">
          Daftar Akun Griyata
        </h3>

        <p className="text-gray-600 text-sm sm:text-base">
          Masukkan identitas diri untuk mendaftar
        </p>
      </div>

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          className="!mb-3"
          label={"Nama Lengkap"}
          name="fullName"
          rules={[
            { required: true, message: "Nama lengkap wajib diisi" },
            { min: 2, message: "Nama minimal 2 karakter" },
            {
              pattern: /^[a-zA-Z\s]+$/,
              message: "Nama hanya boleh berisi huruf dan spasi",
            },
          ]}
        >
          <Input placeholder="Nama lengkap" disabled={loading} />
        </Form.Item>

        <Form.Item
          className="!mb-3"
          label={"Nama Handphone"}
          name="phoneNumber"
          rules={[
            { required: true, message: "Nomor handphone wajib diisi" },
            {
              pattern: /^\d{10,13}$/,
              message: "Nomor handphone harus 10-13 digit angka",
            },
            {
              validator: (_, value) => {
                if (
                  !value ||
                  value.startsWith("08") ||
                  value.startsWith("62")
                ) {
                  return Promise.resolve();
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

        <Form.Item
          className="!mb-3"
          label={"Email"}
          name="email"
          rules={[
            { required: true, message: "Email wajib diisi" },
            { type: "email", message: "Format email tidak valid" },
          ]}
        >
          <Input placeholder="Alamat email" disabled={loading} />
        </Form.Item>

        <Form.Item
          className="!mb-3"
          label={"Kata Sandi"}
          name="password"
          rules={[
            { required: true, message: "Kata Sandi wajib diisi" },
            { min: 8, message: "Kata Sandi minimal 8 karakter" },
            {
              pattern: /(?=.*[a-z])/,
              message: "Kata Sandi harus mengandung huruf kecil",
            },
            {
              pattern: /(?=.*[A-Z])/,
              message: "Kata Sandi harus mengandung huruf besar",
            },
            {
              pattern: /(?=.*\d)/,
              message: "Kata Sandi harus mengandung angka",
            },
            {
              pattern: /(?=.*[^\w\s])/,
              message: "Kata Sandi harus mengandung karakter khusus",
            },
            {
              pattern: /^\S+$/,
              message: "Kata Sandi tidak boleh mengandung spasi",
            },
          ]}
        >
          <Input.Password
            placeholder="Kata sandi"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          className="!mb-3"
          label={"Konfirmasi Kata Sandi"}
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Konfirmasi kata sandi wajib diisi" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
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

        <Form.Item
          className="!mb-3"
          name="agreeToTerms"
          valuePropName="checked"
          rules={[
            {
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
            <Button
              type="link"
              className="!p-0 !text-teal-600 hover:!text-teal-700 !font-medium"
              onClick={() => setIsModalOpen(true)}
            >
              syarat dan ketentuan
            </Button>{" "}
            yang berlaku
          </Checkbox>
        </Form.Item>

        <TermsAndConditionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <Form.Item className="!mb-3">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
            size="large"
          >
            Daftar Sekarang
          </Button>
        </Form.Item>

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
