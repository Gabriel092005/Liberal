
import { FetchPostsVitrineAll, VitrinePost } from "@/api/fetch-all-vitrine-data";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  Heart, MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Verified
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Vitrine() {
  const [activeComments, setActiveComments] = useState<number | null>(null);

  const { data: vitrine, isLoading } = useQuery({
    queryKey: ["v"],
    queryFn: FetchPostsVitrineAll,
  });

  async function handleShare(post: VitrinePost) {
    const shareData = {
      title: post.titulo,
      text: post.description || "Confira esta publicação na Vitrine!",
      url: `${window.location.origin}/posts/${post.id}`, // Ajuste conforme sua rota
    };
  
    try {
      // Verifica se o navegador suporta o compartilhamento nativo
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copia o link se não houver suporte nativo
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copiado para a área de transferência!");
      }
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
    }
  }

  // 1. LOGICA DE CURTIR
  const { mutate: handleToggleLike } = useMutation({
    mutationFn: (postId: number) => api.post(`/vitrine/${postId}/like`, {}),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["v"] });
      const previousData = queryClient.getQueryData<VitrinePost[]>(["v"]);

      queryClient.setQueryData(["v"], (old: VitrinePost[] | undefined) =>
        old?.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                _count: {
                  ...post._count,
                  likes: post.isLiked ? post._count.likes - 1 : post._count.likes + 1,
                },
              }
            : post
        )
      );
      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["v"], context?.previousData);
      toast.error("Erro ao processar curtida");
    },
  });

  // 2. LOGICA DE COMENTAR
  const { mutate: handleSendComment } = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      console.log("🚀 Enviando para o servidor:", { postId, content });
      return api.post(`/vitrine/${postId}/comment`, { content });
    },
    onSuccess: () => {
      console.log("✅ Comentário enviado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["v"] });
      toast.success("Comentário enviado");
    },
    onError: (error) => {
      console.error("❌ Erro na requisição:", error);
      toast.error("Erro ao enviar comentário");
    },
  });

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="flex flex-col h-screen bg-slate-100 lg:mt-24 dark:bg-black antialiased">
      <ScrollArea className="flex-1 w-full">
        <div className="max-w-[1200px] mx-auto flex gap-6 px-0 sm:px-4 py-4">
          
          {/* ASIDE LEFT - PERFIL */}
          {/* <aside className="hidden lg:flex flex-col w-[280px] shrink-0 sticky top-4 h-fit space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div>
                  <p className="font-bold text-sm">Meu Perfil</p>
                  <p className="text-xs text-zinc-500">Postagens e Atividades</p>
                </div>
              </div>
              <Button className="w-full justify-start gap-2 hover:bg-orange-50 hover:text-orange-600 transition-colors" variant="ghost">
                <TrendingUp size={18} /> Em Alta
              </Button>
            </div>
          </aside> */}

          {/* MAIN FEED */}
          <main className="flex-1 max-w-[650px] mx-auto w-full space-y-4 pb-20">
            <AnimatePresence mode="popLayout">
              {vitrine?.map((item) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-zinc-900 sm:rounded-xl border-y sm:border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between p-3 sm:px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full p-[2px]">
                      <div className="bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {item.image_path ? (
                      <img
                        src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                        alt={item.titulo}
                        className="w-full h-auto rounded-full
                         object-contain max-h-[500px]"
                      />
                    ) : (
                      <div className="py-10 opacity-20"><Share2 size={40} /></div>
                    )}
                  </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="text-sm font-bold truncate max-w-[150px]">{item.titulo}</h3>
                          <Verified size={12} className="text-blue-500 fill-current" />
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                          <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ptBR })}</span>
                          <Globe size={10} />
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-zinc-400">
                      <MoreHorizontal size={20} />
                    </Button>
                  </div>

                  {/* CONTEUDO */}
                  {item.description && (
                    <div className="px-4 pb-3">
                      <p className="text-[14px] text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{item.description}</p>
                    </div>
                  )}

                  {/* IMAGEM PRINCIPAL */}
                  <div className="bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {item.image_path ? (
                      <img
                        src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                        alt={item.titulo}
                        className="w-full h-auto object-contain max-h-[500px]"
                      />
                    ) : (
                      <div className="py-10 opacity-20"><Share2 size={40} /></div>
                    )}
                  </div>

                  {/* BARRA DE STATUS (CURTIDAS E COMENTARIOS) */}
                  <div className="px-4 py-2.5 flex justify-between items-center text-[12px] text-zinc-500 border-b border-zinc-50 dark:border-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        <div className="bg-orange-500 rounded-full p-1 ring-2 ring-white dark:ring-zinc-900 z-10">
                          <Heart size={10} className="text-white fill-current"/>
                        </div>
                        {/* Mock de avatares para quem curtiu */}
                        <div className="h-5 w-5 rounded-full bg-zinc-300 ring-2 ring-white dark:ring-zinc-900" />
                        <div className="h-5 w-5 rounded-full bg-zinc-400 ring-2 ring-white dark:ring-zinc-900" />
                      </div>
                      <span className="font-semibold">{item._count.likes} curtidas</span>
                    </div>
                    <button 
                      onClick={() => setActiveComments(activeComments === item.id ? null : item.id)}
                      className="hover:underline font-medium"
                    >
                      {item._count.comments} comentários
                    </button>
                  </div>

                  {/* BOTÕES DE INTERAÇÃO */}
                  <div className="flex p-1 border-b border-zinc-50 dark:border-zinc-800/50">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleToggleLike(item.id)}
                      className={`flex-1 gap-2 h-10 transition-colors ${item.isLiked ? 'text-red-500' : 'text-zinc-600'}`}
                    >
                      <Heart size={20} className={item.isLiked ? "fill-current" : ""} />
                      <span className="text-xs font-bold uppercase tracking-tight">Amei</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setActiveComments(activeComments === item.id ? null : item.id)}
                      className="flex-1 gap-2 h-10 text-zinc-600"
                    >
                      <MessageCircle size={20} />
                      <span className="text-xs font-bold uppercase tracking-tight">Comentar</span>
                    </Button>
                    <Button 
  variant="ghost" 
  onClick={() => handleShare(item)}
  className="flex-1 gap-2 h-10 text-zinc-600 hover:text-orange-600 transition-colors"
