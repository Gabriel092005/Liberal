import { EditarBio } from "@/api/editar-bio";
import { GetUserProfile } from "@/api/get-profile";
import { Logout } from "@/api/log-out";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { AlignLeft, Briefcase, CheckCircle2, ChevronRight, Loader2, LogOut, MapPin, Pencil, Phone, Send, Settings, Star, Type, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Config } from "./config-prestadores";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PromoverServicos } from "@/api/vitrine";


const editarBioBodySchema = z.object({
  description: z.string().min(1, "A bio não pode estar vazia"),
});

type EditarBodySchemaTypes = z.infer<typeof editarBioBodySchema>;

export function ProfilePage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading] = useState(false);

  const vitrineSchema = z.object({
  titulo: z.string()
    .min(5, "O título deve ter pelo menos 5 caracteres")
    .max(50, "Título muito longo"),
  descricao: z.string()
    .min(20, "A descrição deve ser mais detalhada (min 20 caracteres)")
    .max(500, "Limite de 500 caracteres atingido"),
})

type VitrineFormData = z.infer< typeof vitrineSchema> 
const {
    register,
    handleSubmit,
  } = useForm<VitrineFormData>({
    resolver: zodResolver(vitrineSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
    }
  });

  const {mutateAsync:vitrinar}= useMutation({
    mutationFn:PromoverServicos
  })


// 4. Lógica de Envio para a API
  async function handlePromoverPerfil(data:VitrineFormData) {
    console.log(data)
    try {
        const {
          descricao,
          titulo
        } = data

        await vitrinar({
          title:titulo,
          description:descricao
        })
  
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação de delay

      toast.success("Perfil publicado na vitrine com sucesso!");
      reset(); // Limpa o formulário
      setIsOpen(false); // Fecha o painel
    } catch (error) {
      toast.error("Erro ao publicar na vitrine.");
    } 
  };

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
          <div className="mt-8 flex flex-col gap-3 p-1">
  {/* Botão de Destaque: Perfil na Vitrine */}
<div className="w-full flex flex-col gap-2">
      {/* Botão Gatilho */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-full h-16 rounded-[1.5rem] transition-all duration-500 active:scale-[0.98] overflow-hidden border-none shadow-lg
          ${isOpen 
            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" 
            : "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/20"
          }`}
      >
        <div className="relative flex items-center w-full px-2 gap-3">
          <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-orange-500 text-white' : 'bg-white/20'}`}>
            <Star className={isOpen ? "fill-current" : "fill-white"} size={20} />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-black uppercase tracking-tighter text-sm">
              {isOpen ? "Configurando Vitrine" : "Perfil na Vitrine"}
            </span>
            {!isOpen && <span className="text-[10px] opacity-80 font-medium tracking-tight">Expandir visibilidade do perfil</span>}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="ml-auto opacity-40"
          >
            <ChevronRight size={18} />
          </motion.div>
        </div>
      </Button>

      {/* "Dialog" Suave Expansível (Sem Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: "auto", opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-2xl"
          >
            <form onSubmit={handleSubmit(handlePromoverPerfil)} className="p-5 space-y-5">
              {/* Header Interno */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Novo Destaque</span>
                <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X size={16} />
                </button>
              </div>

              {/* Formulário */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-500 ml-1 flex items-center gap-1">
                    <Type size={12} /> TÍTULO DA VITRINE
                  </label>
                   <Input
                                       placeholder="Ex: Especialista em UI Design" 
                                       {...register('titulo')}
                    className="rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus-visible:ring-1 focus-visible:ring-orange-500 h-11 text-sm font-medium"
                   
                      >
                   </Input>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-500 ml-1 flex items-center gap-1">
                    <AlignLeft size={12} /> DESCRIÇÃO DETALHADA
                  </label>
                  <Textarea 
                  {...register('descricao')}
                    placeholder="Conte um pouco sobre seus melhores serviços..." 
                    className="rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none focus-visible:ring-1 focus-visible:ring-orange-500 min-h-[100px] text-sm resize-none"
                  />
                </div>
              </div>

              {/* Ação de Envio */}
              <Button 
                 type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 transition-all"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Star size={18} />
                  </motion.div>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Publicar na Vitrine</span>
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  {/* Botão: Configurações */}
  <Dialog>
    <DialogTrigger asChild>
      <Button className="w-full h-14 rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-tight hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200/50 dark:border-zinc-700/50 gap-3">
        <Settings size={20} className="text-zinc-500" />
        Configurações da Conta
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-2xl w-[95vw] h-[85vh] overflow-hidden rounded-[3rem] p-0 border-none bg-zinc-50 dark:bg-zinc-950 shadow-2xl">
      <div className="h-full overflow-y-auto p-6">
        <Config />
      </div>
    </DialogContent>
  </Dialog>

  {/* Botão: Sair (Design mais limpo e discreto) */}
  <Button 
    onClick={() => { Sair(); window.location.href = '/sign-in'; }}
    variant="ghost" 
    className="h-12 w-full rounded-2xl text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold uppercase tracking-[0.2em] text-[10px] gap-2 mt-2 transition-colors"
  >
    <LogOut size={14} strokeWidth={3} />
    Encerrar Sessão
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