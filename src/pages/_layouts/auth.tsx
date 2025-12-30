import { Outlet } from "react-router-dom";
import { Menu } from "../app/dashboard-admin/welcome-page";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, ShieldCheck, Zap } from "lucide-react";

const images = [
  {
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
    title: "Profissionais qualificados",
    desc: "A maior rede de prestadores de Angola na palma da sua mão."
  },
  {
    url: "https://images.unsplash.com/photo-1581578731522-6204780436d0?q=80&w=2070&auto=format&fit=crop",
    title: "Segurança em cada serviço",
    desc: "Verificamos cada perfil para sua total tranquilidade."
  },
  {
    url: "https://images.unsplash.com/photo-1556740734-7f9589455828?q=80&w=2070&auto=format&fit=crop",
    title: "Cresça seu negócio",
    desc: "Milhares de pedidos mensais esperando por você."
  }
];

export function AuthLayout() {
  const [currentImg, setCurrentImg] = useState(0);

  // Troca de imagem a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 antialiased dark:bg-[#09090b] bg-white">
      
      {/* LADO ESQUERDO: CONTEÚDO (Login/SignUp) */}
      <div className="flex flex-col border-r border-zinc-100 dark:border-zinc-800">
        {/* Topo com o Menu */}
        <div className="p-10 text-muted-foreground">
          <Menu />
        </div>

        {/* Centro com o Formulário Dinâmico */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Outlet />
        </div>

        {/* Footer discreto opcional */}
        <div className="p-10 text-xs text-zinc-400 text-center lg:text-left">
          © {new Date().getFullYear()} Liberal Angola • Conectando Talentos
        </div>
      </div>

      {/* LADO DIREITO: CARROSSEL BONITO */}
      <div className="hidden lg:relative lg:flex items-center justify-center overflow-hidden bg-zinc-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImg}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            animate={{ opacity: 0.5, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images[currentImg].url})` }}
          />
        </AnimatePresence>

        {/* Overlay Gradiente (Laranja para combinar com a Liberal) */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 via-zinc-950/40 to-zinc-950/80" />

        {/* Conteúdo do Carrossel */}
        <div className="relative z-10 p-16 text-white max-w-xl">
          <motion.div
            key={`text-${currentImg}`}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-8"
          >
            {/* Indicadores de Slide */}
            <div className="flex gap-2">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentImg === i ? 'w-10 bg-orange-500' : 'w-2 bg-white/20'}`} 
                />
              ))}
            </div>

            <div className="space-y-4">
              <h2 className="text-6xl font-black leading-[1.1] tracking-tighter italic">
                {images[currentImg].title.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-orange-500" : ""}> {word} </span>
                ))}
              </h2>
              <p className="text-xl text-zinc-200/90 leading-relaxed font-medium">
                {images[currentImg].desc}
              </p>
            </div>

            {/* Badges de Confiança */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Badge icon={<ShieldCheck size={18}/>} text="Verificado" />
              <Badge icon={<Star size={18} className="fill-orange-500 text-orange-500" />} text="Top Rated" />
              <Badge icon={<Zap size={18} className="fill-orange-500 text-orange-500" />} text="Rápido" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Sub-componente de Badge para o carrossel
function Badge({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
      <span className="text-orange-500">{icon}</span>
      <span className="text-xs font-black uppercase tracking-widest">{text}</span>
    </div>
  );
}