/**
 * ProfileSkeleton.tsx
 * Loading skeleton shown while the Mentee Profile page data is fetching.
 */
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-sm">
      <div className="border-b border-[#E5E5E5] px-5 py-6 md:px-8 md:py-7 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
          <Skeleton className="h-20 w-20 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="grid grid-cols-3 gap-4 pt-2">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6 px-5 py-7 md:px-8 lg:px-10">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}
