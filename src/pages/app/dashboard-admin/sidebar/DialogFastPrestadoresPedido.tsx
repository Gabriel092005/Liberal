import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  MapPinX,
  ArrowRight,
  ArrowLeft,
  Search,
  Wrench
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserLocation } from "./location-services"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { CreateNewOrder } from "@/api/new-order"
import { profissoesAngola } from "./profissoes"

interface PlaceSuggestion {
  display_name: string
  lat: string
  lon: string
}

interface FastFazerPedidoProps {
  selecionado?: string
}

export function FastFazerPedido({ selecionado }: FastFazerPedidoProps) {
  const { place, coords, loading } = useUserLocation()

  // Estados principais
  const [step, setStep] = useState(1)
  const [categoria, setCategoria] = useState(selecionado || "")
  const [brevidade, setBrevidade] = useState("")
  const [manualLocation, setManualLocation] = useState("")
  const [descricao, setDescricao] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const steps = [
    "Escolher categoria",
    "Selecionar brevidade",
    "Localização",
    "Descrição",
    "Confirmar"
  ]

  // 🔁 Avançar / voltar
  const handleNext = () => setStep((prev) => Math.min(prev + 1, steps.length))
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1))

  // 📍 Pega coordenadas automáticas
  useEffect(() => {
    if (coords?.latitude && coords?.longitude) {
      setLatitude(coords.latitude)
      setLongitude(coords.longitude)
    }
  }, [coords])

  // 🌍 Busca sugestões do OpenStreetMap
  useEffect(() => {
    if (!manualLocation || manualLocation.length < 3) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            manualLocation
          )}&format=json&addressdetails=1&limit=5`,
          { signal: controller.signal }
        )
        const data = await res.json()
        setSuggestions(data)
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error)
      } finally {
        setLoadingSuggestions(false)
      }
    }

    const delay = setTimeout(fetchSuggestions, 400)
    return () => {
      controller.abort()
      clearTimeout(delay)
    }
  }, [manualLocation])

  const handleSuggestionSelect = (s: PlaceSuggestion) => {
    setManualLocation(s.display_name)
    setLatitude(parseFloat(s.lat))
    setLongitude(parseFloat(s.lon))
    setSuggestions([])
  }

  // 🚀 Envio do pedido
  const { mutateAsync: sendOrder, isPending } = useMutation({
    mutationFn: CreateNewOrder
  })

  const handleSubmit = async () => {
    try {
      const body = {
        title: categoria,
        brevidade,
        content: descricao,
        latitude,
        longitude,
        location: manualLocation || `${place?.city}, ${place?.country}`
      }

      await sendOrder(body)
      toast.success("✅ Pedido enviado com sucesso!")
      console.log("📦 Dados enviados:", body)
    } catch (err) {
      toast.error("Erro ao enviar o pedido")
      console.error(err)
    }
  }

  return (
    <DialogContent className="flex flex-col gap-5 max-w-lg rounded-2xl p-6 bg-white dark:bg-neutral-900 shadow-lg">
      {/* Cabeçalho */}
      <header className="flex flex-col items-center text-center">
        <h1 className="text-xl font-bold text-orange-500">Fazer Pedido</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Etapa {step} de {steps.length}: {steps[step - 1]}
        </p>

        <div className="w-full bg-gray-200 dark:bg-neutral-700 h-2 rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full bg-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / steps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      {/* Conteúdo por etapa */}
      <AnimatePresence mode="wait">
        {/* --- STEP 1: Categoria --- */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-3"
          >
            {selecionado ? (
              <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold">
                <Wrench className="w-5 h-5" />
                <span>{selecionado}</span>
              </div>
            ) : (
            <Select onValueChange={setCategoria}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione uma profissão" />
  </SelectTrigger>
  <SelectContent>
    {profissoesAngola.map((prof) => (
      <SelectItem key={prof.nome} value={prof.nome}>
        {prof.nome}
      </SelectItem>
    ))}
    {/* Opcional: categoria "Outro" */}
    <SelectItem value="Outro">Outro</SelectItem>
  </SelectContent>
</Select>
            )}
            <Button
              // disabled={!categoria}
              onClick={handleNext}
              className="w-full"
            >
              Próximo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* --- STEP 2: Brevidade --- */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-3"
          >
            <Select onValueChange={setBrevidade}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a brevidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="URGENTE">Urgente</SelectItem>
                <SelectItem value="MEDIO">Média</SelectItem>
                <SelectItem value="BAIXO">Pouca</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrev}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button disabled={!brevidade} onClick={handleNext}>
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* --- STEP 3: Localização --- */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-3 relative"
          >
            <div className="flex items-center gap-2">
              {loading ? (
                <Skeleton className="w-32 h-4" />
              ) : place?.city ? (
                <>
                  <MapPin className="text-green-500" />
                  <span>{place.city},{place.country}</span>
                </>
              ) : (
                <>
                  <MapPinX className="text-red-400" />
                  <span>Localização automática não disponível</span>
                </>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center border rounded-md px-2 dark:bg-gray-950">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  placeholder="Pesquisar localização..."
                  className="flex-1 p-2 outline-none bg-transparent"
                />
              </div>

              {loadingSuggestions && (
                <div className="absolute bg-white dark:bg-gray-900 shadow-md w-full rounded-md mt-1 p-2 text-sm text-gray-500">
                  Buscando...
                </div>
              )}

              {!loadingSuggestions && suggestions.length > 0 && (
                <ul className="absolute bg-white dark:bg-gray-900 shadow-md w-full rounded-md mt-1 z-10 max-h-48 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => handleSuggestionSelect(s)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer text-sm"
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-between mt-3">
              <Button variant="outline" onClick={handlePrev}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                disabled={!latitude || !longitude}
                onClick={handleNext}
              >
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* --- STEP 4: Descrição --- */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-3"
          >
            <textarea
              placeholder="Descreva o serviço que pretende"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="dark:bg-gray-950 p-3 rounded-md h-28"
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrev}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button disabled={!descricao} onClick={handleNext}>
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* --- STEP 5: Confirmar --- */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-4"
          >
            <div className="p-3 rounded-md border dark:border-neutral-700 text-sm">
              <p><strong>Categoria:</strong> {categoria}</p>
              <p><strong>Brevidade:</strong> {brevidade}</p>
              <p><strong>Localização:</strong> {manualLocation||`${place?.city}, ${place?.country}`}</p>
              <p><strong>Latitude:</strong> {latitude}</p>
              <p><strong>Longitude:</strong> {longitude}</p>
            </div>
            <div className="flex justify-between mt-3">
              <Button variant="outline" onClick={handlePrev}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
               
              >
                {isPending ? "Solicitando..." : "Solicitar Prestadores"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContent>
  )
}
