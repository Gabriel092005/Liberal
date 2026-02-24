import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Home,
  Plus,
  Users2,
  BookMarked,
  Handshake,
  Briefcase,
  Hammer,
  ArrowLeftRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FastFazerPedido } from "./DialogFastPrestadoresPedido";
import { useQuery } from "@tanstack/react-query";
import { GetUserProfile } from "@/api/get-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getInialts } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { api } from "@/lib/axios";
import { NotificationDropdownAdmin } from "./notification-dropdown-admin";
import { Card } from "@/components/ui/card";
import { FetchPostsVitrineAll } from "@/api/fetch-all-vitrine-data";
import { VitrineCardContent } from "./vitrine-card-content";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// ─── Mock de transações (substituir por query real) ────────────────────────
const mockTransactions = [
  {
    id: "TXN-001",
    descricao: "Pagamento - Serviço de Pintura",
    valor: 450.0,
    tipo: "entrada",
    status: "concluido",
    data: "2025-06-18",
    cliente: "João Silva",
  },
  {
    id: "TXN-002",
    descricao: "Reembolso - Pedido #204",
    valor: 80.0,
    tipo: "saida",
    status: "concluido",
    data: "2025-06-17",
    cliente: "Maria Costa",
  },
  {
    id: "TXN-003",
    descricao: "Pagamento - Instalação Elétrica",
    valor: 1200.0,
    tipo: "entrada",
    status: "pendente",
    data: "2025-06-16",
    cliente: "Carlos Mendes",
  },
  {
    id: "TXN-004",
    descricao: "Taxa de Plataforma",
    valor: 60.0,
    tipo: "saida",
    status: "concluido",
    data: "2025-06-15",
    cliente: "Sistema",
  },
  {
    id: "TXN-005",
    descricao: "Pagamento - Limpeza Residencial",
    valor: 320.0,
    tipo: "entrada",
    status: "cancelado",
    data: "2025-06-14",
    cliente: "Ana Ribeiro",
  },
  {
    id: "TXN-006",
    descricao: "Pagamento - Reparação Canalização",
    valor: 780.0,
    tipo: "entrada",
    status: "concluido",
    data: "2025-06-13",
    cliente: "Pedro Fonseca",
  },
];

// ─── Componente de Transações ──────────────────────────────────────────────


interface Transacao {
  id: number;
  valor: number;
  status: "PENDENTE" | "APROVADO" | "REJEITADO";
  metodo: string;
  createdAt: string;
  usuario: { nome: string; email: string };
  pacote: { title: string; preco: number };
}

