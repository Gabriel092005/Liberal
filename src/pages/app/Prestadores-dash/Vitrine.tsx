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
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, LayoutGrid, Package, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function Vitrine() {
  // 1. Busca de dados centralizada
  const {
    data: vitrine,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["v"],
    queryFn: FetchPostsVitrineAll,
    refetchOnWindowFocus: true,
  });

  // 2. Mutação com Update Otimista e Feedback
  const { mutateAsync: eliminateVitrine, isPending } = useMutation({
    mutationFn: DeleteVitrine,
    onSuccess: (_, vitrineId) => {
      // Atualiza o cache local imediatamente para uma sensação de velocidade
      queryClient.setQueryData(["v"], (old: any) => 
        old?.filter((item: any) => String(item.id) !== String(vitrineId))
      );
      toast.success("Item removido com sucesso!");
      refetch(); // Sincroniza com o servidor
    },
    onError: () => {
      toast.error("Erro ao remover item. Tente novamente.");
    }
  });

  async function handleRemove(id: string) {
    await eliminateVitrine({ vitrineId: id });
  }

  if (isLoading) return <VitrineSkeleton />;

  return (
    <div className="h-full w-full bg-background/50 antialiased">
      <ScrollArea className="h-screen w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 space-y-8">
          
          {/* HEADER RESPONSIVO */}
          <header className="flex flex-col gap-4 md:flex-row md:items-end justify-between border-b border-border pb-8">
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-orange-500">
                <LayoutGrid size={18} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Gestão de Conteúdo</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">Minha Vitrine</h1>
              <p className="text-muted-foreground max-w-md">
                Gerencie seus produtos em destaque com interface otimizada para todos os dispositivos.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 bg-card px-5 py-2.5 rounded-2xl border border-border shadow-sm">
                <Package size={18} className="text-orange-500" />
                <span className="text-sm font-bold">{vitrine?.length || 0} <span className="font-medium text-muted-foreground text-xs uppercase ml-1">Itens</span></span>
              </div>
            </div>
          </header>

          {/* GRID DE CONTEÚDO */}
          <main>
            {!vitrine || vitrine.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 mb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {vitrine.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.03 }}
                      className="group bg-card rounded-[2rem] border border-border/50 overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                    >
                      {/* ÁREA DA IMAGEM */}
                      <div className="relative aspect-video sm:aspect-square overflow-hidden bg-muted">
                        {item.image_path ? (
                          <img
                            src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                            alt={item.titulo}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="text-muted-foreground/20" size={48} />
                          </div>
                        )}
                        
                        {/* BOTÃO DELETE MOBILE/DESKTOP */}
                        <div className="absolute top-3 right-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="destructive"
                            disabled={isPending}
                            className="rounded-xl h-10 w-10 shadow-lg backdrop-blur-md bg-red-500/80 hover:bg-red-600"
                            onClick={() => handleRemove(String(item.id))}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>

                      {/* INFO DO CARD */}
                      <div className="p-5 flex flex-col flex-1 gap-3">
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors">
                            {item.titulo}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase">
                            <CalendarDays size={12} className="text-orange-500" />
                            {new Date(item.created_at).toLocaleDateString("pt-PT")}
                          </div>
                        </div>

                        {item.description && (
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="desc" className="border-none">
                              <AccordionTrigger className="py-1 text-xs font-semibold text-muted-foreground hover:no-underline">
                                Detalhes do item
                              </AccordionTrigger>
                              <AccordionContent className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl mt-2 leading-relaxed">
                                {item.description}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                        
                        {/* Botão de exclusão visível apenas no Mobile (UX Otimizada) */}
                        <Button 
                          variant="outline" 
                          className="md:hidden mt-2 border-red-200 text-red-500 hover:bg-red-50 rounded-xl"
                          onClick={() => handleRemove(String(item.id))}
                        >
                          Remover Item
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </ScrollArea>
    </div>
  );
}

// COMPONENTES AUXILIARES (SKELETON & EMPTY STATE)
function VitrineSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-10">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-12 w-64 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed rounded-[3rem] bg-muted/10"
    >
      <div className="bg-background p-6 rounded-full shadow-xl mb-6">
        <AlertCircle size={40} className="text-muted-foreground/40" />
      </div>
      <h2 className="text-xl font-bold">Nenhum item encontrado</h2>
      <p className="text-muted-foreground max-w-xs mt-2">
        Sua vitrine está vazia. Comece adicionando novos produtos ou serviços.
      </p>
    </motion.div>
  );
}