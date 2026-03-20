import { FetchPostsVitrineAll } from "@/api/fetch-all-vitrine-data";
import { GetUserProfile } from "@/api/get-profile";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { cn, getInialts } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Filter,
  Hammer,
  Handshake,
  Home,
  MapPin,
  Menu,
  Phone,
  Plus,
  Search,
  Sparkles,
  Star,
  Users2,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FastFazerPedido } from "./DialogFastPrestadoresPedido";
import { NotificationDropdownAdmin } from "./notification-dropdown-admin";
import { VitrineCardContent } from "./vitrine-card-content";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Transacao {
  id: number;
  valor: number;
  status: "PENDENTE" | "APROVADO" | "REJEITADO" | "CANCELADO";
  metodo: string;
  createdAt: string;
  usuario: { nome: string; email: string };
  pacote: { title: string; preco: number };
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { to: "/início",        icon: Home,      label: "Início" },
  { to: "/serviços",      icon: Hammer,    label: "Serviços" },
  { to: "/admin-pedidos", icon: Briefcase, label: "Pedidos" },
  { to: "/clientes",      icon: Users2,    label: "Clientes" },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  APROVADO:  { label: "Concluído", icon: <CheckCircle2 size={12} />, cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  PENDENTE:  { label: "Pendente",  icon: <Clock size={12} />,        cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  REJEITADO: { label: "Rejeitado", icon: <XCircle size={12} />,      cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  CANCELADO: { label: "Cancelado", icon: <XCircle size={12} />,      cls: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
};

// ─── Transações Content ───────────────────────────────────────────────────────

function TransacoesContent() {
  const [search, setSearch]         = useState("");
  const [filtroStatus, setFiltro]   = useState("todos");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading]       = useState(true);
  const [aprovando, setAprovando]   = useState<number | null>(null);

  async function fetchTransacoes() {
    try {
      setLoading(true);
      const { data } = await api.get("/transacoes/ultimas");
      setTransacoes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAprovar(id: number) {
    try {
      setAprovando(id);
      await api.post("/approvar", { transacaoId: id });
      await fetchTransacoes();
    } finally {
      setAprovando(null);
    }
  }

  useEffect(() => { fetchTransacoes(); }, []);

  const filtered = transacoes.filter((t) => {
    const q = search.toLowerCase();
    return (
      (t.pacote?.title?.toLowerCase().includes(q) ||
       t.usuario?.nome?.toLowerCase().includes(q) ||
       String(t.id).includes(q)) &&
      (filtroStatus === "todos" || t.status === filtroStatus)
    );
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Search + filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Pesquisar transação..."
            className="pl-9 h-10 text-sm rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          value={filtroStatus}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="APROVADO">Aprovado</option>
          <option value="REJEITADO">Rejeitado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-0.5">
        {loading ? (
          <div className="space-y-2">
            {[0,1,2,3].map(i => (
              <div key={i} className="h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" style={{ animationDelay: `${i*60}ms` }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400 py-12">
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
              <Filter size={24} className="opacity-40" />
            </div>
            <span className="text-sm font-medium">Nenhuma transação encontrada</span>
          </div>
        ) : (
          filtered.map((t) => {
            const cfg = STATUS_CONFIG[t.status] ?? STATUS_CONFIG["PENDENTE"];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
                    <ArrowDownLeft size={15} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[160px] sm:max-w-[220px]">
                      {t.pacote?.title || "Pacote Indisponível"}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      {t.usuario?.nome} · {new Date(t.createdAt).toLocaleDateString("pt-AO")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full", cfg.cls)}>
                    {cfg.icon}
                    {cfg.label}
                  </span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums hidden sm:block">
                    +{Number(t.valor).toLocaleString("pt-AO", { style: "currency", currency: "AOA" }).replace("AOA","Kz")}
                  </span>
                  {t.status === "PENDENTE" && (
                    <Button
                      size="sm"
                      disabled={aprovando === t.id}
                      onClick={() => handleAprovar(t.id)}
                      className="h-7 px-3 text-[11px] font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm shadow-orange-500/20"
                    >
                      {aprovando === t.id ? "..." : "Aprovar"}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 font-medium">
        <span>{filtered.length} de {transacoes.length} transações</span>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 rounded-xl border-zinc-200 dark:border-zinc-800">
          <ArrowUpRight size={12} />
          Ver todas
        </Button>
      </div>
    </div>
  );
}

// ─── Vitrine Panel ────────────────────────────────────────────────────────────

function VitrinePanel({ vitrine, isLoading }: { vitrine: any[]; isLoading: boolean }) {
  const [search, setSearch] = useState("");

  const filtered = vitrine?.filter((v: any) =>
    v.title?.toLowerCase().includes(search.toLowerCase()) ||
    v.description?.toLowerCase().includes(search.toLowerCase()) ||
    v.user?.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <Input
          placeholder="Buscar na vitrine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 text-sm rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total",    value: vitrine?.length ?? 0,  color: "text-zinc-900 dark:text-zinc-100" },
          { label: "Activos",  value: vitrine?.filter((v:any) => v.activo)?.length ?? 0, color: "text-emerald-600" },
          { label: "Destaque", value: vitrine?.filter((v:any) => v.destaque)?.length ?? 0, color: "text-orange-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col items-center py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <span className={`text-lg font-black ${color}`}>{value}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
        {isLoading ? (
          <div className="space-y-3">
            {[0,1,2,3].map(i => (
              <div key={i} className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" style={{ animationDelay: `${i*60}ms` }} />
            ))}
          </div>
        ) : !filtered?.length ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-zinc-400">
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
              <Sparkles size={22} className="opacity-30" />
            </div>
            <p className="text-sm font-medium">Nenhum item na vitrine</p>
          </div>
        ) : (
          filtered.map((item: any, i: number) => (
            <motion.div
              key={item.id ?? i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors"
            >
              <Avatar className="h-10 w-10 rounded-xl ring-2 ring-orange-500/15 flex-shrink-0">
                <AvatarImage
                  src={item.user?.image_path ? `${api.defaults.baseURL}/uploads/${item.user.image_path}` : undefined}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 text-xs font-black">
                  {getInialts(item.user?.nome || "?")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                      {item.title || "Sem título"}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-medium mt-0.5">{item.user?.nome}</p>
                  </div>
                  {item.destaque && (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full flex-shrink-0">
                      <Star size={9} className="fill-current" /> Destaque
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {item.user?.provincia && (
                    <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                      <MapPin size={10} className="text-orange-500" /> {item.user.provincia}
                    </span>
                  )}
                  {item.user?.celular && (
                    <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                      <Phone size={10} className="text-blue-500" /> +244 {item.user.celular}
                    </span>
                  )}
                  {item.user?.profissao && (
                    <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                      <Briefcase size={10} /> {item.user.profissao}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-medium">
          {filtered?.length ?? 0} resultado{filtered?.length !== 1 ? "s" : ""}
        </span>
        <VitrineCardContent />
      </div>
    </div>
  );
}

// ─── TopHeader ────────────────────────────────────────────────────────────────

export function TopHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { data: vitrine = [], isLoading: isLoadingVitrine } = useQuery({
    queryKey: ["v"],
    queryFn: FetchPostsVitrineAll,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const avatarUrl = profile?.image_path
    ? `${api.defaults.baseURL}/uploads/${profile.image_path}`
    : undefined;

  if (!profile) {
    return (
      <header className="flex items-center justify-between px-5 sm:px-8 h-16 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-5 w-20 rounded-lg hidden sm:block" />
        </div>
        <div className="hidden md:flex gap-2">
          {[0,1,2,3].map(i => <Skeleton key={i} className="h-9 w-20 rounded-xl" />)}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl hidden sm:block" />
        </div>
      </header>
    );
  }

  return (
    <>
      {/* ── Main bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/80 flex items-center">
        <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 sm:px-6">

          {/* Logo */}
          <Link to="/início" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <Handshake size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-base tracking-tighter bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent hidden sm:block">
              Liberal
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, icon: Icon, label }) => {
              const active = location.pathname.toLowerCase().includes(to.replace("/","").toLowerCase());
              return (
                <Link key={to} to={to}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all",
                    active
                      ? "bg-orange-50 dark:bg-orange-950/30 text-orange-500 dark:text-orange-400"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}

            {/* Transações — desktop */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all">
                  <ArrowLeftRight size={15} />
                  Transações
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl h-[85vh] flex flex-col rounded-3xl border-zinc-200 dark:border-zinc-800">
                <DialogHeader className="flex-shrink-0 pb-2">
                  <DialogTitle className="flex items-center gap-2 font-black text-xl tracking-tighter">
                    <div className="p-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/50">
                      <ArrowLeftRight size={16} className="text-orange-500" />
                    </div>
                    Transações
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    Histórico e resumo financeiro da plataforma
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  <TransacoesContent />
                </div>
              </DialogContent>
            </Dialog>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Novo Pedido — desktop */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm"
                  className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all active:scale-95">
                  <Plus size={14} />
                  Novo Pedido
                </Button>
              </DialogTrigger>
              <FastFazerPedido />
            </Dialog>

            {/* Vitrine */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative h-9 w-9 flex items-center justify-center rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 text-zinc-500 hover:text-orange-500 transition-colors" title="Vitrine">
                  <Sparkles size={17} />
                  {vitrine?.length > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-zinc-950" />
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg h-[88vh] flex flex-col rounded-3xl p-0 overflow-hidden border-zinc-200 dark:border-zinc-800">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex-shrink-0">
                  <DialogHeader>
                    <DialogTitle className="text-white font-black text-xl tracking-tighter flex items-center gap-2">
                      <Sparkles size={18} className="fill-white/30" /> Vitrine
                    </DialogTitle>
                    <DialogDescription className="text-orange-100 text-xs font-medium">
                      {vitrine?.length ?? 0} publicações encontradas na plataforma
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div className="flex-1 overflow-hidden p-5">
                  <VitrinePanel vitrine={vitrine} isLoading={isLoadingVitrine} />
                </div>
              </DialogContent>
            </Dialog>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  <NotificationDropdownAdmin {...profile} />
                </div>
              </DropdownMenuTrigger>
            </DropdownMenu>

            <ModeToggle />

            {/* Profile pill — desktop */}
            <Link to="/perfil" className="hidden md:flex items-center gap-2 pl-3 border-l border-zinc-100 dark:border-zinc-800 hover:opacity-80 transition-opacity ml-1">
              <Avatar className="h-8 w-8 rounded-xl ring-2 ring-orange-500/20">
                <AvatarImage src={avatarUrl} className="object-cover" />
                <AvatarFallback className="rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 text-xs font-black">
                  {getInialts(profile?.nome)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 max-w-[110px] truncate">{profile.nome}</span>
                <span className="text-[10px] text-zinc-400 font-medium lowercase">@{profile.role?.replace(/_/g, "").toLowerCase()}</span>
              </div>
            </Link>

            {/* Hamburger — mobile */}
            <button type="button" onClick={() => setMobileOpen(v => !v)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-orange-50 hover:text-orange-500 transition-colors">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={mobileOpen ? "x" : "m"}
                  initial={{ rotate: -80, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 80, opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  {mobileOpen ? <X size={17} /> : <Menu size={17} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.aside key="drawer"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[80vw] max-w-[300px] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between h-16 px-5 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center">
                    <Handshake size={15} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-black tracking-tighter bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">Liberal</span>
                </div>
                <button onClick={() => setMobileOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <X size={15} />
                </button>
              </div>

              {/* Profile strip */}
              <Link to="/perfil"
                className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <Avatar className="h-10 w-10 rounded-2xl ring-2 ring-orange-500/20">
                  <AvatarImage src={avatarUrl} className="object-cover" />
                  <AvatarFallback className="rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 font-black text-sm">
                    {getInialts(profile?.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">{profile.nome}</p>
                  <p className="text-[11px] text-zinc-400 font-medium lowercase">@{profile.role?.replace(/_/g, "").toLowerCase()}</p>
                </div>
              </Link>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">

                {/* Páginas normais */}
                {NAV_LINKS.map(({ to, icon: Icon, label }, i) => {
                  const active = location.pathname.toLowerCase().includes(to.replace("/","").toLowerCase());
                  return (
                    <motion.div key={to}
                      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, type: "spring", bounce: 0.3 }}
                    >
                      <Link to={to}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98]",
                          active
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        )}
                      >
                        <div className={cn("p-1.5 rounded-xl", active ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800")}>
                          <Icon size={14} className={active ? "text-white" : "text-zinc-500"} />
                        </div>
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* ✅ Transações — mobile (abre Dialog igual ao desktop) */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.05, type: "spring", bounce: 0.3 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-[0.98]">
                        <div className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                          <ArrowLeftRight size={14} className="text-zinc-500" />
                        </div>
                        Transações
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-[calc(100vw-2rem)] max-w-lg h-[85dvh] flex flex-col rounded-3xl border-zinc-200 dark:border-zinc-800">
                      <DialogHeader className="flex-shrink-0 pb-2">
                        <DialogTitle className="flex items-center gap-2 font-black text-xl tracking-tighter">
                          <div className="p-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/50">
                            <ArrowLeftRight size={16} className="text-orange-500" />
                          </div>
                          Transações
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                          Histórico e resumo financeiro da plataforma
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-hidden">
                        <TransacoesContent />
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>

                {/* Novo Pedido */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (NAV_LINKS.length + 1) * 0.05, type: "spring", bounce: 0.3 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-[0.98]">
                        <div className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                          <Plus size={14} className="text-orange-500" />
                        </div>
                        Novo Pedido
                      </button>
                    </DialogTrigger>
                    <FastFazerPedido />
                  </Dialog>
                </motion.div>
              </nav>
              <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between flex-shrink-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700">
                  Liberal © 2025
                </span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}