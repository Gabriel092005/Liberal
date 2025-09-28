;import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  useState } from "react";
import photo1 from '@/assets/WhatsApp Image 2024-06-27 at 22.46.31_45dd20ec.jpg'
// import photo2 from '@/assets/WhatsApp Image 2024-06-27 at 22.21.29_0203fa98.jpg'
// import photo3 from '@/assets/WhatsApp Image 2024-06-27 at 22.46.31_45dd20ec.jpg'
import photo4 from '@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg'
// import photo5 from '@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg'
// import photo6 from '@/assets/WhatsApp Image 2024-06-27 at 23.12.15_36445ef3.jpg'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Search, X } from "lucide-react";


export function Pedidos() {

    const cards = [
      {
      name:'Leonel Joao',
      description:'Eletricista | Canalizador | Pedreiro',
      image:photo4,
      Location:'Viana,Luanda'
    },

      {
      name:'Gabriel Cavala',
      description:'Eletricista | Canalizador | Pedreiro',
      image:photo1,
      Location:'Viana,Luanda'
    },
  ];
  const [index, _] = useState(0);


  return (
    <motion.div
      className="flex h-screen"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
    <div className="flex mt-2 justify-center">
      <Card className="overflow-auto border-none">
          <CardHeader>
               <CardTitle className="text-xl font-bold">Prestadores Favoritos</CardTitle>
               <CardDescription className="text-xs">Aqui você encontra os ultimos pedidos feitos.</CardDescription>

                 <div className="relative">
                    
                     <Input placeholder="Oque voce precisa?" className="bg-zinc-200 dark:bg-black pl-10 w-80"></Input>
                     <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={20}/>
                   </div>
          </CardHeader>
          <CardContent className="flex m-o p-o overflow-auto">
          <Table>
  <TableBody>
    <TableRow className="flex items-center h-10"> {/* altura reduzida */}
      <TableCell className="flex items-center gap-2 py-1 px-2">
        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
          {cards[index].image ? (
            <AvatarImage src={cards[index].image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm">exemplo</span>
          <span className="text-[0.65rem] text-muted-foreground">Cozinheiro | BarMan</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
       <Button className=" h-7">Contactar</Button>
          <X size={14}/>
      </TableCell>
    </TableRow>


     <TableRow className="flex items-center h-10"> {/* altura reduzida */}
      <TableCell className="flex items-center gap-2 py-1 px-2">
        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
          {cards[index].image ? (
            <AvatarImage src={cards[index].image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm">exemplo</span>
          <span className="text-[0.65rem] text-muted-foreground">Cozinheiro | BarMan</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
       <Button className=" h-7">Contactar</Button>
          <X size={14}/>
      </TableCell>
    </TableRow>

     <TableRow className="flex items-center h-10"> {/* altura reduzida */}
      <TableCell className="flex items-center gap-2 py-1 px-2">
        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
          {cards[index].image ? (
            <AvatarImage src={cards[index].image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm">exemplo</span>
          <span className="text-[0.65rem] text-muted-foreground">Cozinheiro | BarMan</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
       <Button className=" h-7">Contactar</Button>
          <X size={14}/>
      </TableCell>
    </TableRow> <TableRow className="flex items-center h-10"> {/* altura reduzida */}
      <TableCell className="flex items-center gap-2 py-1 px-2">
        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
          {cards[index].image ? (
            <AvatarImage src={cards[index].image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm">exemplo</span>
          <span className="text-[0.65rem] text-muted-foreground">Cozinheiro | BarMan</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
       <Button className=" h-7">Contactar</Button>
          <X size={14}/>
      </TableCell>
    </TableRow> <TableRow className="flex items-center h-10"> {/* altura reduzida */}
      <TableCell className="flex items-center gap-2 py-1 px-2">
        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
          {cards[index].image ? (
            <AvatarImage src={cards[index].image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm">exemplo</span>
          <span className="text-[0.65rem] text-muted-foreground">Cozinheiro | BarMan</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
       <Button className=" h-7">Contactar</Button>
          <X size={14}/>
      </TableCell>
    </TableRow> <TableRow className="flex items-center h-10"> {/* altura reduzida */}
      <TableCell className="flex items-center gap-2 py-1 px-2">
        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
          {cards[index].image ? (
            <AvatarImage src={cards[index].image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm">exemplo</span>
          <span className="text-[0.65rem] text-muted-foreground">Cozinheiro | BarMan</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
       <Button className=" h-7">Contactar</Button>
          <X size={14}/>
      </TableCell>
    </TableRow> <TableRow className="flex items-center h-10"> {/* altura reduzida */}
      <TableCell className="flex items-center gap-2 py-1 px-2">
        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
          {cards[index].image ? (
            <AvatarImage src={cards[index].image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm">exemplo</span>
          <span className="text-[0.65rem] text-muted-foreground">Cozinheiro | BarMan</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
       <Button className=" h-7">Contactar</Button>
          <X size={14}/>
      </TableCell>
    </TableRow> <TableRow className="flex items-center h-10"> {/* altura reduzida */}
      <TableCell className="flex items-center gap-2 py-1 px-2">
        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
          {cards[index].image ? (
            <AvatarImage src={cards[index].image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm">exemplo</span>
          <span className="text-[0.65rem] text-muted-foreground">Cozinheiro | BarMan</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
       <Button className=" h-7">Contactar</Button>
          <X size={14}/>
      </TableCell>
    </TableRow> <TableRow className="flex items-center h-10"> {/* altura reduzida */}
      <TableCell className="flex items-center gap-2 py-1 px-2">
        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
          {cards[index].image ? (
            <AvatarImage src={cards[index].image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm">exemplo</span>
          <span className="text-[0.65rem] text-muted-foreground">Cozinheiro | BarMan</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
       <Button className=" h-7">Contactar</Button>
          <X size={14}/>
      </TableCell>
    </TableRow> <TableRow className="flex items-center h-10"> {/* altura reduzida */}
      <TableCell className="flex items-center gap-2 py-1 px-2">
        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
          {cards[index].image ? (
            <AvatarImage src={cards[index].image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm">exemplo</span>
          <span className="text-[0.65rem] text-muted-foreground">Cozinheiro | BarMan</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
       <Button className=" h-7">Contactar</Button>
          <X size={14}/>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
          </CardContent>
      </Card>
    </div>

 
 
    </motion.div>
  );
}
