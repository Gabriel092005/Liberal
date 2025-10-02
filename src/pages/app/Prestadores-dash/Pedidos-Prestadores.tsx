import { Handshake, InfoIcon, MapPin, MoveDownLeft,MoveUpRight, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import photo4 from "@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ServicesDialogDetails } from "./ServicesDialogDetails";
import { useState } from "react";


export function PrestadoresPedidos() {
  const cards = [
    {
      title: "Canalizador",
      description: "Troca de cano rompido.",
      image: photo4,
      location: "Viana, Luanda",
      date: "1min",
      status: "urgente",
      prestadoresInteressados: 34,
      accepted: true, // aceito ✅
    },
    {
      title: "Pedreiro",
      description: "Reparação de parede.",
      image: photo4,
      location: "Estalagem, Luanda",
      date: "5min",
      status: "médio",
      prestadoresInteressados: 12,
      accepted: false, // não aceito ❌
    },
    {
      title: "Electricista",
      description: "Troca de disjuntor queimado.",
      image: photo4,
      location: "Talatona, Luanda",
      date: "10min",
      status: "baixo",
      prestadoresInteressados: 7,
      accepted: true, // aceito ✅
    },
  ];

  // estado para controlar a filtragem
  const [filter, setFilter] = useState<"all" | "accepted">("all");

  // lista filtrada
  const filteredCards =
    filter === "all" ? cards : cards.filter((c) => c.accepted);

  return (
    <motion.div
      className="flex h-screen justify-center items-start mt-2"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full max-w-lg relative right-[2.5rem] overflow-hidden border-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Pedidos</CardTitle>
          <CardDescription className="text-xs mb-2">
            Aqui você encontra os últimos pedidos feitos pelos clientes.
          </CardDescription>

          {/* Barra de busca */}
          <div className="relative mb-3">
            <Input
              placeholder="O que você precisa?"
              className="bg-zinc-200 dark:bg-black pl-10 w-full max-w-[320px]"
            />
            <Search
              className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400"
              size={20}
            />
          </div>

          {/* Botões de filtro */}
          <div className="flex gap-3">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
               Todos Pedidos  <MoveUpRight/>
            </Button>
            <Button
              variant={filter === "accepted" ? "default" : "outline"}
              onClick={() => setFilter("accepted")}
            >
              Pedidos Aceites
              <MoveDownLeft/>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 max-h-[400px] overflow-auto">
          <Table>
            <TableBody>
              {filteredCards.map((card, i) => (
                <TableRow
                  key={i}
                  className="h-14 cursor-pointer hover:bg-muted/40"
                >
                  <TableCell className="flex items-center gap-3 py-2 px-2">
                    <Avatar className="w-10 h-10 ring-2 ring-orange-300 shadow-sm">
                      {card.image ? (
                        <AvatarImage src={card.image} />
                      ) : (
                        <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
                          {card.title}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex flex-col leading-tight">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {card.title}
                          </span>
                          <span className="text-[0.65rem] text-muted-foreground">
                            {card.description}
                          </span>
                        </div>
                        <div className=" relative left-32 flex items-baseline">
                       
                               <Dialog>
                          <DialogTrigger asChild>
                            <div>
                              <InfoIcon
                                size={15}
                                className="dark:text-white text-blue-400 cursor-pointer"
                              />
                            </div>
                          </DialogTrigger>
                          <ServicesDialogDetails />
                        </Dialog>
                        </div>
                   
                      </div>

                      <div>
                        <span className="text-muted-foreground text-xs font-bold">
                          status :{" "}
                          <span
                            className={
                              card.status === "urgente"
                                ? "text-red-500"
                                : card.status === "médio"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }
                          >
                            {card.status}
                          </span>
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <div className="flex items-start ml-52">
                
                  </div>

                  <TableCell className="flex items-center gap-2 px-2">
                    <X size={16} className="text-red-400 cursor-pointer" />
                    <div className="flex text-orange-400">
                      <MapPin
                        size={16}
                        className="text-orange-400 cursor-pointer"
                      />
                      <span className="font-bold">{card.location}</span>
                    </div>
                    <div>
                        <Dialog>
                              <DialogTrigger asChild>
                                  <Button variant="outline" className="ml-8">
                        <Handshake className="text-muted-foreground" />
                        <span className="flex text-xs text-muted-foreground relative items-center">
                          Negociar
                        </span>
                      </Button>

                              </DialogTrigger>
                         
                                
                                {/* <MessagesHOME/> */}
                            
                        </Dialog>
                    
                    </div>
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
