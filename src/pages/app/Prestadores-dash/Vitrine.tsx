 "use client";

import { FetchPostsVitrineAll, VitrinePost } from "@/api/fetch-all-vitrine-data";
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
      text: post.description || "Confira!",
      url: `${window.location.origin}/posts/${post.id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copiado!");
      }
    } catch (err) { console.error(err); }
  }

  const { mutate: handleToggleLike } = useMutation({
    mutationFn: (postId: number) => api.post(`/vitrine/${postId}/like`, {}),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["v"] });
      const previousData = queryClient.getQueryData<VitrinePost[]>(["v"]);
      queryClient.setQueryData(["v"], (old: VitrinePost[] | undefined) =>
        old?.map((post) =>
          post.id === postId
            ? { ...post, isLiked: !post.isLiked, _count: { ...post._count, likes: post.isLiked ? post._count.likes - 1 : post._count.likes + 1 } }
            : post
        )
      );
      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["v"], context?.previousData);
    },
  });

  const { mutate: handleSendComment } = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      return api.post(`/vitrine/${postId}/comment`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["v"] });
      toast.success("Enviado");
    },
  });

  if (isLoading) return <FeedSkeleton />;

  return (
    // overflow-y-auto e h-screen garantem o scroll vertical caso o pai não tenha
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black antialiased overflow-y-auto">
      
      {/* TÍTULO DO COMPONENTE */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <h1 className="text-sm font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
          Vitrine
        </h1>
      </header>

      <main className="w-full max-w-[550px] mx-auto pb-32 sm:py-6">
        <AnimatePresence mode="popLayout">
          {vitrine?.map((item) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 mb-2 sm:rounded-xl border-y sm:border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              {/* HEADER DO POST */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex shrink-0 items-center justify-center border border-zinc-100 dark:border-zinc-700 overflow-hidden">
                    {item.image_path ? (
                      <img 
                         src={`${api.defaults.baseURL}/uploads/${item.image_path}`} 
                         className="h-full w-full object-cover" 
                         alt=""
                      />
                    ) : (
                      <span className="text-xs font-bold">{item.usuario.nome.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-bold truncate dark:text-white">
                        {item.usuario.nome}
                      </span>
                      <Verified size={14} className="text-blue-500 fill-current shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                      <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ptBR })}</span>
                      <Globe size={10} />
                    </div>
                  </div>
                </div>
                <MoreHorizontal size={20} className="text-zinc-400" />
              </div>

              {/* DESCRIÇÃO TRUNCADA */}
              {item.description && (
                <div className="px-4 pb-3">
                  <p className="text-[14px] leading-relaxed text-zinc-800 dark:text-zinc-200 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              )}

              {/* IMAGEM DO POST */}
              <div className="bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden border-y border-zinc-100 dark:border-zinc-800">
                {item.image_path && (
                  <img
                    src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                    alt={item.titulo}
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                )}
              </div>

              {/* AÇÕES (Mobile First) */}
            {/* STATUS E AÇÕES INTEGRADOS */}
<div className="flex px-2 py-1 border-t border-zinc-50 dark:border-zinc-800/50">
  {/* BOTÃO CURTIR + CONTADOR */}
  <button 
    onClick={() => handleToggleLike(item.id)}
    className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 active:scale-95 transition-all ${
      item.isLiked ? 'text-red-500' : 'text-zinc-600 dark:text-zinc-400'
    }`}
  >
    <div className="relative">
      <Heart size={22} className={item.isLiked ? "fill-current" : ""} />
      {/* Badge de número para likes */}
      {item._count.likes > 0 && (
        <span className="absolute -top-1 -right-3 text-[10px] font-bold bg-red-500 text-white px-1 rounded-full min-w-[16px]">
          {item._count.likes}
        </span>
      )}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-tight">Amei</span>
  </button>
  
  {/* BOTÃO COMENTÁRIOS + CONTADOR */}
  <button 
    onClick={() => setActiveComments(activeComments === item.id ? null : item.id)}
    className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-zinc-600 dark:text-zinc-400 active:scale-95 transition-all"
  >
    <div className="relative">
      <MessageCircle size={22} />
      {item._count.comments > 0 && (
        <span className="absolute -top-1 -right-3 text-[10px] font-bold bg-zinc-500 text-white px-1 rounded-full min-w-[16px]">
          {item._count.comments}
        </span>
      )}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-tight">Comentar</span>
  </button>

  {/* BOTÃO ENVIAR/SHARE */}
  <button 
    onClick={() => handleShare(item)}
    className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-zinc-600 dark:text-zinc-400 active:scale-95 transition-all"
  >
    <Share2 size={22} />
    <span className="text-[10px] font-bold uppercase tracking-tight">Enviar</span>
  </button>
</div>

              {/* COMENTÁRIOS */}
              <AnimatePresence>
                {activeComments === item.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="p-4 max-h-[200px] overflow-y-auto space-y-3">
                      {item.comments?.map((comment: any) => (
                        <div key={comment.id} className="flex gap-2">
                          <div className="h-7 w-7 rounded-full bg-zinc-200 shrink-0" />
                          <div className="bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-2xl shadow-sm">
                            <p className="text-[11px] font-bold">{comment.usuario?.nome}</p>
                            <p className="text-[13px] leading-tight">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-white dark:bg-zinc-900">
                      <div className="relative flex items-center">
                        <input 
                          id={`input-${item.id}`}
                          placeholder="Adicione um comentário..."
                          className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2 text-[16px] outline-none"
                        />
                        <button 
                          onClick={() => {
                            const input = document.getElementById(`input-${item.id}`) as HTMLInputElement;
                            if(input.value.trim()) {
                               handleSendComment({ postId: item.id, content: input.value });
                               input.value = "";
                            }
                          }}
                          className="absolute right-2 text-orange-500 p-1"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="max-w-[550px] mx-auto p-4 space-y-4">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}