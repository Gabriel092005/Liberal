import { GetCategory } from "@/api/get-categories";
import { RegisterNewProfission } from "@/api/new-profissionts";
import { newPackage } from "@/api/novo-pacote";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet,SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { getInialts } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard,Loader2, Plus} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
} from 'recharts';
import { toast } from "sonner";
import color from 'tailwindcss/colors';
import z from "zod";
import { NewCategorySheetContent } from "./new-categorySheet";
import { GraphicsSales } from "@/api/fetch-graphics";
import { useState } from "react";




export function SellingsCharts() {

  const {data:sales} = useQuery({
    queryKey:['sales'],
    queryFn:GraphicsSales
  })
  // interface  DialogLayoutStateTypes {
  //    showList:boolean
  // }

  const [showList, _] = useState<boolean>(true)
  console.log(showList)

    const {mutateAsync:createNewPackage, isPending} = useMutation({
    mutationFn:newPackage,
    onSuccess(){
       toast.success("Plano criado com sucesso para todos os prestadores")
    }
  })
  const queryClient = useQueryClient();

 


  const {data:category, isLoading:isLoadingCategories} = useQuery({
    queryKey:['category'],
    queryFn:()=>GetCategory({query:''})
  })
  const {mutateAsync:newProfission,isPending:isCategoryPending} = useMutation({
    mutationFn:RegisterNewProfission,

      onSuccess: () => {
 queryClient.invalidateQueries({
  queryKey: ['category'],
});
  },

  })
  const createNewProfissionRequestParams = z.object({
    categoryId:z.string(),
    title:z.string()
  })
  type CreateNewProfissionRequestParams =z.infer<typeof createNewProfissionRequestParams>

  const {control, handleSubmit:Submit, register:Register,} = useForm<CreateNewProfissionRequestParams>()
  
async function handleCreateNewProfission(data: CreateNewProfissionRequestParams) {
  try {
    console.log(data)
    await newProfission(data);
    toast.success("Serviço cadastrado com sucesso!");
    // reset(); // limpa formulário
  } catch (err) {
    toast.error("Erro ao cadastrar serviço");
  }
}
  const createNewPackageBodySchema = z.object({
     title:z.string(),
     preco:z.number(),
     validade:z.string(),
     beneficio1:z.string(),
     beneficio2:z.string()
  })

   type CreateNewPackageTypes = z.infer< typeof createNewPackageBodySchema> 
   const {handleSubmit, register} = useForm<CreateNewPackageTypes>()

   async function  handleCreateNewPackage(data:CreateNewPackageTypes) {   
      const {
        beneficio1,
        beneficio2,
        validade,
        preco,
        title
      }=data

      await createNewPackage({
        title,
        preco,
        validade,
        beneficio1,
        beneficio2
      })
    
   }
   if(!category){
      return
   }
  return (

    <Card className="w-[53rem] m-0 relative bg-muted border-0">
      <CardHeader className=" justify-between flex ">
        <div className="flex justify-between">
              <div>
                  <CardTitle>Receitas obitadas por Mês</CardTitle>
                 <CardDescription>Receitas obitidas mensalmente e picos de vendas</CardDescription>
        </div>
        <div>
            <Dialog>
                  <DialogTrigger>
                       <Button variant='outline'>
                <CreditCard className="text-orange-500"></CreditCard>
                  Novo Plano
              </Button>

                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                          <DialogTitle>Planos</DialogTitle>
                          <DialogDescription>Aqui pode cadastrar um novo plano </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleCreateNewPackage)} className="flex flex-col gap-4">
                          <div className="flex gap-2">
                              <Input {...register('title')} required placeholder="Nome do plano"></Input>
                              <Input  type="number" required  {...register('preco')} placeholder="Valor do plano"></Input>
                          </div>
                         {/* <div>
                               <Label htmlFor="1">1-Benéficio</Label>
                                <Input  {...register('beneficio1')} id="1" placeholder="Primeiro"></Input>
                         </div>

                          <div>
                               <Label htmlFor="1">2-Benéficio</Label>
                                <Input {...register('beneficio2')} id="1" placeholder="Segundo"></Input>
                         </div> */}
                          {/* <div>
                               <Label htmlFor="1">3-Benéficio</Label>
                                <Input disabled id="1" placeholder="Terceiro"></Input>
                         </div> */}
                              <div>
                               <Label htmlFor="1">Duração do plano</Label>
                                <Input required {...register('validade')} id="1" placeholder="Duração em dias..."></Input>
                         </div>
                         <Button disabled={isPending} type="submit">
                            {isPending ? (
                            <Loader2 className="animate-spin"></Loader2>
                            ):(
                              <span>
                                Criar
                              </span>
                            )}

                         </Button>

                    </form>
                  </DialogContent>
            </Dialog>
          <Dialog>
  <DialogTrigger>
    <Button className="ml-2" variant="outline">
      <Plus /> Novo Serviço
    </Button>
  </DialogTrigger>

 {showList ? (
   <DialogContent>
    <DialogTitle>Novo Serviço</DialogTitle>
    <DialogDescription>
      Escolha uma categoria e informe o nome do serviço
    </DialogDescription>

    <form onSubmit={Submit(handleCreateNewProfission)} className="flex flex-col gap-3">
      <Input {...Register("title")} placeholder="Nome do serviço" />

      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCategories ? (
                <div className="flex flex-col gap-2 p-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                category?.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`${api.defaults.baseURL}/uploads/${c.image_path}`}
                        />
                        <AvatarFallback>{getInialts(c.titulo)}</AvatarFallback>
                      </Avatar>
                      <span>{c.titulo}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      />
   

      <Button type="submit" disabled={isCategoryPending}>
        {isPending ? <Loader2 className="animate-spin" /> : "Cadastrar"}
      </Button>
    </form>
  </DialogContent >
 ):(
   <DialogContent className="overflow-auto scroll-y h-80  ">
   
   </DialogContent>
 )}
</Dialog>
           <Sheet>
              <SheetTrigger asChild>
                 <Button>Nova Categória</Button>
              </SheetTrigger>
               <NewCategorySheetContent></NewCategorySheetContent>
           </Sheet>
        </div>
        </div>       
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={sales} style={{ fontSize: 12 , color:'' }}>
            <Line type="linear" strokeWidth={2} dataKey="amount" stroke={color.violet[500]} />
            <XAxis dataKey="mounth" tickLine={false} axisLine={false} dy={16} />
            <YAxis width={80} stroke="#888" axisLine={false} />
            <CartesianGrid className="dark:stroke-slate-950" vertical={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
