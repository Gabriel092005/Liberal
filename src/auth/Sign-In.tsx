import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Verifique se o caminho está correto
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion} from "framer-motion";
import z from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/sign-in";
import { toast } from "sonner";
import { Loader2, LockKeyhole, Phone,  ArrowRight, Handshake } from "lucide-react";

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
      
      // Lógica de redirecionamento baseada no ROLE vindo da resposta da mutação
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
      
      {/* Container Principal com Background Suave */}
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#09090b] p-4 relative -top-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* LOGO E TÍTULO */}
          <div className="flex flex-col items-center mb-1 text-center space-y-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 rotate-3">
              <Handshake className="text-white" size={28} fill="currentColor" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight">Acessar Painel</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-[280px]">
                Onde prestadores e clientes se encontram para crescer juntos.
              </p>
            </div>
          </div>

          {/* CARD DE LOGIN */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-14 rounded-[2.5rem] shadow-xl shadow-black/5">
            <form className="space-y-5" onSubmit={handleSubmit(handleSignIn)}>
              
              {/* CAMPO TELEFONE */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">
                  Telefone
                </Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                  <Input 
                    id="phone"
                    {...register('phone')} 
                    placeholder="9xx xxx xxx"
                    className="pl-10 h-12 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:ring-orange-500"
                  />
                </div>
              </div>

              {/* CAMPO SENHA */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Palavra-Passe
                  </Label>
                  <Link to="/forgot-password"  className="text-[10px] text-orange-500 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative group">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                  <Input 
                    id="password"
                    type="password"
                    {...register('password')} 
                    placeholder="••••••••"
                    className="pl-10 h-12 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:ring-orange-500"
                  />
                </div>
              </div>

              {/* BOTÃO ENTRAR */}
              <Button 
                disabled={isSubmitting}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Entrar na Plataforma <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <p className="text-sm text-zinc-500">
                Ainda não tem uma conta?{" "}
                <Link to="/sign-up" className="text-orange-500 font-bold hover:underline">
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </div>
          
          {/* FOOTER DISCRETO */}
          <p className="mt-8 text-center text-[10px] text-zinc-400 uppercase tracking-[0.2em]">
            © 2025 Liberal Angola • Tecnologia & Serviços
          </p>
        </motion.div>
      </div>
    </>
  );
}