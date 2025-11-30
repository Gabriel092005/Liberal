import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, StopCircleIcon, Loader2 } from "lucide-react";
import { AcceptOrders } from "@/api/AcceptOrders";
import { InterruptOrders } from "@/api/interromper-pedido";
import { useEffect, useRef, useState } from "react";

interface CardProps {
  id: number; // pedidoId
  prestadorId: number;
  status?: "PENDING" | "ACEPTED" | "INTERRUPTED";
  refetch: () => void;
  isRefetching?: boolean;
}

export function PedidoCard({ id, prestadorId, status = "PENDING", refetch }: CardProps) {
  const uniqueKey = `${id}-${prestadorId}`;
  const [localStatus, setLocalStatus] = useState(status);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio("/digital-beeping-151921.mp3");
    audioRef.current.volume = 0.7;
  }

  // Sincroniza o estado local com o status recebido
  useEffect(() => {
    setLocalStatus(status);
  }, [status, uniqueKey]);

  // --- MUTATION: CONFIRMAR ---
  const { mutateAsync: confirmar } = useMutation({
    mutationFn: AcceptOrders,
    onSuccess: () => {
      setLocalStatus("ACEPTED");
      toast.success("Pedido confirmado com sucesso!");
      audioRef.current?.play().catch(() => {});
      refetch();
    },
    onError: () => toast.error("Erro ao confirmar o pedido!"),
  });

  // --- MUTATION: INTERROMPER ---
  const { mutateAsync: interromper } = useMutation({
    mutationFn: InterruptOrders,
    onSuccess: () => {
      setLocalStatus("PENDING");
      toast.info("Pedido interrompido!");
      refetch();
    },
    onError: () => toast.error("Erro ao interromper o pedido!"),
  });

  async function handleConfirmar() {
    try {
      setLoading(true);
      setShowConfirmDialog(true);
      await confirmar({ pedidoId: id, prestadorId });
      setTimeout(() => setShowConfirmDialog(false), 1500);
    } finally {
      setLoading(false);
    }
  }

  async function handleInterromper() {
    try {
      setLoading(true);
      await interromper({ pedidoId: id, prestadorId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div  className="flex items-center gap-2">
      {localStatus === "PENDING" && (
        <Button
          onClick={handleConfirmar}
          size="sm"
          disabled={loading}
          className="h-8 px-3 text-xs flex items-center gap-1">
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          Confirmar
        </Button>
      )}

      {localStatus === "ACEPTED" && (
        <Button
          onClick={handleInterromper}
          variant="destructive"
          size="sm"
          disabled={loading}
          className="h-8 px-3 text-xs flex items-center gap-1"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <StopCircleIcon size={14} />
          )}
          Interromper
        </Button>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-[250px] bg-white/90 dark:bg-black backdrop-blur-md shadow-xl border border-orange-200 flex flex-col items-center justify-center py-6">
          <AnimatePresence>
            {showConfirmDialog && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: [0.8, 1.2, 1] }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center"
              >
                <CheckCircle2 size={60} className="text-green-500 drop-shadow-lg" />
                <p className="mt-3 text-sm font-semibold text-muted-foreground">
                  Pedido confirmado!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
