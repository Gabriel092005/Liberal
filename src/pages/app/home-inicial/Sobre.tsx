import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award, // Para valores
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Coins,
  Eye,
  Handshake,
  Lightbulb,
  MessageCircle,
  ShieldCheck,
  Smartphone, // Para diferenciais
  Star,
  Wrench, // Para a missão
  Zap
} from "lucide-react";
import { useState } from "react";

// Definição dos tópicos com ícones para os valores
const VALUES_DATA = [
  { 
    title: "Transparência", 
    icon: <Handshake size={20} className="text-orange-500" />,
    description: "Promovemos relações claras, honestas e responsáveis entre clientes e prestadores."
  },
  { 
    title: "Liberdade Profissional", 
    icon: <BriefcaseBusiness size={20} className="text-orange-500" />,
    description: "Acreditamos na autonomia dos profissionais para definir preços, condições e formas de trabalho."
  },
  { 
    title: "Confiança e Segurança", 
    icon: <ShieldCheck size={20} className="text-orange-500" />,
    description: "Protegemos dados, respeitamos a privacidade e adotamos boas práticas tecnológicas."
  },
  { 
    title: "Inovação", 
    icon: <Lightbulb size={20} className="text-orange-500" />,
    description: "Evoluímos continuamente para oferecer soluções digitais modernas e eficientes."
  },
  { 
    title: "Inclusão e Oportunidade", 
    icon: <Award size={20} className="text-orange-500" />,
    description: "Criamos um espaço acessível para todos os profissionais que desejam crescer e gerar rendimento."
  },
  { 
    title: "Responsabilidade", 
    icon: <AlertCircle size={20} className="text-orange-500" />, // AlertCircle de Lucide
    description: "Atuamos com respeito à legislação angolana e às boas práticas do mercado digital."
  },
];

