import { useEffect, useState } from "react"
import { DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ArrowRight, Briefcase, CheckCircle,MapPin, Search, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { FetchByProfission } from "@/api/searchByProfission"
import { useForm } from "react-hook-form"
import z from "zod"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

export function SearchServices() {
  const [query, setQuery] = useState("")
  const [foco, setFoco] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const { data: usersSearched, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => FetchByProfission({ query }),
    enabled: !!query.trim(), // só busca quando há texto
  })

  const searchUsersByProfission = z.object({
    query: z.string(),
  })
  type SearchUsersByProfission = z.infer<typeof searchUsersByProfission>

  const { register } = useForm<SearchUsersByProfission>()

  const { onChange, ...rest } = register("query")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    setQuery(query)

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (query) newParams.set("query", query)
      else newParams.delete("query")
      return newParams
    })
  }

  useEffect(() => {
    const query = searchParams.get("query") || ""
    setQuery(query)
  }, [searchParams])

  

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
            onFocus={() => setFoco(true)}
            {...rest}
            onChange={(event) => {
              onChange(event)
              handleInputChange(event)
            }}
            className="pl-9 dark:bg-muted"
            />
           
        </div>

      

        {/* Lista de resultados */}
        {foco && query && (
       <div
  className="absolute mt-2 w-full bg-background border rounded-lg shadow-md z-50
  max-h-[37rem] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent
  transition-all duration-300 ease-in-out"
>
  {isLoading ? (
    // 💫 Skeleton enquanto carrega
    <div className="space-y-2 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2 border-b last:border-none animate-pulse"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/5 rounded" />
            <Skeleton className="h-3 w-1/4 rounded" />
            <Skeleton className="h-3 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  ) : usersSearched?.Usuario?.length ? (
    usersSearched.Usuario.map((user) => (
      <div
        key={user.id}
        onMouseDown={() => setQuery(user.profissao)}
        className={cn(
          "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted border-b last:border-none"
        )}
      > 
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={`http://localhost:3333/uploads/${user.image_path}`|| "/default-avatar.png"}
            alt={user.nome}
          />
          <AvatarFallback>{user.nome[0]}</AvatarFallback>
          
        </Avatar>


        

        <div className="flex-1 ">
    <div className="flex items-center gap-1.5">
  <h4 className="text-sm font-medium">{user.nome}</h4>

  {user.nome && (
    <div
      className="relative flex items-center justify-center"
      title="Usuário verificado"
    >
      {/* Fundo gradiente circular */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-500 blur-[2px] opacity-90"></div>

      {/* Ícone com brilho */}
      <CheckCircle
        size={15}
        className="relative text-white drop-shadow-[0_0_3px_rgba(59,130,246,0.8)] transition-transform duration-200 hover:scale-110"
      />
    </div>
  )}
</div>

          <p className="text-xs text-muted-foreground">
            {user.profissao}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <MapPin size={12} />
            <span>{user.municipio || "Localização não informada"}</span>
          </div>
          {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone size={12} />
            <span>{user.celular || "Sem número"}</span>
          </div> */}
        
        </div>

          <div>
            <Drawer>
                <DrawerTrigger>
                      <Button variant='outline'>
                        <ArrowRight></ArrowRight>
                      </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[40rem]">
                     <div className="flex justify-center items-center">
                        <div className="flex flex-col">
                      {/* <Avatar className="h-28 w-28">
               <AvatarImage
            src={`http://localhost:3333/uploads/${user.image_path}`|| "/default-avatar.png"}
            alt={user.nome}
          />
          <AvatarFallback>{user.nome[0]}</AvatarFallback>
        </Avatar> */}
        <img className="h-[31rem] rounded-sm" src={`http://localhost:3333/uploads/${user.image_path}`|| "/default-avatar.png"} alt="" />
        <span className="text-2xl font-bold tracking-tight">{user.nome}</span>
        <div className="flex items-center">
                     <Briefcase size={24} className="text-muted-foreground"></Briefcase>
                  <span className="text-xl  text-muted-foreground tracking-tight">{user.profissao}
                  </span>
        </div>
        <div className="flex">
          <MapPin className="text-muted-foreground" size={24}></MapPin>
          <span className="text-muted-foreground">{user.provincia}, {user.municipio}</span>
        </div>
           <div className="flex items-center gap-1 mt-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          size={12} 
                                          className={
                                            i < (user.estrelas || 0) 
                                              ? "fill-orange-400 text-orange-400" 
                                              : "fill-gray-200 text-gray-200"
                                          } 
                                        />
                                      ))}
                                    </div>

                        </div>
                     </div>
                </DrawerContent>
            </Drawer>
            
          </div>
      </div>
    ))
  ) : (
    <div className="px-16 py-2 text-sm flex flex-col items-center text-muted-foreground">
      <span className="text-nowrap">Nenhum resultado encontrado</span>
    </div>
  )}
</div>
        )}
      </header>
    </DialogContent>
  )
}
