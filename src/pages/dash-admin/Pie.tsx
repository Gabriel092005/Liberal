
import { Loader} from "lucide-react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Metrics } from "@/api/get-metrics";






export function ChartPieLabelCustom() {
    const {data:metrics,isLoading:isLoadingMetrics} =useQuery({
    queryKey:['metrics'],
    queryFn:Metrics
  })

  const chartData = [
  { browser: "prestadores Individual", visitors: metrics?.clientesIndividual, color: "#8884d8" },
  { browser: "prestdores Coletivos", visitors: metrics?.prestadoresEmpresa, color: "#82ca9d" },
  { browser: "Cliente Individual", visitors: metrics?.clientesIndividual, color: "#ffc658" },
  { browser: "Cliente Colectivo", visitors: metrics?.clientesEmpresa, color: "#ff8042" },
  { browser: "Crescimento de clientes", visitors: metrics?.crescimento.clientes, color: "#8dd1e1" },
];
  return (
    <Card className="flex flex-col bg-muted  border-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Analises Gerais</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {isLoadingMetrics ? (
          <Loader className="text-orange-400 animate-spin"></Loader>
        ):(
            <PieChart width={300} height={300}>
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ value }) => `${value}`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        )}
      </CardContent>


    </Card>
  );
}
