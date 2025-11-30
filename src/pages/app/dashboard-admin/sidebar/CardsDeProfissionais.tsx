import { Link } from "react-router-dom";
import { MaisProfissao } from "./Categorias/MaisProfissao";
import { DialogContent } from "@/components/ui/dialog";

import servico1 from "@/assets/IMG-20250928-WA0054.jpg";
import servico2 from "@/assets/IMG-20250928-WA0057.jpg";
import servico3 from "@/assets/IMG-20250928-WA0056.jpg";
import servico4 from "@/assets/IMG-20250928-WA0058.jpg";
import servico5 from "@/assets/IMG-20250928-WA0059.jpg";
import servico6 from "@/assets/IMG-20250928-WA0069.jpg";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

  const [query, setQuery] = useState("");





export function CardDeProfissionais(){
    return(
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
                            <div className="grid grid-cols-2 gap-4 mt-5">
                              {[
                                { src: servico3, label: "Madeira e Ofícios", to: "/madeira" },
                                { src: servico1, label: "Eletricidade", to: "/electricidade" },
                                { src: servico5, label: "Doméstica", to: "/domestica" },
                                { src: servico4, label: "Beleza e Moda" , to:"/moda" },
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
        <Link to='/mais'>
        <MaisProfissao/>
        </Link>
                        </DialogContent>
    )
}



