  import { useState } from "react";
  import { useForm, Controller } from "react-hook-form";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useSearchParams } from "react-router-dom";

  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
  import { X, Search, Loader2, ChevronDown } from "lucide-react";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatNotificationDate, getInialts } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/axios";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Delete } from "@/api/delete-user";
import { toast } from "sonner";
import { DesativarConta } from "@/api/desativarConta";
import { AtivarConta } from "@/api/desativar-conta";
import { SuspenderConta } from "@/api/suspender-conta";
import { getPrestadores } from "@/api/fetch-prestadores";
import { PacientTableSkeleton } from "../Clients/clientes-skeleton";
import { Pagination } from "../Clients/pagination";
import { PrestadoresDetailsDialog } from "../Clients/prestadores-details";

  type MunicipalityMap = Record<string, string[]>;

  const provinceMunicipalityMap: MunicipalityMap = {
    Luanda: ["Viana", "Cazenga", "Luanda", "Belas", "Kilamba Kiaxi", "Ícolo e Bengo", "Quissama", "Talatona", "Cacuaco"],
    Bengo: ["Ambriz", "Dande", "Bula Atumba", "Nambuangongo", "Dembos", "Pango Aluquém"],
    // ... restante das províncias
  };



  export function PrestadoresTableFilters() {
      const pacientFilterSchema = z.object({
    province: z.string().optional(),
    municipality: z.string().optional(),
    nome: z.string().optional(),
    page: z.number().optional(),
  });


  type PacientFilterSchema = z.infer<typeof pacientFilterSchema>;
    const [municipalities, setMunicipalities] = useState<string[]>(provinceMunicipalityMap["Luanda"]);

  const [searchParams, setSearchParams] = useSearchParams();


const page = z.coerce.number().parse(searchParams.get("page") ?? "1");

    const provincia = searchParams.get("province")
    const municipality = searchParams.get("municipality")
    const nome  = searchParams.get("nome")

const { data: costumers, isLoading } = useQuery({
  queryKey: ['prestadores', provincia, municipality, nome, page],
  queryFn: () =>
    getPrestadores({
      municipality,
      nome,
      province:provincia,
      page,
    }),
});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nip = event.target.value;

        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            if (nip) {
                newParams.set('nome', nip);
            } else {
                newParams.delete('nome'); // Remove o parâmetro se o campo estiver vazio
            }
            return newParams;
        });
    }
    const { handleSubmit, control, register, reset } = useForm<PacientFilterSchema>({
      resolver: zodResolver(pacientFilterSchema),
      defaultValues: {
        province: searchParams.get("province") ?? "Luanda",
        municipality: searchParams.get("municipality") ?? "Viana",
        nome: searchParams.get("nome") ?? "Nédio Dias"
      },
    });
        const { onChange, ...rest } = register('nome');

    const handleProvinceChange = (province: string) => {
      setMunicipalities(provinceMunicipalityMap[province] || []);
    };

function handleFilters({ province, municipality }: PacientFilterSchema) {
  setSearchParams((state) => {
    province ? state.set("province", province) : state.delete("province");
    municipality ? state.set("municipality", municipality) : state.delete("municipality");
    nome ? state.set("nome", nome) : state.delete("nome");
    state.set("page", "1");
    return state;
  });
}


function handleDeleteFilters() {
  setSearchParams((state) => {
    state.delete("province");
    state.delete("municipality");
    state.delete("nome");
    state.delete("page");
    return state;
  });

  reset({
    province: "",
    municipality: "",
    nome: "",
    page: 1,
  });
}
const queryClient = useQueryClient();
const { mutateAsync: deleteCostumer } = useMutation({
  mutationFn: async (userId: number) => {
    await Delete({ userId: String(userId) });
  },
  onSuccess: (_data, userId) => {
    queryClient.setQueryData(
      ['prestadores', provincia, municipality, nome, page],
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          users: oldData.users.filter((user: any) => user.id !== userId),
          pagination: {
            ...oldData.pagination,
            total: oldData.pagination.total - 1,
          },
        };
      }
    );

    toast.success("Usuário removido com sucesso!");
  },
});

