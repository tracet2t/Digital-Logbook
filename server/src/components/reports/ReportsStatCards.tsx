import { CheckCircle, Clock, FileText } from "lucide-react";

interface Props {
  totalGenerated: number;
  pendingReports: number;
  completedReports: number;
}

// Three summary stat cards- total, pending, and completed reports
export function ReportsStatCards({
  totalGenerated,
  pendingReports,
  completedReports,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
        <div>
          <p className="text-sm text-[#737373]">Total Generated</p>
          <p className="text-3xl font-bold text-[#0A0A0A]">{totalGenerated}</p>
        </div>
        <FileText className="text-[#737373]" size={28} />
      </div>
      <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
        <div>
          <p className="text-sm text-[#737373]">Pending Reports</p>
          <p className="text-3xl font-bold text-[#0A0A0A]">{pendingReports}</p>
        </div>
        <Clock className="text-yellow-500" size={28} />
      </div>
      <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
        <div>
          <p className="text-sm text-[#737373]">Completed Reports</p>
          <p className="text-3xl font-bold text-[#0A0A0A]">
            {completedReports}
          </p>
        </div>
        <CheckCircle className="text-green-500" size={28} />
      </div>
    </div>
  );
}
