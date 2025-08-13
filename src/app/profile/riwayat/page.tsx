"use client";

import { useState } from "react";
import { inProcessSubmissions, completedSubmissions } from "./constants";
import TabButton from "./components/TabButton";
import SubmissionList from "./components/SubmissionList";

export default function RiwayatPengajuanPage() {
  const [activeTab, setActiveTab] = useState<"dalam-proses" | "selesai">(
    "dalam-proses"
  );

  const submissionsToDisplay =
    activeTab === "dalam-proses" ? inProcessSubmissions : completedSubmissions;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-gray-50 rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Riwayat Pengajuan
      </h2>

      <div className="flex bg-gray-200 rounded-xl p-1 mb-6">
        <TabButton
          isActive={activeTab === "dalam-proses"}
          onClick={() => setActiveTab("dalam-proses")}
        >
          Dalam Proses
        </TabButton>
        <TabButton
          isActive={activeTab === "selesai"}
          onClick={() => setActiveTab("selesai")}
        >
          Selesai
        </TabButton>
      </div>

      <SubmissionList submissions={submissionsToDisplay} />
    </div>
  );
}
