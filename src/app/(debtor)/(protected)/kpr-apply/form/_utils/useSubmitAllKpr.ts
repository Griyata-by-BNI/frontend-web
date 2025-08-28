// hooks/useSubmitAll.ts
"use client";
import { useAuth } from "@/contexts/authContext";
import { useAddKprDetail, useSubmitKpr } from "@/services/submissionServices";
import { useKprApplyStore } from "@/stores/useKprApplyStore";
import { App } from "antd";
import { useMemo, useState } from "react";
import { buildKprDetailPayload, buildKprSubmissionPayload } from "./kprMappers";
import { useRouter } from "next/navigation";

export function useSubmitAllKpr() {
  const router = useRouter();
  const { message } = App.useApp();
  const { property, reset } = useKprApplyStore();
  const addDetail = useAddKprDetail();
  const submitKpr = useSubmitKpr();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const combinedLoading = useMemo(
    () => loading || addDetail.isPending || submitKpr.isPending,
    [loading, addDetail.isPending, submitKpr.isPending]
  );

  const submitAll = async (formData: any) => {
    const propertyId = Number(property?.id);

    if (!propertyId || !user) {
      message.error("Properti belum dipilih.");
      return;
    }

    setLoading(true);

    try {
      const detailPayload = buildKprDetailPayload(formData, propertyId);
      console.log(detailPayload, "payloadd");
      const res = await addDetail.mutateAsync(detailPayload);

      const submissionPayload = buildKprSubmissionPayload(formData, res.data, {
        propertyId,
        debtorId: Number(user?.userId),
        interestId: formData.interestRate,
      });

      await submitKpr.mutateAsync(submissionPayload);
      reset();
      router.push("/profile/riwayat");

      message.success("Pengajuan KPR berhasil dikirim.");
    } catch (e: any) {
      message.error(e?.message || "Terjadi kesalahan saat submit.");
    } finally {
      setLoading(false);
    }
  };

  return {
    submitAll,
    loading: combinedLoading,
    addDetail, // optional jika perlu akses state/error detail
    submitKpr, // optional jika perlu akses state/error submit
  };
}
