import { FetchAllOrders } from "@/api/fetch-all";
import { InterestedOrdersPrestadores } from "@/api/fetch-interrested-orders";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Cartaa } from "./cartao";
import { SkeletonsDemo } from "./NearClientsSearch";

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function PrestadoresPedidos() {
  const [filter] = useState<"all" | "accepted">("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromParams = searchParams.get("query") || "";
  const [searchTerm] = useState(queryFromParams);
  const debouncedQuery = useDebounce(searchTerm, 400);

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (debouncedQuery) newParams.set("query", debouncedQuery);
    setSearchParams(newParams);
  }, [debouncedQuery, setSearchParams]);

  const {isLoading} = useQuery({
    queryKey: ["orders", filter, debouncedQuery],
    queryFn: async () => {
      return filter === "all" 
        ? await FetchAllOrders({ query: debouncedQuery }) 
        : await InterestedOrdersPrestadores();
    },
    staleTime: 1000 * 30,
  });

  // const { mutateAsync: SeInteressar, isSuccess } = useMutation({
  //   mutationFn: InteressarPedidos,
  //   onSuccess: () => toast.success("Pedido marcado para negociação!"),
  //   onError: () => toast.error("Oops! Só pode negociar uma vez!"),
  // });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100dvh] w-full p-4">
        <div className="w-full max-w-md space-y-4">
          <SkeletonsDemo />
          <SkeletonsDemo />
          <SkeletonsDemo />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      // Centralização total no viewport do smartphone
      className="fixed inset-0 flex items-center justify-center bg-background px-4 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
     <Cartaa></Cartaa>
    </motion.div>
  );
}