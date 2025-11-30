import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AvaliarPrestadores } from "@/api/avaliar-prestadores";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function StarButton({prestadorId}:{prestadorId:number}) {
  const [stars, setStars] = useState<number[]>([]);
  
    const {mutateAsync:Avaliar} = useMutation({
      mutationFn:AvaliarPrestadores,
      onError(_,){
         toast.error("Oops alguma coisa deu errado , só poder dar estrelas uma vez!")
        
      },
    })
  

  const handleClick = () => {
    // Cria 20 estrelas para animar
    const newStars = Array.from({ length: 20 }, (_, i) => i);
    setStars(newStars);


    // Limpa as estrelas depois de 1.5s
    setTimeout(() => setStars([]), 1500);
    Avaliar({
      prestadorId
    })
  };

  return (
    <div className="relative inline-block">

        <Star       onClick={handleClick}className="w-4 h-4 text-orange-400" />
 

      {/* Container das estrelas animadas */}
      <AnimatePresence>
        {stars.map((s) => (
          <motion.div
            key={s}
            initial={{
              opacity: 1,
              scale: 0.5,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              scale: 1.2,
              x: Math.random() * 200 - 100, // espalha horizontalmente
              y: -(Math.random() * 200 + 50), // sobe para cima
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
            className="absolute top-1/2 left-1/2 text-yellow-400 pointer-events-none"
          >
            <Star className="w-4 h-4" />
            {/* Estrelas */}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
