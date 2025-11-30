import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  loading: boolean;
  count?: number; // número de skeletons para exibir
}

export function DestaquesSkeleton({ loading, count = 5 }: Props) {
  if (!loading) return null;

  const skeletons = Array.from({ length: count });

  return (
    <div className="flex flex-row gap-4 overflow-x-auto py-4 px-2 scrollbar-none">
      {skeletons.map((_, index) => (
        <Card
          key={index}
          className="flex-shrink-0 w-64 h-44 rounded-2xl shadow-lg border border-orange-100 animate-pulse"
        >
          <CardContent className="p-4 flex flex-col h-full justify-between">
            {/* Cabeçalho do card */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>

            {/* Botão ou ação do card */}
            <div className="mt-4">
              <Skeleton className="h-8 w-full rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
