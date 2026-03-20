import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useEffect } from "react";
import { isAxiosError } from "axios";
import { TopHeader } from "../app/dashboard-admin/sidebar/top-header";
import { GetUserProfile } from "@/api/get-profile";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppLayoutAdmin() {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
    queryFn: GetUserProfile,
  });

  // Redireccionamentos por role — dentro de useEffect para evitar
  // chamadas durante o render (viola as regras dos hooks)
  useEffect(() => {
    if (!profile) return;

    const clienteRoles = ["CLIENTE_COLECTIVO", "CLIENTE_INDIVIDUAL"];
    const prestadorRoles = ["PRESTADOR_COLECTIVO", "PRESTADOR_INDIVIDUAL"];

    if (clienteRoles.includes(profile.role) || prestadorRoles.includes(profile.role)) {
      navigate("/servicos", { replace: true });
    }
  }, [profile, navigate]);

  // Interceptor de 401
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          const code = error.response?.data.code;

          if (status === 401 || code === "UNAUTHORIZED") {
            navigate("/sign-in", { replace: true });
            toast.warning("Faça login novamente");
          }
        }
      }
    );
    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex antialiased">
      <TopHeader />

      {/*
        O ScrollArea do shadcn precisa de uma altura concreta para funcionar —
        não herda via flex-1 sozinho. Solução:
          1. div com flex-1 + h-full recebe as dimensões do fixed inset-0
          2. ScrollArea com h-full + w-full preenche esse div
      */}
      <div className="flex-1 h-full ml-[4px]">
        <ScrollArea className="h-full w-full">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
}