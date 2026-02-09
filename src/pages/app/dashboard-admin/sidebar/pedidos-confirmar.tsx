import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  Clock, 
  MapPinOff, 
  Banknote, 
  Wrench, 
  UserX, 
  MoreHorizontal 
} from "lucide-react";
import { AcceptOrders } from "@/api/AcceptOrders";
import { InterruptOrders } from "@/api/interromper-pedido";
import { useEffect, useRef, useState } from "react";

interface CardProps {
  id: number;
  prestadorId: number;
  status?: "PENDING" | "ACEPTED" | "INTERRUPTED";
  refetch: () => void;
}

const CANCEL_REASONS = [
  { label: "Indisponibilidade de horário", icon: <Clock size={18} /> },
  { label: "Localização muito distante", icon: <MapPinOff size={18} /> },
  { label: "Preço incompatível", icon: <Banknote size={18} /> },
  { label: "Problemas técnicos", icon: <Wrench size={18} /> },
  { label: "Solicitação do cliente", icon: <UserX size={18} /> },
  { label: "Outro motivo", icon: <MoreHorizontal size={18} /> },
];

export function PedidoCard({ id, prestadorId, status = "PENDING", refetch }: CardProps) {
  const [localStatus, setLocalStatus] = useState(status);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio("/digital-beeping-151921.mp3");
    audioRef.current.volume = 0.5;
  }

  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  const { mutateAsync: confirmar } = useMutation({
    mutationFn: AcceptOrders,
    onSuccess: () => {
      setLocalStatus("ACEPTED");
      audioRef.current?.play().catch(() => {});
      refetch();
    },
    onError: () => toast.error("Erro ao confirmar!"),
  });

  const { mutateAsync: interromper } = useMutation({
    mutationFn: (data: { pedidoId: number; prestadorId: number; motivo: string }) => InterruptOrders(data),
    onSuccess: () => {
      setLocalStatus("PENDING");
      setShowCancelDialog(false);
      setSelectedReason("");
      toast.info("Negociação cancelada.");
      refetch();
    },
    onError: () => toast.error("Erro ao cancelar!"),
  });

  async function handleConfirmar() {
    try {
      setLoading(true);
      setShowConfirmDialog(true);
      await confirmar({ pedidoId: id, prestadorId });
      setTimeout(() => setShowConfirmDialog(false), 5000);
    } finally {
      setLoading(false);
    }
  }

  async function handleInterromper() {
    if (!selectedReason) return;
    try {
      setLoading(true);
      await interromper({ pedidoId: id, prestadorId, motivo: selectedReason });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* --- BOTÕES PRINCIPAIS --- */}
      {localStatus === "PENDING" && (
        <Button
          onClick={handleConfirmar}
          size="sm"
          disabled={loading}
          className="h-9 px-5 bg-orange-500 hover:bg-orange-600 text-white font-black text-[11px] uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/20"
        >
          {loading && <Loader2 className="w-3 h-3 animate-spin mr-2" />}
          Confirmar
        </Button>
      )}

      {localStatus === "ACEPTED" && (
        <Button
          onClick={() => setShowCancelDialog(true)}
          variant="outline"
          size="sm"
          className="h-9 px-5 text-[11px] font-black uppercase tracking-wider border-red-200 text-red-500 hover:bg-red-50 rounded-full"
        >
          Cancelar
        </Button>
      )}

      {/* --- DIALOG: SUCESSO NA CONFIRMAÇÃO --- */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-[300px] rounded-[2.5rem] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-none p-8 flex flex-col items-center shadow-2xl">
          <CheckCircle2 size={50} className="text-green-500 mb-4" />
          <h3 className="text-lg font-black italic uppercase tracking-tighter">Confirmado!</h3>
          <p className="text-[11px] text-center font-bold text-zinc-500 mt-2">
            Pedido aceito com sucesso. Aguarde o prestador entrar em contacto ou enviar-lhe uma mensagem
          </p>
        </DialogContent>
      </Dialog>

      {/* --- DIALOG: MOTIVOS DE CANCELAMENTO (SEM OVERLAY) --- */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        {/* Injeção de CSS para remover o overlay escuro apenas deste portal */}
        <style dangerouslySetInnerHTML={{ __html: `
          [data-radix-portal] > div { background-color: transparent !important; backdrop-filter: none !important; }
        `}} />
        
        <DialogContent className="max-w-[360px] rounded-[2.5rem] bg-white dark:bg-zinc-950 p-6 border-none shadow-[0_20px_70px_rgba(0,0,0,0.3)] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] outline-none z-[9999]">
          <DialogHeader className="items-center text-center shrink-0">
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full mb-3">
              <AlertTriangle size={24} className="text-orange-500" />
            </div>
            <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">
              Interromper Serviço
            </DialogTitle>
            <DialogDescription className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] mt-2">
              Selecione o motivo abaixo
            </DialogDescription>
          </DialogHeader>

          {/* LISTA COM SCROLL INTERNO */}
          <ScrollArea className="max-h-[300px] mt-6 pr-2">
            <div className="flex flex-col gap-2 pb-2">
              {CANCEL_REASONS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSelectedReason(item.label)}
                  className={`w-full text-left px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all duration-200 flex items-center gap-4 ${
                    selectedReason === item.label 
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40 translate-x-1" 
                      : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className={selectedReason === item.label ? "text-white" : "text-orange-500"}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-3 mt-6 shrink-0">
            <Button 
              variant="ghost" 
              className="flex-1 rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 text-zinc-400"
              onClick={() => {
                setShowCancelDialog(false);
                setSelectedReason("");
              }}
            >
              Voltar
            </Button>
            <Button 
              disabled={!selectedReason || loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-12 shadow-lg shadow-red-500/20 transition-all active:scale-95 disabled:opacity-30"
              onClick={handleInterromper}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}