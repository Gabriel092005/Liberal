// import {
//   Card,
//   CardHeader,
//   CardTitle
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Inbox, MessageSquareOff, Plus, Send, } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useEffect, useRef, useState } from "react";
// import { formatDistanceToNow } from "date-fns";
// import { ptBR } from "date-fns/locale"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { useMutation, useQuery } from "@tanstack/react-query";

// import { DialogDescription } from "@radix-ui/react-dialog";
// import { useSearchParams } from "react-router-dom";
// // import { SendMessages } from "./Enviar-mensagem";


// interface Props {
//    userId:string
//    name:string
//    contact:number
// }

// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   type: "info" | "success" | "warning" | "message";
//   isNew: boolean;
//   createdAt: string;
//   sender?: { name: string };
// };



// export function MessagesHOME() {


//   const [notification, setNotification] = useState<Notification[]>([])
  
//   const [searchParams, SetSearchParams] = useSearchParams();
//   const [searchNip, setSearchNip] = useState("");

//   const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
//   const [newMessage, setNewMessage] = useState("");
//   const userId = searchParams.get('userId')
//   const name = searchParams.get('name')
//   const phone = searchParams.get('contact')









//     const authUserId = localStorage.getItem('userId')











//  async function handleSearchTalking(data:Props){
//   const {userId,contact,name} = data
//       SetSearchParams(state=>{
//         state.set('userId', userId)
//         state.set('name',name),
//         state.set('contact', String(contact))
//         return state
//       })

      
//   }
//  const isSender = true;




//     function handleSearchUsersg(nip:string){

//       SetSearchParams(state=>{
//         state.set('nip', nip)
//         return state
//       })

//   }

  
//   return (
//     <DialogContent  className="h-full w-full right-24s max-w-4xl  mx-auto mt-[90px] fixed ">
     
//         {/* <SideBar /> */}

//         {/* Header */}
//         <CardHeader className="bg-zinc-100 dark:bg-black">
//           <CardTitle className="text-xl font-bold text-800 dark:text-white">
//             <div className="flex items-center justify-between">
//             { name ? (
//                     <div className="flex"> 
//                     <Avatar className="bg-green-600">
//                        <AvatarFallback>GM</AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-col p-0 m-0 mt-0 mb-0">
//                     <span className="text-sm">{name}</span>
//                     <span className="text-muted-foreground text-xs">+244 {phone}..</span>
//                     </div>
//                     </div>
//             ):(
//               <div className="flex flex-col">
//                <span className="tracking-tight text-3xl font-bold">Conversas</span>
//                 <p className="text-xs text-muted-foreground font-medium">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis suscipit repellat accusamus, iusto .</p>
//               </div>
//             )
                
//             }
             
//              <Dialog>
//   <DialogTrigger>
//     <Button size="icon" className="rounded-full bg-blue-500 hover:bg-blue-600">
//       <Plus className="h-4 w-4 text-white" />
//     </Button>
//   </DialogTrigger>

//   <DialogContent className="max-w-md w-full max-h-[80vh] overflow-hidden rounded-xl shadow-xl border border-zinc-200 p-0">
//     {/* Header fixo */}
//     <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b px-4 py-3">
//       <DialogHeader>
//         <DialogTitle className="text-lg font-semibold">Agentes</DialogTitle>
//         <DialogDescription className="text-sm text-muted-foreground">
//           Selecione um agente/técnico para conversar sua mensagem
//         </DialogDescription>

//         <Input
//           placeholder="Pesquise por NIP..."
//           value={searchNip}
//           onChange={(e) => setSearchNip(e.target.value)}
//           className="mt-2"
//         />
//       </DialogHeader>
//     </div>

//     {/* Lista com scroll */}

  
//   </DialogContent>
// </Dialog>

             
//             </div>
//           </CardTitle>
    
//     </CardHeader>
//         <Separator />
//     <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-white dark:bg-black" >


//         <div
//           className={`flex gap-3 ${isSender ? "justify-end" : "justify-start"}`}
//         >
        
//             <Avatar className="h-8 w-8 shadow-sm bg-black">
//               <AvatarImage />
//               <AvatarFallback>13DD</AvatarFallback>
//             </Avatar>
      

//           <div className="flex flex-col max-w-[75%]">
//             <div
//               className={`py-2 px-4 text-sm shadow-sm break-words whitespace-pre-wrap ${
//                 isSender
//                   ? "bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
//                   : "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white rounded-tr-lg rounded-br-lg rounded-tl-lg"
//               }`}
//             >.
//             </div>
//             <span className="text-[10px] text-muted-foreground dark:text-zinc-400">
//                 2222
//             </span>
//           </div>

//           {isSender&& (
//             <Avatar className="h-8 w-8 shadow-sm">
//               <AvatarImage src={`http://localhost}`} />
//               <AvatarFallback>ddd</AvatarFallback>
//             </Avatar>
//           )}
//         </div>

 
// </div>



//         <Separator />

//         {/* Message input */}
//         <form
      
//           className="bg-zinc-100 dark:bg-zinc-800 flex items-center gap-2 p-3"
//         >
//           <Input
//             placeholder="Escreva sua mensagem..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             className="flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 px-4 py-2"
//           />
//           <Button type="submit" size="icon" className="rounded-full bg-blue-500 hover:bg-blue-600">
//             <Send className="h-4 w-4 text-white" />
//           </Button>
//         </form>
   
//     </DialogContent>
//   );
// }
