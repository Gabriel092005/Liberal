// "use client";

// import { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { X, Search, ChevronDown, ChevronDownCircle } from "lucide-react";
// import { Pagination } from "./pagination";
// import { Dialog, DialogTrigger } from "@/components/ui/dialog";
// import { PrestadoresDetailsDialog } from "./prestadores-details";
// import { Popup } from "react-leaflet";
// import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// type MunicipalityMap = Record<string, string[]>;

// const provinceMunicipalityMap: MunicipalityMap = {
//   Luanda: ["Viana", "Cazenga", "Luanda", "Belas", "Kilamba Kiaxi", "Ícolo e Bengo", "Quissama", "Talatona", "Cacuaco"],
//   Bengo: ["Ambriz", "Dande", "Bula Atumba", "Nambuangongo", "Dembos", "Pango Aluquém"],
//   // ... restante das províncias
// };

// const pacientFilterSchema = z.object({
//   province: z.string().optional(),
//   municipality: z.string().optional(),
//   unidade: z.string().optional(),
//   nip: z.string().optional(),
//   page: z.number().optional(),
// });

// type PacientFilterSchema = z.infer<typeof pacientFilterSchema>;

// export function PrestadoresTableFilters() {
//   const [municipalities, setMunicipalities] = useState<string[]>(provinceMunicipalityMap["Luanda"]);
//   const searchParams = useSearchParams()[0];
//   const SetSearchParams = useSearchParams()[1];

//   const page = z.coerce.number().parse(searchParams.get("page") ?? "1");

//   const { handleSubmit, control, register, reset } = useForm<PacientFilterSchema>({
//     resolver: zodResolver(pacientFilterSchema),
//     defaultValues: {
//       province: searchParams.get("province") ?? "Luanda",
//       municipality: searchParams.get("municipality") ?? "Viana",
//       unidade: searchParams.get("unidade") ?? "CFACC",
//       nip: searchParams.get("nip") ?? "",
//     },
//   });

//   const handleProvinceChange = (province: string) => {
//     setMunicipalities(provinceMunicipalityMap[province] || []);
//   };

//   function handleFilters({ province, municipality, unidade, nip }: PacientFilterSchema) {
//     SetSearchParams((state) => {
//       province ? state.set("province", province) : state.delete("province");
//       municipality ? state.set("municipality", municipality) : state.delete("municipality");
//       unidade ? state.set("unidade", unidade) : state.delete("unidade");
//       nip ? state.set("nip", nip) : state.delete("nip");
//       state.set("page", "1");
//       return state;
//     });
//   }

//   function handleDeleteFilters() {
//     SetSearchParams((state) => {
//       state.delete("nip");
//       state.delete("municipality");
//       state.delete("unidade");
//       return state;
//     });
//     reset({ province: "", municipality: "", unidade: "", nip: "" });
//   }

//   function handlePagination(page: number) {
//     SetSearchParams((state) => {
//       state.set("page", (page + 1).toString());
//       return state;
//     });
//   }

//   return (
//     <div className="space-y-4 pt-20">
//       <div>
//          <h1 className="text-3xl font-bold">Prestadores</h1>
         
//       </div>
//       <form onSubmit={handleSubmit(handleFilters)} className="flex flex-wrap gap-4">
//         {/* Província */}
//         <div>
//           <Label>Província</Label>
//           <Controller
//             name="province"
//             control={control}
//             render={({ field: { name, onChange, value } }) => (
//               <Select
//                 name={name}
//                 value={value}
//                 onValueChange={(val) => {
//                   onChange(val);
//                   handleProvinceChange(val);
//                 }}
//               >
//                 <SelectTrigger className="h-10 w-[180px]">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.keys(provinceMunicipalityMap).map((prov) => (
//                     <SelectItem key={prov} value={prov}>
//                       {prov}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />
//         </div>

