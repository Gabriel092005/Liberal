import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import z from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/sign-in";
import { toast } from "sonner";
import { LockKeyhole, Phone, ArrowRight, Handshake, Loader2 } from "lucide-react";

const signInBodySchema = z.object({
  phone: z.string().min(9, "Telefone inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

type SignInBodySchemaTypes = z.infer<typeof signInBodySchema>;

export function SignIn() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignInBodySchemaTypes>();

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
    onSuccess(data) {
      toast.success("Bem-vindo de volta!");
      if (data?.role === "ADMIN") {
        navigate("/início");
      } else if (data?.role?.startsWith("PRESTADOR")) {
        navigate("/servicos");
      } else {
        navigate("/");
      }
    },
    onError() {
      toast.error("Credenciais inválidas. Verifique seu telefone e senha.");
    }
  });

  async function handleSignIn(data: SignInBodySchemaTypes) {
    await authenticate(data);
  }

  return (
    <>
      <Helmet title="Login | Liberal" />
      
      {/* Centralização absoluta e idêntica ao SignUp */}
      <div className="w-full max-w-[480px] space-y-6 relative -top-20">
        
        {/* Header do Formulário (Seguindo o padrão do SignUp) */}
        <div className="text-center lg:text-left space-y-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4 mx-auto lg:mx-0 rotate-3"
          >
            <Handshake className="text-white" size={28} fill="currentColor" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tight dark:text-white"
          >
            Acessar <span className="text-orange-500">Painel</span>
          </motion.h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Onde prestadores e clientes se encontram para crescer juntos.
          </p>
        </div>

        {/* Formulário com animação de entrada suave */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-black/5"
        >
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-5">
            
            {/* Campo Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
                Telefone
              </Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                <Input 
                  id="phone"
                  {...register('phone')} 
                  placeholder="9xx xxx xxx"
                  className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl focus-visible:ring-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Palavra-Passe
                </Label>
                <Link to="/forgot-password" stroke-width="2" className="text-[10px] text-orange-500 font-bold hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative group">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                <Input 
                  id="password"
                  type="password"
                  {...register('password')} 
                  placeholder="••••••••"
                  className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl focus-visible:ring-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Botão Entrar */}
            <Button 
              disabled={isSubmitting}
              type="submit"
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98] group"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Entrar na Plataforma <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divisor e Link de Registro */}
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">
              Ainda não tem uma conta?{" "}
              <Link to="/sign-up" className="text-orange-500 font-bold hover:underline">
                Criar conta grátis
              </Link>
            </p>
          </div>
        </motion.div>
        
        {/* Footer Discreto */}
        <p className="text-center text-[10px] text-zinc-400 uppercase tracking-[0.2em] pt-4">
          © 2025 Liberal Angola • Tecnologia & Serviços
        </p>
      </div>
    </>
  );
}