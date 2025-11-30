import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  RefreshCw,
  AlertTriangle,
  Star
} from "lucide-react";


// Components UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { Avatar,AvatarImage } from "@/components/ui/avatar";
import { getComments } from "@/api/get-commentario";
import { api } from "@/lib/axios";

// Types

// API Functions (substitua pelas suas funções reais)



export function CommentsList() {
  const [searchTerm] = useState("");
  const [statusFilter] = useState<string>("all");


  const { 
    data: comments, 
    isLoading, 
    isError, 
    error, 
    refetch,
  
  } = useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
    refetchOnWindowFocus: false,
  });

  









  // Filtrar comentários
 

  


  // Loading Skeleton
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  if(!comments){
    return
  }

  // Error State
  if (isError) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar comentários</h3>
          <p className="text-muted-foreground mb-4">
            {error?.message || "Ocorreu um erro ao carregar os comentários."}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full border-0 shadow-sm">
        <CardHeader className="flex  relative right-10 flex-col ">
        <CardTitle>Comentários</CardTitle>
        <CardDescription>Todos os comentários feitos pelos clientes</CardDescription>
        </CardHeader>

        <CardContent className="p-0 items-start justify-start relative right-10">
          <ScrollArea className="h-[600px] px-6 pb-6">
            <AnimatePresence mode="popLayout">
              {comments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum comentário encontrado</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all" 
                      ? "Tente ajustar os filtros de pesquisa." 
                      : "Ainda não há comentários para exibir."}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4 flex flex-col items-start justify-start relative  gap-2">
                  {comments?.map((comment, index) => (
                    <motion.div
                      key={comment.prestador.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                  <Card className=" 
                     group rounded-2xl  border border-border 
                hover:shadow-xl hover:-translate-y-[3px]
                transition-all duration-300 overflow-hidden bg-muted
                  ">
                       <CardContent className="flex flex-col  " >
                          <header>
                              <div className="flex items-center gap-1">
                                  <Avatar>
                                      <AvatarImage src={ `${api.defaults.baseURL}/uploads/${comment.prestador.image_path}`}></AvatarImage>
                                  </Avatar>
                                  <div className="flex flex-col gap-1">
                                    <div  className="text-muted-foreground flex text-xs gap-2">
                                     <span className="text truncate max-w-52 w-16">{comment.prestador.nome}</span>
                                     <span className="text-muted-foreground text-xs">{comment.prestador.provincia}</span> | <span>{comment.prestador.municipio}</span>
                                    </div>
                                        <div className="flex items-center gap-1 mt-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                      <Star 
                                                                        key={i} 
                                                                        size={12} 
                                                                        className={
                                                                          i < (comment.prestador.estrelas || 0) 
                                                                            ? "fill-orange-400 text-orange-400" 
                                                                            : "fill-gray-200 text-gray-200"
                                                                        } 
                                                                      />
                                                                    ))}
                                                                  </div>
                                  </div>
                              </div>  
                          </header>
                          <div className="font-serif">
                            {comment.comentario}
                          </div>
                     </CardContent>
                  </Card>
                     </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>


    </>
  );
}