const { mutateAsync: SuspenderCostumer, isPending:isSupending } = useMutation({
  mutationFn: async (userId: number) => {
    await SuspenderConta({ Id : userId });
    return userId; // ✅ Retorna o ID para usar no onSuccess
  },
  onSuccess: (userId) => {
    queryClient.setQueryData(
      ['costumers', provincia, municipality, nome, page],
      (oldData: any) => {
        if (!oldData || !oldData.users) return oldData;

        return {
          ...oldData,
          users: oldData.users.map((user: any) =>
            user.id === userId
              ? { ...user, estado_conta: 'PENDENTE' } // Atualiza só o campo alterado
              : user
          ),
        };
      }
    );

    toast.success("Conta suspenda com sucesso!", {action:true});

    // 🔁 Atualiza com backend em segundo plano (garante consistência)
    queryClient.invalidateQueries({
      queryKey: ['prestadores', provincia, municipality, nome, page],
    });
  },
  onError: () => {
    toast.error("Erro ao desativar conta. Tente novamente.");
  },
});

const { mutateAsync: DesativarCostumer, isPending: isDesativarContaPending } = useMutation({
  mutationFn: async (userId: number) => {
    await DesativarConta({ Id : userId });
    return userId; // ✅ Retorna o ID para usar no onSuccess
  },
  onSuccess: (userId) => {
    queryClient.setQueryData(
      ['costumers', provincia, municipality, nome, page],
      (oldData: any) => {
        if (!oldData || !oldData.users) return oldData;

        return {
          ...oldData,
          users: oldData.users.map((user: any) =>
            user.id === userId
              ? { ...user, estado_conta: 'DESATIVADA' } // Atualiza só o campo alterado
              : user
          ),
        };
      }
    );

    toast.success("Conta desativada com sucesso!");

    // 🔁 Atualiza com backend em segundo plano (garante consistência)
    queryClient.invalidateQueries({
      queryKey: ['prestadores', provincia, municipality, nome, page],
    });
  },
  onError: () => {
    toast.error("Erro ao desativar conta. Tente novamente.");
  },
});

const { mutateAsync: AtivarCostumer } = useMutation({
  mutationFn: async (userId: number) => {
    await AtivarConta({Id: userId });
    return userId; // ✅ retorna o ID para usar no onSuccess
  },
  onSuccess: (userId) => {
    queryClient.setQueryData(
      ['prestadores', provincia, municipality, nome, page],
      (oldData: any) => {
        if (!oldData || !oldData.users) return oldData;

        return {
          ...oldData,
          users: oldData.users.map((user: any) =>
            user.id === userId
              ? { ...user, estado_conta: 'ACTIVA' } // 🔁 usa o mesmo texto do backend
              : user
          ),
        };
      }
    );

    toast.success("Conta ativada com sucesso!");

    // 🔁 Atualiza o cache em background
    queryClient.invalidateQueries({
      queryKey: ['costumers', provincia, municipality, nome, page],
    });
  },
  onError: () => {
    toast.error("Erro ao ativar conta. Tente novamente.");
  },
});



