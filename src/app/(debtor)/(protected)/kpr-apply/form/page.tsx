"use client";

import { Col, Progress, Row, Steps } from "antd";
import { useShallow } from "zustand/react/shallow";
import DebtorInformationForm from "./_components/DebtorInformationForm";
import DocumentUploadForm from "./_components/DocumentUploadForm";
import EmploymentInformationForm from "./_components/EmploymentInformationForm";
import LoanInformationForm from "./_components/LoanInformationForm";
import PropertyInformation from "./_components/PropertyInformation";
import SpouseInformationForm from "./_components/SpouseInformationForm";
import SummaryForm from "./_components/SummaryForm";
import { useKprApplyStore } from "@/stores/useKprApplyStore";
import { useAuth } from "@/contexts/authContext";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const items = [
  { title: "Informasi Pengajuan" },
  { title: "Informasi Nasabah" },
  { title: "Informasi Pasangan" },
  { title: "Informasi Pekerjaan" },
  { title: "Unggah Dokumen" },
  { title: "Ringkasan" },
];

export default function KprApplyForm() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("property_id");

  const {
    currentStep,
    next,
    prev,
    setCurrentStep,
    initSession,
    isValidSession,
    reset,
  } = useKprApplyStore(
    useShallow((s) => ({
      currentStep: s.currentStep,
      formData: s.formData,
      next: s.next,
      prev: s.prev,
      setCurrentStep: s.setCurrentStep,
      initSession: s.initSession,
      isValidSession: s.isValidSession,
      reset: s.reset,
    }))
  );

  useEffect(() => {
    if (!user?.userId || !propertyId) return;

    const userId = user.userId;
    const propId = Number(propertyId);

    if (!isValidSession(userId, propId)) {
      reset();
      initSession(userId, propId);
    }
  }, [user?.userId, propertyId, initSession, isValidSession, reset]);

  const lastStepIndex = items.length - 1;

  return (
    <div className="bg-light-tosca">
      <div className="px-4 py-6 md:py-0 md:px-0 custom-container">
        <Steps
          labelPlacement="vertical"
          items={items}
          current={currentStep}
          className="!hidden md:!flex [&_.ant-steps-item-title]:!leading-6"
        />

        <div className="h-20 p-4 bg-gradient-to-r from-primary-tosca to-dark-tosca rounded-lg md:hidden">
          <p className="text-white font-bold">{items[currentStep]?.title}</p>

          <Progress
            percent={((currentStep + 1) / items.length) * 100}
            strokeColor="#ffffff"
            className="[&_.ant-progress-text]:!text-white"
          />
        </div>

        {[0, lastStepIndex].includes(currentStep) && <PropertyInformation />}

        <Row className="mt-6">
          <Col span={24}>
            {currentStep === 0 && <LoanInformationForm />}

            {currentStep === 1 && <DebtorInformationForm />}

            {currentStep === 2 && <SpouseInformationForm />}

            {currentStep === 3 && <EmploymentInformationForm />}

            {currentStep === 4 && <DocumentUploadForm />}

            {currentStep === 5 && <SummaryForm />}
          </Col>
        </Row>
      </div>
    </div>
  );
}
