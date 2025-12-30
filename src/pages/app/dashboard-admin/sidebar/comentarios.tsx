import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  RefreshCw,
  AlertTriangle,
  Star,
  MapPin,
  Quote
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getComments } from "@/api/get-commentario";
import { api } from "@/lib/axios";

export function CommentsList() {
  const { 
    data: comments, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-48 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50/50 dark:bg-red-950/10 rounded-[2rem] border border-red-100 dark:border-red-900/20">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="font-bold text-lg text-red-900 dark:text-red-400">Ops! Algo deu errado</h3>
        <p className="text-sm text-red-600/80 mb-6 max-w-xs">{error?.message}</p>
        <Button onClick={() => refetch()} variant="outline" className="rounded-full border-red-200">
          <RefreshCw className="w-4 h-4 mr-2" /> Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="px-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-xl">
            <MessageSquare className="text-orange-600" size={20} />
          </div>
          <div>
            <CardTitle className="text-2xl font-black">Feedbacks</CardTitle>
            <CardDescription className="text-zinc-500 font-medium">
              O que dizem sobre nossos profissionais
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <ScrollArea className="h-[650px] pr-4">
          <AnimatePresence mode="popLayout">
            {!comments || comments.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                   <Quote size={32} />
                </div>
                <p className="text-zinc-500 font-medium">Nenhum depoimento ainda.</p>
              </motion.div>
            ) : (
              <div className="grid gap-6">
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="relative group rounded-[2rem] border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500">
                      <CardContent className="p-6">
                        {/* Aspas decorativas */}
                        <Quote className="absolute top-6 right-6 text-orange-500/10 group-hover:text-orange-500/20 transition-colors" size={48} />
                        
                        <div className="flex flex-col gap-4">
                          <header className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="h-14 w-14 border-2 border-white dark:border-zinc-800 shadow-md">
                                <AvatarImage src={`${api.defaults.baseURL}/uploads/${comment.prestador.image_path}`} />
                                <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
                                  {comment.prestador.nome.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                {comment.prestador.nome}
                              </h4>
                              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                <span className="flex items-center gap-1 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                  <MapPin size={10} className="text-orange-500" />
                                  {comment.prestador.provincia}
                                </span>
                                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                <span className="italic">{comment.prestador.municipio}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < (comment.prestador.estrelas || 0) 
                                      ? "fill-orange-400 text-orange-400" 
                                      : "fill-zinc-200 dark:fill-zinc-800 text-zinc-200 dark:text-zinc-800"}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-black text-orange-500/80 uppercase tracking-widest">Verificado</span>
                            </div>
                          </header>

                          <div className="relative">
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base font-medium italic">
                              "{comment.comentario}"
                            </p>
                          </div>
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
  );
}