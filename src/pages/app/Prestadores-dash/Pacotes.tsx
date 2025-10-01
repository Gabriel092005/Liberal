import { motion } from "framer-motion";
import { Check, Timer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function Package() {
  const planos = [
    {
      nome: "Start",
      preco: "1000,00 AOA",
      validade: "5 Dias",
      beneficios: ["Aceitar 1 pedido", "Suporte básico"],
      delay: 0.3,
    },
        {
      nome: "Start",
      preco: "1000,00 AOA",
      validade: "5 Dias",
      beneficios: ["Aceitar 1 pedido", "Suporte básico"],
      delay: 0.3,
    },
        {
      nome: "Start",
      preco: "1000,00 AOA",
      validade: "5 Dias",
      beneficios: ["Aceitar 1 pedido", "Suporte básico"],
      delay: 0.3,
    },
        {
      nome: "Start",
      preco: "1000,00 AOA",
      validade: "5 Dias",
      beneficios: ["Aceitar 1 pedido", "Suporte básico"],
      delay: 0.3,
    },
        {
      nome: "Start",
      preco: "1000,00 AOA",
      validade: "5 Dias",
      beneficios: ["Aceitar 1 pedido", "Suporte básico"],
      delay: 0.3,
    },
        {
      nome: "Start",
      preco: "1000,00 AOA",
      validade: "5 Dias",
      beneficios: ["Aceitar 1 pedido", "Suporte básico"],
      delay: 0.3,
    },
        {
      nome: "Start",
      preco: "1000,00 AOA",
      validade: "5 Dias",
      beneficios: ["Aceitar 1 pedido", "Suporte básico"],
      delay: 0.3,
    },
        {
      nome: "Start",
      preco: "1000,00 AOA",
      validade: "5 Dias",
      beneficios: ["Aceitar 1 pedido", "Suporte básico"],
      delay: 0.3,
    },
    {
      nome: "Plus",
      preco: "5000,00 AOA",
      validade: "15 Dias",
      beneficios: ["Aceitar 4 pedidos", "Suporte premium", "Badge de verificado"],
      delay: 0.5,
    },
    {
      nome: "Premium",
      preco: "10.000,00 AOA",
      validade: "30 Dias",
      beneficios: [
        "Pedidos ilimitados",
        "Suporte 24/7",
        "Badge de verificado",
        "Maior destaque no app",
      ],
      delay: 0.7,
    },
  ];

  return (
    <div className="flex flex-col w-full bg-background text-foreground min-h-screen">
      {/* HEADER */}
      <header className="w-full bg-white dark:bg-zinc-950 relative -left-9 py-3 shadow-sm">
        <div className="flex flex-col ">
          <h1 className="text-lg font-bold">Pacotes</h1>
          <p className="text-muted-foreground text-[0.7rem]">
            Escolha o plano ideal para você 🚀
          </p>
        </div>
      </header>

      {/* TABELA MAIS COMPACTA PARA MOBILE */}
      <main className="flex-1 px-2 py-4 flex justify-center relative right-11">
        <div className="w-full max-w-md overflow-x-auto rounded-lg shadow-sm">
          <Table className="min-w-[350px] text-center text-[0.65rem]">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-orange-400 to-orange-600 h-8">
                <TableHead className="text-white font-semibold py-1 px-1">
                  Plano
                </TableHead>
                <TableHead className="text-white font-semibold py-1 px-1">
                  Preço
                </TableHead>
                <TableHead className="text-white font-semibold py-1 px-1">
                  Validade
                </TableHead>
                <TableHead className="text-white font-semibold py-1 px-1">
                  Benefícios
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {planos.map((plano, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: plano.delay, duration: 0.3 }}
                  className="border-b hover:bg-muted/30 h-10"
                >
                  <TableCell className="font-semibold px-1 py-1">
                    {plano.nome}
                  </TableCell>
                  <TableCell className="font-bold text-yellow-600 px-1 py-1">
                    {plano.preco}
                  </TableCell>
                  <TableCell className="flex justify-center items-center gap-1 text-[0.6rem] px-1 py-1">
                    <Timer className="text-muted-foreground" size={10} />{" "}
                    {plano.validade}
                  </TableCell>
                  <TableCell className="px-1 py-1">
                    <ul className="flex flex-col gap-0.5 text-left">
                      {plano.beneficios.map((beneficio, j) => (
                        <li
                          key={j}
                          className="text-[0.6rem] text-muted-foreground flex items-center gap-1"
                        >
                          <Check className="text-green-400" size={10} />{" "}
                          {beneficio}
                        </li>
                      ))}
                    </ul>
                      <Button className="p-1 h-7">Assinar</Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
