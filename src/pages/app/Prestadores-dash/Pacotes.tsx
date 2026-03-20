import { assinarPacote, CarregarCarteiraRequest } from "@/api/carregar-carteira";
import { FetchPacotes } from "@/api/fetch-pacotes";
import { GetUserProfile } from "@/api/get-profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { toast } from "sonner";

// ─── Config ───────────────────────────────────────────────────────────────────

const LIBERAL_WHATSAPP = "244923000000";

const COORDENADAS_BANCARIAS = {
  multicaixa: {
    titular: "Liberal Angola Lda",
    iban: "AO06 0000 0000 0000 0000 0000 0",
    banco: "Banco BAI",
    conta: "123456789",
    metodo: "Multicaixa Express",
  },
  referencia: {
    titular: "Liberal Angola Lda",
    iban: "AO06 0000 0000 0000 0000 0000 1",
    banco: "Banco BFA",
    conta: "987654321",
    metodo: "Transferência Bancária",
  },
} as const;

const STEPS = ["Pagamento", "Coordenadas", "Confirmar"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (value?: number) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" })
        .format(value)
        .replace("AOA", "Kz");

function getCarteiraId(): number | null {
  const raw = localStorage.getItem("carteiraId");
  if (!raw) return null;
  const n = Number(raw);
  return isNaN(n) || n <= 0 ? null : n;
}

function buildWhatsAppUrl(
  plano: any,
  metodo: string,
  referencia: string,
  nomeUser: string
) {
  const coords =
    metodo === "multicaixa"
      ? COORDENADAS_BANCARIAS.multicaixa
      : COORDENADAS_BANCARIAS.referencia;

  const msg = [
    `✅ *Confirmação de Pagamento — Liberal Angola*`,
    ``,
    `Olá! Sou *${nomeUser}* e acabei de efectuar o pagamento.`,
    ``,
    `📦 *Pacote:* ${plano?.title}`,
    `💰 *Valor:* ${formatCurrency(plano?.preco)}`,
    `🏦 *Método:* ${coords.metodo}`,
    `🔖 *Referência:* ${referencia}`,
    ``,
    `Por favor, confirmem a activação. Obrigado! 🙏`,
  ].join("\n");

  return `https://wa.me/${LIBERAL_WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

// ─── CopyRow ──────────────────────────────────────────────────────────────────

function CopyRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-colors group">
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm font-bold text-zinc-900 dark:text-white truncate ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(value);
          toast.success(`${label} copiado!`);
        }}
        className="h-9 w-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-all flex-shrink-0 active:scale-90"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingGrid() {
  return (
    <div className="min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950 p-5 pt-16 space-y-4 max-w-2xl mx-auto">
      <div className="h-8 w-40 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-xl" />
      <div className="h-4 w-56 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-lg" />
      <div className="pt-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-3xl"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({
  plano,
  index,
  featured,
  disabled,
  onActivate,
}: {
  plano: any;
  index: number;
  featured: boolean;
  disabled: boolean;
  onActivate: (plano: any) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09, type: "spring", bounce: 0.25 }}
      className={`relative overflow-visible rounded-3xl border-2 transition-all duration-300 ${
        featured
          ? "bg-gradient-to-br from-orange-500 to-orange-600 border-transparent shadow-2xl shadow-orange-500/30"
          : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900/50"
      }`}
    >
      {/* Popular badge */}
      {featured && (
        <div className="absolute -top-3.5 left-5 flex items-center gap-1.5 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
          <Sparkles size={9} />
          Mais Popular
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Top row: icon + name + price */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                featured ? "bg-white/20" : "bg-orange-50 dark:bg-orange-950/30"
              }`}
            >
              <Zap
                size={20}
                className={featured ? "text-white" : "text-orange-500"}
                fill={featured ? "white" : "currentColor"}
              />
            </div>
            <div>
              <h3
                className={`font-black text-base uppercase tracking-tighter leading-none ${
                  featured ? "text-white" : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {plano.title}
              </h3>
              <div
                className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${
                  featured ? "text-orange-100" : "text-zinc-400"
                }`}
              >
                <Timer size={11} />
                {plano.validade} dias de acesso
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <span
              className={`text-xl font-black tracking-tighter leading-none ${
                featured ? "text-white" : "text-zinc-900 dark:text-white"
              }`}
            >
              {formatCurrency(plano.preco)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => onActivate(plano)}
          disabled={disabled}
          className={`w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed ${
            featured
              ? "bg-white text-orange-600 hover:bg-orange-50 shadow-lg shadow-black/10"
              : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white"
          }`}
        >
          Activar Pacote
          <ChevronRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-1.5">
      {STEPS.map((label, idx) => {
        const s = (idx + 1) as 1 | 2 | 3;
        const done = step > s;
        const active = step === s;
        return (
          <div key={s} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                  done
                    ? "bg-orange-500 text-white"
                    : active
                    ? "bg-white text-zinc-900"
                    : "bg-white/10 text-zinc-500"
                }`}
              >
                {done ? <Check size={11} strokeWidth={3} /> : s}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block transition-colors ${
                  active ? "text-white" : "text-zinc-500"
                }`}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-px w-4 sm:w-6 transition-colors ${
                  step > s ? "bg-orange-500" : "bg-white/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Package() {
  const { data: planos, isLoading: loadingPlanos } = useQuery({
    queryKey: ["pacotes"],
    queryFn: FetchPacotes,
  });

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const id = getCarteiraId();
    if (!id) {
      toast.error("Sessão expirada. Redirecionando...");
      redirect("/login");
    }
  }, []);

  const [selectedPlano, setSelectedPlano] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [metodo, setMetodo] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [referencia, setReferencia] = useState("");

  const coords =
    metodo === "multicaixa"
      ? COORDENADAS_BANCARIAS.multicaixa
      : COORDENADAS_BANCARIAS.referencia;

  const { mutateAsync: submeter, isPending } = useMutation({
    mutationFn: (data: CarregarCarteiraRequest) => assinarPacote(data),
    onSuccess: () => {
      toast.success("Pedido registado! Aguarde validação do Admin.");
      const url = buildWhatsAppUrl(
        selectedPlano,
        metodo,
        referencia,
        profile?.nome ?? "Cliente"
      );
      handleClose();
      setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 350);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? "Erro ao registar pagamento. Tente novamente.";
      toast.error(msg);
    },
  });

  const handleOpen = (plano: any) => {
    const carteiraId = getCarteiraId();
    if (!carteiraId) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    setSelectedPlano(plano);
    setMetodo("");
    setStep(1);
    setReferencia("");
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setStep(1);
      setMetodo("");
      setReferencia("");
    }, 300);
  };

  const handleAvancar = () => {
    if (step === 1 && metodo) {
      setStep(2);
    } else if (step === 2) {
      const ref = `LIB-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      setReferencia(ref);
      setStep(3);
    }
  };

  const handleConfirmar = () => {
    const carteiraId = getCarteiraId();
    if (!carteiraId) {
      toast.error("Sessão expirada. Por favor faça login novamente.");
      handleClose();
      return;
    }
    if (!selectedPlano?.id || !metodo || !selectedPlano?.preco) {
      toast.error("Dados incompletos. Reinicie o processo.");
      return;
    }
    submeter({
      planoId: selectedPlano.id,
      metodo,
      walletId: carteiraId,
      valor: selectedPlano.preco,
    });
  };

  if (loadingPlanos || loadingProfile) return <LoadingGrid />;

  const carteiraId = getCarteiraId();

  return (
    <div className="min-h-[100dvh] w-full bg-zinc-50 lg:pt-10  dark:bg-zinc-950 overflow-y-auto">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-orange-500/6 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-56 h-56 rounded-full bg-orange-400/4 blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl  mx-auto">
        {/* ── Header ── */}
        <header className="px-5 pt-14 pb-6 ">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
              Pacotes
            </h1>
            <p className="text-zinc-400 text-xs font-medium mt-1.5">
              Escolha o plano ideal para o seu negócio.
            </p>
          </motion.div>
        </header>

        {/* ── No wallet warning ── */}
        {!carteiraId && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-5 mb-4 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50"
          >
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-snug">
              Carteira não encontrada. Faça login novamente para activar pacotes.
            </p>
          </motion.div>
        )}

        {/* ── Plans list ── */}
        <div className="px-5 pb-24 space-y-3">
          {planos?.map((plano: any, i: number) => (
            <PlanCard
              key={plano.id}
              plano={plano}
              index={i}
              featured={i === 1}
              disabled={!carteiraId}
              onActivate={handleOpen}
            />
          ))}
        </div>
      </div>

      {/* ── Checkout Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={handleClose}>
        <DialogContent className="p-0 border-0 sm:max-w-[460px] max-h-[92dvh] w-[calc(100vw-24px)] rounded-3xl overflow-hidden bg-white dark:bg-zinc-950 shadow-2xl flex flex-col">
          
          {/* Dialog header — dark */}
          <div className="bg-zinc-900 px-6 py-5 flex-shrink-0">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <ShieldCheck size={18} className="text-white" />
                </div>
                <div>
                  <DialogTitle className="text-white text-base font-black leading-none">
                    Checkout Seguro
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400 text-[11px] mt-0.5">
                    {selectedPlano?.title} ·{" "}
                    <span className="text-orange-400 font-bold">
                      {formatCurrency(selectedPlano?.preco)}
                    </span>
                  </DialogDescription>
                </div>
              </div>
              <StepIndicator step={step} />
            </DialogHeader>
          </div>

          {/* Dialog body */}
          <ScrollArea className="flex-1">
            <div className="px-5 py-6 space-y-4">
              <AnimatePresence mode="wait">
                
                {/* ── Step 1: Método ── */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Forma de Pagamento
                      </label>
                      <Select onValueChange={setMetodo} value={metodo}>
                        <SelectTrigger className="h-13 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm font-bold focus:border-orange-500 focus:ring-0 h-12">
                          <SelectValue placeholder="Selecionar método..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 p-1.5">
                          <SelectItem
                            value="multicaixa"
                            className="rounded-xl py-3 font-semibold cursor-pointer"
                          >
                            Multicaixa Express
                          </SelectItem>
                          <SelectItem
                            value="referencia"
                            className="rounded-xl py-3 font-semibold cursor-pointer"
                          >
                            Transferência Bancária
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <AnimatePresence>
                      {metodo && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60"
                        >
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-0.5">
                              Valor total
                            </p>
                            <p className="text-2xl font-black text-orange-600 dark:text-orange-400">
                              {formatCurrency(selectedPlano?.preco)}
                            </p>
                          </div>
                          <CreditCard className="text-orange-400 opacity-50" size={28} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      disabled={!metodo}
                      onClick={handleAvancar}
                      className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm shadow-lg shadow-orange-500/20 active:scale-[0.97] transition-all disabled:opacity-40 gap-2"
                    >
                      Continuar
                      <ArrowRight size={16} />
                    </Button>
                  </motion.div>
                )}

                {/* ── Step 2: Coordenadas ── */}
                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3 pb-1">
                      <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Building2 size={16} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-900 dark:text-white leading-none">
                          Coordenadas Bancárias
                        </p>
                        <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                          Via {coords.metodo}
                        </p>
                      </div>
                    </div>

                    <CopyRow label="Titular" value={coords.titular} />
                    <CopyRow label="IBAN" value={coords.iban} mono />
                    <CopyRow label="Banco" value={coords.banco} />
                    <CopyRow label="Nº da Conta" value={coords.conta} mono />

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-0.5">
                          Valor a Transferir
                        </p>
                        <p className="text-2xl font-black text-orange-600 dark:text-orange-400">
                          {formatCurrency(selectedPlano?.preco)}
                        </p>
                      </div>
                      <CreditCard className="text-orange-400 opacity-50" size={24} />
                    </div>

                    <div className="flex gap-2.5 pt-1">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="h-12 flex-1 rounded-2xl font-bold border-2 text-sm gap-1.5 active:scale-[0.97]"
                      >
                        <ArrowLeft size={14} />
                        Voltar
                      </Button>
                      <Button
                        onClick={handleAvancar}
                        className="h-12 flex-[2] rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm shadow-lg shadow-orange-500/20 active:scale-[0.97] transition-all gap-1.5"
                      >
                        Já Transferi
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Confirmar ── */}
                {step === 3 && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    {/* Resumo */}
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Resumo do Pedido
                      </p>
                      {[
                        { label: "Pacote", value: selectedPlano?.title },
                        { label: "Método", value: coords.metodo },
                        { label: "Wallet", value: `#${carteiraId}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-zinc-500">{label}</span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">
                            {value}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-500">Valor</span>
                          <span className="font-black text-orange-600 dark:text-orange-400">
                            {formatCurrency(selectedPlano?.preco)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-500">Referência</span>
                          <span className="font-mono font-bold text-zinc-900 dark:text-white text-xs tracking-wide">
                            {referencia}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp info */}
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                      <MessageCircle
                        size={15}
                        className="text-emerald-500 mt-0.5 flex-shrink-0"
                      />
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                        Ao confirmar, será redirecionado para o{" "}
                        <strong>WhatsApp da Liberal</strong> com os detalhes já preenchidos.
                      </p>
                    </div>

                    <div className="flex gap-2.5">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="h-12 flex-1 rounded-2xl font-bold border-2 text-sm gap-1.5 active:scale-[0.97]"
                      >
                        <ArrowLeft size={14} />
                        Voltar
                      </Button>
                      <Button
                        onClick={handleConfirmar}
                        disabled={isPending}
                        className="h-12 flex-[2] rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.97] transition-all disabled:opacity-50 gap-2"
                      >
                        {isPending ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <>
                            <MessageCircle size={14} />
                            Já Paguei — Confirmar
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cancel */}
              <button
                type="button"
                onClick={handleClose}
                className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-medium pt-1 pb-2 transition-colors active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}