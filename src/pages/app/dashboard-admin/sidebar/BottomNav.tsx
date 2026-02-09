import { GetCategory } from "@/api/get-categories";
import logo1 from '@/assets/logo-01.png';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import { getInialts } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Briefcase, Heart, Home as HomeIcon, Plus, Search, User } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { FastFazerPedido } from "./DialogFastPrestadoresPedido";

// Serviço para checar status (usado para o badge)
const PedidoService = {
  getStatus: async () => {
    const response = await api.get("/pedidos/status");
    return response.data;
  }
};

export function BottomNav() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  // Query para verificar se existem pedidos ativos (para o pontinho oscilante)
  const { data: orders } = useQuery({
    queryKey: ["pedidos-status"],
    queryFn: PedidoService.getStatus,
    refetchInterval: 10000,
  });

  const temPedidoAtivo = (orders?.quantidadeTotal ?? 0) > 0;

  interface SearchProfissionTypes {
    categoryId: string;
  }

  function handleSearchProfission({ categoryId }: SearchProfissionTypes) {
    setSearchParams((state) => {
      categoryId ? state.set("category", categoryId) : state.delete("category");
      return state;
    });
  }

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => GetCategory({ query: '' })
  });



  useEffect(() => {
    refetchCategories();
  }, [categoryId, refetchCategories]);

  const navLinks = [
    { to: "/", label: "Início", icon: HomeIcon },
    { to: "/favoritos", label: "Favoritos", icon: Heart },
    { to: "/pedidos", label: "Pedidos", icon: Briefcase, hasStatus: true },
    { to: "/me", label: "Eu", icon: User },
  ];

  return (
    <>
      {/* --- DESKTOP: NAVBAR SUPERIOR --- */}
      <nav className="hidden lg:flex fixed top-0 inset-x-0 z-[100] items-center justify-center py-4 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl w-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo1} className="h-10" alt="Logo" />
          </div>

          <div className="flex items-center gap-1 dark:bg-zinc-900/50 p-1 rounded-2xl dark:border-zinc-800">
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              const showRadar = link.hasStatus && temPedidoAtivo;
              
              return (
                <Link key={link.to} to={link.to} className="relative group">
                  <div  className={`
                    flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-300
                    ${isActive ? "bg-white dark:bg-zinc-800 text-orange-500 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"}
                  `}>
                    <div className="relative">
                      <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      {showRadar && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold tracking-tight">{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex-1 max-w-md mx-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group cursor-pointer">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Pesquisar serviços..."
                    readOnly
                    className="w-full h-10 pl-10 pr-4 rounded-full bg-zinc-100/50 dark:bg-zinc-800/50 border border-transparent focus:border-orange-500/50 transition-all text-sm outline-none cursor-pointer"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(100vw-2rem)] md:w-[450px] mt-2 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                <DropdownMenuGroup>
                  <div className="space-y-6 p-1">
                    <div className="flex items-center justify-between px-1">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Descobrir</p>
                        <h3 className="text-xl font-bold tracking-tight">Explorar Categorias</h3>
                      </div>
                    </div>
                    <ScrollArea className="h-[550px] w-full rounded-[2.5rem] pr-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8 px-1">
                        {categories?.map((c, index) => (
                          <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSearchProfission({ categoryId: String(c.id) })}
                            className="group relative cursor-pointer p-4 rounded-[2rem] bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 hover:border-orange-500/40 transition-all shadow-sm"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                {c.image_path ? (
                                  <img src={`${api.defaults.baseURL}/uploads/${c.image_path}`} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-black text-orange-500">{getInialts(c.titulo)}</div>
                                )}
                              </div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-orange-500 truncate">{c.titulo}</h4>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold gap-2 text-white active:scale-95 transition-all">
                <Plus size={18} strokeWidth={3} />
                <span>Solicitar Serviço</span>
              </Button>
            </DialogTrigger>
            <FastFazerPedido />
          </Dialog>
        </div>
      </nav>

      {/* --- MOBILE: BARRA INFERIOR --- */}
      <div className="lg:hidden">
        <nav className="fixed bottom-6 inset-x-4 z-[999]">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-white/20 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] px-6 h-20 flex justify-between items-center relative"
          >
            {/* Esquerda: Início e Favoritos */}
            <div className="flex gap-8">
              {navLinks.slice(0, 2).map((link) => {
                const isActive = pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} className="flex flex-col items-center gap-1">
                    <link.icon className={`w-6 h-6 transition-transform ${isActive ? "text-orange-500 scale-110" : "text-zinc-400"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? "text-orange-500" : "text-zinc-400"}`}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Botão Central Floating */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-7">
              <Dialog>
                <DialogTrigger asChild>
                  <motion.button
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-[1.6rem] h-14 w-14 flex items-center justify-center bg-gradient-to-tr from-orange-500 via-pink-500 to-rose-500 text-white shadow-lg border-[5px] border-zinc-50 dark:border-zinc-950"
                  >
                    <Plus size={24} strokeWidth={3} />
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem]">
                  <FastFazerPedido />
                </DialogContent>
              </Dialog>
            </div>

            {/* Direita: Pedidos e Eu */}
            <div className="flex gap-8">
              {navLinks.slice(2, 4).map((link) => {
                const isActive = pathname === link.to;
                const showRadar = link.hasStatus && temPedidoAtivo;
                
                return (
                  <Link key={link.to} to={link.to} className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <link.icon className={`w-6 h-6 transition-transform ${isActive ? "text-orange-500 scale-110" : "text-zinc-400"}`} />
                      {showRadar && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 border-2 border-white dark:border-zinc-950"></span>
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? "text-orange-500" : "text-zinc-400"}`}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </nav>
      </div>
    </>
  );
}