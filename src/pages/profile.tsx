import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, MapPin, LogOut, Phone, Briefcase, Info, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetUserProfile } from "@/api/get-profile";
import { Logout } from "@/api/log-out";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import z from "zod";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { EditarBio } from "@/api/editar-bio";
import { Config } from "./app/Prestadores-dash/config-prestadores";
import { Badge } from "@/components/ui/badge";

const editarBioBodySchema = z.object({
  description: z.string().min(1, "A bio não pode estar vazia"),
});

type EditarBodySchemaTypes = z.infer<typeof editarBioBodySchema>;

export function Profile() {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
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

  return (
    <div className="fixed inset-0 w-full bg-slate-50 dark:bg-[#080808] overflow-y-auto selection:bg-blue-500/30">
      <div className="max-w-2xl mx-auto pt-6 px-4 pb-32">
        
        {/* HEADER / CAPA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="h-48 sm:h-56 md:h-64 w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <img
              src={`${api.defaults.baseURL}/uploads/${profile?.image_path}`}
              alt="Capa"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <Badge className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white uppercase font-bold text-[10px] tracking-widest px-4 py-1.5 rounded-full">
              {profile?.role?.replace('_', ' ')}
            </Badge>
          </div>

          {/* AVATAR */}
          <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-[6px] border-white dark:border-[#080808] shadow-2xl overflow-hidden bg-zinc-200">
                <img
                  src={`${api.defaults.baseURL}/uploads/${profile?.image_path}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 p-2 bg-blue-500 rounded-2xl text-white shadow-lg border-4 border-white dark:border-[#080808]">
                <CheckCircle2 size={18} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* INFO PRINCIPAL */}
        <div className="mt-20 text-center space-y-2 px-2">
          <h1 className="text-3xl font-black tracking-tight dark:text-white uppercase break-words leading-tight">
            {profile?.nome}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground font-semibold flex-wrap">
            <MapPin size={16} className="text-red-500 shrink-0" />
            <span className="text-sm">{profile?.provincia}, {profile?.municipio}</span>
          </div>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
              <Phone size={20} />
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contato</span>
              <span className="font-bold text-sm truncate">+244 {profile?.celular}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0">
              <Briefcase size={20} />
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ocupação</span>
              <span className="font-bold text-sm truncate uppercase">{profile?.role}</span>
            </div>
          </div>
        </div>

        {/* SEÇÃO SOBRE / BIO */}
        <Card className="mt-6 border-none bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4 gap-2">
              <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                <Info size={18} className="text-blue-500" /> Biografia
              </h3>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-blue-500/10 text-blue-500 font-bold h-8 px-4">
                    <Pencil size={14} className="mr-2" /> Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] max-w-[95vw] sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-black uppercase text-xl">Editar Biografia</DialogTitle>
                    <DialogDescription>Diga ao mundo quem você é e o que você faz.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={submeter(handleEditarBio)} className="space-y-4 pt-4">
                    <Textarea 
                      {...registar("description")} 
                      className="min-h-[150px] rounded-[1.5rem] bg-slate-50 dark:bg-zinc-950 border-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                    <Button disabled={isPending} className="w-full h-12 rounded-2xl bg-blue-600 font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors">
                      {isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic text-sm border-l-4 border-blue-500/20 pl-4 py-1">
              {profile?.description ? `"${profile.description}"` : "Você ainda não definiu uma biografia profissional..."}
            </p>
          </CardContent>
        </Card>

        {/* BOTÕES DE AÇÃO - AJUSTADOS PARA PERFEITO SCROLL */}
        <div className="mt-8 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 h-14 rounded-2xl bg-zinc-900 dark:bg-white dark:text-zinc-900 font-black uppercase tracking-tight hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95">
                Configurações da Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl h-[90vh] sm:h-[85vh] overflow-hidden flex flex-col rounded-[2.5rem] p-0 border-none">
              <div className="overflow-y-auto p-6 flex-1">
                <Config />
              </div>
            </DialogContent>
          </Dialog>

          <div className="w-full sm:w-auto">
            <Button 
              onClick={() => Sair()} 
              variant="outline" 
              className="h-14 w-full sm:w-14 rounded-2xl border-2 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg flex items-center justify-center gap-3 sm:gap-0"
              asChild
            >
              <Link to="/sign-in">
                <LogOut size={24} className="shrink-0" />
                <span className="sm:hidden font-bold uppercase tracking-widest text-xs">Sair da Conta</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}