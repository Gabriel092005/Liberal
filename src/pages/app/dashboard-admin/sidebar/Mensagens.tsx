import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Smile,
  X
} from "lucide-react";
import { useState } from "react";



// --- JANELA DE CHAT ABERTA (MÁXIMA PRIORIDADE) ---
function ChatWindow({ user, onClose }: { user: any; onClose: () => void }) {
  const [msg, setMsg] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      /* z-[9999] para cobrir TUDO no mobile */
      className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[9999] w-full h-[100dvh] sm:w-[380px] sm:h-[650px] bg-white dark:bg-zinc-950 shadow-2xl sm:rounded-[2.5rem] flex flex-col overflow-hidden border-none"
    >
      {/* Header Laranja */}
      <div className="pt-12 pb-5 px-6 sm:pt-6 bg-orange-500 text-white flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <Button onClick={onClose} variant="ghost" size="icon" className="sm:hidden text-white -ml-2 hover:bg-white/10 rounded-full">
            <ArrowLeft size={24} />
          </Button>
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white/20 shadow-md">
              <AvatarImage src={user.img} className="object-cover" />
              <AvatarFallback className="bg-orange-600 font-bold">{user.nome[0]}</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-orange-500 rounded-full" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-black uppercase tracking-tight italic">{user.nome}</p>
            <p className="text-[10px] opacity-90 font-bold uppercase tracking-widest">Online</p>
          </div>
        </div>
        <Button onClick={onClose} variant="ghost" size="icon" className="hidden sm:flex h-9 w-9 text-white hover:bg-white/10 rounded-full">
          <X size={20}/>
        </Button>
      </div>

      {/* Área de Mensagens */}
      <ScrollArea className="flex-1 p-6 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="space-y-6">
          <div className="flex flex-col gap-1 items-start">
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-[1.5rem] rounded-tl-none text-sm shadow-sm max-w-[85%] text-zinc-800 dark:text-zinc-200 font-medium border border-zinc-100 dark:border-zinc-700">
              Olá! Como podemos ajudar no seu serviço de {user.nome}?
            </div>
            <span className="text-[10px] text-zinc-400 font-black ml-2 uppercase">10:30</span>
          </div>
          
          <div className="flex flex-col gap-1 items-end">
            <div className="bg-orange-500 text-white p-4 rounded-[1.5rem] rounded-tr-none text-sm shadow-md shadow-orange-500/20 max-w-[85%] font-bold italic">
              Preciso de um orçamento urgente para Luanda.
            </div>
            <span className="text-[10px] text-zinc-400 font-black mr-2 uppercase tracking-tighter">10:32 • LIDO</span>
          </div>
        </div>
      </ScrollArea>

      {/* Input de Mensagem */}
      <div className="p-4 pb-10 sm:pb-6 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-2 rounded-[2rem]">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-orange-500 rounded-full shrink-0 transition-colors"><Smile size={22}/></Button>
          <Input 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Escreva aqui..." 
            className="border-none bg-transparent focus-visible:ring-0 text-sm h-10 font-bold"
          />
          <Button 
            disabled={!msg}
            size="icon" 
            className="h-10 w-10 bg-orange-500 hover:bg-orange-600 rounded-full shrink-0 shadow-lg shadow-orange-500/30 transition-all active:scale-90 disabled:opacity-30"
          >
            <Send size={18} className="text-white fill-white" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
export function ChatIntegrado() {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {/* AJUSTE DE Z-INDEX: z-[40] para ficar abaixo do Dialog (z-[50])
              Adicionado 'group-data-[state=open]:hidden' se quiser esconder quando o sheet abrir,
              mas o principal é que o Dialog Overlay vai cobrir este z-index.
          */}
          <div className="fixed bottom-28 right-6 sm:bottom-8 sm:right-8 z-[40] pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 pl-4 pr-6 py-3 bg-white dark:bg-zinc-900 border-2 border-orange-500/10 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.15)] group"
            >
              <div className="relative">
                <div className="p-3 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-500/30 group-hover:bg-orange-600 transition-colors">
                  <MessageSquare size={22} fill="currentColor" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-5 w-5 bg-zinc-950 rounded-full text-[10px] text-white items-center justify-center font-black border-2 border-white dark:border-zinc-900">2</span>
              </div>
              <div className="text-left hidden xs:block">
                <p className="text-xs font-black uppercase tracking-tighter leading-none text-zinc-800 dark:text-white">Mensagens</p>
                <p className="text-[9px] text-orange-500 font-black uppercase mt-1 tracking-widest">Online</p>
              </div>
            </motion.button>
          </div>
        </SheetTrigger>

        {/* Sheet também ajustado para z-[45] */}
        <SheetContent 
          side="right" 
          className="w-full h-full sm:max-w-[420px] p-0 bg-white dark:bg-zinc-950 border-none shadow-2xl z-[45]"
        >
          {/* ... conteúdo do sheet (mantenha igual) ... */}
        </SheetContent>
      </Sheet>

      {/* JANELA DE CHAT FLUTUANTE - z-[48] */}
      <AnimatePresence>
        {selectedUser && (
          <div className="z-[48] relative"> 
             <ChatWindow 
               user={selectedUser} 
               onClose={() => setSelectedUser(null)} 
             />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
