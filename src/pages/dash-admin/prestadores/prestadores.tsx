import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { Delete } from "@/api/delete-user";
import { AtivarConta } from "@/api/desativar-conta";
import { DesativarConta } from "@/api/desativarConta";
import { getPrestadores } from "@/api/fetch-prestadores";
import { SuspenderConta } from "@/api/suspender-conta";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/axios";
import { formatNotificationDate, getInialts } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, Loader2, Search, ShieldAlert, SlidersHorizontal, Trash2, UserCheck, UserX, X } from "lucide-react";
import { toast } from "sonner";
import { PacientTableSkeleton } from "../Clients/clientes-skeleton";
import { Pagination } from "../Clients/pagination";
import { PrestadoresDetailsDialog } from "../Clients/prestadores-details";

type MunicipalityMap = Record<string, string[]>;

const provinceMunicipalityMap: MunicipalityMap = {
  Luanda: ["Viana", "Cazenga", "Luanda", "Belas", "Kilamba Kiaxi", "Ícolo e Bengo", "Quissama", "Talatona", "Cacuaco"],
  Bengo: ["Ambriz", "Dande", "Bula Atumba", "Nambuangongo", "Dembos", "Pango Aluquém"],
};

const pacientFilterSchema = z.object({
  province: z.string().optional(),
  municipality: z.string().optional(),
  nome: z.string().optional(),
  page: z.number().optional(),
});

