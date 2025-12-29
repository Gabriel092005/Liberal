import { Input } from "@/components/ui/input";
import { SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
// import * as FileInput from '../app/dashboard-admin/sidebar/FileInput'
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RegisterNewCategory } from "@/api/new-category";
import z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
export function NewCategorySheetContent(){
    const queryClient = useQueryClient();
    const  registerNewCategoryParams = z.object({
         title:z.string()
    })
  type RegisterNewCategoryTypes = z.infer< typeof registerNewCategoryParams>
  const {reset, register, handleSubmit} = useForm<RegisterNewCategoryTypes>()
  const [photo, setPhoto] = useState<File | null>(null);

  const {mutateAsync:NewCategory, isPending}  = useMutation({
    mutationFn:RegisterNewCategory, 
    onError:()=>{
        toast.error("Alguma coisa deu errada, por favor tente mais tardr")
    },
          onSuccess: () => {
 queryClient.invalidateQueries({
  queryKey: ['category'],
})
  },
    
     
  })

      async function handleCreateNewCategory(data:RegisterNewCategoryTypes){
        const {title} = data
        console.log(photo)
         await NewCategory({
            image:photo,
            title:title
         })
         reset()
      }
   return(
     <SheetContent>
                  <SheetTitle>
                      Categória
                  </SheetTitle>
                  <SheetDescription>
                     Cria novas categórias de serviços para mais obter mais clientes
                  </SheetDescription>
                  <form action="" onSubmit={handleSubmit(handleCreateNewCategory)} className="pt-4 flex flex-col gap-4">
                  <Input required min="1" {...register('title')} placeholder="Nome da profissão"></Input>
                  <div>
               <Input type="file"    onChange={(e) =>
                        setPhoto(e.target.files ? e.target.files[0] : null)
                      }  ></Input>
                      
                   {/* <FileInput.Root     
                        <FileInput.Trigger  />
                        <FileInput.FileList />
                        <FileInput.Control />
                 </FileInput.Root> */}
                  </div>
                  <Button disabled={isPending} type="submit">Cadastrar</Button>
                  </form>
              </SheetContent>
   )
}