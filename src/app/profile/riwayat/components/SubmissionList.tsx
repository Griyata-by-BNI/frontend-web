import { Submission } from "../types";
import PengajuanCard from "./PengajuanCard";

interface SubmissionListProps {
  submissions: Submission[];
}

export default function SubmissionList({ submissions }: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">Tidak ada data untuk ditampilkan.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {submissions.map((submission) => (
        <PengajuanCard key={submission.id} {...submission} />
      ))}
    </div>
  );
}