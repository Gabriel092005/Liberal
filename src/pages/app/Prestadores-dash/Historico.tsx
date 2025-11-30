import { HistoricoRecarga } from "@/api/get-historico-recargas";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ArrowRight,
  TrendingDown,
  TrendingUp,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface HistoricoProps {
  data?: HistoricoRecarga[];
  isLoading?: boolean;
  isError?: boolean;
}

export function Historico({ data, isLoading, isError }: HistoricoProps) {
  const renderRows = () => {
    // 💠 Skeletons bonitos e realistas
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow
          key={index}
          className="animate-pulse hover:bg-transparent transition"
        >
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-3 w-8 rounded-md" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2 justify-start">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-4 w-20 ml-auto rounded-md" />
          </TableCell>
        </TableRow>
      ));
    }

    // ⚠️ Erro
    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="py-10 text-center">
            <div className="flex flex-col items-center gap-2 text-red-500">
              <AlertTriangle size={22} />
              <p className="text-sm text-red-600 dark:text-red-400">
                Erro ao carregar histórico.
              </p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    // 🕳️ Nenhum dado
    if (!data || data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="py-10 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Nenhum movimento encontrado.
            </p>
          </TableCell>
        </TableRow>
      );
    }

    // ✅ Dados reais
    return data.map((i) => (
      <TableRow
        key={i.id}
        className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
      >
        <TableCell className="text-gray-700 dark:text-gray-300 text-nowrap">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(i.created_at), { locale: pt })}
          </span>
        </TableCell>

        <TableCell className="text-nowrap">
          {i.catergoy === "OUTCOME" ? (
            <div className="flex items-center gap-1 text-red-500 font-semibold">
              <TrendingDown size={14} />
              <span>Débito</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-500 font-semibold">
              <TrendingUp size={14} />
              <span>Crédito</span>
            </div>
          )}
        </TableCell>

        <TableCell className="text-right text-nowrap font-semibold">
          {i.catergoy === "OUTCOME" ? (
            <span className="text-red-500">
              -{Number(i.valor).toLocaleString("pt-AO")} Kz
            </span>
          ) : (
            <span className="text-green-500">
              +{Number(i.valor).toLocaleString("pt-AO")} Kz
            </span>
          )}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="mb-10 bg-white w-full overflow-hidden dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="text-[0.9rem] font-semibold text-gray-800 dark:text-gray-100">
          Histórico de Transações
        </h2>
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-600 text-sm font-medium transition-colors">
              Ver todos
              <ArrowRight size={14} />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:w-[480px] p-0 bg-white dark:bg-zinc-950 shadow-lg border-l dark:border-zinc-800 overflow-hidden"
          >
            <div className="p-4 border-b dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm z-10">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Histórico de Movimentos
              </h2>
              <SheetClose asChild>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Fechar"
                >
                  <X size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
              </SheetClose>
            </div>

            {/* Conteúdo Scrollável */}
            <ScrollArea className="h-[85vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50 dark:bg-zinc-900/80 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead className="text-gray-600 dark:text-gray-300 font-semibold text-nowrap">
                      Realizado há
                    </TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-300 font-semibold text-nowrap">
                      Categoria
                    </TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-300 font-semibold text-right text-nowrap">
                      Quantia
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderRows()}</TableBody>
              </Table>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Tabela principal resumida */}
      <div className="max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        <Table>
          <TableHeader className="sticky top-0 bg-gray-50 dark:bg-zinc-800/80 backdrop-blur-sm z-10">
            <TableRow>
              <TableHead className="text-gray-600 text-nowrap dark:text-gray-300 font-semibold">
                Realizado Há
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300 font-semibold">
                Categoria
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300 font-semibold text-right">
                Quantia
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </div>

      {/* Loader global opcional */}
      {isLoading && (
        <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400 gap-2">
          <Loader2 className="animate-spin" size={18} />
          <span>Carregando histórico...</span>
        </div>
      )}
    </div>
  );
}
