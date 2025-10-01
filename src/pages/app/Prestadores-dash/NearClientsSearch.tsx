import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonsDemo() {
  return (
    <div className="flex flex-col space-y-4 relative bottom-4">
      {/* Linha tipo título */}
      <Skeleton className="h-6 w-40 rounded-md" />

      {/* Linha tipo parágrafo */}
      <Skeleton className="h-4 w-60 rounded-md" />
      <Skeleton className="h-4 w-52 rounded-md" />
      <Skeleton className="h-4 w-72 rounded-md" />

      {/* Avatar + texto */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}
