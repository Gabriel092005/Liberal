
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"


export  interface PaginationProps{
    
    pageIndex:number
    totalCount:number
    perPage:number
    onPageChange:(pageIndex:number)=>Promise<void>|void
}


export function Pagination({pageIndex,perPage,totalCount,onPageChange}:PaginationProps){
    if(pageIndex===0){
        pageIndex=0+1
    }
    Number(pageIndex)
    
    const pages = Math.ceil(totalCount/perPage) 
    console.log(pages)

    return(
        <div className="flex items-center   justify-between">
           <span className="text-sm ml-10 text-muted-foreground">
            Total de {totalCount} item(s)
           </span>
           <div className="flex items-center ml-7 text-nowrap gap-6 lg:gap-8">
              <div className="text-sm font-medium">
              <div> Página {pageIndex+0} de { pages+1}</div>
     
              </div>
              <div className="flex items-center gap-2">
                    <Button variant={"outline"} disabled={pageIndex===1} onClick={()=>onPageChange(pageIndex-2   )} className="h-8 w-8 p-0">
                        <ChevronLeft/>
                        <span className="sr-only">Próxima Página</span>
                    </Button>
                    <Button disabled={pages<=pageIndex-1}  variant={"outline"} onClick={()=>onPageChange(pageIndex)}  className="h-8 w-8 p-0">
                        <ChevronRight/>
                        <span className="sr-only">Página Anterior</span>
                    </Button>
                </div>
           </div>
        </div>


    )

}