import { DeleteVitrine } from "@/api/delete-vitrine";
import { FetchPostsVitrineAll } from "@/api/fetch-all-vitrine-data";
import { Accordion, AccordionContent,  AccordionItem,  AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";


export function VitrineCardContent(){

     const { data: vitrine,refetch } = useQuery({
      queryKey: ["v"],
      queryFn: FetchPostsVitrineAll,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      staleTime: 0,
    });
       const {mutateAsync:EliminateVitrine} = useMutation({
        mutationFn:DeleteVitrine,
        onSuccess: (_data, vitrineId) => {
          refetch()
        queryClient.setQueryData(
          ['v'],
          (oldData: any) => {
            if (!oldData) return oldData;
    
            return {
              ...oldData,
               vitrine: oldData.vitrine.filter((user: any) => user.id !== vitrineId),
            };
          }
        );
    
        toast.success("Usuário removido com sucesso!");
      },
       })
    
       async function handleEliminateVitrie({id}:{id:string}) {
       EliminateVitrine({vitrineId:id})
   }

   if(!vitrine){
    return
  }
    return(
          <CardContent className="p-0 h-full">
      <ScrollArea className="h-full p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {vitrine.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              {item.image_path && (
                <img
                  src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                  alt={item.titulo}
                  className="h-20 w-full object-cover rounded-t-2xl"
                />
              )}
              <div className="p-4 flex flex-col gap-2 dark:bg-zinc-900">
                <h2 className="font-semibold text-base">{item.titulo}</h2>
                {item.description && (
                   <Accordion type="single" collapsible>
  <AccordionItem value="Mais">
    <AccordionTrigger>Ver mais</AccordionTrigger>
    <AccordionContent>{item.description}</AccordionContent>
  </AccordionItem>
</Accordion>

                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(item.created_at).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <Button onClick={()=>handleEliminateVitrie({id:String(item.id)})} variant="destructive" className="mt-2">
                  Eliminar
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
    )
}