"use client";

import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { Modal, Typography } from "antd";

interface InterestRateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterestRateModal: React.FC<InterestRateModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={720}
      maskClosable
      destroyOnHidden
      title={
        <span className="text-[#007A70] font-semibold">
          Syarat &amp; Ketentuan Suku Bunga
        </span>
      }
      styles={{
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
    >
      <Typography.Paragraph className="text-sm leading-relaxed text-gray-600">
        <Typography.Text strong className="text-gray-800">
          A. Pembelian di Top Selected Developer:
        </Typography.Text>{" "}
        Promo spesial untuk properti baru yang dikembangkan oleh Ciputra,
        Sinarmas Land, Jaya Real Properti, Paramount, Summarecon, Agung
        Podomoro, Pakuwon Group, dan developer terpilih lainnya (plafon kredit
        min. Rp 300 Juta).
      </Typography.Paragraph>

      <Typography.Paragraph className="text-sm leading-relaxed text-gray-600">
        <Typography.Text strong className="text-gray-800">
          B. Pembelian di Developer Kerjasama:
        </Typography.Text>{" "}
        Promo khusus untuk properti baru yang dikembangkan oleh seluruh
        developer kerjasama.
      </Typography.Paragraph>

      <Typography.Paragraph className="text-sm leading-relaxed text-gray-600">
        <Typography.Text strong className="text-gray-800">
          C. Non-Primary:
        </Typography.Text>{" "}
        Promo untuk pembelian properti second, pembangunan/renovasi, top up,
        atau take over dari bank lain.
      </Typography.Paragraph>

      <Typography.Paragraph className="text-sm leading-relaxed text-gray-600">
        <Typography.Text strong className="text-gray-800">
          D. Multiguna/Refinancing:
        </Typography.Text>{" "}
        Promo khusus untuk tujuan refinancing dan multiguna.
      </Typography.Paragraph>

      <Typography.Paragraph className="text-sm leading-relaxed text-gray-600 italic">
        Semua promo spesial di atas hanya berlaku untuk permohonan dengan
        dokumen lengkap selambat-lambatnya tanggal 30 September 2025. Setelah
        suku bunga fixed berakhir, akan dikenakan suku bunga floating yang
        berlaku.
      </Typography.Paragraph>
    </Modal>
  );
};
