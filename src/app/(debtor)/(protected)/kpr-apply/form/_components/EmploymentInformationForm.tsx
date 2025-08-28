"use client";
import "@ant-design/v5-patch-for-react-19";
import { Card, Form, Input, Select, InputNumber, Button, Row, Col } from "antd";
import { useState, useEffect } from "react";
import { useKprApplyStore } from "@/stores/useKprApplyStore";
import { useShallow } from "zustand/react/shallow";

export default function EmploymentInformationForm() {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);

  const { formData, next, prev } = useKprApplyStore(
    useShallow((s) => ({
      formData: s.formData,
      next: s.next,
      prev: s.prev,
    }))
  );

  const employmentTypeOptions = [
    { value: "Karyawan Swasta", label: "Karyawan Swasta" },
    { value: "Karyawan BUMN", label: "Karyawan BUMN" },
    { value: "PNS", label: "PNS" },
    { value: "TNI/Polri", label: "TNI/Polri" },
    { value: "Wiraswasta", label: "Wiraswasta" },
    { value: "Profesional", label: "Profesional" },
  ];

  const positionOptions = [
    { value: "Staff", label: "Staff" },
    { value: "Supervisor", label: "Supervisor" },
    { value: "Manager", label: "Manager" },
    { value: "General Manager", label: "General Manager" },
    { value: "Direktur", label: "Direktur" },
  ];

  const industryOptions = [
    { value: "Teknologi Informasi", label: "Teknologi Informasi" },
    { value: "Perbankan", label: "Perbankan" },
    { value: "Manufaktur", label: "Manufaktur" },
    { value: "Perdagangan", label: "Perdagangan" },
    { value: "Jasa", label: "Jasa" },
    { value: "Pendidikan", label: "Pendidikan" },
    { value: "Kesehatan", label: "Kesehatan" },
    { value: "Konstruksi", label: "Konstruksi" },
  ];

  // Regex angka saja
  const DIGITS_ONLY = /^\d+$/;

  const calculateTotalIncome = () => {
    const basicSalary = Number(form.getFieldValue("basic_salary") || 0);
    const otherIncome = Number(form.getFieldValue("other_income") || 0);
    form.setFieldValue("total_income", basicSalary + otherIncome);
  };

  const checkFormValidity = () => {
    const values = form.getFieldsValue();
    const hasErrors = form
      .getFieldsError()
      .some(({ errors }) => errors.length > 0);
    const requiredFields = [
      "employment_type",
      "company_name",
      "address",
      "company_phone_number",
      "job_title",
      "position",
      "industry_type",
      "length_of_work_years",
      "basic_salary",
      "total_expenses",
    ];
    const allRequiredFieldsFilled = requiredFields.every(
      (field) =>
        values[field] !== undefined &&
        values[field] !== null &&
        values[field] !== ""
    );
    setIsFormValid(allRequiredFieldsFilled && !hasErrors);
  };

  useEffect(() => {
    if (formData) form.setFieldsValue(formData);
    checkFormValidity();
  }, [formData]);

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      next(values);
    } catch {}
  };

  const formatThousand = (v?: string | number | null) =>
    v === null || v === undefined || v === ""
      ? ""
      : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <Form
      form={form}
      layout="vertical"
      className="mt-4"
      onFieldsChange={checkFormValidity}
    >
      <Card
        title={<p className="text-sm">Informasi Pekerjaan Saat Ini</p>}
        className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]"
      >
        <Row gutter={[24, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Jenis Pekerjaan"
              name="employment_type"
              rules={[
                { required: true, message: "Jenis pekerjaan wajib dipilih" },
              ]}
            >
              <Select
                size="large"
                placeholder="Pilih jenis pekerjaan"
                options={employmentTypeOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Nama Perusahaan"
              name="company_name"
              rules={[
                { required: true, message: "Nama perusahaan wajib diisi" },
              ]}
            >
              <Input size="large" placeholder="Masukkan nama perusahaan" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Alamat Perusahaan"
              name="address"
              rules={[
                { required: true, message: "Alamat perusahaan wajib diisi" },
              ]}
            >
              <Input.TextArea
                size="large"
                placeholder="Masukkan alamat perusahaan"
                rows={3}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Nomor Telepon Perusahaan"
              name="company_phone_number"
              rules={[
                {
                  required: true,
                  message: "Nomor telepon perusahaan wajib diisi",
                },
                {
                  pattern: DIGITS_ONLY,
                  message: "Nomor telepon hanya boleh berisi angka",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Masukkan nomor telepon perusahaan"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Jabatan"
              name="job_title"
              rules={[{ required: true, message: "Jabatan wajib diisi" }]}
            >
              <Input size="large" placeholder="Masukkan jabatan" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Posisi"
              name="position"
              rules={[{ required: true, message: "Posisi wajib dipilih" }]}
            >
              <Select
                size="large"
                placeholder="Pilih posisi"
                options={positionOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Jenis Industri"
              name="industry_type"
              rules={[
                { required: true, message: "Jenis industri wajib dipilih" },
              ]}
            >
              <Select
                size="large"
                placeholder="Pilih jenis industri"
                options={industryOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Lama Bekerja (Tahun)"
              name="length_of_work_years"
              rules={[
                { required: true, message: "Lama bekerja wajib diisi" },
                { type: "number", min: 1, message: "Minimal 1 tahun" },
              ]}
            >
              <InputNumber
                size="large"
                placeholder="Masukkan lama bekerja"
                className="!w-full"
                min={1}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Gaji Pokok"
              name="basic_salary"
              rules={[{ required: true, message: "Gaji pokok wajib diisi" }]}
            >
              <InputNumber
                controls={false}
                className="!w-full"
                size="large"
                placeholder="Masukkan gaji pokok"
                prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
                formatter={formatThousand}
                parser={(value) => {
                  if (!value) return undefined as unknown as number;
                  return Number(value.replace(/[^0-9]/g, ""));
                }}
                onChange={calculateTotalIncome}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Penghasilan Lain"
              name="other_income"
              initialValue={0}
            >
              <InputNumber
                controls={false}
                className="!w-full"
                size="large"
                placeholder="Masukkan penghasilan lain"
                prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
                formatter={formatThousand}
                parser={(value) => {
                  if (!value) return undefined as unknown as number;
                  return Number(value.replace(/[^0-9]/g, ""));
                }}
                onChange={calculateTotalIncome}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Total Penghasilan"
              name="total_income"
            >
              <InputNumber
                controls={false}
                className="!w-full"
                size="large"
                disabled
                prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
                formatter={formatThousand}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Total Pengeluaran"
              name="total_expenses"
              rules={[
                { required: true, message: "Total pengeluaran wajib diisi" },
              ]}
            >
              <InputNumber
                controls={false}
                className="!w-full"
                size="large"
                placeholder="Masukkan total pengeluaran"
                prefix={<p className="font-semibold text-dark-tosca">Rp</p>}
                formatter={formatThousand}
                parser={(value) => {
                  if (!value) return undefined as unknown as number;
                  return Number(value.replace(/[^0-9]/g, ""));
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card
        title={<p className="text-sm">Riwayat Pekerjaan Sebelumnya</p>}
        className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9] !mt-6"
      >
        <Row gutter={[24, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Jenis Pekerjaan"
              name={["employmentHistory", "employment_type"]}
            >
              <Select
                size="large"
                placeholder="Pilih jenis pekerjaan"
                options={employmentTypeOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Nama Perusahaan"
              name={["employmentHistory", "company_name"]}
            >
              <Input size="large" placeholder="Masukkan nama perusahaan" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Alamat Perusahaan"
              name={["employmentHistory", "address"]}
            >
              <Input.TextArea
                size="large"
                placeholder="Masukkan alamat perusahaan"
                rows={3}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Nomor Telepon Perusahaan"
              name={["employmentHistory", "phone_number"]}
              rules={[
                {
                  pattern: DIGITS_ONLY,
                  message: "Nomor telepon hanya boleh berisi angka",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Masukkan nomor telepon perusahaan"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Jabatan"
              name={["employmentHistory", "job_title"]}
            >
              <Input size="large" placeholder="Masukkan jabatan" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Posisi"
              name={["employmentHistory", "position"]}
            >
              <Select
                size="large"
                placeholder="Pilih posisi"
                options={positionOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Jenis Industri"
              name={["employmentHistory", "industry_type"]}
            >
              <Select
                size="large"
                placeholder="Pilih jenis industri"
                options={industryOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Lama Bekerja (Tahun)"
              name={["employmentHistory", "length_of_work_years"]}
            >
              <InputNumber
                size="large"
                placeholder="Masukkan lama bekerja"
                className="!w-full"
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-between mt-6">
          <Button
            size="large"
            className="px-8"
            onClick={() => {
              const values = form.getFieldsValue();
              prev(values);
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
      </Card>
    </Form>
  );
}
