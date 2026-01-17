import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare, Search,
  Send,
  Smile,
  X
} from "lucide-react";
import { useState } from "react";

const CHAT_USERS = [
  { id: 1, nome: "Apoio ao Cliente", status: "online", ultimaMsg: "Olá! Como posso ajudar?", timing: "Agora", unread: 2, img: "https://i.pravatar.cc/150?u=support" },
  { id: 2, nome: "Dr. Edson Manuel", status: "online", ultimaMsg: "Obrigado pelo contacto.", timing: "14:20", unread: 0, img: "https://i.pravatar.cc/150?u=edson" },
  { id: 3, nome: "Sara Antunes", status: "offline", ultimaMsg: "Agendamento confirmado.", timing: "Ontem", unread: 0, img: "https://i.pravatar.cc/150?u=sara" },
];

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

// --- TRIGGER E LISTA ---
export function ChatIntegrado() {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {/* BOTÃO FLUTUANTE AJUSTADO: bottom-28 para ficar acima da BottomNav */}
          <div className="fixed bottom-28 right-6 sm:bottom-8 sm:right-8 z-[9990]">
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

        <SheetContent 
          side="right" 
          className="w-full h-full sm:max-w-[420px] p-0 bg-white dark:bg-zinc-950 border-none shadow-2xl z-[9999]"
        >
          <SheetHeader className="p-8 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-end">
              <SheetTitle className="text-3xl font-black italic tracking-tighter uppercase text-zinc-900 dark:text-white">Conversas</SheetTitle>
              <Badge className="bg-orange-500 font-black px-3 py-1">2 NOVAS</Badge>
            </div>
            <div className="relative mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <Input 
                placeholder="Pesquisar..." 
                className="h-14 pl-12 rounded-2xl bg-white dark:bg-zinc-800 border-none font-bold shadow-sm" 
              />
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-220px)] p-6">
            <div className="space-y-4">
              {CHAT_USERS.map((user) => (
                <SheetClose asChild key={user.id}>
                  <div
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center gap-4 p-5 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50 border-2 border-transparent hover:border-orange-500/30 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer group active:scale-[0.97]"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-16 w-16 rounded-[1.8rem] border-2 border-white dark:border-zinc-800 shadow-md group-hover:scale-110 transition-transform">
                        <AvatarImage src={user.img} className="object-cover" />
                        <AvatarFallback className="bg-orange-500 text-white font-bold">{user.nome[0]}</AvatarFallback>
                      </Avatar>
                      {user.status === "online" && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-zinc-900 rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-black uppercase italic text-zinc-800 dark:text-zinc-100">{user.nome}</h4>
                        <span className="text-[10px] text-zinc-400 font-black uppercase italic">{user.timing}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate font-bold uppercase tracking-tight">{user.ultimaMsg}</p>
                    </div>

                    {user.unread > 0 && (
                      <div className="h-6 min-w-[24px] px-1 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-orange-500/40">
                        {user.unread}
                      </div>
                    )}
                  </div>
                </SheetClose>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* JANELA DE CHAT FLUTUANTE */}
      <AnimatePresence>
        {selectedUser && (
          <ChatWindow 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}