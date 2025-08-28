import { DocumentSubmission } from "@/types/riwayat";
import { FileText, ExternalLink } from "lucide-react";

interface DocumentsViewProps {
  documents: DocumentSubmission[];
}

const getDocumentLabel = (type: string): string => {
  const labels: Record<string, string> = {
    ktp: "KTP",
    npwp: "NPWP", 
    employment_certificate: "Surat Keterangan Kerja",
    salary_slip: "Slip Gaji",
    family_card: "Kartu Keluarga",
    marriage_certificate: "Buku Nikah",
    bank_statement: "Rekening Koran"
  };
  return labels[type] || type;
};

export const DocumentsView = ({ documents }: DocumentsViewProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <FileText className="w-6 h-6 text-gray-500" />
        <h2 className="text-xl font-bold text-gray-800">Dokumen Terkirim</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{getDocumentLabel(doc.type)}</span>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};