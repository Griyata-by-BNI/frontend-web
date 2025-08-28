"use client";
import {
  Card,
  Button,
  Row,
  Col,
  Descriptions,
  Tag,
  Form,
  Checkbox,
  App,
  Modal,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useKprApplyStore } from "@/stores/useKprApplyStore";
import { useShallow } from "zustand/react/shallow";
import interestRateData from "@/data/interest-rate.json";
import { useSubmitAllKpr } from "../_utils/useSubmitAllKpr";

export default function SummaryForm() {
  const { formData, prev } = useKprApplyStore(
    useShallow((s) => ({
      formData: s.formData,
      prev: s.prev,
    }))
  );

  const { modal } = App.useApp();
  const [form] = Form.useForm();
  const [canSubmit, setCanSubmit] = useState(false);

  const formatCurrency = (value?: number) =>
    typeof value === "number"
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(value)
      : "-";

  const formatDate = (d: any) => {
    if (!d) return "-";
    if (typeof d?.format === "function") return d.format("DD/MM/YYYY");
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString("id-ID");
  };

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = (files: any[], title: string) => {
    if (files && files.length > 0) {
      const file = files[0];
      let url = file.url;
      if (!url && file.originFileObj && file.originFileObj instanceof File) {
        url = URL.createObjectURL(file.originFileObj);
      }
      if (url) {
        setPreviewUrl(url);
        setPreviewTitle(title);
        setPreviewVisible(true);
      }
    }
  };

  const yesNoTag = (ok: boolean, files?: any[], title?: string) => (
    <div className="flex items-center gap-2">
      <Tag color={ok ? "green" : "red"}>
        {ok ? "Sudah diunggah" : "Belum diunggah"}
      </Tag>
      {ok && files && files.length > 0 && (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handlePreview(files, title || "Dokumen")}
        >
          Preview
        </Button>
      )}
    </div>
  );

  const hasEmploymentHistory =
    !!formData?.employmentHistory &&
    Object.values(formData.employmentHistory).some(
      (v) => v !== undefined && v !== null && v !== ""
    );

  const interestLabel = (() => {
    const id = formData?.interestRate;
    if (id === undefined || id === null) return "-";
    const found = (interestRateData as any[]).find(
      (r) => r.id === id || String(r.id) === String(id)
    );
    return found?.title ?? "-";
  })();

  const handleValuesChange = () => {
    const a = form.getFieldValue("agree_data_truth");
    const b = form.getFieldValue("agree_document_clarify");
    setCanSubmit(Boolean(a && b));
  };

  const { submitAll } = useSubmitAllKpr();

  const handleSubmit = async () => {
    modal.confirm({
      title: "Konfirmasi Pengajuan",
      icon: <></>,
      okText: "Kirim Pengajuan",
      cancelText: "Periksa Kembali",
      okButtonProps: { type: "primary" },
      content: (
        <div className="flex flex-col gap-2 text-[13px] leading-5 mb-4">
          <p>
            Apakah Anda sudah <b>YAKIN</b> dengan seluruh informasi yang Anda
            isi dan dokumen yang Anda unggah?
          </p>
          <p className="text-red-500">
            Setelah pengajuan dikirim, Anda tidak dapat mengubah data pengajuan.
          </p>
        </div>
      ),
      onOk: async () => {
        await submitAll(formData);
      },
    });
  };

  // ====== Responsive helpers
  const labelWidth = "clamp(120px, 35vw, 220px)";
  const gutterH = { xs: 12, sm: 16, md: 24, lg: 24, xl: 24 };
  const gutterV = { xs: 12, sm: 16, md: 24, lg: 24, xl: 24 };
  const descClass =
    "[&_.ant-descriptions-item-content]:break-words " +
    "[&_.ant-descriptions-item-content]:whitespace-pre-wrap " +
    "[&_.ant-descriptions-item-content]:min-w-0 " +
    "[&_.ant-descriptions-item-label]:text-gray-700";

  return (
    <div className="mt-4">
      <Card
        title={<p className="text-sm">Ringkasan Pengajuan</p>}
        className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]"
        styles={{ body: { padding: 16 } }} // ✅ ganti bodyStyle -> styles.body
      >
        <Row gutter={[gutterH, gutterV]}>
          <Col span={24}>
            <div className="overflow-x-auto">
              <Descriptions
                title="Informasi Pinjaman"
                bordered
                size="middle"
                colon={false}
                className={descClass}
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                styles={{ label: { width: labelWidth } as any }}
              >
                <Descriptions.Item label="Jumlah Pinjaman">
                  {formatCurrency(formData?.loanAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="Uang Muka">
                  {formatCurrency(formData?.downPayment)}
                </Descriptions.Item>
                <Descriptions.Item label="Tenor">
                  {formData?.tenor ? `${formData.tenor} bulan` : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Suku Bunga">
                  {interestLabel}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Col>

          <Col span={24}>
            <div className="overflow-x-auto">
              <Descriptions
                title="Informasi Nasabah"
                bordered
                size="middle"
                colon={false}
                className={descClass}
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                styles={{ label: { width: labelWidth } as any }}
              >
                <Descriptions.Item label="Nama Lengkap">
                  {formData?.full_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="NIK">
                  {formData?.nik || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="NPWP">
                  {formData?.tax_id_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Nama Ibu Kandung">
                  {formData?.mother_maiden_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {formData?.email || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="No. HP">
                  {formData?.phone_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Tempat Lahir">
                  {formData?.place_of_birth || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Tanggal Lahir">
                  {formatDate(formData?.birth_date)}
                </Descriptions.Item>
                <Descriptions.Item label="Pendidikan">
                  {formData?.education || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Jenis Kelamin">
                  {formData?.gender === "L"
                    ? "Laki-laki"
                    : formData?.gender === "P"
                    ? "Perempuan"
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Status Tempat Tinggal">
                  {formData?.residence_status || "-"}
                </Descriptions.Item>
              </Descriptions>

              {/* Full-width rows (tanpa span, pakai column=1) */}
              <Descriptions
                bordered
                size="middle"
                colon={false}
                className={`${descClass} mt-3`}
                column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                styles={{ label: { width: labelWidth } as any }}
              >
                <Descriptions.Item label="Alamat KTP">
                  {formData?.id_card_address || "-"}
                </Descriptions.Item>
                {!formData?.same_as_ktp && (
                  <Descriptions.Item label="Alamat Domisili">
                    {formData?.domicile_address || "-"}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          </Col>

          <Col span={24}>
            <div className="overflow-x-auto">
              <Descriptions
                title="Kontak Darurat"
                bordered
                size="middle"
                colon={false}
                className={descClass}
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                styles={{ label: { width: labelWidth } as any }}
              >
                <Descriptions.Item label="Nama">
                  {formData?.emergency_contact_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Hubungan">
                  {formData?.emergency_contact_relationship || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Telepon Rumah">
                  {formData?.emergency_contact_home_phone || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="No. HP">
                  {formData?.emergency_contact_mobile_phone || "-"}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                bordered
                size="middle"
                colon={false}
                className={`${descClass} mt-3`}
                column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                styles={{ label: { width: labelWidth } as any }}
              >
                <Descriptions.Item label="Alamat">
                  {formData?.emergency_contact_address || "-"}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Col>

          {formData?.is_married && formData?.spouse_information && (
            <Col span={24}>
              <div className="overflow-x-auto">
                <Descriptions
                  title="Informasi Pasangan"
                  bordered
                  size="middle"
                  colon={false}
                  className={descClass}
                  column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                  styles={{ label: { width: labelWidth } as any }}
                >
                  <Descriptions.Item label="Nama Lengkap">
                    {formData.spouse_information.full_name || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="NIK">
                    {formData.spouse_information.nik || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="NPWP">
                    {formData.spouse_information.tax_id_number || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jenis Kelamin">
                    {formData.spouse_information.gender === "L"
                      ? "Laki-laki"
                      : formData.spouse_information.gender === "P"
                      ? "Perempuan"
                      : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tanggal Lahir">
                    {formatDate(formData.spouse_information.birth_date)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kewarganegaraan">
                    {formData.spouse_information.nationality || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Pendidikan">
                    {formData.spouse_information.education || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {formData.spouse_information.email || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="No. HP">
                    {formData.spouse_information.phone_number || "-"}
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions
                  bordered
                  size="middle"
                  colon={false}
                  className={`${descClass} mt-3`}
                  column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                  styles={{ label: { width: labelWidth } as any }}
                >
                  <Descriptions.Item label="Alamat KTP">
                    {formData.spouse_information.id_card_address || "-"}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Col>
          )}

          <Col span={24}>
            <div className="overflow-x-auto">
              <Descriptions
                title="Informasi Pekerjaan Saat Ini"
                bordered
                size="middle"
                colon={false}
                className={descClass}
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                styles={{ label: { width: labelWidth } as any }}
              >
                <Descriptions.Item label="Jenis Pekerjaan">
                  {formData?.employment_type || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Nama Perusahaan">
                  {formData?.company_name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Telepon Perusahaan">
                  {formData?.company_phone_number || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Jabatan">
                  {formData?.job_title || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Posisi">
                  {formData?.position || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Jenis Industri">
                  {formData?.industry_type || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Lama Bekerja">
                  {formData?.length_of_work_years
                    ? `${formData.length_of_work_years} tahun`
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Gaji Pokok">
                  {formatCurrency(formData?.basic_salary)}
                </Descriptions.Item>
                <Descriptions.Item label="Penghasilan Lain">
                  {formatCurrency(formData?.other_income)}
                </Descriptions.Item>
                <Descriptions.Item label="Total Penghasilan">
                  {formatCurrency(formData?.total_income)}
                </Descriptions.Item>
                <Descriptions.Item label="Total Pengeluaran">
                  {formatCurrency(formData?.total_expenses)}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                bordered
                size="middle"
                colon={false}
                className={`${descClass} mt-3`}
                column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                styles={{ label: { width: labelWidth } as any }}
              >
                <Descriptions.Item label="Alamat Perusahaan">
                  {formData?.address || "-"}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Col>

          {hasEmploymentHistory && (
            <Col span={24}>
              <div className="overflow-x-auto">
                <Descriptions
                  title="Riwayat Pekerjaan Sebelumnya"
                  bordered
                  size="middle"
                  colon={false}
                  className={descClass}
                  column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                  styles={{ label: { width: labelWidth } as any }}
                >
                  <Descriptions.Item label="Jenis Pekerjaan">
                    {formData.employmentHistory.employment_type || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nama Perusahaan">
                    {formData.employmentHistory.company_name || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Telepon Perusahaan">
                    {formData.employmentHistory.phone_number || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jabatan">
                    {formData.employmentHistory.job_title || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Posisi">
                    {formData.employmentHistory.position || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jenis Industri">
                    {formData.employmentHistory.industry_type || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Lama Bekerja">
                    {formData.employmentHistory.length_of_work_years
                      ? `${formData.employmentHistory.length_of_work_years} tahun`
                      : "-"}
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions
                  bordered
                  size="middle"
                  colon={false}
                  className={`${descClass} mt-3`}
                  column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                  styles={{ label: { width: labelWidth } as any }}
                >
                  <Descriptions.Item label="Alamat Perusahaan">
                    {formData.employmentHistory.address || "-"}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Col>
          )}

          <Col span={24}>
            <div className="overflow-x-auto">
              <Descriptions
                title="Dokumen"
                bordered
                size="middle"
                colon={false}
                className={descClass}
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                styles={{ label: { width: labelWidth } as any }}
              >
                <Descriptions.Item label="KTP">
                  {yesNoTag(
                    Array.isArray(formData?.id_card) &&
                      formData.id_card.length > 0,
                    formData?.id_card,
                    "KTP"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="NPWP">
                  {yesNoTag(
                    Array.isArray(formData?.tax_id) &&
                      formData.tax_id.length > 0,
                    formData?.tax_id,
                    "NPWP"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Sertifikat Pekerjaan">
                  {yesNoTag(
                    Array.isArray(formData?.employment_certificate) &&
                      formData.employment_certificate.length > 0,
                    formData?.employment_certificate,
                    "Sertifikat Pekerjaan"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Slip Gaji">
                  {yesNoTag(
                    Array.isArray(formData?.salary_slip) &&
                      formData.salary_slip.length > 0,
                    formData?.salary_slip,
                    "Slip Gaji"
                  )}
                </Descriptions.Item>
                {formData?.is_married && (
                  <>
                    <Descriptions.Item label="KTP Pasangan">
                      {yesNoTag(
                        Array.isArray(formData?.spouse_id_card) &&
                          formData.spouse_id_card.length > 0,
                        formData?.spouse_id_card,
                        "KTP Pasangan"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Buku Nikah">
                      {yesNoTag(
                        Array.isArray(formData?.marriage_certificate) &&
                          formData.marriage_certificate.length > 0,
                        formData?.marriage_certificate,
                        "Buku Nikah"
                      )}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </div>
          </Col>

          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleValuesChange}
              className="mt-2"
            >
              <Form.Item
                name="agree_data_truth"
                valuePropName="checked"
                className="!mb-2"
              >
                <Checkbox className="leading-6 text-[13px]">
                  Semua informasi dan dokumen yang saya lampirkan dalam
                  permohonan ini adalah benar dan apabila terdapat perubahan
                  data dalam aplikasi, saya wajib segera memberikan informasi
                  terbaru kepada BNI.
                </Checkbox>
              </Form.Item>

              <Form.Item name="agree_document_clarify" valuePropName="checked">
                <Checkbox className="leading-6 text-[13px]">
                  Dengan memberikan tanda ini, debitur menyatakan setuju dan
                  mengklarifikasi dokumen yang dilampirkan.
                </Checkbox>
              </Form.Item>
            </Form>
          </Col>
        </Row>

        {/* CTA */}
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Button size="large" className="px-6 w-full md:w-auto" onClick={prev}>
            Kembali
          </Button>
          <Button
            type="primary"
            size="large"
            className="px-6 w-full md:w-auto"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Submit Pengajuan
          </Button>
        </div>
      </Card>

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        centered
      >
        <div className="flex justify-center">
          <img
            src={previewUrl}
            alt={previewTitle}
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
          />
        </div>
      </Modal>
    </div>
  );
}
