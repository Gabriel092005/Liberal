import { motion } from "framer-motion";


export function FlutuantePoint(){
    return(
                                                                     <div className="relative flex items-center justify-center">
              {/* Onda pulsante */}
              <span className="absolute w-2 h-2 rounded-full bg-orange-400 opacity-50 animate-ping" />
        
              {/* Ponto central com vibração/flutuação */}
              <motion.span
                className="relative w-1 h-1 bg-orange-600 rounded-full shadow-lg"
                animate={{
                  x: [], // vibração
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              />
            </div>
    )
}