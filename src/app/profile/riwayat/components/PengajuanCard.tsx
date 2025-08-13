import { Submission } from "../types";
import StatusBadge from "./StatusBadge";

interface PengajuanCardProps extends Submission {}

export default function PengajuanCard({
  imageUrl,
  title,
  group,
  date,
  status,
}: PengajuanCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-28 h-20 rounded-lg object-cover flex-shrink-0" 
      />
      <div className="flex-grow">
        <h3 className="text-base font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{group}</p>
        <p className="text-sm text-gray-700">🗓️ {date}</p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}