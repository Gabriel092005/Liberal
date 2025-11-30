import { useEffect, useRef, useState, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Workflow, 
  Star, 
  MapPinIcon, 
  Building2, 
  Phone,
  ChevronLeft,
  ChevronRight,
  Sparkles,

} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

  console.log("usuarios:",usuarios)


  
     const [searchParams, setSearchParams] = useSearchParams();
     const UserId = searchParams.get("userId")

     interface searchUserProfileTypes {
        userId:string
     }

  function handleSearchProfile({userId}:searchUserProfileTypes){
      
     setSearchParams((state) => {
    userId ? state.set("userId", userId ) : state.delete("userId");
    return state;
  });
 }

    if(!usuarios){
      return
  }

  // Configuração do scroll automático
  useEffect(() => {
    if (!autoScroll || usuarios?.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const scrollSpeed = 0.5; // Velocidade mais suave

    

    const scrollStep = () => {
      if (container.scrollWidth <= container.clientWidth) return;

      scrollRef.current += scrollSpeed;
      
      // Scroll infinito suave
      if (scrollRef.current >= container.scrollWidth - container.clientWidth) {
        scrollRef.current = 0;
        container.scrollLeft = 0;
      } else {
        container.scrollLeft = scrollRef.current;
      }

      // Atualiza o índice atual baseado na posição do scroll
      const cardWidth = 272; // 64 * 4 + 16 (w-64 + gap-4)
      const newIndex = Math.floor(scrollRef.current / cardWidth) % usuarios.length;
      setCurrentIndex(newIndex);

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, [usuarios, autoScroll]);

  // Handlers para drag manual
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
    setAutoScroll(false);
  };
  

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Retoma o scroll automático após 5 segundos de inatividade
    setTimeout(() => setAutoScroll(true), 5000);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
      scrollRef.current = containerRef.current.scrollLeft;
    }
  };

  // Handlers para touch devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
    setAutoScroll(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
      scrollRef.current = containerRef.current.scrollLeft;
    }
  };


  // Navegação por botões
  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const cardWidth = 272;
    const newScrollLeft = index * cardWidth;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
    
    scrollRef.current = newScrollLeft;
    setCurrentIndex(index);
    setAutoScroll(false);
    
    // Retoma o scroll automático após 10 segundos
    setTimeout(() => setAutoScroll(true), 10000);
  }, []);


  const nextCard = () => {
    const nextIndex = (currentIndex + 1) % usuarios.length;
    scrollToIndex(nextIndex);
  };

  const prevCard = () => {
    const prevIndex = currentIndex === 0 ? usuarios?.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  // Indicadores de progresso
  const ProgressDots = () => (
    <div className="flex justify-center gap-2 mt-4">
      {usuarios.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollToIndex(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === currentIndex 
              ? 'bg-orange-500 w-6' 
              : 'bg-orange-200 hover:bg-orange-300'
          }`}
        />
      ))}
    </div>
  );

  if (usuarios.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Sparkles className="w-12 h-12 text-orange-200" />
          <p className="text-lg font-semibold">Nenhum profissional em destaque</p>
          <p className="text-sm">Volte em breve para descobrir talentos incríveis!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden px-2 ">
      <div className="flex items-center justify-between  px-2   rounded-sm">
        <div className="flex items-center gap-3 ">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div >
            <h2 className="text-xl lg:text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Profissionais em Destaque
            </h2>
    
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevCard}
            className="h-8 w-8 rounded-full border-orange-200 hover:bg-orange-50"
          >
            <ChevronLeft className="h-4 w-4 text-orange-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextCard}
            className="h-8 w-8 rounded-full border-orange-200 hover:bg-orange-50"
          >
            <ChevronRight className="h-4 w-4 text-orange-500" />
          </Button>
        </div>
      </div>

      {/* Container dos cards com scroll horizontal */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden py-1 px-2 scrollbar-none"
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
        >
          <AnimatePresence mode="wait">
            {usuarios.map((usuario, index) => (
              <motion.div
                key={usuario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <Card className="w-64 h-44 rounded-2xl shadow-lg border bg-muted border-orange-100 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-orange-50 dark:from-zinc-900 dark:black">
                  <CardContent className="p-4 flex flex-col h-full justify-between">
                    {/* Header do card */}
                    <header className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-orange-400 shadow-md">
                            {usuario.image_path ? (
                              <AvatarImage 
                                src={`${api.defaults.baseURL}/uploads/${usuario.image_path}`}
                                className="object-cover"
                              />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-tr from-orange-400 to-pink-500 text-white font-bold">
                                {usuario.nome?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <div className="flex flex-col min-w-0">
                            <p className="font-bold text-sm truncate">{usuario.nome}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Workflow size={12} className="text-orange-500 flex-shrink-0" />
                              <span className="truncate">{usuario.profissao}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={12} 
                                  className={
                                    i < (usuario.estrelas || 0) 
                                      ? "fill-orange-400 text-orange-400" 
                                      : "fill-gray-200 text-gray-200"
                                  } 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
{/* 
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <Linkedin className="w-4 h-4 text-blue-500" />
                        </Button> */}
                      </div>

                      {/* Informações adicionais */}
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPinIcon size={12} className="text-orange-500 flex-shrink-0" />
                          <span className="truncate">
                            {usuario.municipio}, {usuario.provincia}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 size={12} className="text-orange-500 flex-shrink-0" />
                          <span className="truncate">
                            {usuario.role === "PRESTADOR_COLECTIVO" ? "@Empresa" : "@Individual"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={12} className="text-orange-500 flex-shrink-0" />
                          <span className="truncate font-mono">{usuario.celular}</span>
                        </div>
                      </div>
                    </header>

                    {/* Botão de ação */}
                    <div className="flex justify-end mt-3">
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          
                          <Button onClick={()=>handleSearchProfile({userId:String(usuario.id)})} className="flex gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-xs h-8 px-3">
                            <User size={14} />
                            Ver perfil
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                        <PrestadoreProfile id={UserId} ></PrestadoreProfile>
                      </DialogContent>
                      </Dialog> 
                      
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>

      {/* Indicadores de progresso */}
      {usuarios.length > 1 && <ProgressDots />}

      {/* Badge de scroll automático */}
      {/* <div className="flex justify-center mt-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
          <Sparkles size={12} />
          <span>Arraste para ver mais profissionais</span>
        </div>
      </div> */}
    </div>
  );
}