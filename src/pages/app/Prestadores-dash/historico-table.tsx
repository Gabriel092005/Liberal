import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { pt } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"

interface HistoricoItem {
  carteiraId: number
  valor: number
  catergoy: "INCOME" | "OUTCOME"
  created_at: string
}

interface HistoricoTableProps {
  data?: { data: HistoricoItem[] }
  isLoading?: boolean
}

export function HistoricoTable({ data, isLoading }: HistoricoTableProps) {
  // Exibe loading skeletons
  if (isLoading) {
    return (
      <TableBody>
        {[1, 2, 3].map((n) => (
          <TableRow key={n}>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-24 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }

  // Exibe os dados
  if (Array.isArray(data?.data) && data.data.length > 0) {
    return (
      <TableBody>
        {data.data.map((i) => (
          <TableRow
            key={i.carteiraId}
            className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
          >
            <TableCell className="text-gray-700 dark:text-gray-300 text-nowrap">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(i.created_at), {
                  locale: pt,
                  addSuffix: true,
                })}
              </span>
            </TableCell>

            <TableCell className="text-nowrap">
              {i.catergoy === "OUTCOME" && (
                <div className="flex items-center gap-1 text-red-500 font-semibold">
                  <TrendingDown size={14} />
                  <span>Débito</span>
                </div>
              )}
              {i.catergoy === "INCOME" && (
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
        ))}
      </TableBody>
    )
  }

  // Exibe mensagem quando não há dados
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={3} className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum movimento encontrado.
          </p>
        </TableCell>
      </TableRow>
    </TableBody>
  )
}
