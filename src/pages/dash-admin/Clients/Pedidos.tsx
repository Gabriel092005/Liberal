"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, ChevronDown, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getInialts } from "@/lib/utils";
import { api } from "@/lib/axios";
import { FetchAllOrders } from "@/api/fetch-all";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "../skeletons-table";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ─── Status config ────────────────────────────────────────────────────────────

const ORDER_STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  PENDING:     { label: "Pendente",  cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",      dot: "bg-amber-500" },
  ACEPTED:     { label: "Aceite",    cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
  INTERRUPTED: { label: "Cancelado", cls: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",              dot: "bg-red-500" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = ORDER_STATUS[status] ?? ORDER_STATUS["PENDING"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide flex-shrink-0 ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PedidosFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");

  const { data: orders, refetch, isLoading } = useQuery({
    queryKey: ["orders", searchParams.toString()],
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
    <div className="pt-24 pb-10 bg-zinc-50 dark:bg-zinc-950 min-h-screen">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-orange-400/3 blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 space-y-6">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
            Pedidos
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-1">
            Todos os pedidos feitos pelos clientes
          </p>
        </motion.div>

        {/* ── Card ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">

            {/* Header strip */}
            <div className="bg-zinc-900 dark:bg-zinc-950 px-5 py-4 flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-orange-500 flex-shrink-0">
                <Briefcase size={13} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm tracking-tight">Pedidos</p>
                <p className="text-zinc-400 text-[10px] font-medium">Todos os pedidos feitos pelos clientes</p>
              </div>
              {orders && (
                <span className="text-zinc-400 text-xs font-bold flex-shrink-0">
                  {orders.length} pedidos
                </span>
              )}
            </div>

            {/* Search */}
            <div className="px-4 pt-4 pb-3">
              <div className="relative">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Pesquisar pedidos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 pl-9 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus-visible:ring-orange-500/30 transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="h-full min-h-0 overflow-hidden">
              <ScrollArea className="h-[420px]">
                <div className="px-3 pb-3 space-y-1.5">
                  {isLoading ? (
                    <div className="py-4"><TableSkeleton /></div>
                  ) : orders && orders.length > 0 ? (
                    orders.map((o, i) => (
                      <motion.div
                        key={o.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors"
                      >
                        {/* Avatar + dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="flex items-center gap-1 flex-shrink-0 group">
                              <Avatar className="h-9 w-9 rounded-xl ring-2 ring-zinc-200 dark:ring-zinc-700 group-hover:ring-orange-300 transition-all">
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
                            className="rounded-2xl p-3.5 border-zinc-200 dark:border-zinc-700 min-w-[200px] shadow-xl"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-11 w-11 rounded-2xl flex-shrink-0">
                                <AvatarImage src={`${api.defaults.baseURL}/uploads/${o.autor.image_path}`} className="object-cover" />
                                <AvatarFallback className="rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 font-black">
                                  {getInialts(o.autor.nome)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1 min-w-0">
                                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                                  {o.autor.nome}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                                  <MapPin size={9} className="text-orange-500 flex-shrink-0" />
                                  <span className="truncate">{o.autor.municipio}, {o.autor.provincia}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                                  <Phone size={9} className="text-blue-500 flex-shrink-0" />
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
                            <MapPin size={9} className="text-orange-500 flex-shrink-0" />
                            <span className="truncate">{o.location}</span>
                          </div>
                        </div>

                        {/* Status */}
                        <StatusBadge status={o.status} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-14 gap-3 text-zinc-400">
                      <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                        <Search size={22} className="opacity-40" />
                      </div>
                      <p className="text-sm font-medium">Nenhum pedido encontrado</p>
                      <p className="text-xs text-zinc-400">Tente ajustar o termo de pesquisa</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <Link to="/admin-pedidos">
                <Button className="w-full h-11 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 shadow-md shadow-orange-500/20 transition-all active:scale-[0.98]">
                  Ver todos os pedidos
                  <ArrowUpRight size={15} />
                </Button>
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}