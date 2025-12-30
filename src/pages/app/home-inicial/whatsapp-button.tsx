import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function WhatsAppButton() {
  // Remova espaços e o sinal de + para a URL
  const phoneNumber = "244922624816" 
  const message = encodeURIComponent("Olá! Gostaria de saber mais sobre os planos da Liberal.")
  
  // Link universal que funciona em App e Navegador
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[999] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] group"
    >
      {/* Efeito de Ondas */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      
      {/* Ícone */}
      <MessageCircle size={30} fill="currentColor" />
      
      {/* Tooltip (Adicionei 'group-hover:opacity-100' para funcionar com a classe 'group' no <a>) */}
      <span className="absolute right-full mr-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl border border-zinc-200 dark:border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
        Falar no WhatsApp
      </span>
    </motion.a>
  )
}