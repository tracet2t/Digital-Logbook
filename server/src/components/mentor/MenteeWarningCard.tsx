"use client";

import { useEffect, useRef, useState } from "react";



import { useCreateWarning } from "@/_hooks/mentor/mentee/warninStatus";
import { WarningCategory } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";



import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";





//StudentId prop
type MenteeWarningCardProps = {
  studentId?: string | null;
  showWarningForm: boolean;
  onShowWarningFormChange: (value: boolean) => void;
};

// Maps Prisma enum values to human-readable display labels
const WARNING_LABELS: Record<WarningCategory, string> = {
  low: "Low warning",
  medium: "Medium warning",
  high: "High warning",
};

const WARNING_TYPES: WarningCategory[] = ["low", "medium", "high"];

// Returns button styles based on the selected warning type.
function getWarningTypeButtonClass(
  currentType: WarningCategory,
  selectedType: WarningCategory,
) {
  if (currentType === "low") {
    return selectedType === currentType
      ? "bg-yellow-100 text-yellow-800 border-yellow-400"
      : "bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50";
  }

  if (currentType === "medium") {
    return selectedType === currentType
      ? "bg-orange-100 text-orange-800 border-orange-400"
      : "bg-white text-orange-700 border-orange-300 hover:bg-orange-50";
  }

  return selectedType === currentType
    ? "bg-red-100 text-red-800 border-red-400"
    : "bg-white text-red-700 border-red-300 hover:bg-red-50";
}

// Renders warning checkbox and form, then submits mentor warnings.
export function MenteeWarningCard({
  studentId,
  showWarningForm,
  onShowWarningFormChange,
}: MenteeWarningCardProps) {
  const [warningComment, setWarningComment] = useState("");
  const [warningType, setWarningType] = useState<WarningCategory>("low");
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Scroll the form into view after the expand animation completes (300ms).
  useEffect(() => {
    if (!showWarningForm) return;
    const timer = setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 320);
    return () => clearTimeout(timer);
  }, [showWarningForm]);

  const createWarningMutation = useCreateWarning();

  // Validates input and sends a warning to the selected student.
  const handleCreateWarning = async () => {
    if (!studentId) {
      return;
    }

    const trimmedComment = warningComment.trim();
    if (!trimmedComment) {
      toast.error("Please enter a warning comment before sending.");
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
          setWarningType("low");
        },
      },
    );
  };

  return (
    <Card
      ref={cardRef}
      className="rounded-xl border-[#e6ecf8] bg-white shadow-sm"
    >
      <CardContent className="space-y-0 p-4 sm:p-5">
        {/* Checkbox toggle */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="send-warning"
            checked={showWarningForm}
            onCheckedChange={(checked) =>
              onShowWarningFormChange(checked === true)
            }
          />
          <label htmlFor="send-warning" className="cursor-pointer select-none">
            <p className="text-sm font-semibold text-[#1a1a2e]">
              Send a Warning
            </p>
            <p className="text-xs text-[#7d8ea8]">
              You can issue a formal warning to the student regarding this
              specific activity.
            </p>
          </label>
        </div>

        {/* Warning form — animates open/close */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            showWarningForm
              ? "grid-rows-[1fr] opacity-100 mt-4"
              : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
        >
          <div className="overflow-hidden">
            <div ref={formRef} className="space-y-4">
              <div className="flex items-center gap-2 border-t border-[#e3ebf8] pt-4">
                <AlertCircle className="h-4 w-4 text-[#ff6b6b]" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d8ea8]">
                  Warnings
                </p>
              </div>

              {/* Create Warning Form */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#4a5f82]">
                  Add New Warning
                </p>

                {/* Warning Type Selection — wraps on small screens */}
                <div className="flex flex-wrap gap-2">
                  {WARNING_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setWarningType(type)}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium border-2 transition-all ${getWarningTypeButtonClass(
                        type,
                        warningType,
                      )}`}
                    >
                      {WARNING_LABELS[type]}
                    </button>
                  ))}
                </div>

                {/* Input + button — stacks on mobile, row on sm+ */}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={warningComment}
                    onChange={(event) => setWarningComment(event.target.value)}
                    placeholder="Warning comment..."
                    className="w-full sm:flex-1 h-9 rounded-md border border-[#dbe5f4] bg-white px-3 text-xs"
                  />

                  <Button
                    type="button"
                    className="w-full sm:w-auto h-9 rounded-md bg-[#000053] text-xs text-white hover:bg-[#23236c]"
                    onClick={handleCreateWarning}
                    disabled={!studentId || createWarningMutation.isPending}
                  >
                    {createWarningMutation.isPending ? "..." : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}