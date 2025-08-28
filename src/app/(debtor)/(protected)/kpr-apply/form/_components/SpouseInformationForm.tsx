"use client";
import "@ant-design/v5-patch-for-react-19";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Checkbox,
} from "antd";
import { useState, useEffect } from "react";
import { useKprApplyStore } from "@/stores/useKprApplyStore";
import { useShallow } from "zustand/react/shallow";

export default function SpouseInformationForm() {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);

  const { formData, next, prev } = useKprApplyStore(
    useShallow((s) => ({
      formData: s.formData,
      next: s.next,
      prev: s.prev,
    }))
  );

  const educationOptions = [
    { value: "SD", label: "SD" },
    { value: "SMP", label: "SMP" },
    { value: "SMA", label: "SMA/SMK" },
    { value: "D3", label: "Diploma 3" },
    { value: "S1", label: "Sarjana (S1)" },
    { value: "S2", label: "Magister (S2)" },
    { value: "S3", label: "Doktor (S3)" },
  ];

  const genderOptions = [
    { value: "L", label: "Laki-laki" },
    { value: "P", label: "Perempuan" },
  ];

  // Regex util
  const NAME_REGEX = /^[A-Za-z\s'.-]+$/; // huruf, spasi, titik, apostrof, tanda hubung
  const DIGITS_16 = /^\d{16}$/;
  const DIGITS_15 = /^\d{15}$/;

  const checkFormValidity = () => {
    const values = form.getFieldsValue();
    const isMarried = values.is_married;
    if (!isMarried) {
      setIsFormValid(true);
      return;
    }
    const hasErrors = form
      .getFieldsError()
      .some(({ errors }) => errors.length > 0);
    const requiredFields = [
      "full_name",
      "gender",
      "birth_date",
      "nationality",
      "education",
      "nik",
      "phone_number",
      "email",
      "id_card_address",
    ];
    const allRequiredFieldsFilled = requiredFields.every(
      (field) => values[field]
    );
    setIsFormValid(allRequiredFieldsFilled && !hasErrors);
  };

  useEffect(() => {
    const init = formData ?? {};
    form.setFieldValue("is_married", init.is_married ?? false);
    if (init.spouse_information) {
      form.setFieldsValue(init.spouse_information);
    }
    checkFormValidity();
  }, [formData]);

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      const { is_married, ...spouseData } = values;
      const spouseInfo = is_married ? spouseData : null;
      next({ is_married, spouse_information: spouseInfo });
    } catch {}
  };

  return (
    <div className="mt-4">
      <Form form={form} layout="vertical" onFieldsChange={checkFormValidity}>
        <Card className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9] mb-6">
          <Form.Item
            className="!mb-0"
            label={<p className="font-semibold text-sm">Status Pernikahan</p>}
            name="is_married"
            valuePropName="checked"
          >
            <Checkbox>Sudah Menikah</Checkbox>
          </Form.Item>
        </Card>

        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => prev.is_married !== curr.is_married}
        >
          {({ getFieldValue }) => {
            const isMarried = getFieldValue("is_married");
            if (!isMarried) return null;
            return (
              <Card
                title={<p className="text-sm">Informasi Pasangan</p>}
                className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9] !mt-8"
              >
                <Row gutter={[24, 12]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="Nama Lengkap"
                      name="full_name"
                      rules={[
                        { required: true, message: "Nama lengkap wajib diisi" },
                        {
                          pattern: NAME_REGEX,
                          message:
                            "Nama hanya boleh berisi huruf, spasi, titik, apostrof, atau tanda hubung",
                        },
                        {
                          whitespace: true,
                          message: "Tidak boleh hanya spasi",
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Masukkan nama lengkap" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="Jenis Kelamin"
                      name="gender"
                      rules={[
                        {
                          required: true,
                          message: "Jenis kelamin wajib dipilih",
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        placeholder="Pilih jenis kelamin"
                        options={genderOptions}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="Tanggal Lahir"
                      name="birth_date"
                      rules={[
                        {
                          required: true,
                          message: "Tanggal lahir wajib diisi",
                        },
                      ]}
                    >
                      <DatePicker
                        size="large"
                        placeholder="Pilih tanggal lahir"
                        className="!w-full"
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="Kewarganegaraan"
                      name="nationality"
                      rules={[
                        {
                          required: true,
                          message: "Kewarganegaraan wajib diisi",
                        },
                        {
                          pattern: NAME_REGEX,
                          message:
                            "Hanya huruf, spasi, titik, apostrof, atau tanda hubung",
                        },
                        {
                          whitespace: true,
                          message: "Tidak boleh hanya spasi",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Masukkan kewarganegaraan"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="Pendidikan Terakhir"
                      name="education"
                      rules={[
                        {
                          required: true,
                          message: "Pendidikan terakhir wajib dipilih",
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        placeholder="Pilih pendidikan terakhir"
                        options={educationOptions}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="NIK"
                      name="nik"
                      rules={[
                        { required: true, message: "NIK wajib diisi" },
                        {
                          pattern: DIGITS_16,
                          message: "NIK harus 16 digit angka",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Masukkan NIK"
                        maxLength={16}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="NPWP"
                      name="tax_id_number"
                      rules={[
                        { required: true, message: "NPWP wajib diisi" },
                        {
                          pattern: DIGITS_15,
                          message: "NPWP harus 15 digit angka",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Masukkan NPWP (opsional)"
                        maxLength={15}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="Nomor Handphone"
                      name="phone_number"
                      rules={[
                        {
                          required: true,
                          message: "Nomor handphone wajib diisi",
                        },
                        {
                          pattern: /^08[0-9]{8,11}$/,
                          message:
                            "Format tidak valid (harus mulai 08 dan total 10–13 digit)",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Masukkan nomor handphone"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Email wajib diisi" },
                        { type: "email", message: "Format email tidak valid" },
                      ]}
                    >
                      <Input size="large" placeholder="Masukkan email" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      className="!mb-3 md:!mb-4"
                      label="Alamat Sesuai KTP"
                      name="id_card_address"
                      rules={[
                        {
                          required: true,
                          message: "Alamat sesuai KTP wajib diisi",
                        },
                        {
                          whitespace: true,
                          message: "Tidak boleh hanya spasi",
                        },
                      ]}
                    >
                      <Input.TextArea
                        size="large"
                        placeholder="Masukkan alamat sesuai KTP"
                        rows={3}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            );
          }}
        </Form.Item>

        <div className="flex justify-between mt-6">
          <Button
            size="large"
            className="px-8"
            onClick={() => {
              const values = form.getFieldsValue();
              const { is_married, ...spouseData } = values;
              const spouseInfo = is_married ? spouseData : null;
              prev({ is_married, spouse_information: spouseInfo });
            }}
          >
            Kembali
          </Button>

          <Button
            type="primary"
            size="large"
            className="px-8"
            onClick={handleNext}
            disabled={!isFormValid}
          >
            Lanjutkan
          </Button>
        </div>
      </Form>
    </div>
  );
}
