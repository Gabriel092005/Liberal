import { motion } from "framer-motion";

export function AppFooter() {
  return (
    /* 1. Adicionei 'h-auto' para garantir que o container cresça conforme o conteúdo.
       2. Usei 'flex-1' se este footer estiver dentro de um layout flexbox.
    */
    <footer className="mt-auto w-full pb-12 px-4 md:px-6">
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-zinc-900 via-zinc-950 to-orange-950 p-8 md:p-12 text-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/5">
        
        {/* Decoração de fundo com animação sutil */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-orange-500/10 blur-[80px]" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-pink-600/10 blur-[80px]" />

        <div className="relative z-10 flex flex-col items-center text-center gap-8">
          
          {/* Texto de Chamada */}
          <div className="space-y-3 max-w-md">
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">
              Leve o talento <br /> 
              <span className="text-orange-500 italic">no seu bolso</span>
            </h3>
            <p className="text-sm md:text-base text-zinc-400 font-medium">
              Baixe o nosso app oficial para encontrar os melhores profissionais de Angola com apenas um toque.
            </p>
          </div>

          {/* Botões de Download - Grid para melhor controle vertical no mobile */}
          <div className="grid grid-cols-1 sm:flex sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
            
            {/* Play Store */}
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="group flex items-center gap-4 bg-white text-black px-7 py-4 rounded-[1.8rem] transition-all duration-300 hover:bg-orange-500 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current transition-transform group-hover:rotate-12" xmlns="http://www.w3.org/2000/svg">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.66,16.19C19.28,16.55 19.28,17.45 18.66,17.81L5.25,25.56L14.75,16.06L16.81,15.12M20.16,10.81C20.73,11.11 21,11.51 21,12C21,12.49 20.73,12.89 20.16,13.19L18.16,14.34L15.81,12L18.16,9.66L20.16,10.81M5.25,1.56L18.66,9.31C19.28,9.67 19.28,10.57 18.66,10.93L16.81,12L14.75,7.94L5.25,1.56Z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black leading-none opacity-60">Disponível no</p>
                <p className="text-xl font-black leading-tight tracking-tighter">Google Play</p>
              </div>
            </motion.a>

            {/* App Store */}
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="group flex items-center gap-4 bg-white text-black px-7 py-4 rounded-[1.8rem] transition-all duration-300 hover:bg-orange-500 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current transition-transform group-hover:rotate-12" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black leading-none opacity-60">Baixar na</p>
                <p className="text-xl font-black leading-tight tracking-tighter">App Store</p>
              </div>
            </motion.a>
          </div>
        </div>
      </div>

      {/* Copyright e Localização Final */}
      <div className="mt-10 flex flex-col items-center gap-2">
        <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600">
         
        </p>
      </div>
    </footer>
  );
}