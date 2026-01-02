import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

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

  const { register, control, handleSubmit, trigger, formState: { errors } } = useForm<any>({
    defaultValues: { termo_privacidade: false }
  });

  const { mutateAsync: registerUser, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success('Conta criada com sucesso! Bem-vindo.');
      navigate("/sign-in");
    },
    onError: () => toast.error("Erro ao registrar. Verifique os dados.")
  });

  const nextStep = async () => {
    let fields: any[] = [];
    if (step === 1) fields = ['nome', 'profissao', 'nif', 'celular', 'palavraPasse'];
    if (step === 2) fields = ['provincia', 'municipio', 'role'];

    const isValid = await trigger(fields);
    if (isValid) {
      if (step === 2 && !photo) return toast.error("Selecione uma foto de perfil.");
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => { setDirection(-1); setStep((prev) => prev - 1); };

  async function handleRegisterUsers(data: any) {
    // Destruturação para isolar o termo_privacidade e NÃO enviá-lo ao backend
    const { termo_privacidade, ...userData } = data;
    await registerUser({ ...userData, image_path: photo });
  }

  return (
    <>
      <Helmet title="Criar Conta | Liberal" />
      
      <div className="w-full max-w-[480px] space-y-2 relative -top-24">
        <div className="text-center lg:text-left space-y-2">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black tracking-tight dark:text-white">
            Criar conta <span className="text-orange-500">grátis</span>
          </motion.h1>
          <p className="text-zinc-500 dark:text-zinc-400">Junte-se à maior rede de serviços de Angola.</p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit(handleRegisterUsers)} className="relative overflow-visible">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={formVariants} initial="enter" animate="center" exit="exit" className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Nome Completo / Empresa</Label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${errors.nome ? 'text-red-500' : 'text-zinc-400 group-focus-within:text-orange-500'}`} />
                    <Input {...register('nome', { required: true })} placeholder="Ex: João Manuel ou Liberal Lda" className={`pl-12 h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.nome ? 'border-red-500 bg-red-50/50' : 'border-zinc-200 dark:border-zinc-800'}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Área de Atuação</Label>
                  <Controller name="profissao" control={control} rules={{ required: true }} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={`h-14 pl-12 relative bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.profissao ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'}`}>
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <SelectValue placeholder="O que você faz?" />
                      </SelectTrigger>
                      <SelectContent>{profissao?.profissao?.map((p: any) => <SelectItem key={p.titulo} value={p.titulo}>{p.titulo}</SelectItem>)}</SelectContent>
                    </Select>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">NIF</Label>
                    <Input {...register('nif', { required: true })} placeholder="000000000" className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.nif ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'}`} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Telefone</Label>
                    <Input {...register('celular', { required: true })} placeholder="9xx..." className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.celular ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Palavra-Passe</Label>
                  <Input type="password" {...register('palavraPasse', { required: true, minLength: 6 })} placeholder="••••••••" className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.palavraPasse ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'}`} />
                </div>

                <Button type="button" onClick={nextStep} className="w-full h-14 bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 rounded-2xl font-bold group">
                  Próximo Passo <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={formVariants} initial="enter" animate="center" exit="exit" className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Província</Label>
                    <Controller name="provincia" control={control} rules={{ required: true }} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.provincia ? 'border-red-500' : 'border-zinc-200'}`}><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>{Object.keys(provinceMunicipalityMap).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                      </Select>
                    )} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Município</Label>
                    <Controller name="municipio" control={control} rules={{ required: true }} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`h-14 bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl ${errors.municipio ? 'border-red-500' : 'border-zinc-200'}`}><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent><SelectItem value="Viana">Viana</SelectItem><SelectItem value="Belas">Belas</SelectItem></SelectContent>
                      </Select>
                    )} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 text-center block">Tipo de Conta</Label>
                  <Controller name="role" control={control} rules={{ required: true }} render={({ field }) => (
                    <div className={`grid grid-cols-2 gap-2 p-1 border-2 rounded-2xl ${errors.role ? 'border-red-500' : 'border-transparent'}`}>
                      {["PRESTADOR_INDIVIDUAL", "PRESTADOR_COLECTIVO", "CLIENTE_INDIVIDUAL", "CLIENTE_COLECTIVO"].map((r) => (
                        <button key={r} type="button" onClick={() => field.onChange(r)} className={`p-3 text-[10px] font-bold rounded-xl border transition-all ${field.value === r ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}>
                          {r.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  )} />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 text-center block">Foto de Perfil ou Logo</Label>
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer transition-colors ${photo ? 'border-orange-500 bg-orange-50/10' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50'}`}>
                    <Camera className={`h-8 w-8 mb-2 ${photo ? 'text-orange-500' : 'text-zinc-400'}`} />
                    <p className="text-xs text-zinc-500 font-medium">{photo ? photo.name : "Clique para carregar"}</p>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-6 rounded-2xl border-zinc-200"><ArrowLeft className="h-4 w-4" /></Button>
                  <Button type="button" onClick={nextStep} className="flex-1 h-14 bg-zinc-900 dark:bg-white dark:text-black rounded-2xl font-bold">Próximo Passo <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" custom={direction} variants={formVariants} initial="enter" animate="center" exit="exit" className="space-y-5">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 bg-orange-500/10 rounded-full"><ShieldCheck className="h-8 w-8 text-orange-500" /></div>
                  <h2 className="text-xl font-black">Termos e Privacidade</h2>
                  <p className="text-xs text-zinc-500 px-4">Leia atentamente as políticas da plataforma Liberal.</p>
                </div>

                <div className={`h-48 overflow-y-auto p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border-2 transition-all ${errors.termo_privacidade ? 'border-red-500' : 'border-zinc-100 dark:border-zinc-800'}`}>
                  <div className="text-[11px] text-zinc-500 space-y-3 leading-relaxed">
                    <p>1. Os dados fornecidos serão usados exclusivamente para a conexão entre clientes e prestadores.</p>
                    <p>2. A Liberal não se responsabiliza por pagamentos feitos fora da plataforma.</p>
                    <p>3. É proibido o uso de fotos que não correspondam à identidade real ou logótipo da empresa.</p>
                  </div>
                </div>

                <div className={`flex items-start space-x-3 p-4 rounded-2xl border-2 transition-all ${errors.termo_privacidade ? 'border-red-500 bg-red-50/50' : 'border-transparent'}`}>
                  <Controller name="termo_privacidade" control={control} rules={{ required: true }} render={({ field }) => (
                    <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} className="mt-1 border-orange-500 data-[state=checked]:bg-orange-500" />
                  )} />
                  <label htmlFor="terms" className="text-xs font-bold text-zinc-600 dark:text-zinc-400 cursor-pointer">Li e aceito todos os termos de uso e políticas de privacidade.</label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-14 px-6 rounded-2xl border-zinc-200"><ArrowLeft className="h-4 w-4" /></Button>
                  <Button disabled={isPending} type="submit" className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20">
                    {isPending ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Finalizar Registo <CheckCircle2 size={20} /></span>}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="text-center text-sm text-zinc-500 pt-4">
          Já tem conta? <Link to="/sign-in" className="text-orange-500 font-bold hover:underline">Fazer Login</Link>
        </p>
      </div>
    </>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);