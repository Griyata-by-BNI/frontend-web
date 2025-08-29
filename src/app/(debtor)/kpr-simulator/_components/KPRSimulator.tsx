"use client";
import "@ant-design/v5-patch-for-react-19";
import { Col, Modal, Row, Table } from "antd";
import { useState, useMemo } from "react";
import interestRateData from "@/data/interest-rate.json";
import { useKPRCalculation } from "../_hooks/useKPRCalculation";
import { useDetailedSchedule } from "../_hooks/useDetailedSchedule";
import { KPRForm } from "./KPRForm";
import { KPRResults } from "./KPRResults";
import { InterestRate, KPRSimulatorProps } from "../_types";

const detailedColumns = [
  { title: "Bulan", dataIndex: "month", key: "month" },
  {
    title: "Angsuran",
    dataIndex: "payment",
    key: "payment",
    render: (v: number) => `Rp ${v.toLocaleString("id-ID")}`,
  },
  {
    title: "Porsi Pokok",
    dataIndex: "principal",
    key: "principal",
    render: (v: number) => `Rp ${v.toLocaleString("id-ID")}`,
  },
  {
    title: "Porsi Bunga",
    dataIndex: "interest",
    key: "interest",
    render: (v: number) => `Rp ${v.toLocaleString("id-ID")}`,
  },
  {
    title: "Sisa Pinjaman",
    dataIndex: "remainingBalance",
    key: "remainingBalance",
    render: (v: number) => `Rp ${v.toLocaleString("id-ID")}`,
  },
  {
    title: "Bunga",
    dataIndex: "interestRate",
    key: "interestRate",
    render: (v: number) => `${v}%`,
  },
];

export const KPRSimulator = ({
  className = "",
  initialPropertyPrice = 1_000_000_000,
  additionalButton = <></>,
  size = "default",
}: KPRSimulatorProps) => {
  // ----- size variants
  const isSmall = size === "small";
  const wrapRadius = "rounded-xl md:rounded-2xl";
  const innerRadius = wrapRadius;
  const outerPt = isSmall ? "pt-4" : "pt-5";
  const shadowCls = "shadow";
  const rowPadding = "p-4 md:p-8";
  const gutterH = isSmall ? 24 : 48;
  const gutterV = isSmall ? 16 : 24;
  const modalWidth = isSmall ? 720 : 1000;
  const tableSize: "small" | "middle" = isSmall ? "small" : "middle";

  // ----- state
  const [propertyPrice, setPropertyPrice] =
    useState<number>(initialPropertyPrice);
  const [downPayment, setDownPayment] = useState<number>(200_000_000);
  const [tenor, setTenor] = useState<number>(15);
  const [selectedInterestRate, setSelectedInterestRate] =
    useState<InterestRate | null>(interestRateData[1] as InterestRate);

  // ----- kalkulasi
  const { monthlyPayment, paymentSchedule, isValidTenor } = useKPRCalculation({
    propertyPrice,
    downPayment,
    tenor,
    selectedRate: selectedInterestRate,
  });

  // ----- detail schedule modal
  const {
    showDetailedSchedule,
    detailedSchedule,
    setShowDetailedSchedule,
    generateDetailedSchedule,
  } = useDetailedSchedule();

  const handleShowDetailedSchedule = () => {
    generateDetailedSchedule({
      propertyPrice,
      downPayment,
      tenor,
      selectedRate: selectedInterestRate,
      isValidTenor,
    });
  };

  const tableData = useMemo(() => detailedSchedule, [detailedSchedule]);

  const leftColProps = isSmall
    ? { xs: 24, sm: 24, md: 10, lg: 10, xl: 10, xxl: 10 }
    : { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };

  const rightColProps = isSmall
    ? { xs: 24, sm: 24, md: 14, lg: 14, xl: 14, xxl: 14 }
    : { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };

  return (
    <div
      className={`w-full bg-gradient-to-r ${outerPt} from-teal-400 to-dark-tosca
      h-max ${wrapRadius} ${shadowCls} ${className}`}
    >
      <div className={`overflow-hidden ${innerRadius}`}>
        <Row
          className={`bg-white ${innerRadius} h-full ${rowPadding}`}
          align="stretch"
          gutter={[gutterH, gutterV]}
        >
          {/* Kiri: Form */}
          <Col {...leftColProps}>
            <KPRForm
              propertyPrice={propertyPrice}
              downPayment={downPayment}
              tenor={tenor}
              selectedRate={selectedInterestRate}
              isValidTenor={isValidTenor}
              onPropertyPriceChange={setPropertyPrice}
              onDownPaymentChange={setDownPayment}
              onTenorChange={setTenor}
              onRateChange={setSelectedInterestRate}
              // size={size} // ← aktifkan jika ingin KPRForm ikut mengecil
            />
          </Col>

          {/* Kanan: Hasil */}
          <Col {...rightColProps}>
            <KPRResults
              selectedRate={selectedInterestRate}
              propertyPrice={propertyPrice}
              downPayment={downPayment}
              monthlyPayment={monthlyPayment}
              paymentSchedule={paymentSchedule}
              onShowDetailedSchedule={handleShowDetailedSchedule}
              additionalButton={additionalButton}
            />
          </Col>
        </Row>

        {/* Modal Detail Angsuran */}
        <Modal
          centered
          destroyOnHidden
          title="Detail Angsuran Bulanan"
          open={showDetailedSchedule}
          onCancel={() => setShowDetailedSchedule(false)}
          footer={null}
          width={modalWidth}
        >
          {selectedInterestRate?.floating_note && (
            <p
              className={`text-gray-500 mb-4 ${
                isSmall ? "text-xs" : "text-sm"
              }`}
            >
              Berikut adalah rincian angsuran sampai tahun ke-
              {selectedInterestRate.fixed_duration} :
            </p>
          )}

          <Table
            bordered
            dataSource={tableData}
            columns={detailedColumns}
            pagination={{ pageSize: 12 }}
            size={tableSize}
            rowKey="key"
            scroll={{ x: 800 }}
          />
        </Modal>
      </div>
    </div>
  );
};