type PacientFilterSchema = z.infer<typeof pacientFilterSchema>;

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  ACTIVA:     { label: "Activa",     cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",    dot: "bg-emerald-500" },
  DESATIVADA: { label: "Desativada", cls: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",                   dot: "bg-red-500" },
  PENDENTE:   { label: "Pendente",   cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",            dot: "bg-amber-500" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["PENDENTE"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const label = role?.replace(/_/g, " ") ?? "—";
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
      {label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PrestadoresTableFilters() {
  const [municipalities, setMunicipalities] = useState<string[]>(provinceMunicipalityMap["Luanda"]);
  const [searchParams, setSearchParams] = useSearchParams();

  const page       = z.coerce.number().parse(searchParams.get("page") ?? "1");
  const provincia  = searchParams.get("province");
  const municipality = searchParams.get("municipality");
  const nome       = searchParams.get("nome");

  const { data: costumers, isLoading } = useQuery({
    queryKey: ["prestadores", provincia, municipality, nome, page],
    queryFn: () => getPrestadores({ municipality, nome, province: provincia, page }),
  });

  const { handleSubmit, control, register, reset } = useForm<PacientFilterSchema>({
    resolver: zodResolver(pacientFilterSchema),
    defaultValues: {
      province:     searchParams.get("province")     ?? "Luanda",
      municipality: searchParams.get("municipality") ?? "Viana",
      nome:         searchParams.get("nome")         ?? "",
    },
  });

  const { onChange, ...rest } = register("nome");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      v ? p.set("nome", v) : p.delete("nome");
      return p;
    });
  };

  const handleProvinceChange = (province: string) => {
    setMunicipalities(provinceMunicipalityMap[province] || []);
  };

  function handleFilters({ province, municipality }: PacientFilterSchema) {
    setSearchParams((state) => {
      province    ? state.set("province", province)       : state.delete("province");
      municipality ? state.set("municipality", municipality) : state.delete("municipality");
      nome        ? state.set("nome", nome)               : state.delete("nome");
      state.set("page", "1");
      return state;
    });
  }

  function handleDeleteFilters() {
    setSearchParams((state) => {
      state.delete("province");
      state.delete("municipality");
      state.delete("nome");
      state.delete("page");
      return state;
    });
    reset({ province: "", municipality: "", nome: "", page: 1 });
  }

  function handlePagination(pageIndex: number) {
    const p = new URLSearchParams(searchParams);
    p.set("page", String(pageIndex + 1));
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  const queryClient = useQueryClient();
  const queryKey = ["prestadores", provincia, municipality, nome, page];

  const patchUser = (userId: number, patch: Record<string, unknown>) => {
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return old;
      return { ...old, users: old.users.map((u: any) => u.id === userId ? { ...u, ...patch } : u) };
    });
  };

  const { mutateAsync: deleteCostumer } = useMutation({
    mutationFn: (userId: number) => Delete({ userId: String(userId) }),
    onSuccess: (_data, userId) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return { ...old, users: old.users.filter((u: any) => u.id !== userId), pagination: { ...old.pagination, total: old.pagination.total - 1 } };
      });
      toast.success("Prestador eliminado com sucesso!");
    },
  });

  const { mutateAsync: suspenderCostumer, isPending: isSuspending } = useMutation({
    mutationFn: async (userId: number) => { await SuspenderConta({ Id: userId }); return userId; },
    onSuccess: (userId) => { patchUser(userId, { estado_conta: "PENDENTE" }); toast.success("Conta suspensa!"); queryClient.invalidateQueries({ queryKey }); },
    onError:   () => toast.error("Erro ao suspender conta."),
  });

  const { mutateAsync: desativarCostumer, isPending: isDesativando } = useMutation({
    mutationFn: async (userId: number) => { await DesativarConta({ Id: userId }); return userId; },
    onSuccess: (userId) => { patchUser(userId, { estado_conta: "DESATIVADA" }); toast.success("Conta desativada!"); queryClient.invalidateQueries({ queryKey }); },
    onError:   () => toast.error("Erro ao desativar conta."),
  });

  const { mutateAsync: ativarCostumer, isPending: isAtivando } = useMutation({
    mutationFn: async (userId: number) => { await AtivarConta({ Id: userId }); return userId; },
    onSuccess: (userId) => { patchUser(userId, { estado_conta: "ACTIVA" }); toast.success("Conta activada!"); queryClient.invalidateQueries({ queryKey }); },
    onError:   () => toast.error("Erro ao activar conta."),
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="pt-20 pb-28 bg-zinc-50 dark:bg-zinc-950">

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-orange-400/3 blur-3xl" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 space-y-6">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
            Prestadores
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-1">
            Gestão e controlo de todos os prestadores de serviço
          </p>
        </motion.div>

        {/* ── Filters ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <form
            onSubmit={handleSubmit(handleFilters)}
            className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-xl bg-orange-500">
                <SlidersHorizontal size={13} className="text-white" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Filtros</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Província */}
              <div className="flex flex-col gap-1.5 min-w-[150px] flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Província</label>
                <Controller
                  name="province"
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <Select name={name} value={value} onValueChange={(v) => { onChange(v); handleProvinceChange(v); }}>
                      <SelectTrigger className="h-10 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus:ring-orange-500/30">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {Object.keys(provinceMunicipalityMap).map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Município */}
              <div className="flex flex-col gap-1.5 min-w-[150px] flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Município</label>
                <Controller
                  name="municipality"
                  control={control}
                  render={({ field: { value, onChange, name } }) => (
                    <Select name={name} value={value} onValueChange={onChange}>
                      <SelectTrigger className="h-10 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus:ring-orange-500/30">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {municipalities.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Nome */}
              <div className="flex flex-col gap-1.5 min-w-[180px] flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nome</label>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    {...rest}
                    onChange={(e) => { onChange(e); handleInputChange(e); }}
                    placeholder="Pesquisar prestador..."
                    className="h-10 pl-8 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus-visible:ring-orange-500/30"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex items-end gap-2 flex-shrink-0">
                <Button type="submit" className="h-10 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm gap-1.5 shadow-md shadow-orange-500/20">
                  <Search size={13} /> Filtrar
                </Button>
                <Button type="button" variant="outline" onClick={handleDeleteFilters} className="h-10 px-4 rounded-xl border-zinc-200 dark:border-zinc-700 font-bold text-sm gap-1.5">
                  <X size={13} /> Limpar
                </Button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* ── List header ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">

            {/* Strip */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 sm:px-5 py-3 flex items-center justify-between">
              <p className="text-white font-black text-sm uppercase tracking-widest">Lista de Prestadores</p>
              {costumers && (
                <span className="text-orange-100 text-xs font-bold">
                  {costumers.pagination.total} prestadores
                </span>
              )}
            </div>

            {/* ─── MOBILE: cards (hidden em lg+) ──────────────────────────── */}
            <div className="lg:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading ? (
                <div className="p-4"><PacientTableSkeleton /></div>
              ) : costumers?.users?.length ? (
                costumers.users.map((row, i) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-4 space-y-3"
                  >
                    {/* Topo do card: avatar + info + estado */}
                    <div className="flex items-center gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button type="button">
                            <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-zinc-200 dark:ring-zinc-700">
                              <AvatarImage src={`${api.defaults.baseURL}/uploads/${row.image_path}`} className="object-cover" />
                              <AvatarFallback className="rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 font-black">
                                {getInialts(row.nome)}
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl overflow-hidden p-0 max-w-xs">
                          <img src={`${api.defaults.baseURL}/uploads/${row.image_path}`} alt={row.nome} className="w-full object-cover" />
                        </DialogContent>
                      </Dialog>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{row.nome}</p>
                          <span className="text-[10px] font-black text-zinc-400">#{row.id}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <StatusBadge status={row.estado_conta} />
                          <RoleBadge role={row.role} />
                        </div>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 px-3 py-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Localização</p>
                        <p className="font-semibold text-zinc-700 dark:text-zinc-300">{row.provincia}</p>
                        <p className="text-zinc-400">{row.municipio}</p>
                      </div>
                      <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 px-3 py-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Registo</p>
                        <p className="font-semibold text-zinc-700 dark:text-zinc-300">{formatNotificationDate(row.created_at)}</p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button type="button" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <Eye size={11} /> Ver
                          </button>
                        </DialogTrigger>
                        <PrestadoresDetailsDialog profissao={row.profissao} estrelas={row.estrelas} description={row.description} accountBalance={Number(row.carteira?.receita ?? 0)} address={row.provincia} name={row.nome} phone={row.celular} image={row.image_path} />
                      </Dialog>

                      <button type="button" disabled={isSuspending} onClick={() => suspenderCostumer(row.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors disabled:opacity-50">
                        {isSuspending ? <Loader2 size={11} className="animate-spin" /> : <ShieldAlert size={11} />} Suspender
                      </button>

                      {row.estado_conta === "ACTIVA" && (
                        <button type="button" disabled={isDesativando} onClick={() => desativarCostumer(row.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 transition-colors disabled:opacity-50">
                          {isDesativando ? <Loader2 size={11} className="animate-spin" /> : <UserX size={11} />} Desativar
                        </button>
                      )}

                      {(row.estado_conta === "PENDENTE" || row.estado_conta === "DESATIVADA") && (
                        <button type="button" disabled={isAtivando} onClick={() => ativarCostumer(row.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors disabled:opacity-50">
                          {isAtivando ? <Loader2 size={11} className="animate-spin" /> : <UserCheck size={11} />} Activar
                        </button>
                      )}

                      <button type="button" onClick={() => deleteCostumer(row.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20">
                        <Trash2 size={11} /> Eliminar
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
                  <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800"><Search size={22} className="opacity-40" /></div>
                  <p className="text-sm font-medium">Nenhum prestador encontrado</p>
                </div>
              )}
            </div>

            {/* ─── DESKTOP: tabela (hidden abaixo de lg) ──────────────────── */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    {["ID", "Prestador", "Registo", "Localização", "Estado", "Cargo", "Ações"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <PacientTableSkeleton />
                  ) : costumers?.users?.length ? (
                    costumers.users.map((row, i) => (
                      <motion.tr key={row.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        className="border-b border-zinc-50 dark:border-zinc-800/60 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">

                        <td className="px-4 py-3 text-xs font-black text-zinc-400">#{row.id}</td>

                        <td className="px-4 py-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button type="button" className="flex items-center gap-2.5 group">
                                <Avatar className="h-9 w-9 rounded-xl ring-2 ring-zinc-200 dark:ring-zinc-700 group-hover:ring-orange-300 transition-all">
                                  <AvatarImage src={`${api.defaults.baseURL}/uploads/${row.image_path}`} className="object-cover" />
                                  <AvatarFallback className="rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 text-xs font-black">{getInialts(row.nome)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-orange-500 transition-colors max-w-[140px] truncate">{row.nome}</span>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="rounded-2xl overflow-hidden p-0 max-w-sm">
                              <img src={`${api.defaults.baseURL}/uploads/${row.image_path}`} alt={row.nome} className="w-full object-cover" />
                            </DialogContent>
                          </Dialog>
                        </td>

                        <td className="px-4 py-3 text-xs text-zinc-400 font-medium whitespace-nowrap">{formatNotificationDate(row.created_at)}</td>

                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{row.provincia}</span>
                            <span className="text-[10px] text-zinc-400 font-medium">{row.municipio}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3"><StatusBadge status={row.estado_conta} /></td>
                        <td className="px-4 py-3"><RoleBadge role={row.role} /></td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button type="button" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                                  <Eye size={11} /> Ver
                                </button>
                              </DialogTrigger>
                              <PrestadoresDetailsDialog profissao={row.profissao} estrelas={row.estrelas} description={row.description} accountBalance={Number(row.carteira?.receita ?? 0)} address={row.provincia} name={row.nome} phone={row.celular} image={row.image_path} />
                            </Dialog>

                            <button type="button" disabled={isSuspending} onClick={() => suspenderCostumer(row.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors disabled:opacity-50">
                              {isSuspending ? <Loader2 size={11} className="animate-spin" /> : <ShieldAlert size={11} />} Suspender
                            </button>

                            {row.estado_conta === "ACTIVA" && (
                              <button type="button" disabled={isDesativando} onClick={() => desativarCostumer(row.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 transition-colors disabled:opacity-50">
                                {isDesativando ? <Loader2 size={11} className="animate-spin" /> : <UserX size={11} />} Desativar
                              </button>
                            )}

                            {(row.estado_conta === "PENDENTE" || row.estado_conta === "DESATIVADA") && (
                              <button type="button" disabled={isAtivando} onClick={() => ativarCostumer(row.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors disabled:opacity-50">
                                {isAtivando ? <Loader2 size={11} className="animate-spin" /> : <UserCheck size={11} />} Activar
                              </button>
                            )}

                            <button type="button" onClick={() => deleteCostumer(row.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20">
                              <Trash2 size={11} /> Eliminar
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
                          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800"><Search size={22} className="opacity-40" /></div>
                          <p className="text-sm font-medium">Nenhum prestador encontrado</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </motion.div>
      </div>
      {costumers && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-10">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl shadow-zinc-900/10 px-3 py-2">
            <Pagination
              onPageChange={handlePagination}
              pageIndex={page}
              perPage={costumers.pagination.perPage}
              totalCount={costumers.pagination.total}
            />
          </div>
        </div>
      )}
    </div>
  );
}