import { GraphicsSales } from "@/api/fetch-graphics";
import { GetCategory } from "@/api/get-categories";
import { RegisterNewProfission } from "@/api/new-profissionts";
import { newPackage } from "@/api/novo-pacote";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { getInialts } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Briefcase,
  CreditCard,
  Layers,
  Loader2,
  TrendingUp
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import z from "zod";
import { NewCategorySheetContent } from "./new-categorySheet";


const packageSchema = z.object({
  title: z.string().min(1),
  preco: z.number().positive(),
  validade: z.string().min(1),
  beneficio1: z.string().min(1, "Obrigatório"), // Removido o .optional()
  beneficio2: z.string().min(1, "Obrigatório"),
});

const profissionSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(1),
});

type PackageFormData = z.infer<typeof packageSchema>;
type ProfissionFormData = z.infer<typeof profissionSchema>;

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
        {label}
      </p>
      <p className="text-lg font-black text-orange-500">
        {Number(payload[0].value).toLocaleString("pt-AO")} Kz
      </p>
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────

function ActionBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-500 hover:text-white border border-zinc-200 dark:border-zinc-700 hover:border-transparent transition-all duration-200 active:scale-[0.97] flex-shrink-0"
    >
      <Icon size={13} />
      <span className="hidden sm:block">{label}</span>
    </button>
  );
}

// ─── New Package Dialog ───────────────────────────────────────────────────────

function NewPackageDialog() {
  const { mutateAsync: createPackage, isPending } = useMutation({
    mutationFn: newPackage,
    onSuccess: () => toast.success("Plano criado com sucesso!"),
    onError: () => toast.error("Erro ao criar plano."),
  });

  const { handleSubmit, register, reset } = useForm<PackageFormData>();

  const onSubmit = async (data: PackageFormData) => {
    await createPackage(data);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionBtn icon={CreditCard} label="Novo Plano" />
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md rounded-3xl p-0 overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-2xl gap-0">
        <div className="bg-zinc-900 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-white font-black text-xl tracking-tighter flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-orange-500">
                <CreditCard size={14} className="text-white" />
              </div>
              Novo Plano
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Crie um novo plano de subscrição para os prestadores
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Nome do Plano
              </Label>
              <Input
                {...register("title")}
                required
                placeholder="Ex: Premium"
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Valor (Kz)
              </Label>
              <Input
                type="number"
                required
                {...register("preco", { valueAsNumber: true })}
                placeholder="Ex: 5000"
                className="h-11 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Duração (dias)
            </Label>
            <Input
              required
              {...register("validade")}
              placeholder="Ex: 30"
              className="h-11 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm"
            />
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-11 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all"
          >
            {isPending ? <Loader2 className="animate-spin" size={16} /> : "Criar Plano"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── New Service Dialog ───────────────────────────────────────────────────────

function NewServiceDialog() {
  const queryClient = useQueryClient();

  const { data: category, isLoading: loadingCategories } = useQuery({
    queryKey: ["category"],
    queryFn: () => GetCategory({ query: "" }),
  });

  const { mutateAsync: createProfission, isPending } = useMutation({
    mutationFn: RegisterNewProfission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      toast.success("Serviço cadastrado com sucesso!");
    },
    onError: () => toast.error("Erro ao cadastrar serviço."),
  });

  const { control, handleSubmit, register, reset } = useForm<ProfissionFormData>();

  const onSubmit = async (data: ProfissionFormData) => {
    await createProfission(data);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionBtn icon={Briefcase} label="Novo Serviço" />
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md rounded-3xl p-0 overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-2xl gap-0">
        <div className="bg-zinc-900 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-white font-black text-xl tracking-tighter flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-orange-500">
                <Briefcase size={14} className="text-white" />
              </div>
              Novo Serviço
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Associe um serviço a uma categoria existente
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Nome do Serviço
            </Label>
            <Input
              {...register("title")}
              required
              placeholder="Ex: Canalizador"
              className="h-11 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Categoria
            </Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-11 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 p-1.5">
                    {loadingCategories ? (
                      <div className="p-2 space-y-2">
                        <Skeleton className="h-8 w-full rounded-xl" />
                        <Skeleton className="h-8 w-full rounded-xl" />
                      </div>
                    ) : (
                      category?.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={String(c.id)}
                          className="rounded-xl py-2.5 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-6 w-6 rounded-lg">
                              <AvatarImage
                                src={`${api.defaults.baseURL}/uploads/${c.image_path}`}
                                className="object-cover"
                              />
                              <AvatarFallback className="rounded-lg bg-orange-100 text-orange-600 text-[9px] font-black">
                                {getInialts(c.titulo)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-sm">{c.titulo}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all"
          >
            {isPending ? <Loader2 className="animate-spin" size={16} /> : "Cadastrar Serviço"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── SellingsCharts ───────────────────────────────────────────────────────────

export function SellingsCharts() {
  const { data: sales, isLoading: loadingSales } = useQuery({
    queryKey: ["sales"],
    queryFn: GraphicsSales,
  });

  // Summary values from sales data
  const totalReceitas = sales?.reduce((acc: number, s: any) => acc + (s.amount ?? 0), 0) ?? 0;
  const melhorMes = sales?.reduce(
    (best: any, s: any) => (!best || s.amount > best.amount ? s : best),
    null
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden"
    >
      {/* ── Card Header ── */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
        <div className="flex items-start justify-between gap-3">
          {/* Title + description */}
          <div className="min-w-0">
            <h3 className="font-black text-base sm:text-lg tracking-tighter text-zinc-900 dark:text-zinc-100 leading-tight">
              Receitas por Mês
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-medium mt-0.5">
              Crescimento mensal e picos de vendas
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <NewPackageDialog />
            <NewServiceDialog />
            <Sheet>
              <SheetTrigger asChild>
                <ActionBtn icon={Layers} label="Categoria" />
              </SheetTrigger>
              <NewCategorySheetContent />
            </Sheet>
          </div>
        </div>

        {/* Mini stats strip */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">
              Total Acumulado
            </p>
            <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 leading-none">
              {totalReceitas.toLocaleString("pt-AO")}
              <span className="text-xs font-bold text-zinc-400 ml-1">Kz</span>
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40">
            <p className="text-[9px] font-black uppercase tracking-widest text-orange-400 mb-1">
              Melhor Mês
            </p>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-orange-500 flex-shrink-0" />
              <p className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400 leading-none truncate">
                {melhorMes?.mounth ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="px-2 sm:px-4 pb-5 sm:pb-6">
        {loadingSales ? (
          <div className="h-[180px] sm:h-[200px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-zinc-400">
              <Loader2 size={20} className="animate-spin text-orange-500" />
              <p className="text-[10px] font-bold uppercase tracking-widest">A carregar...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={190}>
            <LineChart
              data={sales}
              style={{ fontSize: 11 }}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-zinc-100 dark:text-zinc-800"
              />
              <XAxis
                dataKey="mounth"
                tickLine={false}
                axisLine={false}
                dy={12}
                tick={{ fill: "currentColor", className: "text-zinc-400", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                width={56}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", className: "text-zinc-400", fontSize: 10 }}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                }
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "#f97316", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="url(#lineGradient)"
                strokeWidth={2.5}
                dot={{ fill: "#f97316", strokeWidth: 2, r: 3, stroke: "#fff" }}
                activeDot={{ r: 5, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}