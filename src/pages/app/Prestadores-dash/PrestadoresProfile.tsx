import { EditarBio } from "@/api/editar-bio";
import { GetUserProfile } from "@/api/get-profile";
import { Logout } from "@/api/log-out";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, Loader2, LogOut, MapPin, Pencil, Phone } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Config } from "./config-prestadores";

const editarBioBodySchema = z.object({
  description: z.string().min(1, "A bio não pode estar vazia"),
});

type EditarBodySchemaTypes = z.infer<typeof editarBioBodySchema>;

export function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
  });

  const { mutateAsync: Sair } = useMutation({ mutationFn: Logout });
  const { register: registar, handleSubmit: submeter, reset } = useForm<EditarBodySchemaTypes>();

  const { mutateAsync: salvar, isPending } = useMutation({
    mutationFn: EditarBio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  useEffect(() => {
    if (profile?.description) reset({ description: profile.description });
  }, [profile, reset]);

  const handleEditarBio = async (data: EditarBodySchemaTypes) => {
    await salvar({ description: data.description });
  };

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-slate-50 dark:bg-[#080808]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    // CONTÊINER PRINCIPAL: Centralização absoluta
    <div className="h-[100dvh] relative right-6 max-h-[34rem] w-full bg-slate-50 dark:bg-[#080808] flex items-center justify-center overflow-hidden">
      
      {/* Background Decorativo sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3b82f608,transparent_50%)] pointer-events-none" />

      <ScrollArea className="h-full w-full">
        {/* Wrapper que permite o my-auto para centralização vertical */}
        <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-8">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg my-auto"
          >
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden bg-white dark:bg-zinc-900 rounded-[3rem]">
              
              {/* HEADER / CAPA */}
              <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                <img
                  src={`${api.defaults.baseURL}/uploads/${profile?.image_path}`}
                  alt="Capa"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                <Badge className="absolute top-4 right-6 bg-white/20 backdrop-blur-md border-none text-white uppercase font-black text-[9px] tracking-[0.2em] px-4 py-1.5 rounded-full">
                  {profile?.role?.replace('_', ' ')}
                </Badge>

                {/* AVATAR SOBREPOSTO */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2.2rem] border-[6px] border-white dark:border-zinc-900 shadow-2xl overflow-hidden bg-zinc-200">
                      <img
                        src={`${api.defaults.baseURL}/uploads/${profile?.image_path}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-1 right-1 p-1.5 bg-blue-500 rounded-2xl text-white shadow-lg border-4 border-white dark:border-zinc-900">
                      <CheckCircle2 size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="pt-16 pb-10 px-6 sm:px-10 text-center">
                {/* INFO PRINCIPAL */}
                <div className="space-y-1">
                  <h1 className="text-2xl font-black tracking-tighter dark:text-white uppercase">
                    {profile?.nome}
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
                    <MapPin size={14} className="text-red-500" />
                    <span className="text-[11px] uppercase tracking-wider">{profile?.provincia}, {profile?.municipio}</span>
                  </div>
                </div>

                {/* GRID DE CARDS RÁPIDOS */}
                <div className="grid grid-cols-2 gap-3 mt-8">
                  <div className="flex flex-col items-center gap-1 p-3 rounded-3xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800">
                    <Phone size={16} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Contato</span>
                    <span className="font-bold text-[11px] truncate">+244 {profile?.celular}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 p-3 rounded-3xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800">
                    <Briefcase size={16} className="text-orange-500" />
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Ocupação</span>
                    <span className="font-bold text-[11px] truncate uppercase">{profile?.role}</span>
                  </div>
                </div>

                {/* SEÇÃO BIO */}
                <div className="mt-6 text-left bg-blue-500/5 dark:bg-blue-500/10 p-5 rounded-[2rem] relative border border-blue-500/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                      Bio Profissional
                    </h3>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-blue-500/20 text-blue-500">
                          <Pencil size={12} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2.5rem] max-w-[92vw]">
                        <DialogHeader>
                          <DialogTitle className="font-black text-lg italic">Editar Perfil</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submeter(handleEditarBio)} className="space-y-4 pt-4">
                          <Textarea 
                            {...registar("description")} 
                            className="min-h-[140px] rounded-2xl bg-slate-50 dark:bg-zinc-900 border-none p-4"
                            placeholder="Descreva suas competências..."
                          />
                          <Button disabled={isPending} className="w-full h-12 rounded-xl bg-blue-600 font-bold uppercase shadow-lg shadow-blue-500/20">
                            {isPending ? <Loader2 className="animate-spin" /> : "Atualizar Biografia"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic text-xs font-medium">
                    "{profile?.description || "Inovando e prestando serviços com qualidade e dedicação."}"
                  </p>
                </div>

                {/* BOTÕES DE AÇÃO ESTILO MOBILE */}
                <div className="mt-8 flex flex-col gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                        Configurações da Conta
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl w-[95vw] h-[85vh] overflow-y-auto rounded-[3rem] p-4 border-none">
                      <Config />
                    </DialogContent>
                  </Dialog>

                  <Button 
                    onClick={() => { Sair(); window.location.href = '/sign-in'; }}
                    variant="ghost" 
                    className="h-12 w-full rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-black uppercase tracking-widest text-[10px] gap-2"
                  >
                    <LogOut size={16} />
                    Sair da Conta
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Footer de Créditos (opcional) */}
            <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 opacity-50">
              Prestador Verificado
            </p>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}