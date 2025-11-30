import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Timer, Loader } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FetchPacotes } from "@/api/fetch-pacotes";
import { assinarPacote } from "@/api/carregar-carteira";
import { SkeletonsDemo } from "./NearClientsSearch";

// 🧩 Gera uma referência de pagamento aleatória
function gerarCodigoReferencia() {
  const prefixo = "REF";
  const numero = Math.floor(100000 + Math.random() * 900000);
  return `${prefixo}-${numero}`;
}

export function Package() {
  const { data: planos, isLoading } = useQuery({
    queryKey: ["pacotes"],
    queryFn: FetchPacotes,
  });

  const [selectedPlano, setSelectedPlano] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState<string>("");
  const [referenciaGerada, setReferenciaGerada] = useState<string | null>(null);

  // 🧠 Mutation para submeter o pedido
  const { mutateAsync: submeterPedido, isPending: isSubmitting } = useMutation({
    mutationFn: async ({
      planoId,
      referencia,
      valor,
    }: {
      planoId: number;
      referencia: string;
      valor: number;
    }) => {
      const payload = { planoId, referencia, valor };

      console.log("📦 Enviando dados para o servidor:", payload);
      await assinarPacote({metodo:'Referencia', pacoteId:planoId})

      const { data } = await api.post("/pagamentos/confirmar", payload);

      console.log("✅ Resposta do servidor:", data);

      return data;
    },
    onSuccess: () => {
      toast.success("Pedido submetido com sucesso ✅");
      setDialogOpen(false);
      setReferenciaGerada(null);
    },
    onError: () => toast.error("Erro ao submeter pedido 😢"),
  });

  const handleAssinar = (plano: any) => {
    setSelectedPlano(plano);
    setMetodoPagamento("");
    setReferenciaGerada(null);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center flex-col justify-center h-screen">
        <SkeletonsDemo></SkeletonsDemo>
        <SkeletonsDemo></SkeletonsDemo>
        <SkeletonsDemo></SkeletonsDemo>
      </div>
    );
  }

  if(!planos){
      return
  }
  return (
    <div className="flex flex-col w-full bg-background text-foreground min-h-screen">
      {/* HEADER */}
      <header className="w-full bg-white dark:bg-zinc-950 relative -left-9 py-3 shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Pacotes</h1>
          <p className="text-muted-foreground text-[0.7rem]">
            Escolha o plano ideal para você 🚀
          </p>
        </div>
      </header>

      {/* TABELA */}
      <main className="flex-1 px-2 py-4 flex justify-center relative right-11">
        <div className="w-full max-w-md overflow-x-auto rounded-lg shadow-sm">
          <Table className="min-w-[350px] text-center text-[0.65rem]">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-orange-400 to-orange-600 h-8">
                <TableHead className="text-white font-semibold py-1 px-1">
                  Plano
                </TableHead>
                <TableHead className="text-white font-semibold py-1 px-1">
                  Preço
                </TableHead>
                <TableHead className="text-white font-semibold py-1 px-1">
                  Validade
                </TableHead>
                <TableHead className="text-white font-semibold py-1 px-1">
                  Benefícios
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planos.length<=0 &&(
                <div className="flex items-center justify-center  w-screen">
                  <span className="text-muted-foreground">Nenhum plano criado por enquanto.</span>
                </div>
              )}
              {planos?.map((plano, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * i, duration: 0.3 }}
                  className="border-b hover:bg-muted/30 h-10"
                >
                  <TableCell className="font-semibold px-1 py-1">
                    {plano.title}
                  </TableCell>
                  <TableCell className="font-bold text-yellow-600 px-1 py-1">
                    {plano.preco},00kz
                  </TableCell>
                  <TableCell className="flex gap-1 text-[0.6rem] px-1">
                    <Timer className="text-muted-foreground" size={10} />{" "}
                    {plano.validade} Dias
                  </TableCell>
                  <TableCell className="px-1 py-1">
                    {/* <ul className="flex flex-col gap-0.5 text-left">
                      <li className="text-[0.6rem] text-muted-foreground flex items-center gap-1">
                        <Check className="text-green-400" size={10} />{" "}
                        {plano.beneficio1}
                      </li>
                      <li className="text-[0.6rem] text-muted-foreground flex items-center gap-1">
                        <Check className="text-green-400" size={10} />{" "}
                        {plano.beneficio2}
                      </li>
                    </ul> */}
                    <Button
                      className="p-1 h-7 mt-1"
                      onClick={() => handleAssinar(plano)}
                    >
                      Assinar
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* 🧾 Dialog de pagamento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          {selectedPlano && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Confirmar Assinatura
                </DialogTitle>
                <DialogDescription>
                  Você está prestes a assinar o plano{" "}
                  <span className="font-semibold text-orange-500">
                    {selectedPlano.title}
                  </span>{" "}
                  por{" "}
                  <span className="font-semibold">
                    {selectedPlano.preco},00kz
                  </span>
                  .
                </DialogDescription>
              </DialogHeader>

              {/* Método de Pagamento */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Selecione o método de pagamento:
                </p>
                <Select onValueChange={setMetodoPagamento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolher método..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multicaixa">Multicaixa Express</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="referencia">Referência Bancária</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exibir referência gerada */}
              {referenciaGerada && (
                <div className="mt-3 p-2 border rounded-md bg-muted/30 text-sm">
                  <p>
                    Código de pagamento:{" "}
                    <span className="font-bold text-orange-600">
                      {referenciaGerada}
                    </span>
                  </p>
                </div>
              )}

              <DialogFooter className="mt-6 flex flex-col gap-2">
                {/* Botão Gerar Referência */}
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white w-full"
                  onClick={() => {
                    if (!metodoPagamento) {
                      toast.error("Selecione o método de pagamento ⚠️");
                      return;
                    }
                    const codigo = gerarCodigoReferencia();
                    setReferenciaGerada(codigo);
                    toast.success(`Referência gerada: ${codigo}`);
                  }}
                  disabled={!!referenciaGerada}
                >
                  {!referenciaGerada ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      Gerar Referência
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-2 text-green-400" />
                      Referência Gerada
                    </>
                  )}
                </Button>

                {/* Botão Submeter Pedido */}
                {referenciaGerada && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-full"
                    onClick={() =>
                      submeterPedido({
                        planoId: selectedPlano.id,
                        referencia: referenciaGerada,
                        valor: selectedPlano.preco,
                      })
                    }
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader size={16} className="animate-spin mr-2" />
                    ) : null}
                    Submeter Pedido
                  </Button>
                )}

                <DialogClose asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
