import { DialogContent } from "@/components/ui/dialog";
import { api } from "@/lib/axios";


export function OpenOnFullScreenPhoto({imagePath}:{imagePath:string|null}){
    return(
          <DialogContent>
          <img  src={`${api.defaults.baseURL}/uploads/${imagePath}`}  alt="" />
         </DialogContent>
    )

}