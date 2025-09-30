import {
  Bell,
  ChevronRightCircle,

  Hammer,
  House,
  Linkedin,
  Mail,
  // Loader2,
  MapPinIcon,
  Phone,
  Plus,
  Search,
  Settings,
  Star,
  User,
  Workflow,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import photo1 from "@/assets/WhatsApp Image 2024-06-27 at 22.46.31_45dd20ec.jpg";
import photo4 from "@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg";
import servico1 from "@/assets/IMG-20250928-WA0054.jpg";
import servico2 from "@/assets/IMG-20250928-WA0057.jpg";
import servico3 from "@/assets/IMG-20250928-WA0056.jpg";
import servico4 from "@/assets/IMG-20250928-WA0058.jpg";
import servico5 from "@/assets/IMG-20250928-WA0059.jpg";
import servico6 from "@/assets/IMG-20250928-WA0069.jpg";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NotificationMenu } from "./Notification/Notification-Content";
import { SearchServices } from "./Search";
import { MaisProfissao } from "./Categorias/MaisProfissao";
import { PrestadoreProfile } from "./PrestadorProfile";

export function Home() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const navigate = useNavigate()

  
  useEffect(()=>{
    const seen = localStorage.getItem('app_onboarding_seen_v1')
    if(!seen){
       navigate('/sign-up')
    }

  },[navigate])

  const cards = [
    {
      name: "Leonel Joao",
      description: "Eletricista | Canalizador | Pedreiro",
      image: photo4,
      Location: "Viana, Luanda",
      phoe:+244766345454,
      mail:'gabriel@gmail.com'
    },
    {
      name: "Gabriel Cavala",
      description: "Eletricista | Canalizador | Pedreiro",
      image: photo1,
      Location: "Viana, Luanda",
      phoe:+244766345454,
       mail:'gabriel@gmail.com'


    },
  ];

  const next = () => setIndex((prev) => (prev + 1) % cards.length);
  // const prev = () =>
  //   setIndex((prev) => (prev - 1 + cards.length) % cards.length);

  return (
    <div className=" flex flex-col h-screen w-full right-1 fixed overflow-hidden bg-background text-foreground">
      {/* CONTEÚDO */}
      <motion.div
        className="flex flex-col flex-1 px-4 py-4 gap-4 items-center justify-center pb-20"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* HEADER */} 
        <header className="w-full flex justify-center flex-col items-center gap-44">
          <div className="flex items-center gap-11 justify-between">
              <div>
                 <h1 className="tracking-tight font-bold text-lg sm:text-xl">
              Boas-Vindas, Marcos!
            </h1>
              </div>

            <div className="flex gap-2">
              {/* BOTÃO DE CRIAR */}
              <Dialog>
                <DialogTrigger>
                  <Button className="rounded-full h-10 w-10 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:opacity-90">
                    <Plus />
                  </Button>
                </DialogTrigger>

                <DialogContent className="flex flex-col gap-4 h-full sm:h-auto sm:max-w-lg rounded-xl p-6 bg-background shadow-lg">
                  {/* Input pesquisa */}
                  <div className="relative top-5">
                    <Input
                      placeholder="O que você precisa?"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search
                      className="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground"
                      size={18}
                    />
                  </div>

                  {query ? (
                    <div className="flex flex-col gap-2 text-sm">
                      <p className="text-muted-foreground">Sugestões:</p>
                    <Link className="flex items-center justify-center"  to='/electricidade'> 
                         <button  className="px-3 py-2 rounded-md hover:bg-muted transition">
                        Electricidade & Mecânica⚡
                         </button>
                    </Link>
                        <Link className="flex items-center justify-center"  to='/madeira'> 
                      <button className="px-3 py-2 rounded-md hover:bg-muted transition">
                        Oficícios 🌐
                      </button>
                      </Link>
                          <Link className="flex items-center justify-center"  to='/moda'> 
                      <button className="px-3 py-2 rounded-md hover:bg-muted transition">
                        Cabelereiro &  Moda🧹
                      </button>
                        </Link>
                          <Link className="flex items-center justify-center"  to='/electricidade'> 
                      <button className="px-3 py-2 rounded-md hover:bg-muted transition">
                        Mecânico
                      </button>
                       </Link>
                          <Link className="flex items-center justify-center"  to='/electricidade'> 
                          <button className="px-3 py-2 rounded-md hover:bg-muted transition">
                             Serviços de Frio e Climatização
                          </button>
                         </Link>

                          <Link className="flex items-center justify-center"  to='/domestica'> 
                           <button className="px-3 py-2 rounded-md hover:bg-muted transition">
                            Serviços domesticos
                          </button>
                            </Link>
                      <Link className="flex items-center justify-center"  to='/mais'> 
                       <button className="px-3 py-2 rounded-md hover:bg-muted transition">
                         Serviços  Juridicos
                      </button>
                        </Link>
                      
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 mt-5">
                      {[
                        { src: servico3, label: "Madeira e Ofícios", to: "/madeira" },
                        { src: servico1, label: "Eletricidade", to: "/electricidade" },
                        { src: servico5, label: "Doméstica", to: "/domestica" },
                        { src: servico4, label: "Beleza e Moda" , to:"/moda" },
                        { src: servico6, label: "Tecnologia e Design", to:'/tecnologia' },
                        { src: servico2, label: "Docente" , to:'/ensino' },
                      ].map((s, i) => (
                        <Link to={s.to ?? "#"} key={i}>
                          <div className="relative group cursor-pointer">
                            <img
                              src={s.src}
                              className="h-32 w-full object-cover rounded-lg shadow-md group-hover:scale-105 transition"
                            />
                            <span className="absolute bottom-2 left-2 text-white text-xs font-semibold bg-black/60 px-2 py-1 rounded-md">
                              {s.label}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
<Link to='/mais'>
<MaisProfissao/>
</Link>
<MaisProfissao/>
                </DialogContent>
              </Dialog>

              {/* NOTIFICAÇÕES */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button className="relative rounded-full h-10 w-10 flex items-center justify-center bg-transparent">
                <Bell className="h-5 w-5 text-orange-400" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
                  8
                </span>
              </Button>
                </DropdownMenuTrigger>
                <NotificationMenu/>
              </DropdownMenu>
            
            </div>
          </div>

  
               
                 
        </header>
       
                   <Dialog>
                    <DialogTrigger>
                      <div className="flex w-80">
                       <Input
                      placeholder="O que você precisa?"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-8 dark:bg-muted"
                    />
                    <Search
                      className="absolute top-[5.8rem]  -translate-y-1/2 left-9 text-muted-foreground"
                      size={18}
                    />
                   </div>
                    </DialogTrigger>
                    <SearchServices/>
                   </Dialog>
            

        {/* CATEGORIAS */}
        <section className="w-full flex flex-col gap-6 items-center justify-center">
           <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              CATEGORIAS POPULARES
            </span>
          <div className="flex justify-around w-full gap-3">
            {[
              { icon: Wrench, color: "text-blue-400", bg: "from-blue-100 to-blue-50", label: "Assistência Técnica" ,to:'/electricidade' },
              { icon: Hammer, color: "text-orange-400", bg: "from-orange-100 to-orange-50", label: "Reformas & Reparos",to:'/madeira'  },
              { icon: House, color: "text-violet-400", bg: "from-violet-100 to-violet-50", label: "Serviços Domésticos" ,to:'/domestica' },
            ].map((c, i) => (
              <div className="flex flex-col items-center" key={i}>
               <Link to={c.to}>
                 <Button
                  variant="outline"
                  className={`p-4 w-20 h-20 rounded-xl shadow-md border-0 bg-gradient-to-br ${c.bg} hover:scale-105 transition-transform`}
                >
                  <c.icon className={c.color} size={30} />
                </Button>
               </Link>
                <span className="text-xs mt-2 font-medium">{c.label}</span>
              </div>
            ))}
          </div>

         
        </section>

        {/* CARDS PROFISSIONAIS */}
        <section className="flex flex-col items-center gap-3 flex-1 relative bottom-120 justify-center">
           <div className="flex justify-between items-center w-full">
            <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Profissionais em Destaque
            </span>
            <Link to="/config" className="hover:rotate-90 transition-transform">
              <Settings size={18} />
            </Link>
          </div>
          <div className="relative w-80 h-48 gap-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <Card className=" sticky w-full h-40 rounded-2xl left-5  shadow-xl overflow-hidden border border-orange-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-white to-orange-50 dark:from-zinc-900 dark:to-black opacity-90" />
                  <div className="absolute inset-0 backdrop-blur-sm" />

                  <CardContent className="relative z-10 h-full p-4 flex  flex-col justify-between">
                    <header>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-orange-400 shadow-md">
                          {cards[index].image ? (
                            <AvatarImage src={cards[index].image} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-tr from-orange-400 to-pink-500 text-white font-bold">
                              {cards[index].name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                   <p className="font-bold text-sm">{cards[index].name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Workflow size={12} className="text-orange-500" />
                            <span className="truncate max-w-[140px]">
                              {cards[index].description}
                            </span>

                            
                          </div>

                                                   <div className="flex items-center gap-1 mt-1">
  <Star size={14} className="fill-orange-400 text-orange-400" />
  <Star size={14} className="fill-orange-400 text-orange-400" />
  <Star size={14} className="fill-orange-400 text-orange-400" />
  <Star size={14} className="fill-orange-400 text-orange-400" />
  <Star size={14} className="fill-orange-400 text-orange-400" />
</div>
        
                        </div>
                        <div>
                       <Button>
                           <Linkedin className="text-blue"/>
                       </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPinIcon size={14} className="text-orange-500" />
                        {cards[index].Location}
                      </div>

                        <div className="flex items-center">
                          <Mail size={14}  className="text-orange-500"/>
                           <span className="truncate max-w-[140px] text-muted-foreground text-xs">
                              +{cards[index].mail}
                            </span>
                        </div>

                         <div className="flex items-center">
                          <Phone size={14}  className="text-orange-500"/>
                           <span className="truncate max-w-[140px]">
                              +{cards[index].phoe}
                            </span>
                        </div>
                    </header>
                    <div className="flex justify-end gap-2 sticky bottom-5">
                 
                    <Dialog>
                        <DialogTrigger>
                              <Button className="flex gap-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:opacity-90 text-xs">
                        <User></User>
                         ver perfil
                      </Button>
                        </DialogTrigger>
                        <PrestadoreProfile/>
                    </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
        
          </div>

          <div className="flex gap-1 relative bottom-36">
                      <ChevronRightCircle
              onClick={next}
              className="cursor-pointer fixed left-[21.1rem] text-muted-foreground hover:text-orange-500"
            />

             {/* <ChevronLeftCircle
              onClick={prev}
              className="cursor-pointer d text-muted-foreground hover:text-orange-500"
            /> */}
           
      
          </div>

            <section className="relative bottom-3 ">
      </section>
        </section>
    
        {/* ÚLTIMOS PEDIDOS */}
        {/* <section className="w-full">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-sm">Últimos Pedidos</CardTitle>
              <CardDescription className="text-xs">
                Aqui você encontra os últimos pedidos feitos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {[
                    { role: "Cozinheiro | Barman", status: "loading" },
                    { role: "Doméstica | Engomadeira", status: "error" },
                  ].map((p, i) => (
                    <TableRow key={i} className="flex items-center h-10">
                      <TableCell className="flex items-center gap-2 py-1">
                        <Avatar className="w-7 h-7 ring-2 ring-orange-300 shadow-sm">
                          <AvatarImage src={cards[index].image} />
                        </Avatar>
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs font-medium">Exemplo</span>
                          <span className="text-[0.65rem] text-muted-foreground">
                            {p.role}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        {p.status === "loading" ? (
                          <Loader2
                            className="text-orange-400 animate-spin"
                            size={12}
                          />
                        ) : (
                          <X className="text-red-400" size={12} />
                        )}
                        <span className="text-[0.65rem] text-muted-foreground">
                          1min
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section> */}
      </motion.div>

      {/* NAV BOTTOM FIXA */}

    </div>
  );
}