//         {/* Município */}
//         <div>
//           <Label>Município</Label>
//           <Controller
//             name="municipality"
//             control={control}
//             render={({ field: { value, onChange, name } }) => (
//               <Select name={name} value={value} onValueChange={onChange}>
//                 <SelectTrigger className="h-10 w-[180px]">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectItem value="PRESTAORES_EMPRESA">PRESTADORES EMPRESA</SelectItem>
//                     <SelectItem value="PRESTADORES_INDIVIDUAL">PRESTADORES INDIVIDUA;</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//           />
//         </div>

//         {/* NIP */}
//         <div>
//           <Label>Nome</Label>
//           <Input {...register("nip")} placeholder="Nome" />
//         </div>

//         {/* Botões */}
//         <div className="flex items-end gap-2">
//           <Button type="submit" variant="secondary" className="flex items-center gap-1">
//             <Search size={16} /> Filtrar Resultados
//           </Button>
//           <Button type="button" variant="outline" className="flex items-center gap-1" onClick={handleDeleteFilters}>
//             <X size={16} /> Remover Filtros
//           </Button>
//         </div>
//       </form>

//       {/* Tabela */}
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-gradient-to-tr from-orange-500 to-orange-400 ">
//             <TableHead className="text-white">ID</TableHead>
//             <TableHead className="text-white">Registado Em</TableHead>
//             <TableHead className="text-white">Província</TableHead>
//             <TableHead className="text-white">Município</TableHead>
//             <TableHead className="text-white">Cargo</TableHead>
//             <TableHead className="text-white">Estado</TableHead>
//             <TableHead className="text-white">Nome</TableHead>
//             <TableHead className="text-white">Ações</TableHead>
//           </TableRow>
//         </TableHeader>
//        <TableBody>
//   {[
//     { id: 1, date: "22/09/2033", province: "Luanda", municipality: "Viana", user: "@Admin", name: "João Silva", status: "red" },
//     { id: 2, date: "22/09/2033", province: "Luanda", municipality: "Viana", user: "@Admin", name: "João Silva", status: "red" },
//     { id: 3, date: "10/02/2003", province: "Luanda", municipality: "Viana", user: "@Admin", name: "João Silva", status: "red" },
//     { id: 4, date: "22/09/2033", province: "Luanda", municipality: "Viana", user: "@Admin", name: "João Silva", status: "red" },
//     { id: 5, date: "22/09/2033", province: "Luanda", municipality: "Viana", user: "@Admin", name: "João Silva", status: "red" },
//   ].map((row) => (
//     <TableRow key={row.id} className="h-8"> {/* Altura reduzida */}
//       <TableCell className="py-1 px-2">{row.id}</TableCell>
//       <TableCell className="py-1 px-2">{row.date}</TableCell>
//       <TableCell className="py-1 px-2">{row.province}</TableCell>
//       <TableCell className="py-1 px-2">{row.municipality}</TableCell>
//       <TableCell className="py-4 px-2">{row.user}</TableCell>
//       <TableCell className="py-1 px-2">
//         <div className={`h-3 w-3 rounded-full ${row.status === "red" ? "bg-red-500" : "bg-green-500"}`}></div>
//       </TableCell>
//       <TableCell className="py-1 px-2">{row.name}</TableCell>
//       <TableCell className="py-1 px-2 flex gap-2">
//         <Button  variant="outline">Activar</Button>
//         <Button  variant="outline">Eliminar</Button>
//         <Dialog>
//             <DialogTrigger>
//                    <Button  variant="outline">
//              <ChevronDown></ChevronDown>
//         </Button>

//             </DialogTrigger>
//             <PrestadoresDetailsDialog></PrestadoresDetailsDialog>
//         </Dialog>
      
//       </TableCell>
//     </TableRow>
//   ))}
// </TableBody>

//       </Table>

//       {/* Paginação */}
//       <div className="fixed w-full bottom-4 flex justify-center items-center">
//         <Pagination onPageChange={handlePagination} pageIndex={page} perPage={12} totalCount={20} />
//       </div>
//     </div>
//   );
// }
