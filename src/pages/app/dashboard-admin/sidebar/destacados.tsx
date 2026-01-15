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
  User,
  ShieldCheck
} from "lucide-react";
import { api } from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

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

  const CARD_WIDTH_TOTAL = 344; // Card(320px) + Gap(24px)

  // Lógica de Scroll Automático Suave
  useEffect(() => {
    if (!autoScroll || !usuarios || usuarios.length === 0 || isDragging) return;
    
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    
    const scrollStep = () => {
      if (!container) return;
      scrollRef.current = container.scrollLeft;
      scrollRef.current += 0.6; 
      
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
  }, [usuarios, autoScroll, currentIndex, isDragging]);

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
    <section className="relative w-full overflow-hidden bg-transparent py-16">
      {/* Header Alinhado ao Layout (Max-W-7xl) */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-orange-500/10 w-fit px-4 py-1.5 rounded-full border border-orange-500/20">
            <Sparkles size={14} className="text-orange-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-700">Seleção Premium</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
            Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600">Talents</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-lg text-lg">
            Os profissionais mais requisitados e bem avaliados do mercado nacional.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollToIndex(currentIndex - 1)}
            className="h-16 w-16 rounded-[2rem] border-zinc-200 dark:border-zinc-800 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-500 shadow-xl active:scale-90 bg-white dark:bg-zinc-950"
          >
            <ChevronLeft size={28} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollToIndex(currentIndex + 1)}
            className="h-16 w-16 rounded-[2rem] border-zinc-200 dark:border-zinc-800 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-500 shadow-xl active:scale-90 bg-white dark:bg-zinc-950"
          >
            <ChevronRight size={28} />
          </Button>
        </div>
      </div>

      {/* Container de Carrossel com Efeito "Bleed" (Vaza para as bordas) */}
      <div className="relative w-full">
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto py-10 px-[max(1.5rem,calc((100vw-80rem)/2))] scrollbar-none select-none touch-pan-x cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleDragStart(e.pageX)}
          onMouseMove={(e) => handleDragMove(e.pageX)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={(e) => handleDragStart(e.touches[0].pageX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].pageX)}
          onTouchEnd={() => setIsDragging(false)}
        >
          <AnimatePresence mode="popLayout">
            {usuarios.map((usuario) => (
              <motion.div
                key={usuario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                className="flex-shrink-0"
              >
                <Card className="w-80 h-[460px] rounded-[3.5rem] border-none bg-white dark:bg-zinc-900 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden group/card transition-all duration-500">
                  
                  {/* Gradiente Decorativo de Fundo */}
                  <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent" />
                  
                  <CardContent className="p-8 flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="relative group/avatar">
                        <div className="absolute inset-0 bg-orange-500 rounded-[2.2rem] blur-2xl opacity-0 group-hover/card:opacity-30 transition-opacity" />
                        <Avatar className="h-24 w-24 rounded-[2.2rem] border-[6px] border-white dark:border-zinc-900 shadow-2xl relative transition-transform duration-500 group-hover/card:scale-105">
                          {usuario.image_path ? (
                            <AvatarImage src={`${api.defaults.baseURL}/uploads/${usuario.image_path}`} className="object-cover" />
                          ) : (
                            <AvatarFallback className="bg-zinc-950 text-white text-3xl font-black italic">
                              {usuario.nome?.slice(0, 1)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl flex items-center gap-1.5 shadow-[0_10px_20px_-5px_rgba(249,115,22,0.5)]">
                        <Star size={14} className="fill-current" />
                        <span className="text-xs font-black">4.9</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-tight truncate uppercase tracking-tighter">
                          {usuario.nome}
                        </h3>
                        <ShieldCheck size={20} className="text-blue-500 shrink-0" />
                      </div>
                      <span className="inline-block bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                        {usuario.profissao}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-auto">
                      <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800">
                        <MapPinIcon size={14} className="text-orange-500 mb-1.5" />
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Local</p>
                        <p className="text-[11px] font-black truncate text-zinc-700 dark:text-zinc-300 uppercase">{usuario.municipio}</p>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800">
                        <Building2 size={14} className="text-orange-500 mb-1.5" />
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Perfil</p>
                        <p className="text-[11px] font-black truncate text-zinc-700 dark:text-zinc-300 uppercase">
                          {usuario.role === "PRESTADOR_COLECTIVO" ? "Empresa" : "Expert"}
                        </p>
                      </div>
                    </div>

                    {/* Botão de Perfil Refinado */}
                    <Link to={`/users/${usuario.id}/profile`} className="mt-6">
                      <Button 
                        className="w-full h-14 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black uppercase tracking-tighter text-[11px] shadow-2xl transition-all duration-300 hover:bg-orange-600 dark:hover:bg-orange-500 hover:text-white group/btn gap-3"
                      >
                        <User size={16} strokeWidth={3} />
                        Visualizar Portfólio
                        <ChevronRight size={16} className="ml-auto opacity-50 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Indicador de Progresso Minimalista */}
      <div className="flex justify-center items-center gap-3 mt-6">
        {usuarios.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`transition-all duration-500 rounded-full h-1.5 ${
              index === currentIndex 
                ? 'w-10 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                : 'w-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-orange-200'
            }`}
          />
        ))}
      </div>
    </section>
  );
}