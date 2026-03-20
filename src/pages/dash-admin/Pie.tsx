import { Metrics } from "@/api/get-metrics";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// ─── Config ───────────────────────────────────────────────────────────────────

const CHART_COLORS = [
  "#f97316", // orange-500
  "#fb923c", // orange-400
  "#fdba74", // orange-300
  "#3b82f6", // blue-500
  "#22c55e", // green-500
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
        {item.name}
      </p>
      <p className="text-lg font-black" style={{ color: item.payload.color }}>
        {item.value}
      </p>
    </div>
  );
}

// ─── Legend Row ───────────────────────────────────────────────────────────────

function LegendRow({
  label,
  value,
  color,
  total,
  index,
}: {
  label: string;
  value: number;
  color: string;
  total: number;
  index: number;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-3"
    >
      {/* Dot */}
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />

      {/* Label + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 truncate pr-2">
            {label}
          </span>
          <span
            className="text-[10px] font-black flex-shrink-0"
            style={{ color }}
          >
            {value}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: index * 0.06 + 0.2, duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      {/* Percentage */}
      <span className="text-[10px] font-black text-zinc-400 flex-shrink-0 w-8 text-right">
        {pct}%
      </span>
    </motion.div>
  );
}

// ─── ChartPieLabelCustom ──────────────────────────────────────────────────────

export function ChartPieLabelCustom() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: Metrics,
  });

  const chartData = metrics
    ? [
        {
          name: "Prestadores Individuais",
          value: metrics.prestadoresIndividual ?? 0,
          color: CHART_COLORS[0],
        },
        {
          name: "Prestadores Colectivos",
          value: metrics.prestadoresEmpresa ?? 0,
          color: CHART_COLORS[1],
        },
        {
          name: "Clientes Individuais",
          value: metrics.clientesIndividual ?? 0,
          color: CHART_COLORS[2],
        },
        {
          name: "Clientes Colectivos",
          value: metrics.clientesEmpresa ?? 0,
          color: CHART_COLORS[3],
        },
        {
          name: "Crescimento Clientes",
          value: metrics.crescimento?.clientes ?? 0,
          color: CHART_COLORS[4],
        },
      ]
    : [];

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="w-full h-full rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex-shrink-0">
        <h3 className="font-black text-base sm:text-lg tracking-tighter text-zinc-900 dark:text-zinc-100 leading-tight">
          Análises Gerais
        </h3>
        <p className="text-[11px] sm:text-xs text-zinc-400 font-medium mt-0.5">
          Distribuição por tipo de utilizador
        </p>
      </div>

      {/* Body */}
      {isLoading || !metrics ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <Loader2 size={20} className="animate-spin text-orange-500" />
            <p className="text-[10px] font-black uppercase tracking-widest">
              A carregar...
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 px-4 sm:px-5 pb-5 sm:pb-6 flex-1">

          {/* Pie */}
          <div className="flex-shrink-0 relative">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-none">
                {total}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full space-y-3 min-w-0">
            {chartData.map((item, i) => (
              <LegendRow
                key={item.name}
                label={item.name}
                value={item.value}
                color={item.color}
                total={total}
                index={i}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}