function TransacoesContent() {
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [aprovando, setAprovando] = useState<number | null>(null);

  // Busca as últimas 10
  async function fetchTransacoes() {
    try {
      setLoading(true);
      const { data } = await api.get("/transacoes/ultimas");
      setTransacoes(data);
    } catch (error) {
      console.error("Erro ao buscar transações", error);
    } finally {
      setLoading(false);
    }
  }

  // Aprovar transação
  async function handleAprovar(transacaoId: number) {
    try {
      setAprovando(transacaoId);
      await api.post("/approvar", { transacaoId });
      await fetchTransacoes(); // atualiza a lista
    } catch (error) {
      console.error("Erro ao aprovar", error);
    } finally {
      setAprovando(null);
    }
  }

  useEffect(() => {
    fetchTransacoes();
  }, []);

  // Mapeia status do backend para o frontend
  const statusConfig: Record<string, { label: string; icon: JSX.Element; class: string }> = {
    APROVADO: {
      label: "Concluído",
      icon: <CheckCircle2 size={13} />,
      class: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    },
    PENDENTE: {
      label: "Pendente",
      icon: <Clock size={13} />,
      class: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
    },
    CANCELADO: {
      label: "Cancelado",
      icon: <XCircle size={13} />,
      class: "text-rose-600 bg-rose-50 dark:bg-rose-950/40",
    },
  };

  const filtered = transacoes.filter((t) => {
    const matchSearch =
      t.pacote.title.toLowerCase().includes(search.toLowerCase()) ||
      t.usuario.nome.toLowerCase().includes(search.toLowerCase()) ||
      String(t.id).includes(search);
    const matchStatus = filtroStatus === "todos" || t.status === filtroStatus;
    return matchSearch && matchStatus;
  });

  const totalEntradas = transacoes
    .filter((t) => t.status === "APROVADO")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Filtros */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar transação..."
            className="pl-8 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-9 text-sm border rounded-md px-2"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="APROVADO">Aprovado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            A carregar...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <Filter size={32} className="opacity-30" />
            <span className="text-sm">Nenhuma transação encontrada</span>
          </div>
        ) : (
          filtered.map((t) => {
            const cfg = statusConfig[t.status];
            return (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600">
                    <ArrowDownLeft size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {t.pacote.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.usuario.nome} · {new Date(t.createdAt).toLocaleDateString("pt-AO")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={cn("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full", cfg.class)}>
                    {cfg.icon}
                    {cfg.label}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                    +{Number(t.valor).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                  </span>

                  {/* Só mostra botão se estiver pendente */}
                  {t.status === "PENDENTE" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={aprovando === t.id}
                      onClick={() => handleAprovar(t.id)}
                    >
                      {aprovando === t.id ? "Aprovando..." : "Aprovar"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rodapé */}
      <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
        <span>{filtered.length} de {transacoes.length} transações</span>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
          <ArrowUpRight size={12} />
          Ver todas
        </Button>
      </div>
    </div>
  );
}
// ─── TopHeader Principal ───────────────────────────────────────────────────
export function TopHeader() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
    queryFn: GetUserProfile,
  });

  const { data: vitrine, isLoading: isLoadingVitrine } = useQuery({
    queryKey: ["v"],
    queryFn: FetchPostsVitrineAll,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  if (!profile || !vitrine) {
    return (
      <header className="hidden md:flex items-center justify-between px-8 py-4 dark:bg-muted bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-20 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </header>
    );
  }

  const navLinks = [
    { to: "/início", icon: <Home size={18} />, label: "Início" },
    { to: "/Serviços", icon: <Hammer size={18} />, label: "Serviços" },
    { to: "/admin-pedidos", icon: <Briefcase size={18} />, label: "Pedidos" },
    { to: "/clientes", icon: <Users2 size={18} />, label: "Clientes" },
  ];

  return (
    <header className="hidden md:flex items-center justify-between px-8 py-3 dark:bg-zinc-900/95 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm fixed top-0 left-0 right-0 z-50">
      {/* Logo */}
      <Link to="/início" className="flex items-center gap-2 group">
        <div className="bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg shadow-orange-200 dark:shadow-orange-900/30 rounded-xl p-2 group-hover:scale-105 transition-transform">
          <Handshake size={20} className="text-white" />
        </div>
        <span className="font-bold text-base bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent hidden lg:block">
          ServiçosHub
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {navLinks.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-lg transition-all"
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}

        {/* Transações — item de nav que abre dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-lg transition-all">
              <ArrowLeftRight size={18} />
              <span>Transações</span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl h-[85vh] flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <ArrowLeftRight size={18} className="text-orange-500" />
                Transações
              </DialogTitle>
              <DialogDescription>
                Histórico e resumo financeiro da plataforma
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <TransacoesContent />
            </div>
          </DialogContent>
        </Dialog>
      </nav>

      {/* Ações direita */}
      <div className="flex items-center gap-2">
        {/* Novo Pedido */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 hover:shadow-md hover:shadow-orange-200 dark:hover:shadow-orange-900/30 transition-all"
            >
              <Plus size={16} />
              <span>Novo Pedido</span>
            </Button>
          </DialogTrigger>
          <FastFazerPedido />
        </Dialog>

        {/* Vitrine */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-lg hover:bg-muted transition-colors"
              title="Vitrine"
            >
              <BookMarked size={18} className="text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vitrine</DialogTitle>
              <DialogDescription>
                Todos os posts encontrados na vitrine
              </DialogDescription>
            </DialogHeader>
            <Card className="w-full h-[60vh] border-none shadow-none bg-background">
              {isLoadingVitrine ? (
                <div className="flex flex-col gap-4 p-4 h-full justify-center">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-xl" />
                  ))}
                </div>
              ) : vitrine?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Nenhum item adicionado ainda.
                </div>
              ) : (
                <VitrineCardContent />
              )}
            </Card>
          </DialogContent>
        </Dialog>

        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span />
          </DropdownMenuTrigger>
          <NotificationDropdownAdmin {...profile} />
        </DropdownMenu>

        <ModeToggle />

        {/* Perfil */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/50">
          <Avatar className="h-8 w-8 ring-2 ring-orange-200 dark:ring-orange-900">
            <AvatarImage
              src={`${api.defaults.baseURL}/uploads/${profile.image_path}`}
            />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white text-xs font-bold">
              {getInialts(profile?.nome)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium leading-none">
              {profile.nome}
            </span>
            <span className="text-xs text-muted-foreground">
              @{profile.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}