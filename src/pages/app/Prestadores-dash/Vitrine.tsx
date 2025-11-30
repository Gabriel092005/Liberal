import { DeleteVitrine } from "@/api/delete-vitrine";
import { FetchPostsVitrineAll } from "@/api/fetch-all-vitrine-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarDays, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function Vitrine() {
  const {
    data: vitrine,
    isLoading: isLoadingVitrine,
    refetch,
  } = useQuery({
    queryKey: ["v"],
    queryFn: FetchPostsVitrineAll,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  const { mutateAsync: EliminateVitrine } = useMutation({
    mutationFn: DeleteVitrine,
    onSuccess: (_data, vitrineId) => {
      refetch();
      queryClient.setQueryData(["v"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          vitrine: oldData.vitrine.filter((user: any) => user.id !== vitrineId),
        };
      });

      toast.success("Item removido com sucesso!");
    },
  });

  async function handleEliminateVitrie({ id }: { id: string }) {
    EliminateVitrine({ vitrineId: id });
  }

  if (!vitrine || isLoadingVitrine) {
    return (
      <CardContent className="p-4">
        <Skeletons />
      </CardContent>
    );
  }

  return (
  <div className="flex flex-col gap-6">
    <header className=" flex right-10 relative flex-col t">
      <h1 className="font-bold tracking-tight text-3xl">Vitrine</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Gerencie todos os itens publicados na vitrine
      </p>
    </header>

    <CardContent className="p-0 w-96 overflow-auto relative right-14">
        <ScrollArea className="h-[600px] px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {vitrine.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="
                group rounded-2xl  border border-border 
                hover:shadow-xl hover:-translate-y-[3px]
                transition-all duration-300 overflow-hidden
                bg-muted
              "
            >
              <div className="relative w-full h-36">
                {item.image_path ? (
                  <img
                    src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                    alt={item.titulo}
                    className="
                      h-full w-full object-cover brightness-95
                      group-hover:brightness-110 transition-all
                    "
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-muted text-muted-foreground">
                    Sem imagem
                  </div>
                )}

                {/* Overlay bonito com botão */}
                <div
                  className="
                    absolute top-2 right-2
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                  "
                >
                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full h-8 w-8 shadow-md"
                    onClick={() => handleEliminateVitrie({ id: String(item.id) })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <h2 className="font-semibold text-lg leading-tight">
                  {item.titulo}
                </h2>

                {item.description && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="desc">
                      <AccordionTrigger className="text-sm">
                        Ver descrição
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(item.created_at).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </div>
);

}

/* ------------------------ Skeleton Loading ------------------------ */

function Skeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border p-4 animate-pulse bg-muted/20"
        >
          <div className="h-28 bg-muted rounded-xl mb-3"></div>
          <div className="h-3 w-3/4 bg-muted rounded mb-2" />
          <div className="h-3 w-1/2 bg-muted rounded mb-4" />
          <div className="h-8 bg-muted rounded-xl" />
        </div>
      ))}
    </div>
  );
}
