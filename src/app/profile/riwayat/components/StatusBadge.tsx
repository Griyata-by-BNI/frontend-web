import { Status } from "../types";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status: Status) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-500";
      case "Ditolak":
        return "bg-red-500";
      case "Diproses":
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className={`px-3 py-1.5 rounded-full text-xs font-medium text-white whitespace-nowrap ${getStatusStyles(status)}`}>
      {status}
    </div>
  );
}