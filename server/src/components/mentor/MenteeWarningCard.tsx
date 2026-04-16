"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCreateWarning,
  useWarningStatusList,
} from "@/hooks/mentor/mentee/warninStatus";

//StudentId prop
type MenteeWarningCardProps = {
  studentId?: string | null;
};

export function MenteeWarningCard({ studentId }: MenteeWarningCardProps) {
  const [warningComment, setWarningComment] = useState("");
  const [warningType, setWarningType] = useState("Low warning");

  useWarningStatusList(studentId);

  const createWarningMutation = useCreateWarning();

  const handleCreateWarning = async () => {
    if (!studentId) {
      return;
    }

    const trimmedComment = warningComment.trim();
    if (!trimmedComment) {
      return;
    }

    createWarningMutation.mutate(
      {
        studentId,
        comment: trimmedComment,
        warningType,
      },
      {
        onSuccess: () => {
          setWarningComment("");
          setWarningType("Low warning");
        },
      },
    );
  };

  const getWarningColor = (warningType: string | null) => {
    switch (warningType) {
      case "High warning":
        return "bg-red-100 text-red-700 border-red-300";
      case "Medium warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Low warning":
      default:
        return "bg-orange-100 text-orange-700 border-orange-300";
    }
  };

  return (
    <Card className="rounded-xl border-[#e6ecf8] bg-white shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-[#ff6b6b]" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d8ea8]">
            Warnings
          </p>
        </div>

       

        {/* Create Warning Form */}
        <div className="border-t border-[#e3ebf8] pt-4 space-y-3">
          <p className="text-xs font-medium text-[#4a5f82]">Add New Warning</p>

          {/* Warning Type Selection */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setWarningType("Low warning")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                warningType === "Low warning"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                  : "bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50"
              }`}
            >
              Low warning
            </button>
            <button
              onClick={() => setWarningType("Medium warning")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                warningType === "Medium warning"
                  ? "bg-orange-100 text-orange-800 border-orange-400"
                  : "bg-white text-orange-700 border-orange-300 hover:bg-orange-50"
              }`}
            >
              Medium warning
            </button>
            <button
              onClick={() => setWarningType("High warning")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                warningType === "High warning"
                  ? "bg-red-100 text-red-800 border-red-400"
                  : "bg-white text-red-700 border-red-300 hover:bg-red-50"
              }`}
            >
              High warning
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={warningComment}
              onChange={(event) => setWarningComment(event.target.value)}
              placeholder="Warning comment..."
              className="flex-1 h-9 rounded-md border border-[#dbe5f4] bg-white px-3 text-xs"
            />

            <Button
              type="button"
              className="h-9 rounded-md bg-[#000053] text-xs text-white hover:bg-[#23236c]"
              onClick={handleCreateWarning}
              disabled={!studentId || createWarningMutation.isPending}
            >
              {createWarningMutation.isPending ? "..." : "Add"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
