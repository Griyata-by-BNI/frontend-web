"use client";

import { Card, Form, InputNumber, Select, Button, Row, Col } from "antd";
import { useState, useEffect, useMemo } from "react";
import interestRateData from "@/data/interest-rate.json";
import { useKprApplyStore } from "@/stores/useKprApplyStore";
import { useShallow } from "zustand/react/shallow";

export default function LoanInformationForm() {
  const [form] = Form.useForm();
  const [selectedInterestRate, setSelectedInterestRate] = useState<number>();
  const [isFormValid, setIsFormValid] = useState(false);

  const { property, formData, next } = useKprApplyStore(
    useShallow((s) => ({
      formData: s.formData,
      next: s.next,
      property: s.property,
    }))
  );

  // batas min/max berbasis harga properti
  const maxLoanAmount = useMemo(
    () => (property?.price ? Number(property.price) * 0.9 : undefined),
    [property?.price]
  );

  const minDownPayment = useMemo(
    () => (property?.price ? Number(property.price) * 0.1 : undefined),
    [property?.price]
  );

  const maxDownPayment = useMemo(
    () => (property?.price ? Number(property.price) * 0.8 : undefined),
    [property?.price]
  );

  const getMinTenorFromInterestRate = () => {
    if (!selectedInterestRate) return 12;
    const rate = interestRateData.find((r) => r.id === selectedInterestRate);
    return rate ? rate.minimum_tenor * 12 : 12;
  };

  const checkFormValidity = () => {
    const values = form.getFieldsValue();
    const hasErrors = form
      .getFieldsError()
      .some(({ errors }) => errors.length > 0);
    const allFieldsFilled =
      values.loanAmount &&
      values.downPayment &&
      values.tenor &&
      values.interestRate;
    setIsFormValid(Boolean(allFieldsFilled) && !hasErrors);
  };

  useEffect(() => {
    const init = formData ?? {};
    form.setFieldsValue(init);
    if (init?.interestRate) setSelectedInterestRate(init.interestRate);
  }, [formData]);

  useEffect(() => {
    checkFormValidity();
  }, [selectedInterestRate]);

  const handleFinish = (values: any) => {
    next(values);
  };

  return (
    <Card
      title={<p className="text-sm">Informasi Pinjaman</p>}
      className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        onFieldsChange={checkFormValidity}
        onFinish={handleFinish}
      >
        <Row gutter={[12, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Jumlah Pinjaman"
              name="loanAmount"
              rules={[
                { required: true, message: "Jumlah pinjaman wajib diisi" },
                {
                  min: 250_000_000,
                  type: "number",
                  message: `Jumlah pinjaman minimal Rp 250.000.000`,
                },
                // pasang rule max hanya jika ada harga properti
                ...(maxLoanAmount
                  ? [
                      {
                        max: maxLoanAmount,
                        type: "number" as const,
                        message: `Jumlah pinjaman maksimal 90% dari harga rumah (Rp ${Math.floor(
                          maxLoanAmount
                        ).toLocaleString("id-ID")})`,
                      },
                    ]
                  : []),
              ]}
            >
              <InputNumber
                controls={false}
                className="!w-full"
                size="large"
                placeholder="Masukkan jumlah pinjaman"
                prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
                formatter={(value) => {
                  if (value === null || value === undefined) return "";
                  const str = String(value);
                  const parts = str.split(",");
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  return parts.join(",");
                }}
                parser={(value) => {
                  if (!value) return undefined as unknown as number;
                  // hilangkan semua kecuali digit & koma, lalu ganti koma->titik
                  return Number(
                    value.replace(/[^0-9,]/g, "").replace(",", ".")
                  );
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Uang Muka"
              name="downPayment"
              rules={[
                { required: true, message: "Uang muka wajib diisi" },
                ...(minDownPayment
                  ? [
                      {
                        min: minDownPayment,
                        type: "number" as const,
                        message: `Uang muka minimal 10% dari harga rumah (Rp ${Math.floor(
                          minDownPayment
                        ).toLocaleString("id-ID")})`,
                      },
                    ]
                  : []),
                ...(maxDownPayment
                  ? [
                      {
                        max: maxDownPayment,
                        type: "number" as const,
                        message: `Uang muka maksimal 80% dari harga rumah (Rp ${Math.floor(
                          maxDownPayment
                        ).toLocaleString("id-ID")})`,
                      },
                    ]
                  : []),
              ]}
            >
              <InputNumber
                controls={false}
                className="!w-full"
                size="large"
                placeholder="Masukkan uang muka"
                prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
                formatter={(value) => {
                  if (value === null || value === undefined) return "";
                  const str = String(value);
                  const parts = str.split(",");
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  return parts.join(",");
                }}
                parser={(value) => {
                  if (!value) return undefined as unknown as number;
                  return Number(
                    value.replace(/[^0-9,]/g, "").replace(",", ".")
                  );
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Tenor Peminjaman"
              name="tenor"
              rules={[
                { required: true, message: "Tenor wajib diisi" },
                {
                  validator: (_, value) => {
                    const currentInterestRate =
                      form.getFieldValue("interestRate");
                    if (!currentInterestRate) return Promise.resolve();
                    const rate = interestRateData.find(
                      (r) => r.id === currentInterestRate
                    );
                    const minTenor = rate ? rate.minimum_tenor * 12 : 12;
                    if (value && value < minTenor) {
                      return Promise.reject(
                        new Error(
                          `Tenor minimal ${minTenor} bulan berdasarkan suku bunga yang dipilih`
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                controls={false}
                className="!w-full"
                size="large"
                placeholder="Masukkan tenor peminjaman"
                suffix={<p className="font-semibold text-dark-tosca">bulan</p>}
                min={getMinTenorFromInterestRate()}
                max={300}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Pilihan Suku Bunga"
              name="interestRate"
              rules={[{ required: true, message: "Suku bunga wajib dipilih" }]}
            >
              <Select
                size="large"
                placeholder="Pilih suku bunga"
                onChange={(value) => {
                  setSelectedInterestRate(value);
                  // re-validate tenor karena min tenor tergantung suku bunga
                  form.validateFields(["tenor"]);
                }}
                options={interestRateData.map((rate) => ({
                  value: rate.id,
                  label: rate.title,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end mt-6">
          <Button
            type="primary"
            size="large"
            className="px-8"
            htmlType="submit"
            disabled={!isFormValid}
          >
            Lanjutkan
          </Button>
        </div>
      </Form>
    </Card>
  );
}
