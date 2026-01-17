import { useEffect, useState } from "react";
import { Briefcase,  Search, X, HeartOff, Star, MapPin, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchFavoritos } from "@/api/favoritos";
import { RemoveFavoritos } from "@/api/remover-favoritos";
import { CallButton } from "./callButton";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BuscarPrestadores() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState<string>(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams(searchValue.trim() ? { search: searchValue.trim() } : {});
    }, 350);
    return () => clearTimeout(handler);
  }, [searchValue, setSearchParams]);

  const { data: favoritos, isLoading } = useQuery({
    queryKey: ["favoritos", search],
    queryFn: () => FetchFavoritos({ search }),
  });

  const { mutateAsync: DeletarFromFavorites } = useMutation({
    mutationFn: RemoveFavoritos,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["favoritos", search], (old: any) => {
        return old?.filter((f: any) => f.prestador.id !== Number(variables.prestadorId));
      });
      toast.success("Removido dos favoritos");
    },
  });

  if (isLoading) return <FavoriteSkeleton />;

  return (
    <div className="min-h-screen w-full flex justify-center items-start p-4 md:p-8 bg-slate-50 dark:bg-[#080808]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <header className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight dark:text-white">Meus Favoritos</h1>
            </div>

            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-500 transition-colors" size={18} />
              <Input
                placeholder="Filtrar por nome ou profissão..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-12 pl-12 pr-10 rounded-2xl border-none bg-white dark:bg-zinc-900 shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500/50 transition-all"
              />
              {searchValue && (
                <button onClick={() => setSearchValue("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X size={16} className="text-muted-foreground hover:text-red-500" />
                </button>
              )}
            </div>
          </div>
        </header>

        <ScrollArea className="h-[calc(100vh-250px)] pr-4 -mr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {favoritos?.map((card: any, index: number) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group border-none bg-white dark:bg-zinc-900/50 hover:bg-orange-500/[0.02] dark:hover:bg-orange-500/[0.02] rounded-[2rem] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 border border-transparent hover:border-orange-500/20 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16 rounded-2xl shadow-lg ring-4 ring-white dark:ring-zinc-800">
                            <AvatarImage src={`${api.defaults.baseURL}/uploads/${card.prestador.image_path}`} className="object-cover" />
                            <AvatarFallback className="bg-orange-100 text-orange-600 font-bold"><User size={24} /></AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-4 border-white dark:border-zinc-900" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg truncate group-hover:text-orange-500 transition-colors">{card.prestador.nome}</h3>
                            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                              <Star size={10} className="fill-current" />
                              <span className="text-[10px] font-black">4.9</span>
                            </div>
                          </div>

                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Briefcase size={14} className="text-orange-500" />
                              <span className="text-xs font-bold uppercase tracking-tight">{card.prestador.profissao}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin size={14} />
                              <span className="text-xs">{card.prestador.municipio || "Angola"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <div className="flex gap-2">
                          <CallButton phoneNumber={card.prestador.celular} />
                          <Button variant="secondary" className="rounded-xl h-10 w-10 p-0 hover:bg-red-50 hover:text-red-500 transition-colors" onClick={() => DeletarFromFavorites({ prestadorId: String(card.prestador.id) })}>
                            <HeartOff size={18} />
                          </Button>
                        </div>
                         <Link to={`/users/${card.prestador.id}/profile`} className="mt-6">
                             <Button className="rounded-xl bg-zinc-900 dark:bg-white dark:text-black hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-all font-bold text-xs h-10 px-6">
                          Ver Perfil
                        </Button>
                         </Link>
                      
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {favoritos?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-muted-foreground">
                <Search size={32} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg">Nenhum resultado para "{searchValue}"</p>
                <p className="text-sm text-muted-foreground">Tente buscar por outra profissão ou nome.</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </motion.div>
    </div>
  );
}

function FavoriteSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}