import { Skeleton } from "@/components/ui/skeleton"
import { TableCell } from "@/components/ui/table"



export function SkeletonsCard(){
      return(
        <div>
             <div>
                  <TableCell className="text-start relative bottom-10 right-14  ">
                                  <div className="flex items-center justify-center gap-2">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex flex-col gap-1">
                                      <Skeleton className="h-4 w-24" />
                                      <Skeleton className="h-3 w-16" />
                                    </div>
                                  </div>
                                </TableCell>

             </div>
               <div className="flex items-center justify-center">
           <Skeleton className="relative w-80 h-48 right-12   p-6 overflow-hidden"></Skeleton>
       </div>
        </div>
      )
}