import { useState } from "react"
import { DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { File, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const profissoes = [
  "Cabeleireiro",
  "Manicure & Pedicure",
  "Maquiadora",
  "Costureira & Estilista",
  "Jardineiro",
  "Electricista",
  "Canalizador",
  "Pintor",
  "Empregada Doméstica",
  "Segurança Privado",
  "Técnico de Informática",
  "Programador",
  "Garson",
  "Pedreiro",

]

export function SearchServices() {
  const [query, setQuery] = useState("")
  const [foco, setFoco] = useState(false)

  const resultados = profissoes.filter((prof) =>
    prof.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <DialogContent className="h-full">
      <header className="relative">
        {/* Campo de busca */}
     <div className="relative w-full">
  <Search
    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
    size={18}
  />
  <Input
    placeholder="O que você precisa?"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onFocus={() => setFoco(true)}
    onBlur={() => setTimeout(() => setFoco(false), 150)}
    className="pl-9 dark:bg-muted"
  />
</div>


        {/* Sugestões */}
        {foco && query && (
          <div className="absolute mt-2 w-full bg-background border rounded-lg shadow-md z-50 max-h-48 overflow-y-auto">
            {resultados.length > 0 ? (
              resultados.map((prof, i) => (
                <div
                  key={i}
                  onMouseDown={() => setQuery(prof)} // seleciona sem fechar imediatamente
                  className={cn(
                    "px-3 py-2 cursor-pointer text-sm hover:bg-muted",
                    query.toLowerCase() === prof.toLowerCase()
                      ? "bg-muted"
                      : ""
                  )}
                >
                  {prof}
                </div>
              ))
            ) : (
              <div className="px-16 py-2 text-sm flex flex-col  text-muted-foreground">
                <File className="relative left-20"/>
                  <span>  Nenhum resultado encontrado</span>
              </div>
            )}
          </div>
        )}
      </header>
    </DialogContent>
  )
}
