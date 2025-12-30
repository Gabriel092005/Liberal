import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Search, X, Send, 
  MoreVertical,Smile, 
} from "lucide-react";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// --- MOCKS ---
const CHAT_USERS = [
  { id: 1, nome: "Apoio ao Cliente", status: "online", ultimaMsg: "Olá! Como posso ajudar?", timing: "Agora", unread: 2, img: "https://i.pravatar.cc/150?u=support" },
  { id: 2, nome: "Dr. Edson Manuel", status: "online", ultimaMsg: "Obrigado pelo contacto.", timing: "14:20", unread: 0, img: "https://i.pravatar.cc/150?u=edson" },
  { id: 3, nome: "Sara Antunes", status: "offline", ultimaMsg: "Agendamento confirmado.", timing: "Ontem", unread: 0, img: "https://i.pravatar.cc/150?u=sara" },
];

// --- COMPONENTE DA JANELA DE CONVERSA (POPOVER) ---
function ChatWindow({ user, onClose }: { user: any; onClose: () => void }) {
  const [msg, setMsg] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-[999] w-[350px] h-[500px] bg-white dark:bg-neutral-900 shadow-2xl rounded-[2rem] border dark:border-neutral-800 flex flex-col overflow-hidden ring-1 ring-black/5"
    >
      {/* Header */}
      <div className="p-4 bg-emerald-600 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-white/20">
            <AvatarImage src={user.img} />
            <AvatarFallback>{user.nome[0]}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-bold">{user.nome}</p>
            <p className="text-[10px] opacity-80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white rounded-full"><MoreVertical size={16}/></Button>
          <Button onClick={onClose} variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full"><X size={18}/></Button>
        </div>
      </div>

      {/* Messages List */}
      <ScrollArea className="flex-1 p-4 bg-slate-50 dark:bg-neutral-950">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <div className="bg-white dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none text-xs shadow-sm max-w-[85%] text-neutral-700 dark:text-neutral-300">
              Olá! Em que posso ser útil hoje?
            </div>
            <span className="text-[9px] text-neutral-400 ml-1">10:30</span>
          </div>
          
          <div className="flex flex-col gap-1 items-end">
            <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none text-xs shadow-md max-w-[85%]">
              Gostaria de saber a disponibilidade para um serviço de consultoria.
            </div>
            <span className="text-[9px] text-neutral-400 mr-1">10:32 • Lido</span>
          </div>
        </div>
      </ScrollArea>

      {/* Input Footer */}
      <div className="p-3 bg-white dark:bg-neutral-900 border-t dark:border-neutral-800">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-neutral-800 p-1.5 rounded-2xl">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 rounded-full"><Smile size={18}/></Button>
          <Input 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Mensagem..." 
            className="border-none bg-transparent focus-visible:ring-0 text-sm h-8"
          />
          <Button size="icon" className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 rounded-full shrink-0 shadow-lg transition-transform active:scale-90">
            <Send size={14} className="text-white" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// --- COMPONENTE PRINCIPAL (TRIGGER + LISTA) ---
export function ChatIntegrado() {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <motion.div 
            whileHover={{ y: -2 }} 
            whileTap={{ scale: 0.96 }}
            className="flex cursor-pointer items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 border border-neutral-100 dark:border-neutral-800 rounded-full shadow-sm"
          >
            <div className="relative">
              <div className="p-2 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-500/20">
                <MessageSquare size={16}/>
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 border border-white"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold leading-none">Chat</span>
                <Badge className="h-3 px-1 text-[8px] bg-emerald-500 border-none">LIVE</Badge>
              </div>
              <span className="text-[9px] text-muted-foreground font-medium">Suporte Online</span>
            </div>
          </motion.div>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-[400px] p-0 bg-slate-50 dark:bg-neutral-950 border-none shadow-2xl">
          <SheetHeader className="p-6 bg-white dark:bg-neutral-900 border-b dark:border-neutral-800">
            <SheetTitle className="text-2xl font-black flex items-center gap-2">
              Mensagens
              <Badge variant="secondary" className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{CHAT_USERS.length}</Badge>
            </SheetTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Pesquisar conversa..." className="pl-10 rounded-xl bg-slate-100 dark:bg-neutral-800 border-none" />
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-140px)] p-4">
            <div className="space-y-3">
              {CHAT_USERS.map((user) => (
                <SheetClose asChild key={user.id}>
                  <div
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white dark:bg-neutral-900 border border-transparent hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer active:scale-[0.98] group"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12 rounded-2xl border-2 border-transparent group-hover:border-emerald-500 transition-all">
                        <AvatarImage src={user.img} className="object-cover" />
                        <AvatarFallback>{user.nome[0]}</AvatarFallback>
                      </Avatar>
                      {user.status === "online" && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white dark:border-neutral-900 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold truncate">{user.nome}</h4>
                        <span className="text-[10px] text-muted-foreground font-medium">{user.timing}</span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">{user.ultimaMsg}</p>
                    </div>
                    {user.unread > 0 && (
                      <Badge className="bg-emerald-500 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                        {user.unread}
                      </Badge>
                    )}
                  </div>
                </SheetClose>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

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