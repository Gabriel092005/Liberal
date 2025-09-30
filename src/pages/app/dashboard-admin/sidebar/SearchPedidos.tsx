import { ChevronDown,MapPin, Phone, Search, Star,Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import photo4 from '@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FlutuantePoint } from "./FluatuantePoint";

export function SearchPedidos() {
  const cards = [
    {
      title: 'Canalizador',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min ',
      status:'urgente',
      prestadoresInteressados:34
    },
      {
      title: 'Canalizador',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min ',
      status:'urgente',
      prestadoresInteressados:34
    },  {
      title: 'Canalizador',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min ',
      status:'urgente',
      prestadoresInteressados:34
    },
      {
      title: 'Canalizador',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min ',
      status:'urgente',
      prestadoresInteressados:34
    },
      {
      title: 'Canalizador',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min ',
      status:'urgente',
      prestadoresInteressados:34
    },

        {
      title: 'Pedreiro',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min',
      status:'médio',
      prestadoresInteressados:34

    },

     
  ];

  return (
    <motion.div
      className="flex h-screen justify-center items-start mt-2"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full max-w-lg relative right-[1.4rem] overflow-hidden border-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Pedidos</CardTitle>
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
                          {card.title}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <div className="flex gap-4">
                            <div className="flex flex-col">
                                   <span className="text-sm font-medium">{card.title}</span>
                                   <span className="text-[0.65rem] text-muted-foreground">{card.description}</span>
                            </div>
                            <div>

                                   <span className="text-[0.65rem] mt-2 text-muted-foreground">{card.date}</span>
                            </div>
                            
                            <div>
                        
                                         <Trash2 size={15} className="text-red-600"/>
                             
                            </div>

                          

                            
                      </div>

                         


                           <div>
                             <span className="text-muted-foreground text-xs font-bold">status : <span className="text-red-500">{card.status}</span></span>
                           </div>
                      
                    </div>
                  </TableCell>
   
                              <div className="flex items-start ml-52">
                                   <span className="absolute top-10 right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
                    {card.prestadoresInteressados}
                </span>
                               </div>

                  <TableCell className="flex items-center gap-2 px-2">
                    <X size={16} className="text-red-400 cursor-pointer" />
                    <div className="flex text-orange-400">
                            <MapPin size={16} className="text-orange-400 cursor-pointer" />
                            <span className="font-bold">Estalagem,Luanda</span>
                    </div>
                    <div>
                     <DropdownMenu>
                             <DropdownMenuTrigger>
                                   <Button variant='outline'>
                                                                             <span className="text-muted-foreground flex text-xs items-center">
                                                                                    Prestadores
                                                                                    <ChevronDown/>
                                                                            </span>

                                   </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent className="h-28">
                                     <TableCell className="flex items-center gap-3 py-2 px-2">
                    <Avatar className="w-10 h-10 ring-2 ring-orange-300 shadow-sm">
                      {card.image ? (
                        <AvatarImage src={card.image} />
                      ) : (
                        <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
                          Gabriel Manuel
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <div className="flex gap-4">
                            <div className="flex flex-col">
                                   <div className="flex items-center gap-8">
                                          <div>
                                             <span className="text-sm font-medium trucante">Gabriel Manuel</span>
                                          </div>
                                          <div>
                                              <FlutuantePoint/>
                                          </div>
                                   </div>
                                   <span className="text-[0.65rem] text-muted-foreground">Canalizador | Pedreiro </span>
                            </div>
                            
                            <div>
                                   <Button variant='outline'>
                                         <Star className="text-orange-300"/>
                                   </Button>
                            </div>

                            
                      </div>
                  
                      
                         <div className="flex">
                             <MapPin size={15} className="text-red-500">
                     </MapPin>

                        <span className="text-muted-foreground text-xs">Cazenga,Mabor</span>
                      </div>
                      <div className="flex">
                        <Phone size={14} className="text-blue-400"></Phone>
                         <span className="text-muted-foreground text-xs">+244 987 737 344 </span>
                      </div>
                    </div>
                    
                  </TableCell>
                  <TableCell lang="relative top">
                   
                  </TableCell>
                                  
                             </DropdownMenuContent>
                     </DropdownMenu>
                    </div>
                    {/* <Button className="h-7">Contactar</Button> */}
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
