import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeletons() {
  return (
    <div className=" w-96 -ml-20 flex justify-center px-2 sm:px-0">
      {/* 💻 Desktop / Tablet */}
      <div className="hidden sm:block">
        <Table className="w-[95%] wmd:w-[85%] lg:w-[70%] border border-border shadow-sm rounded-xl overflow-hidden mx-auto">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-center">Realizado Há</TableHead>
              <TableHead className="text-center">Categória</TableHead>
              <TableHead className="text-center">Quantia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="hover:bg-muted/20 transition">
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Skeleton className="h-4 w-28 mx-auto" />
                </TableCell>

                <TableCell className="text-center">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 📱 Mobile layout */}
      <div className="flex flex-col gap-4 w-full sm:hidden">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="border border-border shadow-sm rounded-xl p-4 bg-muted/20 flex flex-col gap-3 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
