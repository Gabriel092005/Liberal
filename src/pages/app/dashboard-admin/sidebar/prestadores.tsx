import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Search, X } from "lucide-react"
import photo4 from "@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg"

export function Prestadores() {
  const cards = [
    {
      name: "Leonel João",
      description: "Eletricista | Canalizador | Pedreiro",
      image: photo4,
      location: "Viana, Luanda",
    },
     {
      name: "Leonel João",
      description: "Eletricista | Canalizador | Pedreiro",
      image: photo4,
      location: "Viana, Luanda",
    },
     {
      name: "Leonel João",
      description: "Eletricista | Canalizador | Pedreiro",
      image: photo4,
      location: "Viana, Luanda",
    },
     {
      name: "Leonel João",
      description: "Eletricista | Canalizador | Pedreiro",
      image: photo4,
      location: "Viana, Luanda",
    },
     {
      name: "Leonel João",
      description: "Eletricista | Canalizador | Pedreiro",
      image: photo4,
      location: "Viana, Luanda",
    },
     {
      name: "Leonel João",
      description: "Eletricista | Canalizador | Pedreiro",
      image: photo4,
      location: "Viana, Luanda",
    },

  ]

  const [query, setQuery] = useState("")

  const filtered = cards.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <motion.div
      className="flex justify-center items-center h-screen p-2"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full relative right-4 -top-14 border-none shadow-xl rounded-2xl overflow flex flex-col">
        {/* Header fixo */}
        <CardHeader className="space-y-2 sticky top-0 bg-white dark:bg-zinc-950 z-10">
          <CardTitle className="text-lg font-bold">
            Prestadores Favoritos
          </CardTitle>
          <CardDescription className="text-xs">
            Aqui você encontra os últimos pedidos feitos
          </CardDescription>

          {/* Search */}
          <div className="relative">
            <Input
              placeholder="O que você precisa?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-zinc-200 dark:bg-black pl-10 w-full rounded-full"
            />
            <Search
              className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400"
              size={18}
            />
          </div>
        </CardHeader>

        {/* Conteúdo rolável */}
        <CardContent className="flex-1 overflow-y-auto p-0">
          <Table>
            <TableBody>
              {filtered.map((card, i) => (
                <TableRow
                  key={i}
                  className="flex items-center justify-between px-3 py-2 hover:bg-muted/40 transition rounded-lg"
                >
                  <TableCell className="flex items-center gap-2 p-0">
                    <Avatar className="w-9 h-9 ring-2 ring-orange-300 shadow-sm">
                      {card.image ? (
                        <AvatarImage src={card.image} />
                      ) : (
                        <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
                          {card.name?.slice(0, 2).toUpperCase() ?? "LS"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">{card.name}</span>
                      <span className="text-[0.65rem] text-muted-foreground">
                        {card.description}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="flex items-center gap-2 p-0">
                    <Button size="sm" className="h-7 text-xs">
                      Contactar
                    </Button>
                    <X
                      size={16}
                      className="text-red-500 cursor-pointer hover:scale-110 transition"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
