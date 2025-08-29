"use client";
import "@ant-design/v5-patch-for-react-19";
import { Col, Row } from "antd";
import { useState } from "react";
import { AffordabilityForm } from "./AffordabilityForm";
import { AffordabilityResults } from "./AffordabilityResults";
import { useAffordabilityCalculation } from "../_hooks/useAffordabilityCalculation";
import { KPRAffordabilityProps, AffordabilityParams } from "../_types";

export const KPRAffordability = ({ className = "" }: KPRAffordabilityProps) => {
  const [params, setParams] = useState<AffordabilityParams>({
    jobType: "karyawan",
    age: 30,
    monthlyIncome: 10000000,
    monthlyExpenses: 5000000,
    tenor: 15,
    downPayment: 200000000,
    monthlyInstallment: 1500000,
    selectedRateId: 1,
  });

  const { affordablePrice, isAffordable } = useAffordabilityCalculation(params);

  const handleParamsChange = (newParams: Partial<AffordabilityParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  return (
    <div
      className={`w-full bg-gradient-to-r pt-5 from-teal-400 to-dark-tosca h-max rounded-xl md:rounded-2xl shadow-lg shadow-gray-500/10 border border-gray-200 ${className}`}
    >
      <div className="overflow-hidden rounded-xl md:rounded-2xl border border-gray-200">
        <Row
          className="bg-white rounded-xl h-full p-4 md:p-8"
          align="stretch"
          gutter={[48, 24]}
        >
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <AffordabilityForm
              params={params}
              onParamsChange={handleParamsChange}
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <AffordabilityResults
              params={params}
              affordablePrice={affordablePrice}
              isAffordable={isAffordable}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
