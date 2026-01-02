import { CreateNewOrder } from "@/api/new-order"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Map as MapIcon,
  MapPin,
  MapPinX,
  Wrench
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useUserLocation } from "./location-services"; // Certifique-se que este hook retorna { place, coords, loading }
import { profissoesAngola } from "./profissoes"

interface FastFazerPedidoProps {
  selecionado?: string
}

export function FastFazerPedido({ selecionado }: FastFazerPedidoProps) {
  const { place, coords, loading } = useUserLocation()
  
  // Estados do Formulário
  const [step, setStep] = useState(1)
  const [categoria, setCategoria] = useState<string|undefined>(selecionado || "")
  const [brevidade, setBrevidade] = useState("")
  const [manualLocation, setManualLocation] = useState("")
  const [descricao, setDescricao] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  
  // Estados de Sugestão de Endereço
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const steps = [
    { id: 1, label: "Serviço", icon: Wrench },
    { id: 2, label: "Urgência", icon: Clock },
    { id: 3, label: "Local", icon: MapPin },
    { id: 4, label: "Detalhes", icon: FileText },
    { id: 5, label: "Revisão", icon: CheckCircle2 },
  ]

  // Sincronizar localização GPS automática
  useEffect(() => {
    if (coords?.latitude && coords?.longitude) {
      setLatitude(coords.latitude)
      setLongitude(coords.longitude)
    }
  }, [coords])

  // Busca de Endereços (OpenStreetMap Nominatim) com Debounce
  useEffect(() => {
    if (!manualLocation || manualLocation.length < 4 || manualLocation === (place?.city || "")) {
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
  }, [manualLocation, place])

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
      toast.success("Pedido enviado com sucesso!")
      setStep(1) // Reset ou fechar modal
    },
    onError: () => toast.error("Falha ao processar pedido")
  })

  return (
    <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-zinc-50 dark:bg-zinc-950 sm:rounded-[2.5rem] shadow-2xl">
      
      {/* 1. PROGRESS BAR SUPERIOR */}
      <div className="flex w-full h-1.5 gap-1 px-8 pt-8">
        {steps.map((s) => (
          <div 
            key={s.id} 
            className={cn(
              "h-full flex-1 rounded-full transition-all duration-500",
              step >= s.id ? "bg-orange-500" : "bg-zinc-200 dark:bg-zinc-800"
            )} 
          />
        ))}
      </div>

      {/* 2. HEADER DINÂMICO */}
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

      {/* 3. CONTEÚDO COM ANIMAÇÃO */}
      <div className="px-8 pb-10 min-h-[360px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* PASSO 1: CATEGORIA */}
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center space-y-4">
                {selecionado ? (
                  <div className="p-8 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 shadow-inner">
                    <Wrench className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                    <h3 className="font-black uppercase text-orange-600 text-lg">{selecionado}</h3>
                    <p className="text-xs text-orange-500/70 font-bold uppercase tracking-widest">Especialidade selecionada</p>
                  </div>
                ) : (
                  <Select onValueChange={setCategoria}>
                    <SelectTrigger className="h-16 rounded-[1.5rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-base font-medium focus:ring-orange-500">
                      <SelectValue placeholder="O que você procura?" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800">
                      {profissoesAngola.map((p) => (
                        <SelectItem key={p.nome} value={p.nome} className="py-3 rounded-lg">{p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button 
                  onClick={handleNext} 
                  disabled={!categoria && !selecionado} 
                  className="w-full h-16 rounded-[1.5rem] bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-tight text-lg shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                >
                  Continuar <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* PASSO 2: URGÊNCIA */}
          {step === 2 && (
            <motion.div 
              key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid gap-3"
            >
              {[
                { id: "URGENTE", label: "Imediato", desc: "Preciso agora (Emergência)", icon: Clock, color: "text-red-500" },
                { id: "MEDIO", label: "Hoje", desc: "Pode ser resolvido hoje", icon: Clock, color: "text-orange-500" },
                { id: "BAIXO", label: "Agendado", desc: "Apenas para orçamento", icon: Clock, color: "text-blue-500" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setBrevidade(opt.id); handleNext(); }}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all text-left group",
                    brevidade === opt.id 
                      ? "border-orange-500 bg-orange-50/50 dark:bg-orange-500/10" 
                      : "border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:scale-110 transition-transform", opt.color)}>
                      <opt.icon size={20} />
                    </div>
                    <div>
                      <p className="font-black uppercase text-xs text-zinc-800 dark:text-zinc-200">{opt.label}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">{opt.desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-zinc-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
              <Button variant="ghost" onClick={handlePrev} className="mt-2 font-bold uppercase text-[10px] tracking-widest text-zinc-400">Voltar</Button>
            </motion.div>
          )}

          {/* PASSO 3: LOCALIZAÇÃO */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              
              {/* Status GPS */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-full", place?.city ? "bg-green-500/10" : "bg-red-500/10")}>
                    {loading ? <Loader2 size={16} className="animate-spin text-zinc-400" /> : place?.city ? <MapPin size={16} className="text-green-500" /> : <MapPinX size={16} className="text-red-500" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase leading-none mb-1">Localização Atual</p>
                    <p className="text-xs font-black truncate max-w-[180px]">
                      {place?.city ? `${place.city}, ${place.country}` : "Não detectada"}
                    </p>
                  </div>
                </div>
                {!place?.city && <span className="text-[9px] font-black bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500 uppercase">GPS Off</span>}
              </div>

              {/* Input de Busca */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors">
                  <MapIcon size={18} />
                </div>
                <input
                  placeholder="Digitar endereço (Bairro, Rua...)"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  className="w-full h-16 pl-12 pr-12 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none focus:border-orange-500 transition-all text-sm font-medium"
                />
                
                {loadingSuggestions && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="animate-spin text-orange-500" size={16} />
                  </div>
                )}

                {/* Lista de Sugestões */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.ul 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-h-56 overflow-y-auto"
                    >
                      {suggestions.map((s, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => handleSuggestionSelect(s)}
                            className="w-full text-left p-4 text-xs hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors border-b border-zinc-50 dark:border-zinc-800 last:border-none flex gap-3"
                          >
                            <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
                            <span className="text-zinc-600 dark:text-zinc-300 leading-tight">{s.display_name}</span>
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={handlePrev} className="flex-1 h-14 rounded-xl font-black uppercase text-[10px] tracking-widest border-zinc-200">Voltar</Button>
                <Button 
                  onClick={handleNext} 
                  disabled={!latitude || !longitude}
                  className="flex-1 h-14 rounded-xl bg-zinc-900 dark:bg-orange-500 font-black uppercase text-[10px] tracking-widest"
                >
                  Avançar
                </Button>
              </div>
            </motion.div>
          )}

          {/* PASSO 4: DESCRIÇÃO */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="relative">
                <textarea
                  placeholder="Descreva o problema ou o que precisa exatamente. Ex: Torneira da cozinha pingando, preciso de troca da vedação."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full h-44 p-6 rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none focus:border-orange-500 transition-all resize-none text-sm leading-relaxed font-medium placeholder:text-zinc-400"
                />
                <div className="absolute bottom-4 right-6 text-[10px] font-bold text-zinc-300 uppercase">
                  {descricao.length} caracteres
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrev} className="flex-1 h-14 rounded-xl font-black uppercase text-[10px] tracking-widest">Voltar</Button>
                <Button onClick={handleNext} disabled={descricao.length < 10} className="flex-1 h-14 rounded-xl bg-orange-500 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-orange-500/20">Revisar</Button>
              </div>
            </motion.div>
          )}

          {/* PASSO 5: REVISÃO E ENVIO */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
              
              <div className="p-6 rounded-[2rem] bg-zinc-100/50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Serviço Solicitado</p>
                    <p className="text-sm font-black uppercase text-zinc-800 dark:text-zinc-100">{categoria || selecionado}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Urgência</p>
                    <span className="px-2 py-0.5 rounded-full bg-orange-500 text-[9px] font-black text-white uppercase tracking-tighter">
                      {brevidade}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Local da Execução</p>
                  <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 leading-tight">
                    {manualLocation || (place?.city ? `${place.city}, ${place.country}` : "Coordenadas GPS")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => sendOrder({ 
                    title: categoria || selecionado , 
                    brevidade, 
                    content: descricao, 
                    latitude, 
                    longitude, 
                    location: manualLocation || `${place?.city}, ${place?.country}` 
                  })} 
                  disabled={isPending}
                  className="w-full h-16 rounded-[1.5rem] bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-tight text-lg shadow-2xl shadow-orange-500/30"
                >
                  {isPending ? <Loader2 className="animate-spin mr-2" /> : "Confirmar Pedido"}
                </Button>
                <button 
                  onClick={handlePrev} 
                  className="text-[10px] font-black uppercase text-zinc-400 hover:text-orange-500 transition-colors tracking-widest"
                >
                  Deseja alterar algo? Clique aqui
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </DialogContent>
  )
}