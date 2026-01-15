import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Home as HomeIcon, User, Plus, Briefcase, Heart,Search, ChevronRight, Sparkles } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FastFazerPedido } from "./DialogFastPrestadoresPedido";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { GetCategory } from "@/api/get-categories";
import { useEffect } from "react";
import { getInialts } from "@/lib/utils";
import logo1 from '@/assets/logo-01.png'
import { GetProfissaoByCategory } from "@/api/fetchProfissionByCategory";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BottomNav() {
  const { pathname } = useLocation();
  interface SearchProfissionTypes  {
    categoryId:string
  }
  
     const [searchParams, setSearchParams] = useSearchParams();
     const categoryId = searchParams.get("category")
  

  function handleSearchProfission({categoryId}:SearchProfissionTypes){
  console.log("peguei", categoryId)
     setSearchParams((state) => {
    categoryId ? state.set("category", categoryId) : state.delete("category");
    return state;
  });
 }
  
 const {data:categories,refetch:refetchCategories} = useQuery({
  queryKey:['category',categoryId],
  queryFn:()=>GetCategory({query:''})
 })
  const {data:profByCategoy} =  useQuery({
    queryKey:['byCategory',categoryId],
    queryFn:()=>GetProfissaoByCategory({categoryId:Number(categoryId)})
  })
 useEffect(()=>{
  refetchCategories()
 },[categoryId,refetchCategories])
  const navLinks = [
    { to: "/", label: "Início", icon: HomeIcon },
    { to: "/favoritos", label: "Favoritos", icon: Heart },
    { to: "/pedidos", label: "Pedidos", icon: Briefcase },
    { to: "/me", label: "Eu", icon: User },
  ];

  return (
    <>
      {/* --- DESKTOP: NAVBAR SUPERIOR (Sempre no Topo) --- */}
      <nav className="hidden lg:flex fixed top-0 inset-x-0 z-[100]  items-center justify-center py-4 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl w-full px-8 flex items-center justify-between">
          
          {/* Logo Minimalista */}
          <div className="flex items-center gap-2">
        <img src={logo1} className="h-10" alt="" />
          </div>

          {/* Links de Navegação */}
          <div className="flex items-center gap-1 dark:bg-zinc-900/50 p-1 rounded-2xl  dark:border-zinc-800">
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link key={link.to} to={link.to} className="relative group">
                  <div className={`
                    flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-300
                    ${isActive ? "bg-white dark:bg-zinc-800 text-orange-500 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"}
                  `}>
                    <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
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
              readOnly // Usamos readOnly para o input agir apenas como gatilho do dropdown
              className="w-full h-10 pl-10 pr-4 rounded-full bg-zinc-100/50 dark:bg-zinc-800/50 border border-transparent focus:border-orange-500/50 transition-all text-sm outline-none cursor-pointer"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex h-5 select-none items-center gap-1 rounded border bg-white dark:bg-zinc-900 px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </DropdownMenuTrigger>

        {/* CONTEÚDO DO DROPDOWN (MENU DE BUSCA) */}
        <DropdownMenuContent className="w-[calc(100vw-2rem)] md:w-[450px] mt-2 rounded-2xl p-2 shadow-2xl border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-xl">
       
          <DropdownMenuGroup>
           
       <div className="space-y-6 p-1">
  {/* Header da Seção */}
  <div className="flex items-center justify-between px-1">
    <div className="space-y-1">
      <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Descobrir</p>
      <h3 className="text-xl font-bold tracking-tight">Explorar Categorias</h3>
    </div>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-orange-500/20 to-transparent ml-4" />
  </div>

  {/* IMPLEMENTAÇÃO COM SCROLL-AREA DO SHADCN */}
  <ScrollArea className="h-[550px] w-full rounded-[2.5rem] pr-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8 px-1">
      {categories?.map((c, index) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: index * 0.05 }}
          onClick={() => handleSearchProfission({ categoryId: String(c.id) })}
          className="group relative cursor-pointer p-4 rounded-[2rem] bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 hover:border-orange-500/40 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.1)]"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 shadow-inner border border-black/5">
                {c.image_path ? (
                  <img 
                    src={`${api.defaults.baseURL}/uploads/${c.image_path}`} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-orange-500 text-xl">
                    {getInialts(c.titulo)}
                  </div>
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-4 border-white dark:border-slate-900 scale-0 group-hover:scale-100 transition-transform duration-300 shadow-sm" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-orange-500 transition-colors truncate">
                {c.titulo}
              </h4>
              
              <Dialog>
                <DialogTrigger asChild>
                  <button 
                    onClick={(e) => e.stopPropagation()} 
                    className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-orange-500/80 uppercase tracking-wider transition-all"
                  >
                    Ver Profissões
                    <ChevronRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </DialogTrigger>
                
                <DialogContent className="rounded-[3rem] border-none bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-8 shadow-2xl">
                  <DialogHeader className="items-center pb-6">
                    <div className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center mb-4">
                      <Sparkles className="text-orange-500" size={32} />
                    </div>
                    <DialogTitle className="text-2xl font-black text-center">{c.titulo}</DialogTitle>
                    <p className="text-sm text-muted-foreground text-center">Selecione a especialidade desejada</p>
                  </DialogHeader>

                  {/* ScrollArea também dentro do Dialog para profissões */}
                  <ScrollArea className="h-[40vh] pr-4">
                    <div className="grid gap-3">
                      {profByCategoy?.map(i => (
                        <Dialog key={i.id}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="group/item justify-between h-16 rounded-[1.5rem] bg-slate-100/50 dark:bg-slate-900/50 hover:bg-orange-500 hover:text-white transition-all duration-300 px-6 border border-transparent hover:border-orange-400"
                            >
                              <span className="font-bold text-sm tracking-tight">{i.titulo}</span>
                              <div className="p-10 rounded-full bg-white/20 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <Plus size={16} />
                              </div>
                            </Button>
                          </DialogTrigger>
                            <FastFazerPedido selecionado={i.titulo}/>
                       
                        </Dialog>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
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

          {/* Botão de Ação Direita */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 font-bold gap-2 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                <Plus size={18} strokeWidth={3} />
                <span>Solicitar Serviço</span>
              </Button>
            </DialogTrigger>
           
               <FastFazerPedido />
           
          </Dialog>
        </div>
      </nav>

      {/* --- MOBILE: BARRA INFERIOR (Sempre no Fundo) --- */}
      <div className="lg:hidden">
        <nav className="fixed bottom-6 inset-x-4 z-[999]">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-white/20 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] px-6 h-20 flex justify-between items-center relative"
          >
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

            {/* Botão Central Mobile */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-7"> {/* Ajustei o -top de 10 para 7 para compensar o tamanho menor */}
  <Dialog>
    <DialogTrigger asChild>
      <motion.button
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.9 }}
        className="rounded-[1.6rem] h-14 w-14 flex items-center justify-center 
          bg-gradient-to-tr from-orange-500 via-pink-500 to-rose-500 text-white 
          shadow-[0_10px_25px_rgba(249,115,22,0.3)] border-[5px] border-zinc-50 dark:border-zinc-950"
      >
        <Plus size={24} strokeWidth={3} />
      </motion.button>
    </DialogTrigger>
    <DialogContent className="rounded-[2.5rem]">
       <FastFazerPedido />
    </DialogContent>
  </Dialog>
</div>

            <div className="flex gap-8">
              {navLinks.slice(2, 4).map((link) => {
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
          </motion.div>
        </nav>
      </div>
    </>
  );
}