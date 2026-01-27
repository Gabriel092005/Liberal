// import { UpdateOrderLocation } from "@/api/update-order"; // Supondo esta API
import { changeLocation } from "@/api/update-location";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle2,
    Loader2,
    Map as MapIcon,
    MapPin,
    Navigation
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserLocation } from "../dashboard-admin/sidebar/location-services";


interface UpdateLocationProps {
  currentLocationName?: string;
  onSuccess?: () => void;
}

export function UpdateLocationDialog({ currentLocationName}: UpdateLocationProps) {
  const queryClient = useQueryClient();
  const { place, coords, loading: loadingGPS } = useUserLocation();

  const [step, setStep] = useState(1);
  const [manualLocation, setManualLocation] = useState(currentLocationName || "");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Lógica de busca Nominatim (OpenStreetMap)
  useEffect(() => {
    if (!manualLocation || manualLocation.length < 4 || step === 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualLocation)}&format=json&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Erro ao buscar endereços", error);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [manualLocation, step]);

  const handleSuggestionSelect = (s: any) => {
    setManualLocation(s.display_name);
    setLatitude(parseFloat(s.lat));
    setLongitude(parseFloat(s.lon));
    setSuggestions([]);
    setStep(2); // Vai para revisão
  };

  const useGPSLocation = () => {
    if (coords) {
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
      setManualLocation(place?.city ? `${place.city}, Angola` : "Localização via GPS");
      setStep(2);
    } else {
      toast.error("GPS não disponível no momento");
    }
  };

  const { mutateAsync: updateLocation, isPending } = useMutation({
        mutationFn: (data: { latitude: number | null, longitude: number | null, location: string }) => 
          changeLocation({
              latitude: data.latitude,
              longitude: data.longitude,
              description: data.location // Ou o campo que sua API esperar
          }),
        // ... rest of onSuccess/onError
    onSuccess: () => {
      toast.success("Localização do pedido atualizada!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
 
    },
    onError: () => toast.error("Erro ao atualizar localização"),
  });

  return (
  
      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="z-[1000] max-w-md p-0 overflow-hidden border-none bg-zinc-50 dark:bg-zinc-950 sm:rounded-[2.5rem] shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] outline-none"
      >
        {/* PROGRESS BAR */}
        <div className="flex w-full h-1.5 gap-1.5 px-8 pt-8">
          {[1, 2].map((i) => (
            <div 
              key={i} 
              className={cn(
                "h-full flex-1 rounded-full transition-all duration-700",
                step >= i ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" : "bg-zinc-200 dark:bg-zinc-800"
              )} 
            />
          ))}
        </div>

        <DialogHeader className="px-8 pt-6 pb-2 text-left">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            {step === 1 ? <MapPin className="text-blue-500" /> : <CheckCircle2 className="text-green-500" />}
            {step === 1 ? "Novo Local" : "Confirmar"}
          </DialogTitle>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            {step === 1 ? "Defina onde o serviço será feito" : "Verifique os detalhes abaixo"}
          </p>
        </DialogHeader>

        <div className="px-8 pb-10 min-h-[380px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                
                {/* GPS QUICK OPTION */}
                <button 
                  onClick={useGPSLocation}
                  className="w-full p-5 rounded-[1.8rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-between group hover:bg-blue-500/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-full text-white">
                      {loadingGPS ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-blue-600 uppercase">Usar GPS Atual</p>
                      <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{place?.city || "Detectar posição"}</p>
                    </div>
                  </div>
                  <span className="text-xl">🇦🇴</span>
                </button>

                <div className="relative group">
                  <MapIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    placeholder="Bairro ou Rua em Angola..."
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    className="w-full h-16 pl-14 pr-12 rounded-[1.5rem] border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none focus:border-blue-500 text-sm font-bold uppercase transition-all shadow-sm"
                  />
                  
                  {suggestions.length > 0 && (
                    <motion.ul className="absolute z-[1001] w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] shadow-2xl max-h-48 overflow-y-auto">
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSuggestionSelect(s)} className="w-full text-left p-4 text-[10px] font-bold uppercase hover:bg-blue-50 dark:hover:bg-blue-500/10 border-b border-zinc-50 dark:border-zinc-800 flex gap-3 items-center">
                          <MapPin size={14} className="text-blue-500 shrink-0" />
                          <span className="truncate">{s.display_name}</span>
                        </button>
                      ))}
                    </motion.ul>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-7 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Endereço Selecionado</p>
                  <div className="flex gap-3">
                    <MapPin className="text-blue-500 shrink-0" size={20} />
                    <p className="text-xs font-black text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {manualLocation}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                <Button 
  onClick={() => {
    // 1. Dispara o console log com os dados formatados
    console.log("🚀 Enviando atualização de localização:", {
      latitude: latitude,
      longitude: longitude,
      location: manualLocation,
      timestamp: new Date().toISOString()
    });

    // 2. Chama a mutação para atualizar na API
    updateLocation({ 
      latitude, 
      longitude, 
      location: manualLocation 
    });
  }} 
  disabled={isPending}
  className="w-full h-16 rounded-[1.8rem] bg-zinc-900 dark:bg-blue-600 text-white font-black uppercase shadow-xl"
>
  {isPending ? <Loader2 className="animate-spin" /> : "Confirmar Alteração"}
</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
  );
}