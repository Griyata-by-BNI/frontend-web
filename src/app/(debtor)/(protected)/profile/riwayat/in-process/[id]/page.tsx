"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { SUBMISSION_STEPS } from "@/utils/constants";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { StatusTracker } from "./components/StatusTracker";
import { PengajuanKPRView } from "./components/PengajuanKPRView";
import { VerifikasiView } from "./components/VerifikasiView";
import { StatusResultView } from "./components/StatusResultView";
import { usePropertyDetail, useSubmissionDetail } from "@/services/kprService";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";

export default function InProcessDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const {
    data: submission,
    isLoading: submissionLoading,
    error: submissionError,
  } = useSubmissionDetail(id);
  const { data: property, isLoading: propertyLoading } = usePropertyDetail(
    submission?.loan_information?.property_id
  );

  const currentProgress = useMemo(
    () =>
      submission?.submission.status === "under_review"
        ? SUBMISSION_STEPS.VERIFIKASI
        : SUBMISSION_STEPS.PENGAJUAN,
    [submission?.submission.status]
  );

  const [viewedStep, setViewedStep] = useState(currentProgress);

  const isLoading = submissionLoading || propertyLoading;

  if (isNaN(id)) {
    return (
      <ProtectedRoute>
        <div className="text-center p-10 text-red-500">
          ID pengajuan tidak valid
        </div>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="text-center p-10">Memuat detail pengajuan...</div>
      </ProtectedRoute>
    );
  }

  if (submissionError || !submission) {
    return (
      <ProtectedRoute>
        <div className="text-center p-10">
          <p className="text-red-500 mb-2">Gagal memuat data pengajuan</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:underline"
          >
            Coba lagi
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  const stepsData = [
    {
      title: "Pengajuan KPR",
      date: submission.submission.created_at
        ? new Date(submission.submission.created_at).toLocaleDateString("id-ID")
        : "",
    },
    {
      title: "Verifikasi Pengajuan",
      date: submission.submission.verified_at
        ? new Date(submission.submission.verified_at).toLocaleDateString(
            "id-ID"
          )
        : "",
    },
    { title: "Hasil Pengajuan", date: "" },
  ];

  const status =
    submission?.submission.status === "under_review"
      ? "Sedang Diproses"
      : "Diajukan";

  const breadcrumbItems = [
    { label: "Beranda", href: "/" },
    { label: "Profil", href: "/profile" },
    { label: "Riwayat Pengajuan", href: "/profile/riwayat" },
    { label: "Detail Pengajuan" },
  ];

  return (
    <ProtectedRoute>
      <div className="bg-gradient-to-t from-white to-light-tosca min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <CustomBreadcrumb items={breadcrumbItems} className="mb-6" />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-primary-tosca/40 px-8 py-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    Detail Pengajuan
                  </h1>
                  <p className="text-sm text-gray-600">
                    Lacak status pengajuan KPR Anda
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      submission?.submission.status === "under_review"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        submission?.submission.status === "under_review"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    {status}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-8">
              <StatusTracker
                steps={stepsData}
                currentProgress={currentProgress}
                viewedStep={viewedStep}
                onStepClickAction={(step: number) =>
                  setViewedStep(step as typeof currentProgress)
                }
              />
            </div>
          </div>

          <main className="mt-8">
            <div className="space-y-8">
              <StatusResultView
                status={status}
                submissionId={submission.submission?.id || id}
                submittedAt={submission.submission.created_at}
              />

              {viewedStep === SUBMISSION_STEPS.PENGAJUAN && (
                <PengajuanKPRView
                  submissionData={submission}
                  propertyData={property ?? null}
                />
              )}

              {viewedStep === SUBMISSION_STEPS.VERIFIKASI && (
                <VerifikasiView submissionData={submission} />
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
