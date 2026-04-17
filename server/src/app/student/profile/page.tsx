import { Construction, User } from "lucide-react";

import { Card } from "@/components/ui/card";

export default function StudentProfilePage() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <Card className="overflow-hidden border-[#d9dde5] bg-white">
        <div className="space-y-6 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#000053]/10 text-[#000053]">
              <User size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
              <p className="text-sm text-slate-500">
                Student profile tools will appear here.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-20 text-center">
            <Construction size={64} className="mb-4 text-slate-300" />
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              Page Under Construction
            </h2>
            <p className="max-w-md text-slate-500">
              The student profile page is currently under development. Please
              check back soon for this feature.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
