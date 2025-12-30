import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { provinceMunicipalityMap } from "@/data/province";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signUp } from "@/api/sign-up";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { GetProfission } from "@/api/get-profissions";
import { 
  User, 
  Phone, 
  Briefcase, 
  Fingerprint, 
  LockKeyhole,  
  Camera, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

// Variantes de animação refinadas
const formVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)"
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.3 }
  })
};

export function SignUp() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<File | null>(null);

  const { data: profissao } = useQuery({
    queryKey: ['profissao'],
    queryFn: GetProfission
  });

  const { register, control, handleSubmit } = useForm<any>();
  const { mutateAsync: registerUser, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success('Conta criada com sucesso! Bem-vindo.');
      navigate("/sign-in");
    },
    onError: () => toast.error("Erro ao registrar. Verifique os dados.")
  });

  const nextStep = () => { setDirection(1); setStep(2); };
  const prevStep = () => { setDirection(-1); setStep(1); };

  async function handleRegisterUsers(data: any) {
    await registerUser({ ...data, image_path: photo });
  }

  return (
    <>
      <Helmet title="Criar Conta | Liberal" />
      
      <div className="w-full max-w-[480px] space-y-2 relative -top-24">
        {/* Header do Formulário */}
        <div className="text-center lg:text-left space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tight dark:text-white"
          >
            Criar conta <span className="text-orange-500">grátis</span>
          </motion.h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Junte-se à maior rede de serviços de Angola.
          </p>
        </div>

        {/* Indicador de Passos Visual */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
        </div>

        <form onSubmit={handleSubmit(handleRegisterUsers)} className="relative overflow-visible">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 ? (
              <motion.div
                key="step1"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                {/* Nome */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Nome Completo / Empresa</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input {...register('nome')} placeholder="Ex: João Manuel ou Liberal Lda" className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl" />
                  </div>
                </div>

                {/* Profissão */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Área de Atuação</Label>
                  <Controller
                    name="profissao"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-14 pl-12 relative bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                          <SelectValue placeholder="O que você faz?" />
                        </SelectTrigger>
                        <SelectContent>
                          {profissao?.profissao?.map((p: any) => (
                            <SelectItem key={p.titulo} value={p.titulo}>{p.titulo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">NIF</Label>
                    <div className="relative group">
                      <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                      <Input {...register('nif')} placeholder="000000000" className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Telefone</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                      <Input {...register('celular')} placeholder="9xx..." className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Palavra-Passe</Label>
                  <div className="relative group">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input type="password" {...register('palavraPasse')} placeholder="••••••••" className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl" />
                  </div>
                </div>

                <Button type="button" onClick={nextStep} className="w-full h-14 bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 rounded-2xl font-bold group">
                  Próximo Passo <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                {/* Localização */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Província</Label>
                    <Controller
                      name="provincia"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-14 bg-zinc-50 dark:bg-zinc-900 rounded-2xl"><SelectValue placeholder="Província" /></SelectTrigger>
                          <SelectContent>
                            {Object.keys(provinceMunicipalityMap).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Município</Label>
                    <Controller
                      name="municipio"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-14 bg-zinc-50 dark:bg-zinc-900 rounded-2xl"><SelectValue placeholder="Município" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Viana">Viana</SelectItem>
                            <SelectItem value="Belas">Belas</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Tipo de Conta</Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-2">
                        {["PRESTADOR_INDIVIDUAL", "PRESTADOR_COLECTIVO", "CLIENTE_INDIVIDUAL", "CLIENTE_COLECTIVO"].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => field.onChange(r)}
                            className={`p-3 text-[10px] font-bold rounded-xl border transition-all ${field.value === r ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}
                          >
                            {r.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                {/* Upload de Foto Estilizado */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 text-center block">Foto de Perfil ou Logo</Label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="h-8 w-8 text-zinc-400 mb-2" />
                      <p className="text-xs text-zinc-500">{photo ? photo.name : "Clique para carregar"}</p>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button disabled={isPending} type="submit" className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20">
                    {isPending ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Finalizar Registo <CheckCircle2 size={20} /></span>}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Já tem conta? <Link to="/sign-in" className="text-orange-500 font-bold hover:underline">Fazer Login</Link>
        </p>
      </div>
    </>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);