import { useEffect, useRef, useState, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPinIcon, 
  Building2, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { PrestadoreProfile } from "./PrestadorProfile";
import { useSearchParams } from "react-router-dom";

interface UsuarioDestaque {
  id: number;
  nome: string;
  estrelas: number | null;
  profissao: string;
  provincia: string;
  role: string;
  image_path?: string | null;
  municipio: string;
  celular: string;
}

interface FetchPrestadoresDestaquesResponse {
  usuarios: UsuarioDestaque[] | undefined
}
export function DestaquesAuto({ usuarios }: FetchPrestadoresDestaquesResponse) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const UserId = searchParams.get("userId");
  const CARD_WIDTH_TOTAL = 344;

  function handleSearchProfile({userId}: {userId: string}){
    setSearchParams((state) => {
      userId ? state.set("userId", userId ) : state.delete("userId");
      return state;
    });
  }

  // Lógica de Scroll Automático REPARADA
  useEffect(() => {
    // Adicionamos isDragging aqui para não brigar com o mouse do usuário
    if (!autoScroll || !usuarios || usuarios.length === 0 || isDragging) return;
    
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    
    const scrollStep = () => {
      if (!container) return;

      // Sincroniza o ref com a posição real caso o usuário tenha mexido
      scrollRef.current = container.scrollLeft;
      
      scrollRef.current += 0.6; // Sua velocidade original
      
      if (scrollRef.current >= container.scrollWidth - container.clientWidth) {
        scrollRef.current = 0;
        container.scrollLeft = 0;
      } else {
        container.scrollLeft = scrollRef.current;
      }

      const newIndex = Math.round(container.scrollLeft / CARD_WIDTH_TOTAL) % usuarios.length;
      if(newIndex !== currentIndex) setCurrentIndex(newIndex);
      
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [usuarios, autoScroll, currentIndex, isDragging]); // isDragging é chave aqui

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const newScrollLeft = index * CARD_WIDTH_TOTAL;
    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    scrollRef.current = newScrollLeft;
    setCurrentIndex(index);
    setAutoScroll(false);
    setTimeout(() => setAutoScroll(true), 8000);
  }, [usuarios]);

  const handleDragStart = (x: number) => {
    setIsDragging(true);
    setStartX(x - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
    setAutoScroll(false);
  };

  const handleDragMove = (x: number) => {
    if (!isDragging || !containerRef.current) return;
    const moveX = x - (containerRef.current.offsetLeft || 0);
    const walk = (moveX - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
    scrollRef.current = containerRef.current.scrollLeft;
  };

  if (!usuarios || usuarios.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden  py-10">
      {/* HEADER EXTREME - (Mantido exatamente igual) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 px-6 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-orange-500/10 w-fit px-3 py-1 rounded-full border border-orange-500/20">
            <Sparkles size={14} className="text-orange-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-700">Premium Choice</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white lg:text-5xl">
            Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600">Talents</span>
          </h2>
          <p className="text-zinc-500 font-medium max-w-md">Descubra os profissionais que estão elevando o nível do mercado angolano com excelência e qualidade.</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollToIndex(currentIndex - 1)}
            className="h-14 w-14 rounded-3xl border-zinc-200 dark:border-zinc-800 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-500 shadow-xl active:scale-90"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollToIndex(currentIndex + 1)}
            className="h-14 w-14 rounded-3xl border-zinc-200 dark:border-zinc-800 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-500 shadow-xl active:scale-90"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
      </div>

      {/* CAROUSEL EXTREME - AJUSTE DE GESTO AQUI */}
      <div className="relative overflow-visible flex-col">
        <div
          ref={containerRef}
          /** * ADICIONADO: touch-pan-x e no-scrollbar 
           * Isso permite que o scroll horizontal funcione livre do ScrollArea pai
           */
          className="flex lg:flex-row gap-6 overflow-x-auto py-8 px-6 scrollbar-none   select-none touch-pan-x"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={(e) => handleDragStart(e.pageX)}
          onMouseMove={(e) => handleDragMove(e.pageX)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={(e) => handleDragStart(e.touches[0].pageX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].pageX)}
          onTouchEnd={() => setIsDragging(false)}
        >
          <AnimatePresence>
            {usuarios.map((usuario) => (
              <motion.div
                key={usuario.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -15 }}
                className="flex-shrink-0"
              >
                {/* O restante do seu Card (CardContent, Avatar, etc) continua IGUAL */}
                <Card className="w-80 h-[420px]  rounded-[3.5rem] border-none bg-white dark:bg-zinc-900 shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group/card transition-all duration-500">
                  <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-orange-500/10 to-transparent opacity-50 group-hover/card:opacity-100 transition-opacity" />
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-[60px]" />
                  <CardContent className="p-8 flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-500 rounded-[2rem] blur-xl opacity-20 group-hover/card:opacity-40 transition-opacity" />
                        <Avatar className="h-24 w-24 rounded-[2rem] border-[6px] border-white dark:border-zinc-900 shadow-2xl relative">
                          {usuario.image_path ? (
                            <AvatarImage src={`${api.defaults.baseURL}/uploads/${usuario.image_path}`} className="object-cover" />
                          ) : (
                            <AvatarFallback className="bg-zinc-950 text-white text-3xl font-black">
                              {usuario.nome?.slice(0, 1)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div className="bg-zinc-950 dark:bg-orange-500 text-white px-4 py-2 rounded-2xl flex items-center gap-1.5 shadow-lg">
                        <Star size={16} className="fill-current" />
                        <span className="text-sm font-black tracking-tighter">{usuario.estrelas || "5.0"}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-none truncate">
                        {usuario.nome}
                      </h3>
                      <p className="inline-block bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                        {usuario.profissao}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <MapPinIcon size={14} className="text-orange-500 mb-1" />
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Local</p>
                        <p className="text-[11px] font-black truncate">{usuario.municipio}</p>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <Building2 size={14} className="text-orange-500 mb-1" />
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Role</p>
                        <p className="text-[11px] font-black truncate">
                           {usuario.role === "PRESTADOR_COLECTIVO" ? "Empresa" : "Expert"}
                        </p>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => handleSearchProfile({ userId: String(usuario.id) })}
                          className="w-full mt-auto bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-[1.5rem] h-14 font-black text-xs tracking-[0.2em] group/btn overflow-hidden relative shadow-2xl active:scale-95 transition-all"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                             EXPLORAR PERFIL <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                          </span>
                          <motion.div className="absolute inset-0 bg-orange-500 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                        </Button>
                      </DialogTrigger>
                      {/* <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none focus-visible:ring-0"> */}
                        <div className="bg-white dark:bg-zinc-950 rounded-[4rem] overflow-hidden p-1">
                           <PrestadoreProfile id={UserId} />
                        </div>
                      {/* </DialogContent> */}
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* PROGRESS BAR EXTREME - (Igual) */}
      <div className="flex justify-center items-center gap-3 mt-10">
        {usuarios.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`transition-all duration-700 rounded-full ${
              index === currentIndex 
                ? 'w-12 h-2.5 bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
                : 'w-2.5 h-2.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-orange-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}