import { CreateNewOrder } from "@/api/new-order"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Map as MapIcon,
  MapPin,
  MapPinX,
  Wrench
} from "lucide-react"; // Verifique se o nome do pacote está correto ou use lucide-react
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useUserLocation } from "./location-services"
import { profissoesAngola } from "./profissoes"

interface FastFazerPedidoProps {
  selecionado?: string
}

export function FastFazerPedido({ selecionado }: FastFazerPedidoProps) {
  const { place, coords, loading } = useUserLocation()
  
  const [step, setStep] = useState(1)
  const [categoria, setCategoria] = useState<string | undefined>(selecionado || "")
  const [brevidade, setBrevidade] = useState("")
  const [manualLocation, setManualLocation] = useState("")
  const [descricao, setDescricao] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [_, setLoadingSuggestions] = useState(false)

  const steps = [
    { id: 1, label: "Serviço", icon: Wrench },
    { id: 2, label: "Urgência", icon: Clock },
    { id: 3, label: "Local", icon: MapPin },
    { id: 4, label: "Detalhes", icon: FileText },
    { id: 5, label: "Revisão", icon: CheckCircle2 },
  ]

  useEffect(() => {
    if (coords?.latitude && coords?.longitude) {
      setLatitude(coords.latitude)
      setLongitude(coords.longitude)
    }
  }, [coords])

  useEffect(() => {
    if (!manualLocation || manualLocation.length < 4) {
      setSuggestions([])
      return
    }
    const timer = setTimeout(async () => {
      setLoadingSuggestions(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualLocation)}&format=json&addressdetails=1&limit=5`
        )
        const data = await res.json()
        setSuggestions(data)
      } catch (error) {
        console.error("Erro ao buscar endereços", error)
      } finally {
        setLoadingSuggestions(false)
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [manualLocation])

  const handleNext = () => setStep((p) => Math.min(p + 1, steps.length))
  const handlePrev = () => setStep((p) => Math.max(p - 1, 1))

  const handleSuggestionSelect = (s: any) => {
    setManualLocation(s.display_name)
    setLatitude(parseFloat(s.lat))
    setLongitude(parseFloat(s.lon))
    setSuggestions([])
  }

  const { mutateAsync: sendOrder, isPending } = useMutation({
    mutationFn: CreateNewOrder,
    onSuccess: () => {
      toast.success("🔎 Estamos a procurar profissionais perto de si.")
      setStep(1)
    },
    onError: () => toast.error("Falha ao processar pedido")
  })

  return (
    <DialogPortal>
      {/* 1. OVERLAY COM Z-INDEX MÁXIMO E BLUR PESADO */}
      <DialogOverlay className="z-[999] bg-black/80 backdrop-blur-md" />
      
      {/* 2. CONTENT COM FOCO CORRIGIDO E SHADOW PROFUNDO */}
      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()} // Evita que o foco automático congele o Select
        className="z-[1000] max-w-md p-0 overflow-hidden border-none bg-zinc-50 dark:bg-zinc-950 sm:rounded-[2.5rem] shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] outline-none"
      >
        
        {/* PROGRESS BAR */}
        <div className="flex w-full h-1.5 gap-1.5 px-8 pt-8">
          {steps.map((s) => (
            <div 
              key={s.id} 
              className={cn(
                "h-full flex-1 rounded-full transition-all duration-700",
                step >= s.id ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]" : "bg-zinc-200 dark:bg-zinc-800"
              )} 
            />
          ))}
        </div>

        {/* HEADER */}
        <DialogHeader className="px-8 pt-6 pb-2 text-left">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            {(() => {
              const Icon = steps[step - 1].icon
              return <Icon className="w-6 h-6 text-orange-500" />
            })()}
            {steps[step - 1].label}
          </DialogTitle>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            Etapa {step} de 5
          </p>
        </DialogHeader>

        {/* CONTENT AREA */}
        <div className="px-8 pb-10 min-h-[420px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SERVIÇO (CORREÇÃO DO SELECT QUE NÃO ABRE) */}
            {step === 1 && (
              <motion.div key="st1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                {selecionado ? (
                  <div className="p-8 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 text-center">
                    <Wrench className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                    <h3 className="font-black uppercase text-orange-600 text-lg">{selecionado}</h3>
                    <p className="text-[10px] text-orange-500/70 font-bold uppercase tracking-[0.2em]">Serviço Pré-definido</p>
                  </div>
                ) : (
                  <Select onValueChange={setCategoria}>
                    <SelectTrigger className="h-16 rounded-[1.5rem] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-base font-bold shadow-sm focus:ring-2 focus:ring-orange-500">
                      <SelectValue placeholder="O que você precisa?" />
                    </SelectTrigger>
                    {/* Z-INDEX 1100 PARA FICAR ACIMA DO DIALOG CONTENT */}
                    <SelectContent position="popper" className="z-[1100] rounded-2xl max-h-[300px]">
                      {profissoesAngola.map((p) => (
                        <SelectItem key={p.nome} value={p.nome} className="py-3 font-bold uppercase text-[10px] tracking-wider">
                          {p.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button onClick={handleNext} disabled={!categoria && !selecionado} className="w-full h-16 rounded-[1.5rem] bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-lg shadow-xl shadow-orange-500/30 transition-all active:scale-95">
                  Continuar <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {/* STEP 2: URGÊNCIA */}
            {step === 2 && (
              <motion.div key="st2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid gap-3">
                {[
                  { id: "URGENTE", label: "Imediato", desc: "Emergência / Agora", color: "text-red-500", bg: "bg-red-500/10" },
                  { id: "MEDIO", label: "Hoje", desc: "Resolver ainda hoje", color: "text-orange-500", bg: "bg-orange-500/10" },
                  { id: "BAIXO", label: "Agendado", desc: "Apenas orçamentos", color: "text-blue-500", bg: "bg-blue-500/10" }
                ].map((opt) => (
                  <button key={opt.id} onClick={() => { setBrevidade(opt.id); handleNext(); }} className="flex items-center justify-between p-5 rounded-[1.8rem] border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-900 hover:border-orange-500 transition-all text-left active:scale-[0.98] group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-2xl transition-transform group-hover:rotate-12", opt.bg, opt.color)}>
                        <Clock size={22} />
                      </div>
                      <div>
                        <p className="font-black uppercase text-xs text-zinc-800 dark:text-zinc-100">{opt.label}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase">{opt.desc}</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-zinc-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
                <button onClick={handlePrev} className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-zinc-400 hover:text-orange-500 transition-colors">
                  <ArrowLeft size={14}/> Voltar para o anterior
                </button>
              </motion.div>
            )}

            {/* STEP 3: LOCALIZAÇÃO (BANDEIRA INTEGRADA) */}
            {step === 3 && (
              <motion.div key="st3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="p-5 rounded-[1.8rem] bg-zinc-100/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-full shadow-sm", place?.city ? "bg-green-500 text-white" : "bg-zinc-200 text-zinc-400")}>
                      {loading ? <Loader2 size={16} className="animate-spin" /> : place?.city ? <MapPin size={16} /> : <MapPinX size={16} />}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Localização Detectada</p>
                      <p className="text-xs font-black truncate max-w-[140px] text-zinc-800 dark:text-zinc-200">
                        {place?.city ? `${place.city}, Angola` : "Procurando sinal..."}
                      </p>
                    </div>
                  </div>
                  {/* Badge da Bandeira de Angola */}
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                    <span className="text-base leading-none">🇦🇴</span>
                    <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-400">+244</span>
                  </div>
                </div>

                <div className="relative group">
                  <MapIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                  <input
                    placeholder="Bairro, Rua ou Referência"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    className="w-full h-16 pl-14 pr-12 rounded-[1.5rem] border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none focus:border-orange-500 text-sm font-bold uppercase transition-all shadow-sm"
                  />
                  
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.ul 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-[1001] w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] shadow-2xl max-h-52 overflow-y-auto"
                      >
                        {suggestions.map((s, i) => (
                          <button key={i} onClick={() => handleSuggestionSelect(s)} className="w-full text-left p-4 text-[10px] font-bold uppercase hover:bg-orange-50 dark:hover:bg-orange-500/10 border-b border-zinc-50 dark:border-zinc-800 flex gap-3 items-center transition-colors">
                            <MapPin size={14} className="text-orange-500 shrink-0" />
                            <span className="truncate leading-tight">{s.display_name}</span>
                          </button>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={handlePrev} className="flex-1 h-14 rounded-xl font-black uppercase text-[10px] tracking-widest border-zinc-200">Voltar</Button>
                  <Button onClick={handleNext} disabled={!latitude || !longitude} className="flex-1 h-14 rounded-xl bg-zinc-900 dark:bg-orange-500 text-white font-black uppercase text-[10px] tracking-widest shadow-lg">Avançar</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: DESCRIÇÃO */}
            {step === 4 && (
              <motion.div key="st4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="relative">
                  <textarea
                    placeholder="Detalhe o seu problema aqui..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full h-48 p-7 rounded-[2.2rem] border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none focus:border-orange-500 transition-all resize-none text-sm font-bold leading-relaxed shadow-inner"
                  />
                  <div className="absolute bottom-5 right-7 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[9px] font-black text-zinc-400 uppercase">
                    {descricao.length} Caracteres
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrev} className="flex-1 h-14 rounded-xl font-black uppercase text-[10px] tracking-widest">Voltar</Button>
                  <Button onClick={handleNext} disabled={descricao.length < 10} className="flex-1 h-14 rounded-xl bg-orange-500 text-white font-black uppercase text-[10px] tracking-widest">Revisar Pedido</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: REVISÃO FINAL */}
            {step === 5 && (
              <motion.div key="st5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-7 rounded-[2.5rem] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Tipo de Serviço</p>
                      <p className="text-sm font-black uppercase text-orange-600">{categoria || selecionado}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Prioridade</p>
                      <span className="text-[9px] font-black bg-orange-500 text-white px-3 py-1 rounded-full uppercase">{brevidade}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
                    <MapPin size={16} className="text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Endereço de Execução</p>
                      <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase leading-tight line-clamp-2">
                        {manualLocation || (place?.city ? `${place.city}, Angola` : "Localização GPS")}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => sendOrder({ 
                      title: categoria || selecionado, 
                      brevidade, 
                      content: descricao, 
                      latitude, 
                      longitude, 
                      location: manualLocation || `${place?.city}` 
                    })} 
                    disabled={isPending}
                    className="w-full h-16 rounded-[1.8rem] bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-lg shadow-2xl shadow-orange-500/40 transition-all active:scale-[0.97]"
                  >
                    {isPending ? <Loader2 className="animate-spin" /> : "Publicar Pedido Agora"}
                  </Button>
                  <p 
                    className="text-center text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] cursor-pointer hover:text-orange-500 transition-colors"
                    onClick={handlePrev}
                  >
                    Clique aqui para editar detalhes
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </DialogContent>
    </DialogPortal>
  )
}