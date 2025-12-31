import { DeleteVitrine } from "@/api/delete-vitrine";
import { FetchPostsVitrineAll } from "@/api/fetch-all-vitrine-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, LayoutGrid, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function Vitrine() {
  const {
    data: vitrine,
    isLoading: isLoadingVitrine,
    refetch,
  } = useQuery({
    queryKey: ["v"],
    queryFn: FetchPostsVitrineAll,
  });

  const { mutateAsync: EliminateVitrine } = useMutation({
    mutationFn: DeleteVitrine,
    onSuccess: () => {
      refetch();
      toast.success("Item removido da vitrine");
    },
  });

  if (isLoadingVitrine) return <Skeletons />;

  return (
    /* ScrollArea configurado para ocupar a altura total da viewport menos o header se houver */
    <ScrollArea className="h-full w-full bg-background antialiased">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-32">
        
        {/* HEADER MODERNO */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-orange-500 mb-1">
              <LayoutGrid size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Vitrine</h1>
            <p className="text-muted-foreground text-base">
              Curadoria de produtos e serviços em destaque.
            </p>
          </div>
          
          <div className="bg-muted/50 px-4 py-2 rounded-full border border-border flex items-center gap-2 w-fit shadow-sm">
            <Package size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">{vitrine?.length || 0} Itens publicados</span>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="relative">
          {vitrine?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] bg-muted/20"
            >
              <div className="p-6 bg-muted rounded-full mb-4">
                <Package size={48} className="text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground font-medium text-lg">Nenhum item na vitrine no momento.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {vitrine?.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20, 
                      delay: i * 0.05 
                    }}
                    className="group relative flex flex-col bg-card rounded-[2.5rem] border border-border/60 hover:border-orange-500/50 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden h-full"
                  >
                    {/* IMAGEM COM OVERLAY DINÂMICO */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {item.image_path ? (
                        <img
                          src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                          alt={item.titulo}
                          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                        />
                      ) : (
                        <div className="h-full w-full bg-secondary flex items-center justify-center">
                          <Package className="text-muted-foreground/20" size={40} />
                        </div>
                      )}
                      
                      {/* GRADIENTE PARA LEITURA */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* BOTÃO DE DELETAR COM FEEDBACK VISUAL */}
                      <div className="absolute top-4 right-4 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-11 w-11 rounded-2xl shadow-2xl backdrop-blur-md bg-red-500/90 hover:bg-red-600 border border-white/20 active:scale-90"
                          onClick={() => EliminateVitrine({ vitrineId: String(item.id) })}
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                    </div>

                    {/* CORPO DO CARD */}
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="font-black text-xl mb-3 line-clamp-1 group-hover:text-orange-500 transition-colors tracking-tight">
                        {item.titulo}
                      </h2>

                      {item.description && (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="desc" className="border-none">
                            <AccordionTrigger className="py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hover:no-underline">
                              Ver descrição
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-3 border-t border-dashed border-border mt-2">
                              {item.description}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      {/* FOOTER DO CARD */}
                      <div className="mt-auto pt-5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-muted/50 rounded-full text-[10px] font-bold text-muted-foreground">
                          <CalendarDays size={14} className="text-orange-500" />
                          {new Date(item.created_at).toLocaleDateString("pt-PT")}
                        </div>
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500/40" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </ScrollArea>
  );
}

function Skeletons() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24 bg-muted rounded-full" />
        <Skeleton className="h-12 w-64 bg-muted rounded-2xl" />
        <Skeleton className="h-4 w-96 bg-muted rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="aspect-[4/3] w-full rounded-[2.5rem] bg-muted" />
            <Skeleton className="h-6 w-3/4 bg-muted rounded-full" />
            <Skeleton className="h-4 w-1/2 bg-muted rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}