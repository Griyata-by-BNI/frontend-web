"use client";
import "@ant-design/v5-patch-for-react-19";
import { Card, Form, Upload, Button, Row, Col, App } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import type { UploadProps } from "antd";
import { useKprApplyStore } from "@/stores/useKprApplyStore";
import { useShallow } from "zustand/react/shallow";

const MAX_MB = 5;

export default function DocumentUploadForm() {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isMarried, setIsMarried] = useState(false);

  const { formData, next, prev } = useKprApplyStore(
    useShallow((s) => ({
      formData: s.formData,
      next: s.next,
      prev: s.prev,
    }))
  );

  // (opsional) hardening tambahan saat normalisasi
  const normalizeFileList = (e: any) => {
    const list = Array.isArray(e) ? e : e?.fileList ?? [];
    // buang file yg melebihi size (jika masuk dari drag/drop aneh)
    return list.filter(
      (f: any) =>
        !f.originFileObj || f.originFileObj.size / 1024 / 1024 < MAX_MB
    );
  };

  const uploadProps: UploadProps = useMemo(
    () => ({
      beforeUpload: (file) => {
        const isValidType =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "application/pdf";

        if (!isValidType) {
          message.error("File harus berformat JPG, PNG, JPEG, atau PDF!");
          // jangan masukkan ke fileList
          return Upload.LIST_IGNORE;
        }

        const isLtMax = file.size / 1024 / 1024 < MAX_MB;
        if (!isLtMax) {
          message.error(`Ukuran file maksimal ${MAX_MB}MB!`);
          // jangan masukkan ke fileList
          return Upload.LIST_IGNORE;
        }

        // return false = tidak auto-upload, tapi tetap MASUK ke fileList
        // kita mau tidak masuk fileList jika invalid; untuk valid biarkan masuk:
        return false;
      },
      // batasi satu file per field
      maxCount: 1,
      // batasi pilihan di dialog
      accept: ".jpg,.jpeg,.png,.pdf",
      className: "[&_.ant-upload]:!w-full",
      // (opsional) cegah preview default jika perlu
      // onPreview: () => {}
    }),
    []
  );

  const checkFormValidity = () => {
    const values = form.getFieldsValue();
    const required = [
      "id_card",
      "tax_id",
      "employment_certificate",
      "salary_slip",
    ];
    if (isMarried) required.push("spouse_id_card", "marriage_certificate");
    const ok = required.every(
      (f) => Array.isArray(values[f]) && values[f].length > 0
    );
    setIsFormValid(ok);
  };

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
      setIsMarried(Boolean(formData.is_married));
      checkFormValidity();
    }
  }, [formData]);

  const handleNext = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    next(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="mt-4"
      onFieldsChange={checkFormValidity}
    >
      <Card
        title={<p className="text-sm">Unggah Dokumen</p>}
        className="!border-[#d9d9d9] [&_.ant-card-head]:!border-[#d9d9d9]"
      >
        <Row gutter={[24, 12]}>
          <Col span={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="KTP"
              name="id_card"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
              rules={[{ required: true, message: "KTP wajib diunggah" }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} className="!w-full">
                  Pilih File
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="NPWP"
              name="tax_id"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
              rules={[{ required: true, message: "NPWP wajib diunggah" }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} className="!w-full">
                  Pilih File
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Sertifikat Pekerjaan Saat Ini"
              name="employment_certificate"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
              rules={[
                {
                  required: true,
                  message: "Sertifikat pekerjaan wajib diunggah",
                },
              ]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} className="!w-full">
                  Pilih File
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              className="!mb-3 md:!mb-4"
              label="Slip Gaji"
              name="salary_slip"
              valuePropName="fileList"
              getValueFromEvent={normalizeFileList}
              rules={[{ required: true, message: "Slip gaji wajib diunggah" }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} className="!w-full">
                  Pilih File
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          {isMarried && (
            <>
              <Col span={24}>
                <Form.Item
                  className="!mb-3 md:!mb-4"
                  label="KTP Pasangan"
                  name="spouse_id_card"
                  valuePropName="fileList"
                  getValueFromEvent={normalizeFileList}
                  rules={[
                    { required: true, message: "KTP pasangan wajib diunggah" },
                  ]}
                >
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />} className="!w-full">
                      Pilih File
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  className="!mb-3 md:!mb-4"
                  label="Buku Nikah"
                  name="marriage_certificate"
                  valuePropName="fileList"
                  getValueFromEvent={normalizeFileList}
                  rules={[
                    { required: true, message: "Buku nikah wajib diunggah" },
                  ]}
                >
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />} className="!w-full">
                      Pilih File
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </>
          )}
        </Row>

        <div className="flex justify-between mt-6">
          <Button size="large" className="px-8" onClick={() => {
            const values = form.getFieldsValue();
            prev(values);
          }}>
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
