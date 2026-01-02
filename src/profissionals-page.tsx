import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"; // Importe o ScrollArea
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, ChevronLeft, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetProfissaoByCategory } from "./api/fetchProfissionByCategory";
import { Dialog, DialogTrigger } from "./components/ui/dialog"; // Adicionado DialogContent
import { FastFazerPedido } from "./pages/app/dashboard-admin/sidebar/DialogFastPrestadoresPedido";

export function PaginaProfissoes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: profByCategoy, isLoading } = useQuery({
    queryKey: ['byCategory', id],
    queryFn: () => GetProfissaoByCategory({ categoryId: Number(id) }),
    enabled: !!id
  });

  const filteredProfessions = profByCategoy?.filter((p: any) =>
    p.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // h-screen e overflow-hidden no container pai para o ScrollArea funcionar corretamente
    <div className="flex flex-col w-full h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      
      {/* HEADER FIXO */}
      <header className="shrink-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="rounded-full h-10 w-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-500 hover:text-white transition-all"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-black uppercase tracking-tighter leading-none text-zinc-900 dark:text-zinc-100">
              Especialidades
            </h1>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
              Escolha um serviço
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <Input 
            placeholder="Buscar especialidade..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-zinc-100/50 dark:bg-zinc-800/50 border-none rounded-2xl text-sm focus-visible:ring-1 focus-visible:ring-orange-500"
          />
        </div>
      </header>

      {/* ÁREA DE SCROLL */}
      <ScrollArea className="flex-1 w-full">
        <main className="max-w-2xl mx-auto p-4 pb-20"> {/* pb-20 para dar espaço no final do scroll */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Carregando...</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="grid gap-3"
              >
                {filteredProfessions?.map((item: any) => (
                  <Dialog key={item.id}>
                    {/* Use asChild para evitar que o DialogTrigger renderize um botão extra em volta do seu card */}
                    <DialogTrigger asChild>
                      <button className="w-full p-4 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group hover:border-orange-500/40 hover:shadow-md transition-all active:scale-[0.98]">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <Briefcase size={22} />
                          </div>
                          <div className="text-left">
                            <p className="font-black text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">
                              {item.titulo}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-medium">Clique para solicitar</p>
                          </div>
                        </div>
                        
                        <div className="h-8 w-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-orange-500 transition-colors">
                          <ArrowRight size={16} />
                        </div>
                      </button>
                    </DialogTrigger>
                    
                    {/* Certifique-se de que o FastFazerPedido está dentro de um DialogContent se ele não o incluir internamente */}
                       <FastFazerPedido selecionado={item.titulo}/>
                
                  </Dialog>
                ))}

                {filteredProfessions?.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-zinc-400 font-bold uppercase text-xs">Nenhuma profissão encontrada.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </ScrollArea>
    </div>
  );
}