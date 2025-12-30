import { DeleteVitrine } from "@/api/delete-vitrine";
import { FetchPostsVitrineAll } from "@/api/fetch-all-vitrine-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Trash2, Package, LayoutGrid } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
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
        
        <div className="bg-muted/50 px-4 py-2 rounded-full border border-border flex items-center gap-2 w-fit">
          <Package size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">{vitrine?.length || 0} Itens publicados</span>
        </div>
      </header>

      {/* GRID RESPONSIVO */}
      <main>
        {vitrine?.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-3xl">
            <Package size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Nenhum item na vitrine no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {vitrine?.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="group relative flex flex-col bg-card rounded-[2rem] border border-border/50 hover:border-orange-500/50 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden"
                >
                  {/* IMAGEM COM GRADIENTE OVERLAY */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {item.image_path ? (
                      <img
                        src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                        alt={item.titulo}
                        className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="h-full w-full bg-secondary flex items-center justify-center">
                        <Package className="text-muted-foreground/20" size={40} />
                      </div>
                    )}
                    
                    {/* BOTÃO DE DELETAR FLUTUANTE */}
                    <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-10 w-10 rounded-2xl shadow-xl backdrop-blur-md bg-red-500/90 hover:bg-red-600"
                        onClick={() => EliminateVitrine({ vitrineId: String(item.id) })}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>

                  {/* CONTEÚDO */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {item.titulo}
                    </h2>

                    {item.description && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="desc" className="border-none">
                          <AccordionTrigger className="py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:no-underline">
                            Detalhes
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2">
                            {item.description}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/70">
                        <CalendarDays size={14} className="text-orange-500/70" />
                        {new Date(item.created_at).toLocaleDateString("pt-PT")}
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

function Skeletons() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-20 bg-muted rounded-3xl w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-80 bg-muted rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}