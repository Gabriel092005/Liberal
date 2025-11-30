import { useEffect, useState } from "react";
import { Briefcase, Phone, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchFavoritos } from "@/api/favoritos";
import { RemoveFavoritos } from "@/api/remover-favoritos";
import { CallButton } from "./callButton";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export function BuscarPrestadores() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // search atual vindo da URL
  const search = searchParams.get("search") || "";

  // estado local do input (iniciado com query param)
  const [searchValue, setSearchValue] = useState<string>(search);

  // debounce para atualizar URL enquanto o usuário digita
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchValue.trim();
      if (trimmed) {
        setSearchParams({ search: trimmed });
      } else {
        // limpa o param quando input vazio
        setSearchParams({});
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchValue, setSearchParams]);

  // garante que se a URL mudar externamente, o input seja atualizado
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  // fetch reativo ao parâmetro 'search'
  const { data: favoritos, isLoading } = useQuery({
    queryKey: ["favoritos", search],
      refetchOnWindowFocus: true,     // Rebusca ao voltar ao foco
  refetchOnReconnect: true,       // Rebusca se a internet voltar
  refetchOnMount: true,           // Rebusca sempre que o componente monta
  staleTime: 0,    
    queryFn: () => FetchFavoritos({ search }),
    // keepPreviousData: true,
  });
  
  // remoção
  const { mutateAsync: DeletarFromFavorites, isPending } = useMutation({
    mutationFn: RemoveFavoritos,
    onSuccess: (_, variables) => {
      // atualiza cache: remove o prestador da lista atual
      queryClient.setQueryData(["favoritos", search], (old: any) => {
        if (!old) return [];
        return old.filter((f: any) => f.prestador.id !== Number(variables.prestadorId));
      });
      toast.success("Prestador removido dos favoritos.");
    },
    onError: () => {
      toast.error("Erro ao remover. Tente novamente.");
    },
  });
  
  async function handleDeleteFromFavorites(prestadorId: string) {
    await DeletarFromFavorites({ prestadorId });
  }
  
  // skeleton enquanto carrega
  if (isLoading) {
    return (
      <motion.div
        className="flex h-screen justify-center fixed left-1 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="w-full max-w-lg border-none bg-10 p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-3 mt-6">
            {[1, 2, 3,4,5,8,9,19].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  }
  

  return (
    <motion.div
      className="flex h-screen justify-center fixed left-[0.1rem] items-start mt-2"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="w-[22rem] max-w-lg overflow-hidden border-none bg-10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Prestadores Favoritos</CardTitle>
          <CardDescription className="text-xs mb-2">
            Aqui você encontra os prestadores favoritos.
          </CardDescription>

          <div className="relative">
            <Input
              placeholder="O que você precisa?"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-zinc-200 dark:bg-black pl-10 w-full max-w-[320px]"
            />
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={20} />
            {/* limpar input (opcional) */}
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label="Limpar pesquisa"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 max-h-[400px] overflow-auto">
          {/* se não existir nenhum favorito (após a busca), mostra mensagem dentro do card */}
          {!favoritos || favoritos.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <p className="text-sm font-medium">Nenhum usuário encontrado.</p>
              <p className="text-xs mt-1">Tente outro termo de busca ou limpe o filtro.</p>
            </div>
          ) : (
            <Table>
              <TableBody>
                {favoritos.map((card) => (
                  <TableRow key={card.id} className="h-14">
                    <TableCell className="flex items-center gap-3 py-2 px-2">
                      <Avatar className="w-10 h-10 ring-2 ring-orange-300 shadow-sm">
                        {card.prestador.image_path ? (
                          <AvatarImage src={`${api.defaults.baseURL}/uploads/${card.prestador.image_path}`} />
                        ) : (
                          <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
                            {card.prestador.nome.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="flex flex-col leading-tight">
                        <span className="text-lg font-medium">{card.prestador.nome}</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Briefcase size={13} /> {card.prestador.profissao}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone size={13} /> {card.prestador.celular}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="flex items-center gap-2 px-2">
                      <CallButton phoneNumber={card.prestador.celular} />
                      <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={() => handleDeleteFromFavorites(String(card.prestador.id))}
                      >
                        {isPending ? "Removendo..." : "Remover"}
                      </Button>
                      <X
                        size={16}
                        className="text-red-400 cursor-pointer"
                        onClick={() => handleDeleteFromFavorites(String(card.prestador.id))}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
