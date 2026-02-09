import { Outlet, useNavigate } from "react-router-dom";
import { BottomNav } from "../app/dashboard-admin/sidebar/BottomNav";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useEffect } from "react";
import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { GetUserProfile } from "@/api/get-profile";
import { socket } from "@/lib/socket";

export function AppLayoutClients() {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
    staleTime: Infinity,
  });

  // Quando o usuário logar
// Onde você tem os dados do usuário logado
// No teu App.tsx
useEffect(() => {
  function conectarSala() {
    const userId = profile?.id; // Garante que pegas o ID atual
    if (userId) {
      console.log("🔌 [Socket] Forçando entrada na sala:", userId);
      socket.emit("join_room", String(userId));
    }
  }

  // Tenta entrar na sala logo ao carregar
  conectarSala();

  // Se a internet cair e voltar, ele entra na sala de novo automaticamente
  socket.on("connect", conectarSala);

  return () => {
    socket.off("connect", conectarSala);
  };
}, []);
useEffect(() => {
  if (profile?.id) {
    console.log("Entrando na sala do usuário:", profile.id);
    socket.emit("join_room", String(profile.id)); 
    // Certifique-se que o backend tem um socket.on("join_room", (id) => socket.join(id))
  }
}, [profile]);

  useEffect(() => {
    if (isLoading || !profile) return;
    if (profile.estado_conta === 'DESATIVADA' || profile.estado_conta === 'PENDENTE') {
      navigate("/sign-in", { replace: true });
      return;
    }
    if (profile.role === 'PRESTADOR_COLECTIVO' || profile.role === 'PRESTADOR_INDIVIDUAL') {
      navigate("/servicos", { replace: true });
    } else if (profile.role === 'ADMIN') {
      navigate("/início", { replace: true });
    }
  }, [profile, isLoading, navigate]);

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401 || status === 400) {
            navigate('/sign-in', { replace: true });
            toast.warning('Sua sessão expirou. Faça login novamente.');
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptorId);
  }, [navigate]);

  if (isLoading) return null;

  return (
    /* h-[100dvh] impede que a barra do navegador corte o layout no Android/iOS */
    <div className="h-[100dvh] w-full bg-background flex flex-col overflow-hidden antialiased select-none">
      
      {/* AREA DE CONTEUDO CENTRALIZADA */}
      <div className="flex-1 w-full flex justify-center overflow-hidden">
        {/* max-w-7xl impede que o conteúdo espalhe demais em telas grandes */}
        <main className="w-full max-w-7xl h-full  flex flex-col relative px-0">
          <Outlet />
        </main>
      </div>

      {/* NAVEGAÇÃO INFERIOR COM SUPORTE A IPHONE (Safe Area) */}
      {/* <footer className="flex-none w-full border-t bg-background/95 backdrop-blur-xl z-[100] flex justify-center pb-[env(safe-area-inset-bottom)]"> */}
        <div className="w-full max-w-7xl px-4 h-16 flex items-center justify-center">
          <BottomNav />
        </div>
      {/* </footer> */}
    </div>
  );
}