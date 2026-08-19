import { Skeleton } from "@/components/ui/skeleton";

export function PreviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="flex-1 space-y-3 w-full">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      <Skeleton className="h-[480px] w-full" />
    </div>
  );
}