>
  <Share2 size={20} />
  <span className="text-xs font-bold uppercase tracking-tight">compartlhar</span>
</Button>
                  </div>

                  {/* LISTA DE COMENTÁRIOS E INPUT (FACEBOOK STYLE) */}
                  <AnimatePresence>
                    {activeComments === item.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-zinc-50/50 dark:bg-zinc-950/20"
                      >
                        <div className="p-4 space-y-4">
                          {/* LISTA */}
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {item.comments?.map((comment: any) => (
                              <div key={comment.id} className="flex gap-2">
                                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0 flex items-center justify-center font-bold text-[10px]">
                                <div className="bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {item.image_path ? (
                      <img
                        src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                        alt={item.titulo}
                        className="w-full rounded-full h-auto object-contain max-h-[500px]"
                      />
                    ) : (
                      <div className="py-10 opacity-20"><Share2 size={40} /></div>
                    )}
                  </div>
                                </div>
                                <div className="flex flex-col bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-2xl rounded-tl-none">
                                  <span className="text-[12px] font-bold">{comment.usuario?.nome}</span>
                                  <p className="text-[13px] text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* INPUT */}
                          <div className="flex items-center gap-2 pt-2 border-t dark:border-zinc-800">
  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs shrink-0">
  <div className="bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {item.image_path ? (
                      <img
                        src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                        alt={item.titulo}
                        className="w-full h-auto rounded-3xl object-contain max-h-[500px]"
                      />
                    ) : (
                      <div className="py-10 opacity-20"><Share2 size={40} /></div>
                    )}
                  </div>
  </div>
  
  <div className="relative flex-1">
    <input 
      id={`input-comment-${item.id}`} // ID único para controle
      placeholder="Escreva um comentário..."
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none transition-all pr-10"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Evita comportamento padrão do formulário
          const val = e.currentTarget.value.trim();
          console.log("⌨️ Enter pressionado, valor:", val);
          if (val) {
            handleSendComment({ postId: item.id, content: val });
            e.currentTarget.value = "";
          }
        }
      }}
    />
    
    <button 
      type="button"
      onClick={() => {
        const input = document.getElementById(`input-comment-${item.id}`) as HTMLInputElement;
        console.log("🖱️ Clique no botão, valor:", input?.value);
        if (input?.value.trim()) {
          handleSendComment({ postId: item.id, content: input.value.trim() });
          input.value = "";
        }
      }}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 transition-colors"
    >
      <Send size={16} />
    </button>
  </div>
</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.article>
              ))}
            </AnimatePresence>
            {(!vitrine || vitrine.length === 0) && <EmptyState />}
          </main>

          {/* ASIDE RIGHT - SUGESTÕES */}
          {/* <aside className="hidden xl:flex flex-col w-[320px] shrink-0 sticky top-4 h-fit">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h4 className="font-bold text-sm mb-4">Sugestões de Vitrines</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-orange-100 transition-colors" />
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold">Vitrine Pro {i}</span>
                        <span className="text-[10px] text-zinc-500">Verificado</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-[11px] h-7 rounded-full hover:bg-orange-500 hover:text-white transition-all">Seguir</Button>
                  </div>
                ))}
              </div>
            </div>
          </aside> */}
        </div>
      </ScrollArea>
    </div>
  );
}

function FeedSkeleton() {

  return (

    <div className="max-w-[650px] mx-auto p-4 space-y-4">

      <Skeleton className="h-10 w-10 rounded-full" />

      <Skeleton className="h-[400px] w-full rounded-xl" />

    </div>

  );

}



function EmptyState() {

  return (

    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800">

      <Share2 className="mx-auto text-zinc-300 mb-4" size={40} />

      <p className="font-bold">Nenhum post disponível</p>

    </div>

  );

}