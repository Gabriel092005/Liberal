import { FetchAllOrders } from "@/api/fetch-all";
import { Metrics } from "@/api/get-metrics";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { getInialts } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  ChevronDown,
  CreditCard,
  MapPin,
  Phone,
  Search,
  TrendingUp,
  Users2
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChartPieLabelCustom } from "./Pie";
import { SellingsCharts } from "./selling-charts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Order {
  id: number;
  title: string;
  status: "PENDING" | "ACEPTED" | "INTERRUPTED";
  location: string;
  autor: {
    nome: string;
    image_path: string;
    municipio: string;
    provincia: string;
    celular: string;
  };
}

// ─── Status config ────────────────────────────────────────────────────────────

const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING:     { label: "Pendente",  cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  ACEPTED:     { label: "Aceite",    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  INTERRUPTED: { label: "Cancelado", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  title,
  description,
  value,
  icon: Icon,
  growth,
  growthPositive = true,
  isLoading,
  onClick,
  extraDropdown,
}: {
  title: string;
  description: string;
  value?: string | number;
  icon: React.ElementType;
  growth?: string;
  growthPositive?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  extraDropdown?: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={onClick}
      className={`w-full ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-orange-100 dark:hover:border-orange-900/40 transition-all duration-300 h-full flex flex-col gap-3 sm:gap-4">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5 truncate">
              {title}
            </p>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-medium truncate">{description}</p>
          </div>
          {extraDropdown}
        </div>

        {/* Value + icon */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/25">
              <Icon size={18} className="text-white sm:hidden" />
              <Icon size={22} className="text-white hidden sm:block" />
            </div>
            {isLoading ? (
              <Skeleton className="h-7 sm:h-8 w-14 sm:w-16 rounded-xl" />
            ) : (
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 truncate">
                {value ?? "—"}
              </span>
            )}
          </div>

          {growth && (
            <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 py-1 rounded-full flex-shrink-0 ${growthPositive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-50 text-red-500"}`}>
              <TrendingUp size={9} />
              {growth}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Orders Dialog ────────────────────────────────────────────────────────────

function OrdersDialog({ trigger }: { trigger: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");

  const { data: orders, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: () => FetchAllOrders({ query: searchTerm }),
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        searchTerm ? p.set("query", searchTerm) : p.delete("query");
        return p;
      });
      refetch();
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm, setSearchParams, refetch]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg rounded-3xl p-0 overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-2xl gap-0 max-h-[90dvh] flex flex-col">

        {/* Header */}
        <div className="bg-zinc-900 px-5 sm:px-6 py-5 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-white font-black text-lg sm:text-xl tracking-tighter flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-orange-500">
                <Briefcase size={14} className="text-white" />
              </div>
              Pedidos
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs mt-0.5">
              Todos os pedidos feitos pelos clientes
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative mt-4">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Pesquisar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-white placeholder:text-zinc-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
            />
          </div>
        </div>

        {/*
          O ScrollArea do shadcn não herda altura via flex-1 sozinho —
          o viewport interno precisa de uma altura concreta.
          Solução: envolver num div com flex-1 + min-h-0 + overflow-hidden
          e dar h-full ao ScrollArea para ele preencher esse espaço.
        */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {!orders || orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-400">
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                  <Search size={22} className="opacity-40" />
                </div>
                <p className="text-sm font-medium">Nenhum pedido encontrado</p>
              </div>
            ) : (
              (orders as Order[]).map((o, i) => {
                const status = ORDER_STATUS[o.status] ?? ORDER_STATUS["PENDING"];
                return (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors"
                  >
                    {/* Author avatar + dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" className="flex items-center gap-1 flex-shrink-0 group">
                          <Avatar className="h-9 w-9 rounded-xl ring-2 ring-zinc-200 dark:ring-zinc-700">
                            <AvatarImage
                              src={`${api.defaults.baseURL}/uploads/${o.autor.image_path}`}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 text-xs font-black">
                              {getInialts(o.autor.nome)}
                            </AvatarFallback>
                          </Avatar>
                          <ChevronDown size={11} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="rounded-2xl p-3.5 border-zinc-200 dark:border-zinc-800 min-w-[200px] shadow-xl"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11 rounded-2xl">
                            <AvatarImage src={`${api.defaults.baseURL}/uploads/${o.autor.image_path}`} className="object-cover" />
                            <AvatarFallback className="rounded-2xl bg-orange-100 text-orange-600 font-black">
                              {getInialts(o.autor.nome)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                              {o.autor.nome}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                              <MapPin size={9} className="text-orange-500" />
                              {o.autor.municipio}, {o.autor.provincia}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                              <Phone size={9} className="text-blue-500" />
                              +244 {o.autor.celular}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Title + location */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                        {o.title}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium mt-0.5">
                        <MapPin size={9} className="text-orange-500" />
                        <span className="truncate">{o.location}</span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0 ${status.cls}`}>
                      {status.label}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <Link to="/admin-pedidos">
            <Button className="w-full h-11 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 shadow-md shadow-orange-500/20 transition-all active:scale-[0.98]">
              Ver todos os pedidos
              <ArrowUpRight size={15} />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function Dashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: Metrics,
  });

  // Shared dropdown builder
  const CompanyDropdown = ({ label, value }: { label: string; value?: number }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-orange-500 transition-colors flex-shrink-0"
        >
          <Building2 size={13} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-2xl p-4 border-zinc-200 dark:border-zinc-800 min-w-[180px] shadow-xl"
      >
        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">{label}</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-black text-orange-500">{value ?? "—"}</span>
          <TrendingUp size={18} className="text-emerald-500" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950 overflow-y-auto pt-20 ">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-orange-400/3 blur-3xl" />
      </div>

      <div className="relative w-full max-w-screen-xl mx-auto px-4  sm:px-6 sm:pt-10 pb-20 sm:pb-16">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
            Dashboard
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-1.5">
            Visão geral da plataforma Liberal Angola
          </p>
        </motion.div>

        {/* ── Metric Cards — 2×2 on mobile, 4 cols on desktop ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">

          {/* Prestadores */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <MetricCard
              title="Prestadores"
              description="Total individual"
              value={metrics?.prestadoresIndividual}
              icon={Briefcase}
              growth={`+${metrics?.crescimento?.prestadores ?? 0}%`}
              isLoading={isLoading}
              extraDropdown={
                <CompanyDropdown
                  label="Prestadores Empresa"
                  value={metrics?.prestadoresEmpresa}
                />
              }
            />
          </motion.div>

          {/* Clientes */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MetricCard
              title="Clientes"
              description="Total individual"
              value={metrics?.clientesIndividual}
              icon={Users2}
              growth={`+${metrics?.crescimento?.clientes ?? 0}%`}
              isLoading={isLoading}
              extraDropdown={
                <CompanyDropdown
                  label="Clientes Empresa"
                  value={metrics?.clientesEmpresa}
                />
              }
            />
          </motion.div>

          {/* Receitas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <MetricCard
              title="Receitas"
              description="Créditos totais"
              value={
                metrics?.receitas
                  ? `${Number(metrics.receitas).toLocaleString("pt-AO")} Kz`
                  : undefined
              }
              icon={CreditCard}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Pedidos — clickable, opens dialog */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <OrdersDialog
              trigger={
                <MetricCard
                  title="Pedidos"
                  description="Total de pedidos"
                  value={metrics?.pedidos}
                  icon={Briefcase}
                  isLoading={isLoading}
                  onClick={() => {}}
                  growth="Ver todos"
                  growthPositive={false}
                />
              }
            />
          </motion.div>
        </div>

        {/* ── Charts ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        >
          <div className="lg:col-span-3 min-h-[280px] sm:min-h-[320px]">
            <SellingsCharts />
          </div>
          <div className="lg:col-span-2 min-h-[280px] sm:min-h-[320px]">
            <ChartPieLabelCustom />
          </div>
        </motion.div>
      </div>
    </div>
  );
}