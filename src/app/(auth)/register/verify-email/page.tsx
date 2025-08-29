"use client";
import "@ant-design/v5-patch-for-react-19";
import {
  useVerifyEmailRegister,
  useResendOtpRegister,
} from "@/services/authServices";
import { CheckCircleOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Input, Space, Spin, Typography, App } from "antd";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { jwtDecode } from "jwt-decode";

const { Title, Text } = Typography;

const VerifyEmailPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const verifyEmailMutation = useVerifyEmailRegister();
  const resendOtpMutation = useResendOtpRegister();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (value: string) => {
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 4);
    setOtp(sanitizedValue);
  };

  const handleVerify = useCallback(async () => {
    verifyEmailMutation.mutate(
      { email, otp },
      {
        onSuccess: async (data) => {
          message.success("Email berhasil diverifikasi!");
          setIsVerified(true);
          login(data.data.token);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            "Terjadi kesalahan. Silakan coba lagi.";

          message.error(errorMessage);
          setOtp("");
        },
      }
    );
  }, [email, otp, router, verifyEmailMutation]);

  const handleResendOtp = useCallback(async () => {
    resendOtpMutation.mutate(email, {
      onSuccess: (data) => {
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

  const canVerify = otp.length === 4 && !verifyEmailMutation.isPending;
  const canResend = resendCooldown === 0 && !resendOtpMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card
        className="w-full max-w-md shadow-2xl shadow-gray-500/20 !border-gray-200"
        style={{ borderRadius: 16 }}
      >
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            {isVerified ? (
              <CheckCircleOutlined className="text-2xl !text-white" />
            ) : (
              <MailOutlined className="text-2xl !text-white" />
            )}
          </div>

          <Title level={3} className="!text-primary-tosca !mb-2">
            {isVerified ? "Email Terverifikasi!" : "Verifikasi Email Anda"}
          </Title>

          <Text type="secondary" className="block mb-4">
            {isVerified
              ? "Akun Anda berhasil diverifikasi dan siap digunakan."
              : `Masukkan kode verifikasi 4 digit yang telah dikirim ke:  ${email}`}
          </Text>
        </div>

        {!isVerified ? (
          <Space direction="vertical" size="large" className="w-full">
            <div className="flex flex-col items-center">
              <Input.OTP
                length={4}
                value={otp}
                onChange={handleOtpChange}
                size="large"
                disabled={verifyEmailMutation.isPending}
                separator={<span>-</span>}
              />
            </div>

            <Button
              type="primary"
              size="large"
              block
              loading={verifyEmailMutation.isPending}
              disabled={!canVerify}
              onClick={handleVerify}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 h-12"
            >
              {verifyEmailMutation.isPending
                ? "Memverifikasi..."
                : "Verifikasi Email"}
            </Button>

            <div className="text-center flex gap-2 items-center justify-center">
              <Text type="secondary">Tidak menerima kode?</Text>

              <Button
                type="link"
                loading={resendOtpMutation.isPending}
                disabled={!canResend}
                onClick={handleResendOtp}
                className={clsx("!p-0 h-max", {
                  "!text-primary-tosca hover:!text-dark-tosca":
                    !resendOtpMutation.isPending || resendCooldown < 1,
                  "!text-gray-400":
                    resendOtpMutation.isPending || resendCooldown > 0,
                })}
              >
                {resendOtpMutation.isPending ? (
                  <Spin size="small" className="mr-1" />
                ) : null}

                {resendCooldown > 0
                  ? `Kirim ulang dalam ${resendCooldown}s`
                  : "Kirim ulang kode"}
              </Button>
            </div>
          </Space>
        ) : (
          <Alert
            message="Verifikasi Berhasil!"
            description="Email Anda telah berhasil diverifikasi. Anda akan dialihkan ke halaman login dalam beberapa saat."
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            className="text-center"
          />
        )}
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
