import { ModeToggle } from '@/components/theme/theme-toggle'
import { Check, LogIn, Star, Zap,  MessageCircle, Globe, Award, Handshake, Play, Apple, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import phones from '@/assets/phone.png'
import { motion } from 'framer-motion'
// 1. IMPORTANTE: Importar o ScrollArea do seu diretório de componentes
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Settings, LifeBuoy, History } from 'lucide-react' // Novos ícones
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WhatsAppButton } from './whatsapp-button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
}

export function Indentitidade() {
  return (
    // 2. O container principal agora é fixo para que apenas a ScrollArea deslize
    <div className="fixed inset-0 bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 font-sans overflow-hidden">
      
      {/* HEADER FIXO */}
   

      {/* 3. SCROLL AREA DO SHADCNUI - Ela ocupa todo o espaço abaixo do header */}
      <ScrollArea className="h-full w-full pt-16">
        <main className="min-h-screen">
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="space-y-24 pb-20 pt-10"
          >

            <header className="absolute top-0 z-[100] w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl">
  <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
    
    {/* LOGO */}
    <Link to="/" className="flex items-center gap-2 group shrink-0">
      <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
        <Handshake className="text-white" size={20} fill="currentColor" />
      </div>
      <span className="font-bold text-xl tracking-tight hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
        Liberal
      </span>
    </Link>

    {/* BARRA DE PESQUISA COM DROPDOWN */}
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
          <DropdownMenuLabel className="text-xs text-zinc-500 px-3 py-2">Buscas Recentes</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 py-3">
              <History className="h-4 w-4 text-zinc-400" />
              <span>Eletricista em Luanda</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 py-3">
              <History className="h-4 w-4 text-zinc-400" />
              <span>Limpeza Profissional</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuLabel className="text-xs text-zinc-500 px-3 py-2">Categorias Sugeridas</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 py-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Settings className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Manutenção</span>
                <span className="text-[10px] text-zinc-500">Reparos, Pintura, Obras</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 py-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <LifeBuoy className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Suporte Técnico</span>
                <span className="text-[10px] text-zinc-500">Computadores, TI, Celulares</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* BOTÕES LADO DIREITO */}
    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
      <ModeToggle />
      <Link to='/sign-in'>
        <Button className="rounded-full font-semibold shadow-md hover:shadow-orange-500/10 transition-all" size="sm">
          <LogIn className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Entrar</span>
        </Button>
      </Link>
    </div>
  </div>
</header>
            
            {/* HERO SECTION */}
            <section className="container lg:flex lg:items-center max-w-7xl mx-auto px-4 text-center space-y-8">
              <motion.div variants={itemVariants} className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                  Aumente sua <br />
                  <span className="text-orange-500 italic">Visibilidade.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-zinc-500 dark:text-zinc-400 text-lg md:text-xl">
                  Escolha o plano que melhor se adapta ao seu momento e comece a receber pedidos hoje mesmo em Angola.
                </p>
                <Button>Quero saber mais</Button>
              </motion.div>

              <motion.div variants={itemVariants} className="relative py-10 flex justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-orange-500/20 blur-[100px] rounded-full -z-10" />
                <motion.img
                  src={phones}
                  alt="Liberal App"
                  className="w-full max-w-[280px] md:max-w-[420px] drop-shadow-2xl"
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
              </motion.div>
            </section>

            {/* STATS SECTION */}
            <section className="bg-zinc-50 dark:bg-zinc-900/30 py-16 border-y border-zinc-100 dark:border-zinc-800">
              <div className="container max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { label: 'Prestadores', value: '+2k', icon: Award },
                  { label: 'Cidades', value: '18', icon: Globe },
                  { label: 'Suporte', value: '24/7', icon: MessageCircle },
                  { label: 'Pedidos/mês', value: '+10k', icon: Zap },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <stat.icon className="mx-auto text-orange-500" size={24} />
                    <div className="text-2xl md:text-3xl font-black">{stat.value}</div>
                    <p className="text-zinc-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ / FUNCIONALIDADES SECTION */}
<section className="container max-w-4xl mx-auto px-4 py-20 space-y-12">
  <div className="text-center space-y-3">
    <h2 className="text-3xl md:text-4xl font-bold">Como a Liberal funciona?</h2>
    <p className="text-zinc-500">Tudo o que você precisa para gerenciar seus serviços.</p>
  </div>

  <Accordion type="single" collapsible className="w-full space-y-4">
    <AccordionItem value="item-1" className="border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 bg-white dark:bg-zinc-900/50">
      <AccordionTrigger className="hover:no-underline py-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
            <User size={20} />
          </div>
          <div>
            <span className="font-bold text-lg">Perfil Profissional Verificado</span>
            <p className="text-xs text-zinc-500 font-normal">Sua vitrine para milhares de clientes.</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-zinc-500 pb-6 pt-2 leading-relaxed">
        Crie um perfil completo com suas fotos de trabalhos anteriores, descrição detalhada, localização e especialidades. Todos os profissionais passam por um processo de verificação para garantir a segurança e confiança na plataforma.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="item-2" className="border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 bg-white dark:bg-zinc-900/50">
      <AccordionTrigger className="hover:no-underline py-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <Zap size={20} />
          </div>
          <div>
            <span className="font-bold text-lg">Sistema de Pedidos em Tempo Real</span>
            <p className="text-xs text-zinc-500 font-normal">Receba notificações instantâneas.</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-zinc-500 pb-6 pt-2 leading-relaxed">
        Sempre que um cliente solicitar um serviço na sua categoria e região, você recebe uma notificação instantânea. Você pode visualizar os detalhes do problema e decidir se deseja aceitar o pedido usando seus créditos do plano.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="item-3" className="border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 bg-white dark:bg-zinc-900/50">
      <AccordionTrigger className="hover:no-underline py-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
            <MessageCircle size={20} />
          </div>
          <div>
            <span className="font-bold text-lg">Chat Integrado</span>
            <p className="text-xs text-zinc-500 font-normal">Comunicação direta com o cliente.</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-zinc-500 pb-6 pt-2 leading-relaxed">
        Após aceitar um pedido, um chat privado é aberto entre você e o cliente. Lá vocês podem enviar fotos adicionais, combinar o horário exato da visita e fechar o orçamento final sem intermediários.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="item-4" className="border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 bg-white dark:bg-zinc-900/50">
      <AccordionTrigger className="hover:no-underline py-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
            <Star size={20} />
          </div>
          <div>
            <span className="font-bold text-lg">Avaliações e Ranking</span>
            <p className="text-xs text-zinc-500 font-normal">Construa sua reputação online.</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-zinc-500 pb-6 pt-2 leading-relaxed">
        Ao final de cada serviço, o cliente avalia sua pontualidade, qualidade e preço. Profissionais com melhores avaliações aparecem primeiro nas buscas, aumentando organicamente suas chances de fechar novos negócios.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</section>

            {/* PRICING SECTION */}
            <section className="container max-w-7xl mx-auto px-4 space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold">Planos Transparentes</h2>
                <p className="text-zinc-500 max-w-md mx-auto">Sem taxas ocultas.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
                <PlanCard 
                  title="Start"
                  price="1.000,00"
                  duration="5 Dias"
                  features={["Aceitar 1 pedido", "Perfil verificado", "Suporte WhatsApp"]}
                  description="Perfeito para iniciantes."
                />
                <PlanCard 
                  title="Plus"
                  price="5.000,00"
                  duration="15 Dias"
                  featured
                  features={["Aceitar 4 pedidos", "Destaque nas buscas", "Selo Premium"]}
                  description="A escolha dos profissionais."
                />
              </div>
            </section>
          </motion.div>

          {/* FOOTER - AGORA DENTRO DA SCROLL AREA */}
          <footer className="bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-12">
            <div className="container max-w-7xl mx-auto px-4 text-center">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="flex flex-col items-center gap-3">
                     <Zap className="text-orange-500" />
                     <p className="text-sm text-zinc-500">Liberal Angola</p>
                  </div>
                  <div className="flex flex-col gap-2">
                     <h4 className="font-bold">Baixe agora</h4>
                     <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm">
                          <Play> </Play>
                          PlayStore
                        </Button>
                        <Button variant="outline" size="sm">
                          <Apple></Apple>
                          appStore
                        </Button>
                     </div>
                  </div>
                  <div className="text-sm text-zinc-500">
                     Suporte: +244 9XX XXX XXX
                  </div>
               </div>
               <p className="text-[10px] text-zinc-400">© 2025 Liberal. Todos os direitos reservados.</p>
            </div>
          </footer>
        </main>
      </ScrollArea>
    </div>
  )
}

function PlanCard({ title, price, features,  featured = false }: any) {
  return (
    <div
      className={`relative p-8 rounded-[2rem] border transition-all duration-300 ${
        featured 
        ? 'border-orange-500 bg-white dark:bg-zinc-900 shadow-xl shadow-orange-500/10' 
        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30'
      }`}
    >
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="text-3xl font-black">{price} AOA</div>
        <ul className="text-left space-y-3 py-4 border-y border-zinc-100 dark:border-zinc-800">
          {features.map((f: any, i: number) => (
            <li key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Check size={14} className="text-green-500" strokeWidth={3} /> {f}
            </li>
          ))}
        </ul>
        <Button className={`w-full rounded-xl ${featured ? 'bg-orange-500 hover:bg-orange-600' : ''}`}>
          Assinar
        </Button>
        <WhatsAppButton />
      </div>
    </div>
  )
}