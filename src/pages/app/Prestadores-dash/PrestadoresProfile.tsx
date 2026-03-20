import { EditarBio } from "@/api/editar-bio";
import { GetUserProfile } from "@/api/get-profile";
import { Logout } from "@/api/log-out";
import { PromoverServicos } from "@/api/vitrine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlignLeft,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Loader2,
  LogOut,
  MapPin,
  Pencil,
  Phone,
  Send,
  Settings,
  Star,
  Type,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const editarBioSchema = z.object({
  description: z.string().min(1, "A bio não pode estar vazia"),
});

const vitrineSchema = z.object({
  titulo: z
    .string()
    .min(5, "Mínimo de 5 caracteres")
    .max(50, "Título muito longo"),
  descricao: z
    .string()
    .min(20, "Descreva com pelo menos 20 caracteres")
    .max(500, "Limite de 500 caracteres atingido"),
});

type EditarBioData = z.infer<typeof editarBioSchema>;
type VitrineFormData = z.infer<typeof vitrineSchema>;

// ─── Role formatter ───────────────────────────────────────────────────────────

function formatRole(role?: string) {
  if (!role) return "";
  return role.replace(/_/g, " ");
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 shadow-sm flex-1"
    >
      <div className={`p-2 rounded-xl ${accent}`}>{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
        {label}
      </span>
      <span className="font-bold text-xs text-center leading-tight text-zinc-700 dark:text-zinc-200 truncate max-w-full px-1">
        {value || "—"}
      </span>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProfilePage() {
  const queryClient = useQueryClient();
  const [vitrineOpen, setVitrineOpen] = useState(false);
  const [bioDialogOpen, setBioDialogOpen] = useState(false);

  // ── Bio Form ──────────────────────────────────────────────────────────────
  const {
    register: registerBio,
    handleSubmit: submitBio,
    reset: resetBio,
  } = useForm<EditarBioData>({ resolver: zodResolver(editarBioSchema) });

  // ── Vitrine Form ──────────────────────────────────────────────────────────
  const {
    register: registerVitrine,
    handleSubmit: submitVitrine,
    reset: resetVitrine,
    formState: { errors: vitrineErrors, isSubmitting: vitrineLoading },
  } = useForm<VitrineFormData>({ resolver: zodResolver(vitrineSchema) });

  // ── Queries & Mutations ───────────────────────────────────────────────────
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
  });

  const { mutateAsync: sair } = useMutation({ mutationFn: Logout });

  const { mutateAsync: salvarBio, isPending: savingBio } = useMutation({
    mutationFn: EditarBio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setBioDialogOpen(false);
      toast.success("Bio atualizada com sucesso!");
    },
    onError: () => toast.error("Erro ao atualizar bio."),
  });

  const { mutateAsync: vitrinar } = useMutation({
    mutationFn: PromoverServicos,
  });

  useEffect(() => {
    if (profile?.description) resetBio({ description: profile.description });
  }, [profile, resetBio]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleEditarBio = async (data: EditarBioData) => {
    await salvarBio({ description: data.description });
  };

  const handlePromoverPerfil = async (data: VitrineFormData) => {
    try {
      await vitrinar({ title: data.titulo, description: data.descricao });
      toast.success("Perfil publicado na vitrine!");
      resetVitrine();
      setVitrineOpen(false);
    } catch {
      toast.error("Erro ao publicar na vitrine.");
    }
  };

  const handleLogout = async () => {
    await sair();
    window.location.href = "/sign-in";
  };

  // ── Loading State ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-orange-500" size={32} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Carregando perfil...
          </span>
        </div>
      </div>
    );
  }

  const avatarUrl = `${api.defaults.baseURL}/uploads/${profile?.image_path}`;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[100dvh] w-full bg-zinc-50 dark:bg-zinc-950 overflow-y-auto">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-orange-500/8 blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-48 h-48 rounded-full bg-orange-400/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-auto pb-10">

        {/* ── COVER + AVATAR ─────────────────────────────────────────────── */}
        <div className="relative">
          {/* Cover image */}
          <div className="h-52 sm:h-64 w-full overflow-hidden">
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={avatarUrl}
              alt="Capa"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-black/10 to-black/20" />
          </div>

          {/* Role badge */}
          <div className="absolute top-safe-top top-4 left-0 right-0 flex justify-end px-5 pt-1">
            <Badge className="bg-black/30 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
              {formatRole(profile?.role)}
            </Badge>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-[2rem] border-4 border-zinc-50 dark:border-zinc-950 shadow-2xl overflow-hidden bg-zinc-200 ring-2 ring-orange-500/30">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-orange-500 rounded-xl text-white shadow-lg border-2 border-zinc-50 dark:border-zinc-950">
                <CheckCircle2 size={13} strokeWidth={3} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
        <div className="mt-20 px-5">

          {/* Name + Location */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center space-y-1 mb-6"
          >
            <h1 className="text-2xl font-black tracking-tighter dark:text-white uppercase leading-none">
              {profile?.nome}
            </h1>
            <div className="flex items-center justify-center gap-1.5 text-zinc-400">
              <MapPin size={12} className="text-orange-500 flex-shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {profile?.provincia}, {profile?.municipio}
              </span>
            </div>
          </motion.div>

          {/* Stat cards */}
          <div className="flex gap-3 mb-6">
            <StatCard
              icon={<Phone size={15} className="text-white" />}
              label="Contacto"
              value={`+244 ${profile?.celular}`}
              accent="bg-blue-500"
            />
            <StatCard
              icon={<Briefcase size={15} className="text-white" />}
              label="Ocupação"
              value={formatRole(profile?.profissao || profile?.role)}
              accent="bg-orange-500"
            />
          </div>

          {/* Bio section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-5 p-5 rounded-[1.75rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                  Bio Profissional
                </span>
              </div>
              <Dialog open={bioDialogOpen} onOpenChange={setBioDialogOpen}>
                <DialogTrigger asChild>
                  <button className="p-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10 text-orange-500 transition-colors active:scale-95">
                    <Pencil size={13} />
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2rem] max-w-[92vw] sm:max-w-md border-zinc-200 dark:border-zinc-800">
                  <DialogHeader>
                    <DialogTitle className="font-black text-xl tracking-tighter">
                      Editar Bio
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={submitBio(handleEditarBio)} className="space-y-4 pt-2">
                    <Textarea
                      {...registerBio("description")}
                      rows={5}
                      placeholder="Descreva suas competências e experiência..."
                      className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 resize-none text-sm focus-visible:ring-orange-500"
                    />
                    <Button
                      disabled={savingBio}
                      type="submit"
                      className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold uppercase tracking-tight text-white shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
                    >
                      {savingBio ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        "Guardar Alterações"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[13px] italic">
              "{profile?.description || "Inovando e prestando serviços com qualidade e dedicação."}"
            </p>
          </motion.div>

          {/* ── VITRINE BUTTON ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-3"
          >
            <button
              type="button"
              onClick={() => setVitrineOpen(!vitrineOpen)}
              className={`w-full flex items-center gap-3 p-4 rounded-[1.5rem] transition-all duration-300 active:scale-[0.98] border ${
                vitrineOpen
                  ? "bg-zinc-900 dark:bg-zinc-100 border-transparent text-white dark:text-zinc-900"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 border-transparent text-white shadow-lg shadow-orange-500/25"
              }`}
            >
              <div
                className={`p-2.5 rounded-xl transition-colors ${
                  vitrineOpen ? "bg-orange-500 text-white" : "bg-white/20"
                }`}
              >
                <Star
                  size={18}
                  className={vitrineOpen ? "fill-white" : "fill-white/80"}
                />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="font-black uppercase tracking-tight text-sm leading-none">
                  {vitrineOpen ? "Configurando Vitrine" : "Perfil na Vitrine"}
                </span>
                {!vitrineOpen && (
                  <span className="text-[10px] opacity-75 font-medium mt-0.5">
                    Expanda sua visibilidade
                  </span>
                )}
              </div>
              <motion.div
                animate={{ rotate: vitrineOpen ? 90 : 0 }}
                transition={{ duration: 0.25 }}
                className="ml-auto opacity-50"
              >
                <ChevronRight size={18} />
              </motion.div>
            </button>

            {/* Vitrine expandable panel */}
            <AnimatePresence>
              {vitrineOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.75rem] shadow-xl">
                    <form
                      onSubmit={submitVitrine(handlePromoverPerfil)}
                      className="p-5 space-y-4"
                    >
                      {/* Panel header */}
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                          Novo Destaque
                        </span>
                        <button
                          type="button"
                          onClick={() => setVitrineOpen(false)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Título */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          <Type size={11} />
                          Título
                        </label>
                        <Input
                          {...registerVitrine("titulo")}
                          placeholder="Ex: Especialista em UI Design"
                          className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus-visible:ring-orange-500"
                        />
                        {vitrineErrors.titulo && (
                          <p className="text-[10px] text-red-500 ml-1">
                            {vitrineErrors.titulo.message}
                          </p>
                        )}
                      </div>

                      {/* Descrição */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          <AlignLeft size={11} />
                          Descrição
                        </label>
                        <Textarea
                          {...registerVitrine("descricao")}
                          placeholder="Conte sobre seus melhores serviços..."
                          rows={4}
                          className="rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm resize-none focus-visible:ring-orange-500"
                        />
                        {vitrineErrors.descricao && (
                          <p className="text-[10px] text-red-500 ml-1">
                            {vitrineErrors.descricao.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={vitrineLoading}
                        className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
                      >
                        {vitrineLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <>
                            <Send size={15} />
                            Publicar na Vitrine
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── SETTINGS BUTTON ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-3"
          >
            <Link to="/config-prestadores">
              <button
                type="button"
                className="w-full flex items-center gap-3 p-4 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98]"
              >
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  <Settings size={18} className="text-zinc-500" />
                </div>
                <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200 uppercase tracking-tight">
                  Configurações da Conta
                </span>
                <ChevronRight size={16} className="ml-auto text-zinc-300 dark:text-zinc-600" />
              </button>
            </Link>
          </motion.div>

          {/* ── LOGOUT BUTTON ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-[0.98]"
            >
              <LogOut size={13} strokeWidth={3} />
              Encerrar Sessão
            </button>
          </motion.div>

          {/* Footer */}
          <p className="mt-6 text-center text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300 dark:text-zinc-700">
            Liberal · Prestador Verificado
          </p>
        </div>
      </div>
    </div>
  );
}