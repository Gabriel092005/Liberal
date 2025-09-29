import {
  Bell,
  ChevronLeftCircle,
  ChevronRightCircle,
  Hammer,
  House,
  Loader2,
  MapPinIcon,
  Phone,
  Plus,
  Search,
  Settings,
  Workflow,
  Wrench,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import photo1 from "@/assets/WhatsApp Image 2024-06-27 at 22.46.31_45dd20ec.jpg";
import photo4 from "@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg";
import servico1 from "@/assets/IMG-20250928-WA0054.jpg";
import servico2 from "@/assets/IMG-20250928-WA0057.jpg";
import servico3 from "@/assets/IMG-20250928-WA0056.jpg";
import servico4 from "@/assets/IMG-20250928-WA0058.jpg";
import servico5 from "@/assets/IMG-20250928-WA0059.jpg";
import servico6 from "@/assets/IMG-20250928-WA0069.jpg";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function Home() {
  const [query, setQuery] = useState("");
  const cards = [
    {
      name: "Leonel Joao",
      description: "Eletricista | Canalizador | Pedreiro",
      image: photo4,
      Location: "Viana, Luanda",
    },
    {
      name: "Gabriel Cavala",
      description: "Eletricista | Canalizador | Pedreiro",
      image: photo1,
      Location: "Viana, Luanda",
    },
  ];
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % cards.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);

  return (
    <motion.div
      className="flex h-screen bg-background text-foreground"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-col w-full max-w-lg mx-auto p-4 gap-4">
        {/* HEADER */}
        <header>
          <div className="flex items-center justify-between">
            <h1 className="tracking-tight font-bold text-lg sm:text-xl">
              Boas-Vindas, <span className="text-orange-500">Marcos</span>!
            </h1>

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
                  <div className="relative">
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
                      <button className="px-3 py-2 rounded-md hover:bg-muted transition">
                        Eletricista disponível perto de você ⚡
                      </button>
                      <button className="px-3 py-2 rounded-md hover:bg-muted transition">
                        Designer gráfico e web 🌐
                      </button>
                      <button className="px-3 py-2 rounded-md hover:bg-muted transition">
                        Serviços de limpeza 🧹
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { src: servico3, label: "Madeira e Ofícios", to: "/madeira" },
                        { src: servico1, label: "Eletricidade", to: "/electricidade" },
                        { src: servico5, label: "Doméstica", to: "/domestica" },
                        { src: servico4, label: "Beleza e Moda" },
                        { src: servico6, label: "Tecnologia e Design" },
                        { src: servico2, label: "Docente" },
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
                </DialogContent>
              </Dialog>

              {/* NOTIFICAÇÕES */}
              <Button className="relative rounded-full h-10 w-10 flex items-center justify-center bg-muted">
                <Bell className="h-5 w-5 text-orange-400" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
                  8
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* CATEGORIAS */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-around">
            {[
              { icon: Wrench, color: "text-blue-400", bg: "from-blue-100 to-blue-50", label: "Assistência Técnica" },
              { icon: Hammer, color: "text-orange-400", bg: "from-orange-100 to-orange-50", label: "Reformas & Reparos" },
              { icon: House, color: "text-violet-400", bg: "from-violet-100 to-violet-50", label: "Serviços Domésticos" },
            ].map((c, i) => (
              <div className="flex flex-col items-center" key={i}>
                <Button
                  variant="outline"
                  className={`p-4 w-20 h-20 rounded-xl shadow-md border-0 bg-gradient-to-br ${c.bg} hover:scale-105 transition-transform`}
                >
                  <c.icon className={c.color} size={30} />
                </Button>
                <span className="text-xs mt-2 font-medium">{c.label}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Profissionais em Destaque
            </span>
            <Link to="/config" className="hover:rotate-90 transition-transform">
              <Settings size={18} />
            </Link>
          </div>
        </section>

        {/* CARDS PROFISSIONAIS */}
        <section className="flex flex-col items-center gap-3">
          <div className="relative w-80 h-48 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <Card className="relative w-full h-48 rounded-2xl shadow-xl overflow-hidden border border-orange-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-white to-orange-50 dark:from-zinc-900 dark:to-black opacity-90" />
                  <div className="absolute inset-0 backdrop-blur-sm" />

                  <CardContent className="relative z-10 h-full p-4 flex flex-col justify-between">
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
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPinIcon size={14} className="text-orange-500" />
                        {cards[index].Location}
                      </div>
                    </header>
                    <div className="flex justify-end">
                      <Button className="flex gap-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:opacity-90 text-xs">
                        <Phone size={14} />
                        Contactar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-4">
            <ChevronLeftCircle
              onClick={prev}
              className="cursor-pointer text-muted-foreground hover:text-orange-500"
            />
            <ChevronRightCircle
              onClick={next}
              className="cursor-pointer text-muted-foreground hover:text-orange-500"
            />
          </div>
        </section>

        {/* ÚLTIMOS PEDIDOS */}
        <section>
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
        </section>
      </div>
    </motion.div>
  );
}