function handlePagination(pageIndex: number) {
  // pageIndex é zero-based, precisamos enviar 1-based para URL
  const newPage = pageIndex + 1;

  const newParams = new URLSearchParams(searchParams);
  newParams.set("page", newPage.toString());

  setSearchParams(newParams);

  window.scrollTo({ top: 0, behavior: "smooth" });
}


    // if(!costumers){
    //     return
    // }

    return (
      <div className="space-y-4 pt-20">
      <h1 className="text-3xl font-bold">Prestadores</h1>
        <form onSubmit={handleSubmit(handleFilters)} className="flex flex-wrap gap-4">
          {/* Província */}
          <div>
            <Label>Província</Label>
            <Controller
              name="province"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  name={name}
                  value={value}
                  onValueChange={(val) => {
                    onChange(val);
                    handleProvinceChange(val);
                  }}
                >
                  <SelectTrigger className="h-10 w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(provinceMunicipalityMap).map((prov) => (
                      <SelectItem key={prov} value={prov}>
                        {prov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Município */}
          <div>
            <Label>Município</Label>
            <Controller
              name="municipality"
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <Select name={name} value={value} onValueChange={onChange}>
                  <SelectTrigger className="h-10 w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map((mun) => (
                      <SelectItem key={mun} value={mun}>
                        {mun}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* NIP */}
          <div>
            <Label>Nome</Label>
            <Input
                        className="mt-0.5"
                        {...rest}
                        onChange={(event) => {
                            onChange(event); // Preserva o comportamento do react-hook-form
                            handleInputChange(event); // Adiciona comportamento customizado
                        }}
                        placeholder="Pesquise..."
                    />
          </div>

          {/* Botões */}
          <div className="flex items-end gap-2">
            <Button type="submit" variant="secondary" className="flex items-center gap-1">
              <Search size={16} /> Filtrar Resultados
            </Button>
            <Button type="button" variant="outline" className="flex items-center gap-1" onClick={handleDeleteFilters}>
              <X size={16} /> Remover Filtros
            </Button>
          </div>
        </form>

        {/* Tabela */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-tr from-orange-500 to-orange-400 ">
              <TableHead className="text-white">ID</TableHead>
              <TableHead className="text-white">Avatar</TableHead>
              <TableHead className="text-white text-nowrap">Data Registo</TableHead>
              <TableHead className="text-white">Província</TableHead>
              <TableHead className="text-white">Município</TableHead>
              <TableHead className="text-white">Estado</TableHead>
              <TableHead className="text-white">Cargo</TableHead>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
<TableBody>
  {isLoading ? (
    <PacientTableSkeleton />
  ) : costumers?.users?.length ? (
    costumers.users.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.id}</TableCell>
        <TableCell>
          <Dialog>
             <DialogTrigger>
                 <Avatar>
                  <AvatarImage src={`${api.defaults.baseURL}/uploads/${row.image_path}`}></AvatarImage>
                  <AvatarFallback>{getInialts(row.nome)}</AvatarFallback>
                </Avatar>
             </DialogTrigger>
             <DialogContent>
                <img src={`${api.defaults.baseURL}/uploads/${row.image_path}`} />
             </DialogContent>
          </Dialog>
          
        </TableCell>
         <TableRow>
           <span className="text-xs text-muted-foreground mt-1">
                          {formatNotificationDate(row.created_at)}
         </span>
         </TableRow>
        <TableCell>{row.provincia}</TableCell>
        <TableCell>{row.municipio}</TableCell>
<TableCell>
  <span
    className={`
      px-2 py-1 rounded-full text-white text-sm font-medium
      ${row.estado_conta === "ACTIVA" ? "bg-green-500" : ""}
      ${row.estado_conta === "DESATIVADA" ? "bg-red-500" : ""}
      ${row.estado_conta === "PENDENTE" ? "bg-yellow-500" : ""}
    `}
  >
    {row.estado_conta}
  </span>
</TableCell>
        <TableCell>{row.role}</TableCell>
          <TableCell>
          <Dialog>
            <DialogTrigger>
                    <Button  variant="outline">
        <TableCell>{row.nome}</TableCell>
              <ChevronDown></ChevronDown>
         </Button>

             </DialogTrigger>
             <PrestadoresDetailsDialog profissao={row.profissao} estrelas={row.estrelas} description={row.description}      accountBalance={Number(row.carteira?.receita ?? 0)}
  address={row.provincia} name={row.nome} phone={row.celular} image={row.image_path}></PrestadoresDetailsDialog>
         </Dialog>
    </TableCell>
        <TableCell className="flex gap-2">

                            <Button  disabled={isSupending} onClick={()=>{SuspenderCostumer(row.id)}} variant="outline">Suspender</Button>  
   
          {row.estado_conta === 'ACTIVA' && (
            <Button onClick={()=>DesativarCostumer(row.id)} variant="outline">
               {isDesativarContaPending ? (
                  <div className="flex items-center">
                                    <Loader2 className="animate-spin"></Loader2>
                                    Desativando
                  </div>
               ):(
                <div>
                  Desativar
                </div>
               )}
            </Button>
          )}

           {row.estado_conta === 'PENDENTE' && (
            <Button onClick={()=>AtivarCostumer(row.id)} variant="outline">
               {isDesativarContaPending ? (
                  <div className="flex items-center">
                                    <Loader2 className="animate-spin"></Loader2>
                                    Activar
                  </div>
               ):(
                <div>
                  Activar
                </div>
               )}
            </Button>
          )}

             {row.estado_conta === 'DESATIVADA' && (
            <Button onClick={()=>AtivarCostumer(row.id)} variant="outline">Activar</Button>
      
          )}
          <Button onClick={()=>deleteCostumer(row.id)} variant="destructive">Eliminar</Button>
        </TableCell>
  
      </TableRow>
    ))
  ) : (
    <TableRow className="flex justify-center items-center w-screen">
      <TableCell colSpan={7} className="text-center py-4">
         <div className="flex flex-col justify-center items-center">
               <span className="text-muted-foreground">  Nenhum Prestador encontrado</span>
         </div>
      </TableCell>
    </TableRow>
  )}
</TableBody>



        </Table>

        {/* Paginação */}
        {costumers && (
               <div className="fixed w-full bottom-4 flex justify-center items-center">
          <Pagination onPageChange={handlePagination} pageIndex={page} perPage={costumers.pagination.perPage} totalCount={costumers.pagination.total} />
        </div>
        )}
      </div>
    );
  }
