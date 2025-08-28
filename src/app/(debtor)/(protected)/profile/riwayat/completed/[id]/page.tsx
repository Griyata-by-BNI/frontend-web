"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { useSubmissionDetail, usePropertyDetail } from "@/services/kprService";
import { SUBMISSION_STEPS } from "@/utils/constants";
import { StatusTracker } from "../../in-process/[id]/components/StatusTracker";
import { PengajuanKPRView } from "../../in-process/[id]/components/PengajuanKPRView";
import { VerifikasiView } from "../../in-process/[id]/components/VerifikasiView";
import { HasilPengajuanView } from "./components/HasilPengajuanView";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";

function CompletedPageContent() {
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

  const isLoading = submissionLoading || propertyLoading;
  const status =
    submission?.submission.status === "verified"
      ? "selesai"
      : submission?.submission.status === "rejected"
      ? "ditolak"
      : "dalam_proses";
  const currentProgress = SUBMISSION_STEPS.HASIL;
  const [viewedStep, setViewedStep] = useState<number>(currentProgress);

  const breadcrumbItems = [
    { label: "Beranda", href: "/" },
    { label: "Profil", href: "/profile" },
    { label: "Riwayat Pengajuan", href: "/profile/riwayat" },
    { label: "Detail Pengajuan" }
  ];

  if (isNaN(id)) {
    return (
      <div className="text-center p-10 text-red-500">
        ID pengajuan tidak valid
      </div>
    );
  }

  if (isLoading) return <div className="text-center p-10">Memuat...</div>;

  if (submissionError || !submission) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500 mb-2">Gagal memuat data pengajuan</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  const stepsData = [
    {
      title: "Pengajuan KPR",
      date: new Date(submission.submission.created_at).toLocaleDateString(
        "id-ID"
      ),
    },
    {
      title: "Verifikasi Pengajuan",
      date: submission.submission.verified_at
        ? new Date(submission.submission.verified_at).toLocaleDateString(
            "id-ID"
          )
        : "",
    },
    {
      title: "Hasil Pengajuan",
      date: submission.submission.verified_at
        ? new Date(submission.submission.verified_at).toLocaleDateString(
            "id-ID"
          )
        : "",
    },
  ];

  return (
    <div className="bg-gradient-to-t from-white to-light-tosca min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <CustomBreadcrumb items={breadcrumbItems} className="mb-6" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">Detail Pengajuan</h1>
                <p className="text-sm text-gray-600">Lacak status pengajuan KPR Anda</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                  status === "selesai"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : status === "ditolak"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    status === "selesai"
                      ? "bg-emerald-500"
                      : status === "ditolak"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}></div>
                  {status === "selesai"
                    ? "Selesai"
                    : status === "ditolak"
                    ? "Ditolak"
                    : "Dalam Proses"}
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <StatusTracker
              steps={stepsData}
              currentProgress={currentProgress}
              viewedStep={viewedStep}
              onStepClickAction={setViewedStep}
              status={status}
            />
          </div>
        </div>

        <main className="mt-8">
          {viewedStep === SUBMISSION_STEPS.PENGAJUAN && (
            <PengajuanKPRView
              submissionData={submission}
              propertyData={property ?? null}
            />
          )}
          {viewedStep === SUBMISSION_STEPS.VERIFIKASI && (
            <VerifikasiView submissionData={submission} />
          )}
          {viewedStep === SUBMISSION_STEPS.HASIL && (
            <div className="space-y-8">
              <HasilPengajuanView
                status={status}
                submissionId={submission.submission?.id || id}
                submittedAt={submission.submission.created_at}
                verificationNotes={submission.submission.verification_notes}
              />
              <PengajuanKPRView
                submissionData={submission}
                propertyData={property ?? null}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CompletedPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <CompletedPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
