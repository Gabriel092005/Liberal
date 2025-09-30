import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import photo1 from '@/assets/WhatsApp Image 2024-06-27 at 22.46.31_45dd20ec.jpg'
import photo4 from '@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg'

export function BuscarPrestadores() {
  const cards = [
    {
      name: 'Leonel Joao',
      description: 'Eletricista | Canalizador | Pedreiro',
      image: photo4,
      location: 'Viana, Luanda'
    },

       {
      name: 'Leonel Joao',
      description: 'Eletricista | Canalizador | Pedreiro',
      image: photo4,
      location: 'Viana, Luanda'
    },
    {
      name: 'Gabriel Cavala',
      description: 'Eletricista | Canalizador | Pedreiro',
      image: photo1,
      location: 'Viana, Luanda'
    },
       {
      name: 'Leonel Joao',
      description: 'Eletricista | Canalizador | Pedreiro',
      image: photo4,
      location: 'Viana, Luanda'
    },
  ];

  return (
    <motion.div
      className="flex h-screen justify-center items-start mt-2"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full max-w-lg overflow-hidden border-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Prestadores</CardTitle>
          <CardDescription className="text-xs mb-2">
            Aqui você encontra os últimos pedidos feitos.
          </CardDescription>

          <div className="relative">
            <Input placeholder="O que você precisa?" className="bg-zinc-200 dark:bg-black pl-10 w-full max-w-[320px]" />
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={20} />
          </div>
        </CardHeader>

        <CardContent className="p-0 max-h-[400px] overflow-auto">
          <Table>
            <TableBody>
              {cards.map((card, i) => (
                <TableRow key={i} className="h-14">
                  <TableCell className="flex items-center gap-3 py-2 px-2">
                    <Avatar className="w-10 h-10 ring-2 ring-orange-300 shadow-sm">
                      {card.image ? (
                        <AvatarImage src={card.image} />
                      ) : (
                        <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
                          {card.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">{card.name}</span>
                      <span className="text-[0.65rem] text-muted-foreground">{card.description}</span>
                    </div>
                  </TableCell>

                  <TableCell className="flex items-center gap-2 px-2">
                    <Button className="h-7">Contactar</Button>
                    <X size={16} className="text-red-400 cursor-pointer" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
