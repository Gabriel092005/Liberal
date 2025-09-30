import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Search, Send, UserRoundPlus } from "lucide-react"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import image_01 from '@/assets/ChatGPT Image 27_09_2025, 20_29_07.png'
import image_02 from '@/assets/Lovepik_com-832324747-Cartoon vector business meeting, commercial elements.png'
import image_04 from '@/assets/IMG-20250930-WA0003.jpg'
import image_05 from '@/assets/IMG-20250930-WA0004.jpg'

export type Slide = {
  id: string
  title: string
  description?: string
  image?: string | React.ReactNode
}

type Props = {
  slides?: Slide[]
  localStorageKey?: string
  onFinish?: () => void
  showSkip?: boolean
}

export function Menu({
  slides = [],
  localStorageKey = "app_onboarding_seen_v1",
  onFinish,
  showSkip = true,
}: Props) {
  const navigate = (function () {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useNavigate()
    } catch {
      return undefined as unknown as ReturnType<typeof useNavigate>
    }
  })()

  const defaultSlides: Slide[] = [
    {
      id: "s1",
      title: "Bem-vindo à nossa plataforma Liberal",
      description: "Nossa plataforma conecta profissionais com clientes que buscam os melhores serviços.",
      image:image_01
    },
    {
      id: "s2",
      title: "Aumente a viabilidade de seu negócio ",
      description: "Conecte-se com oportunidades de trabalho incríveis",
      image:image_02

    },
    {
      id: "4",
      title: "Encontre os Melhores Prestadores de Angola",
      description: "Acesse um pool de profissionais qualificados e experientes.",
      image:image_04
    },
      {
      id: "s4",
      title: "Por que escolher a Liberal ",
      description: "Uma plataforma completa para conectar clientes com prestadores de serviços com segurança e eficiência",
      image:image_05
    },

    {
      id: "s5",
      title: "Como Funciona?",
      description: "Em apenas 4 passos simples conecte-se aos melhores prestadores de serviços de Angola",
      image:''
    },

       {
      id: "s6",
      title: "1.Cadastra-se",
      description: "Crie uma conta gratuita como cliente ou prestador de serviços",
      image:<UserRoundPlus size={50} className="text-orange-500 "></UserRoundPlus>
    },

           {
      id: "s7",
      title: "2.Busque ou Publique",
      description: "Clientes publicam pedidos prestadores oferecem serviços",
      image:<Search size={50} className="text-orange-500 "></Search>
    },

           {
      id: "s8",
      title: "3.Conecte-se",
      description: "Comunique-se diretamente e negocie os melhores termos.",
      image:<Send size={50} className="text-orange-500 "></Send>
    },
           {
      id: "s9",
      title: "4.Finalize",
      description: "Complete o serviço e avalie mutuamente",
      image:<Check size={50} className="text-orange-500 "></Check>
    },
  ]

  const effectiveSlides = slides.length > 0 ? slides : defaultSlides

  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [direction, setDirection] = useState(0) // controla direção da animação

  useEffect(() => {
    try {
      const seen = localStorage.getItem(localStorageKey)
      if (!seen) setIsVisible(true)
    } catch {
      setIsVisible(true)
    }
  }, [localStorageKey])

  if (!isVisible) return null

  function finish() {
    try {
      localStorage.setItem(localStorageKey, new Date().toISOString())
    } catch {
      /* ignore */
    }

    if (onFinish) {
      onFinish()
      setIsVisible(false)
      return
    }

    if (navigate) {
      try {
        navigate("/home")
        setIsVisible(false)
        return
      } catch {
        /* ignore */
      }
    }

    setIsVisible(false)
  }

  function next() {
    if (index + 1 >= effectiveSlides.length) {
      finish()
    } else {
      setDirection(1)
      setIndex((i) => i + 1)
    }
  }

  function prev() {
    if (index > 0) {
      setDirection(-1)
      setIndex((i) => i - 1)
    }
  }

  function skip() {
    finish()
  }

  const slide = effectiveSlides[index]

  // Variants para animar a entrada/saída
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header com ícone voltar + skip */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={prev}
          disabled={index === 0}
          className={`p-2 rounded-full ${
            index === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>

        {showSkip && (
          <button
            onClick={skip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Pular
          </button>
        )}
      </div>

      {/* Conteúdo animado */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-6">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute flex flex-col items-center text-center gap-4 w-full"
          >
            {/* imagem */}
            <div className="h-44 w-full flex items-center justify-center">
              {slide.image ? (
                typeof slide.image === "string" ? (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-52 object-contain"
                  />
                ) : (
                  <div className="h-40 w-full flex items-center justify-center">
                    {slide.image}
                  </div>
                )
              ) : (
                <div className="h-40 w-full flex items-center justify-center">
                  {/* Placeholder */}
                  <svg
                    width="160"
                    height="120"
                    viewBox="0 0 160 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="160" height="120" rx="16" fill="#F3F4F6" />
                    <circle
                      cx="80"
                      cy="45"
                      r="22"
                      fill="#fff"
                      stroke="#E5E7EB"
                    />
                    <rect
                      x="40"
                      y="70"
                      width="80"
                      height="30"
                      rx="8"
                      fill="#fff"
                      stroke="#E5E7EB"
                    />
                  </svg>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-semibold">{slide.title}</h2>
            {slide.description && (
              <p className="text-gray-600">{slide.description}</p>
            )}

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {effectiveSlides.map((s, i) => (
                <div
                  key={s.id}
                  className={`h-2 w-8 rounded-full ${
                    i === index ? "bg-gray-900" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rodapé com botão */}
      <div className="p-4">
        <Button onClick={next} className="w-full py-6 text-lg">
          {index + 1 >= effectiveSlides.length ? "Começar" : "Próximo"}
        </Button>
      </div>
    </div>
  )
}
