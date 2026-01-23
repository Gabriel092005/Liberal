  import logo from '@/assets/liberal.png'
import phones from '@/assets/phone.png'
import { ModeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Apple, Award, Check, Globe, HelpCircle, Info, LogIn, Menu, MessageCircle, MessageSquare, Play, Star, User, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
  // 1. IMPORTANTE: Importar o ScrollArea do seu diretório de componentes
  import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Search } from 'lucide-react'; // Novos ícones
import { AboutUsPage } from './Sobre'
import { HeroSection } from './SpellingEffetc'
import { WhatsAppButton } from './whatsapp-button'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  const menuItems = [
   { name: "Sobre", id: "#sobre", icon: <Info size={18} /> },
    { name: "Como Funciona", id: "#como-funciona", icon: <HelpCircle size={18} /> },
    { name: "Depoimentos", id: "#depoimentos", icon: <MessageSquare size={18} /> },
  ];

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

   <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md -webkit-backdrop-blur-md shadow-sm transform-gpu isolation-auto">
  <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
    
    {/* LADO ESQUERDO */}
    <div className="flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden rounded-xl flex items-center justify-center">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        {/* Adicionado z-index alto específico no SheetContent para iOS */}
        <SheetContent side="left" className="z-[110] w-[300px] rounded-r-[2rem] border-none p-6 bg-white dark:bg-zinc-950">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-left font-black italic uppercase tracking-tighter text-orange-500 text-2xl">
              Liberal
            </SheetTitle>
          </SheetHeader>
          
          {/* Nav Mobile corrigida (estava repetindo a desktop no seu código) */}
          <nav className="flex flex-col gap-4 mt-4">
            {menuItems.map((item) => (
              <a 
                key={item.name} 
                href={item.id} 
                className="text-sm font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300 active:text-orange-500"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <Link to="/" className="flex items-center gap-1 group shrink-0 relative z-10">
        <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
      </Link>
      
      <Separator orientation="vertical" className="h-6 hidden md:block mx-2" />
      
      {/* LINKS DESKTOP */}
      <nav className="hidden md:flex items-center gap-8">
        {menuItems.map((item) => (
          <a 
            key={item.name} 
            href={item.id} 
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-orange-500 transition-colors"
          >
            {item.name}
          </a>
        ))}
      </nav>
    </div>

    {/* PESQUISA */}
    <div className="flex-1 max-w-md hidden sm:block relative z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative group cursor-pointer w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-orange-500" />
            <input
              type="text"
              placeholder="Pesquisar..."
              readOnly
              className="w-full h-10 pl-10 pr-4 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-transparent text-xs outline-none cursor-pointer"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[110] w-[450px] rounded-2xl p-2 shadow-2xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
           {/* Conteúdo do Dropdown */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* BOTÕES DIREITOS */}
    <div className="flex items-center gap-2 shrink-0 relative z-10">
      <div className="hidden xs:block">
        <ModeToggle />
      </div>
      <Link to='/sign-in' className="block">
        <Button 
          className="rounded-full font-black text-[10px] uppercase tracking-widest bg-orange-500 text-white h-10 px-6 active:scale-95 transition-transform" 
          size="sm"
        >
          <LogIn className="h-4 w-4 mr-2 hidden md:block" /> 
          Entrar
        </Button>
      </Link>
    </div>
  </div>
</header>
  {/* CATEGORIAS POPULARES */}

{/* TESTEMUNHO RÁPIDO */}

              
              {/* HERO SECTION */}
              <section id='depoimentos' className="container lg:flex lg:items-center max-w-7xl mx-auto px-4 text-center space-y-8">
             <HeroSection></HeroSection>

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
                <section id="sobre">
              <AboutUsPage></AboutUsPage>
            </section>
              <section className="container max-w-5xl mx-auto px-4 py-12">
  <div className="bg-orange-500 rounded-[3rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
    <div className="absolute top-0 right-0 opacity-10">
       <Star size={200} />
    </div>
    <div className="w-24 h-24 rounded-full bg-orange-300 shrink-0 border-4 border-orange-400 overflow-hidden">
       <img src="https://github.com/shadcn.png" alt="Avatar" />
    </div>
    <div className="space-y-4 relative">
      <div className="flex gap-1 text-orange-200">
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
      </div>
      <p className="text-xl md:text-2xl font-medium leading-tight italic">
        "Consegui meu primeiro contrato grande em Talatona na primeira semana usando o Plano Plus. A Liberal mudou minha forma de trabalhar."
      </p>
      <div>
        <p className="font-bold uppercase tracking-widest">Mateus Manuel</p>
        <p className="text-orange-200 text-xs">Técnico de Frio • Luanda</p>
      </div>
    </div>
  </div>

  
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
  <section id="como-funciona" className="container max-w-4xl mx-auto px-4 py-20 space-y-12">
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
                      <p className="text-sm text-zinc-500">
                        Quem somos; Dicas de segurança; redes sociais;
                        Termos de uso e privacidade.
                      </p>
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
                <p className="text-[10px] text-zinc-400">LIBERAL Conectamos talentos. Criamos oportunidades. Facilitamos negócios.
© 2025 – LIBERAL | LISA HELP SECURITY, LDA, em Luanda, Município do Camama, Bairro Antigos 
Guerrilheiros, Rua e Casa s/n.º, próximo ao Supermercado Deskontão. Contacto: 926 135 066. Todos os 
                </p>

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