// Definição dos tópicos com ícones para os diferenciais
const DIFFERENTIALS_DATA = [
  { 
    title: "100% Digital e Adaptada", 
    icon: <Smartphone size={20} className="text-orange-500" />, // Smartphone de Lucide
    description: "Plataforma 100% digital e adaptada à realidade angolana."
  },
  { 
    title: "Contacto Direto", 
    icon: <MessageCircle size={20} className="text-orange-500" />,
    description: "Contacto direto entre clientes e prestadores."
  },
  { 
    title: "Sistema de Créditos", 
    icon: <Coins size={20} className="text-orange-500" />,
    description: "Sistema interno de créditos (Moedas) para acesso a oportunidades."
  },
  { 
    title: "Ambiente Seguro e Transparente", 
    icon: <Eye size={20} className="text-orange-500" />,
    description: "Ambiente seguro, transparente e sem interferência nas negociações."
  },
  { 
    title: "Apoio Tecnológico", 
    icon: <Wrench size={20} className="text-orange-500" />, // Wrench de Lucide
    description: "Apoio tecnológico com base em segurança da informação."
  },
];

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, icon, isOpen, setIsOpen }) => (
  <motion.div 
    initial={false}
    animate={{ backgroundColor: isOpen ? 'var(--orange-50)' : 'var(--zinc-50)', borderColor: isOpen ? 'var(--orange-200)' : 'var(--zinc-200)' }}
    transition={{ duration: 0.3 }}
    className="rounded-3xl border dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-sm"
  >
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center justify-between w-full p-5 text-left outline-none touch-none select-none"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl transition-colors duration-300 ${isOpen ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-500 dark:bg-orange-900/30'}`}>
          {icon}
        </div>
        <h4 className="text-base font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white">
          {title}
        </h4>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-zinc-500 dark:text-zinc-400"
      >
        <ChevronDown size={20} />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="px-5 pb-5 pt-1 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export function AboutUsPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-orange-50 dark:from-zinc-950 dark:to-orange-950/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        
        {/* Header Principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-tight">
            Sobre <span className="text-orange-500">nós</span>
          </h1>
          <p className="mt-3 text-sm md:text-base font-medium text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
            Descubra a história, missão e valores que impulsionam a LIBERAL a transformar o mercado de serviços em Angola.
          </p>
        </motion.div>

        {/* Quem Somos - Card Principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-zinc-100 dark:border-zinc-800"
        >
          <h2 className="flex items-center gap-3 text-xl font-black italic uppercase tracking-tighter text-orange-500 mb-4">
            <Building2 size={24} /> A LIBERAL
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            A LIBERAL é uma plataforma digital angolana criada para facilitar o encontro entre quem precisa de 
            serviços e quem sabe fazer. Somos um marketplace de serviços profissionais que conecta Clientes e 
            Prestadores de Serviços de forma simples, rápida e segura, através da tecnologia.

            Atuamos como uma plataforma de intermediação tecnológica, oferecendo um ambiente digital onde 
            profissionais podem divulgar os seus serviços, aceder a oportunidades reais de trabalho e negociar 
            diretamente com os seus clientes, com total autonomia e transparência.

            Fundada em Setembro de 2025, a LIBERAL nasce da visão do seu fundador, Nédio Rafael Dias, com o 
            propósito de modernizar o mercado de serviços em Angola, criando um ecossistema digital que gere 
            oportunidades reais de trabalho, promova a autonomia profissional e estimule a economia digital.

            A LIBERAL pertence à LISA HELP SECURITY, LDA., empresa angolana especializada em tecnologia e 
            segurança digital, o que garante à nossa plataforma elevados padrões de fiabilidade, proteção de dados e 
            estabilidade tecnológica.

            Não prestamos diretamente os serviços anunciados. O nosso compromisso é fornecer a infraestrutura, as 
            ferramentas e a visibilidade necessárias para que os negócios aconteçam de forma eficiente e segura, 
            respeitando a liberdade das partes envolvidas.

            Acreditamos que a tecnologia deve servir como um motor de oportunidades, inclusão económica e 
            crescimento profissional. Por isso, a LIBERAL foi pensada à medida da realidade angolana, apoiando desde 
            pequenos prestadores independentes até profissionais e empresas especializadas.
          </p>
        </motion.div>

        {/* Missão e Visão - Accordion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <AccordionItem 
            title="A Nossa Missão"
            icon={<Star size={20} />} // Ícone para Missão
            content="Conectar pessoas a soluções, promovendo oportunidades de trabalho, valorizando competências profissionais e facilitando o acesso a serviços de qualidade por meio de uma plataforma digital simples, segura e acessível."
            isOpen={openSection === 'missao'}
            setIsOpen={() => toggleSection('missao')}
          />
          <AccordionItem 
            title="A Nossa Visão"
            icon={<Zap size={20} />} // Ícone para Visão
            content="Ser a principal plataforma digital de serviços em Angola, reconhecida pela confiança, inovação e impacto positivo na vida dos profissionais e clientes, contribuindo para o desenvolvimento do mercado de serviços e da economia digital no país."
            isOpen={openSection === 'visao'}
            setIsOpen={() => toggleSection('visao')}
          />
        </motion.div>

        {/* Nossos Valores - Seção de Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="flex items-center gap-3 text-xl font-black italic uppercase tracking-tighter text-orange-500 mb-6 px-2 sm:px-0">
            <Award size={24} /> Os Nossos Valores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES_DATA.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-start"
              >
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-3">
                  {value.icon}
                </div>
                <h3 className="text-base font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* O Que Nos Diferencia - Seção de Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="flex items-center gap-3 text-xl font-black italic uppercase tracking-tighter text-orange-500 mb-6 px-2 sm:px-0">
            <BriefcaseBusiness size={24} /> O Que Nos Diferencia
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIFFERENTIALS_DATA.map((diff, index) => (
              <motion.div
                key={diff.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-start"
              >
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-3">
                  {diff.icon}
                </div>
                <h3 className="text-base font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">
                  {diff.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {diff.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

     

      </div>
    </div>
  );
}