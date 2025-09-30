import { ModeToggle } from '@/components/theme/theme-toggle'
import { Check, LogIn, Star, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import phones  from '@/assets/phone.png'
import { motion, AnimatePresence } from 'framer-motion'

export function Indentitidade() {
  return ( 
    <div className="h-screen flex flex-col">
      {/* Header fixo */}
      <header className="flex items-center justify-between m-4">
        <ModeToggle />
        <Link to='/sign-in'>
          <Button className="rounded-full" variant="outline">
            <LogIn />
          </Button>
        </Link>
      </header>

      {/* Conteúdo com scroll animado */}
      <AnimatePresence mode="wait">
        <motion.section
          className="flex-1 overflow-y-auto px-6 py-12 lg:px-20 space-y-10 relative right-5"
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -50 }} 
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Cabeçalho */}
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-extrabold text-muted-foreground">
              Planos para{' '}
              <span className="text-orange-500">Prestadores</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Escolha um plano ideal para expandir seus negócios e conquistar mais clientes.
            </p>
          </motion.div>

          {/* Benefício */}
          <motion.div
            className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-xl shadow-sm"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Star className="text-orange-600 w-5 h-5" />
            <span className="text-sm font-medium text-orange-700">
              Os primeiros <strong>6 meses gratuitos</strong> para todos prestadores
            </span>
          </motion.div>

             {/* Imagem animada */}
<motion.div
  className="flex justify-center"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
>
  <motion.img
    src={phones}
    alt="Phones"
    className="max-w-[220px] lg:max-w-[350px] rounded-2xl  shadow-2xl border border-orange-200 dark:border-zinc-700"
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  />
</motion.div>

          {/* Plano Start */}
          <motion.div
            className="w-full max-w-sm mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-xl font-bold text-muted-foreground">Start</h2>
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 bg-clip-text text-transparent text-4xl font-extrabold drop-shadow-lg animate-pulse">
              1000,00 AOA
            </span>
            <p className="flex items-center gap-1 text-muted-foreground">
              <Timer className="text-muted-foreground" size={14} /> 5 Dias
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="text-green-400" size={14} /> Aceitar 1 pedido
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="text-green-400" size={14} /> Suporte básico
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Ideal para quem está começando e deseja atrair os primeiros clientes.
            </p>
          </motion.div>

          {/* Plano Plus */}
          <motion.div
            className="w-full max-w-sm mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-xl font-bold text-muted-foreground">Plus</h2>
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 bg-clip-text text-transparent text-4xl font-extrabold drop-shadow-lg animate-pulse">
              5000,00 AOA
            </span>
            <p className="flex items-center gap-1 text-muted-foreground">
              <Timer className="text-muted-foreground" size={14} /> 15 Dias
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="text-green-400" size={14} /> Aceitar 4 pedidos
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="text-green-400" size={14} /> Suporte premium
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="text-green-400" size={14} /> Badge de verificado
            </p>
          </motion.div>
        </motion.section>
      </AnimatePresence>

      {/* Footer fixo */}
      <motion.footer
        className="bg-orange-100 dark:bg-zinc-900 py-3 text-center text-sm text-muted-foreground shadow-inner"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        © {new Date().getFullYear()} Plataforma Liberal - Todos os direitos reservados
      </motion.footer>
    </div>
  )
}
