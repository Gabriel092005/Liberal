
import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export function TableSkeleton(){
    return Array.from({length:10}).map((_,i)=>{
        return(
            <TableRow key={i}>
                    <TableCell>
                        <Skeleton className="h-100 w-full bg-black"/>
                    </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[173px]"/>
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[110px]"/>
                        </TableCell>
                        <TableCell>
                        <Skeleton className="h-4 w-[110px]"/>
                        </TableCell>
                        <TableCell>
                        <Skeleton className="h-4 w-[105px]"/>
                        </TableCell>
                        <TableCell>
                        <Skeleton className="h-4 w-[110px]"/>
                        </TableCell>
                        <TableCell>
                        <Skeleton className="h-4 w-[200px]"/>
                        </TableCell>
                        <TableCell>
                        <Skeleton className="h-4 w-[110px]"/>
                        </TableCell>    
                        <TableCell>
                        <Skeleton className="h-4 w-[110px]"/>
                        </TableCell>    
                        <TableCell>
                          <Skeleton className="h-4 w-[4px]"/>
                          <Skeleton className="h-4 w-[4px]"/>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-4"/>
                          <Skeleton className="h-4 w-4"/>
                        </TableCell>
            </TableRow>
        )
    })

}