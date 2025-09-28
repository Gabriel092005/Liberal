import { Bell,  ChevronLeftCircle, ChevronRightCircle, Hammer,  House, Loader2, MapPinIcon, Phone, Plus, Search,   Settings,   Star,      Workflow,   Wrench, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
import servico1 from '@/assets/IMG-20250928-WA0054.jpg'
import servico2 from '@/assets/IMG-20250928-WA0057.jpg'
import servico3 from '@/assets/IMG-20250928-WA0056.jpg'
import servico4 from '@/assets/IMG-20250928-WA0058.jpg'
import servico5 from '@/assets/IMG-20250928-WA0059.jpg'
import servico6 from '@/assets/IMG-20250928-WA0069.jpg'


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell,  TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LocationDemo from "./location-demo";


export function Home() {
  
  const [query, setQuery] = useState("")
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
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % cards.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  return (
    <motion.div
      className="flex h-screen"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="lg:flex lg:flex-col lg:flex-1 lg:ml-40 lg:p-4 flex flex-col gap-2 ">
          <header>
              <div className="flex flex-col gap-3">
<div className="flex items-center justify-between mt-3">
 
      <h1 className="text-muted-foreground tracking-tighter font-bold text-xl">
        Boas-Vindas, Marcos!
      </h1>

      <div className="relative flex gap-2">
    <Dialog>
      <DialogTrigger>
        <Button
          variant="default"
          className="relative rounded-full h-10 w-10 flex items-center justify-center"
        >
          <Plus />
        </Button>
      </DialogTrigger>

    <DialogContent
      className="
        flex flex-col justify-center
        h-full 
        max-w-none rounded-none 
        bg-white dark:bg-zinc-950 
        p-6 overflow-y-auto
        data-[state=open]:animate-in 
        data-[state=closed]:animate-out

        sm:h-auto sm:max-w-lg sm:rounded-lg
      "
    >
      {/* Input */}
      <div className="relative mb-6">
        <Input
          placeholder="O que você precisa?"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // controla o texto
          className="bg-zinc-200 dark:bg-zinc-900 pl-10 w-full"
        />
        <Search
          className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400"
          size={20}
        />
      </div>

      {query ? (
        // === Sugestões quando o usuário digita ===
        <div className="flex flex-col gap-3">
          <p className="text-gray-500 text-sm">Sugestões:</p>
          <button className="text-left px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Eletricista disponível perto de você ⚡
          </button>
          <button className="text-left px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Designer gráfico e web 🌐
          </button>
          <button className="text-left px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Serviços de limpeza 🧹
          </button>
        </div>
      ) : (
        // === Cards visíveis inicialmente ===
        <div className="flex flex-col gap-4 justify-center relative left-5">
          <div className="flex gap-4">
           <Link to='/madeira'>
              <div className="relative group cursor-pointer">
              <img
                className="h-36 w-36 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                src={servico3}
                alt="Madeira e Oficios"
              />
              <span className="absolute bottom-2 left-2 text-white text-sm font-semibold bg-black/60 px-2 py-1 rounded-md">
                Madeira e Ofícios
              </span>
            </div>

           </Link>
           <Link to='/electricidade'>
             <div className="relative group cursor-pointer">
              <img
                className="h-36 w-36 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                src={servico1}
                alt="Eletricidade & Manutenção"
              />
              <span className="absolute bottom-2 left-2 text-white text-sm font-semibold bg-black/60 px-2 py-1 rounded-md">
                Eletricidade & Manutenção
              </span>
            </div>
           </Link>
          </div>

          <div className="flex gap-4">
           <Link to='/domestica'>
               <div className="relative group cursor-pointer">
              <img
                className="h-36 w-36 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                src={servico5}
                alt="Doméstica"
              />
              <span className="absolute bottom-2 left-2 text-white text-sm font-semibold bg-black/60 px-2 py-1 rounded-md">
                Doméstica
              </span>
            </div>
           </Link>

            <div className="relative group cursor-pointer">
              <img
                className="h-36 w-36 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                src={servico4}
                alt="Beleza e Moda"
              />
              <span className="absolute bottom-2 left-2 text-white text-sm font-semibold bg-black/60 px-2 py-1 rounded-md">
                Beleza e Moda
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative group cursor-pointer">
              <img
                className="h-36 w-36 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                src={servico6}
                alt="Tecnologia e Design"
              />
              <span className="absolute bottom-2 left-2 text-white text-sm font-semibold bg-black/60 px-2 py-1 rounded-md">
                Tecnologia e Design
              </span>
            </div>

            <div className="relative group cursor-pointer">
              <img
                className="h-36 w-36 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                src={servico2}
                alt="Docente"
              />
              <span className="absolute bottom-2 left-2 text-white text-sm font-semibold bg-black/60 px-2 py-1 rounded-md">
                Docente
              </span>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
</Dialog>

           <Button
          variant="outline"
          className="relative bg-muted rounded-full h-10 w-10 flex items-center justify-center"
        >
          <Bell className="h-5 w-5 text-orange-400" />
          {/* Badge */}
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
            8
          </span>
        </Button>

        
      </div>
    </div>
  
  <Dialog>
      <DialogTrigger>
         <div className="relative">
                     <Input placeholder="Oque voce precisa?" className="bg-zinc-200 dark:bg-black pl-10 w-80"></Input>
                     <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={20}/>
                   </div>
      </DialogTrigger>
      <DialogContent className="h-full">
         <div className="relative">
                     <Input placeholder="Pesquisar..." className="bg-zinc-200 dark:bg-black pl-10 w-80"></Input>
                     <Search className="absolute top-[1rem] -translate-y-1/2 left-3 text-gray-400" size={20}/>
                   </div>
                   <div className="flex justify-center text-xs text-muted-foreground">
                    Nenhuma Pesquisa Recente ainda..
                   </div>
         
      </DialogContent>
  </Dialog>
                  
              </div>
          </header>
          <section>
              <div className="flex justify-center items-center gap-2">
                <div className="flex flex-col items-center">
                     <Button variant='outline' className="p-2 w-20">
                     <Wrench className="text-blue-300" size={10}/>
                     </Button>
                     <span className="text-xs text-muted-foreground text-[0.6rem] ">Assistência Técnica</span>
                </div>
                    <div className="flex flex-col items-center">
                     <Button variant='outline' className="p-2 w-20">
                     <Hammer className="text-orange-400" size={10}/>
                     </Button>
                     <span className="text-[0.6rem] text-muted-foreground ">Reformas & Reparos</span>
                </div>

                   <div className="flex flex-col items-center">
                     <Button variant='outline' className="p-2 w-20">
                     <House className="text-violet-400" size={10}/>
                     </Button>
                     <span className="text-[0.6rem] text-muted-foreground ">Serviços Domésticos</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 w-full">
               <div className="flex justify-between items-center gap-1">
                     <span className="text font-bold">Profissionais em Destaques</span>
                    <Link to='/config'>
                     <Settings size={16}/>
                    </Link>
               </div>
      <div className="relative w-80 h-40 mt-1 p-10 overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
  <motion.div
    key={index}
    initial={{ x: 200, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -200, opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="absolute w-full"
  >
    {/* Renderiza apenas o card atual */}
    <Card className="flex items-center justify-center flex-1 w-full h-44 dark:bg-black rounded-xl border border-orange-200 shadow-md bg-white">
      <CardContent className="w-full p-4">
        <header className="border-b border-orange-100 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-orange-300 shadow-sm">
              {cards[index].image ? (
                <AvatarImage src={cards[index].image} />
              ) : (
                <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                  {cards[index].name?.slice(0, 2).toUpperCase() ?? "LS"}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm text-muted-foreground">
                {cards[index].name}
              </span>

              <div className="flex items-center gap-1 text-muted-foreground">
                <Workflow size={12} className="text-orange-500" />
                <span className="text-[0.7rem] truncate max-w-[160px]">
                  {cards[index].description}
                </span>
              </div>

              <div className="flex mt-1 items-center">
                <Star size={12} className="text-orange-500 fill-orange-500" />
                <Star size={12} className="text-orange-500 fill-orange-500" />
                <Star size={12} className="text-orange-500 fill-orange-500" />
                <span className="text-muted-foreground text-xs"> 5+</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-3 text-gray-600">
            <MapPinIcon size={14} className="text-orange-500" />
            <span className="text-xs">{cards[index].Location}</span>
          </div>
        </header>
        <div className="mt-2">
          <Button>
            <Phone />
            Contactar
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
</AnimatePresence>

      </div>
              

      <div className="flex gap-2">
<ChevronLeftCircle onClick={prev} size={14}></ChevronLeftCircle>
<ChevronRightCircle onClick={next} size={14}></ChevronRightCircle>
      </div>
    </div>
    <div className="flex mt-2 justify-center">
      <Card className="overflow-auto">
          <CardHeader>
               <CardTitle className="text-xs">Útimos Pedidos</CardTitle>
               <CardDescription className="text-xs">Aqui você encontra os ultimos pedidos feitos.</CardDescription>
          </CardHeader>
          <CardContent className="flex m-o p-o">
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
        <Loader2 className="text-orange-400 animate-spin" size={13} />
        <span className="text-[0.65rem] text-muted-foreground">1min</span>
      </TableCell>
    </TableRow>

    <TableRow className="flex items-center h-10">
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
          <span className="text-[0.65rem] text-muted-foreground">Doméstica | Engomadeira</span>
        </div>
      </TableCell>

      <TableCell className="flex items-center gap-1 px-2">
        <X className="text-red-400" size={13} />
        <span className="text-[0.65rem] text-muted-foreground">1min</span>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>


          </CardContent>
      </Card>
    </div>

          </section>
<LocationDemo/>
      </div>
    </motion.div>
  );
}
