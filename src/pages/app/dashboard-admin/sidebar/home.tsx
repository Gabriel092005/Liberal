import { GetCategory } from "@/api/get-categories";
import { GetUserProfile } from "@/api/get-profile";
import { GetProfission } from "@/api/get-profissions";
import { Logout } from "@/api/log-out";
import logo from '@/assets/logo-01.png'

import { PrestadoresDestaques } from "@/api/porfissionais-destaques";
import { UpdatePhoto } from "@/api/update-profile-photo";
import servico1 from "@/assets/IMG-20250928-WA0054.jpg";
import servico3 from "@/assets/IMG-20250928-WA0056.jpg";
import servico2 from "@/assets/IMG-20250928-WA0057.jpg";
import servico4 from "@/assets/IMG-20250928-WA0058.jpg";
import servico5 from "@/assets/IMG-20250928-WA0059.jpg";
import servico6 from "@/assets/IMG-20250928-WA0069.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { socket } from "@/lib/socket";
import { getInialts } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookMarked,
  Camera,
  Loader2,
  LogOut,
  MessageCircle,
  Search,
  Sparkles
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DestaquesAuto } from "./destacados";
import { ChatIntegrado } from "./Mensagens";
import { NotificationDropdownCostumer } from "./Notification/notif-dropdown-costumer";
import { AppFooter } from "./footer";





export function Home() {
  const categorias = [
    { image: servico3, title: 'Madeira & Oficios', to: '/madeira' },
    { image: servico1, title: 'Electricidade & Manuntenção', to: '/electricidade' },
    { image: servico2, title: 'Educação', to: '/ensino' },
    { image: servico4, title: 'Beleza & Moda', to: '/moda' },
    { image: servico5, title: 'Serviços Domésticos', to: '/domestica' },
    { image: servico6, title: 'Tecnologias & Design', to: '/tecnologia' },
    { image: servico4, title: 'Mais Profissionais', to: '/mais' }
  ];

  interface SearchProfissionTypes { categoryId: string }

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Queries
  const { data: categories, refetch: refetchCategories } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => GetCategory({ query: '' })
  });

  const { data: destacados, isLoading: iSLoadingDestaques } = useQuery({
    queryKey: ["destaques"],
    queryFn: PrestadoresDestaques,
    refetchOnMount: true,
    staleTime: 0,
  });

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
    refetchOnMount: true,
    staleTime: 0,
  });

  // const { data: profByCategoy } = useQuery({
  //   queryKey: ['byCategory', categoryId],
  //   queryFn: () => GetProfissaoByCategory({ categoryId: Number(categoryId) }),
  //   enabled: !!categoryId
  // });

  const { data: profissao } = useQuery({
    queryKey: ['profissao'],
    queryFn: GetProfission
  });

  // Mutations
  const { mutateAsync: Sair } = useMutation({ mutationFn: Logout });
  const { mutateAsync: changeProfilePhoto } = useMutation({ mutationFn: UpdatePhoto });

  // Handlers
  function handleSearchProfission({ categoryId }: SearchProfissionTypes) {
    setSearchParams((state) => {
      categoryId ? state.set("category", categoryId) : state.delete("category");
      return state;
    });
  }

  const handleSignOut = async () => { await Sair(); };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (selectedFile) changeProfilePhoto({ image_path: selectedFile });
  };

  const imageSrc = preview || (profile?.image_path
    ? `${api.defaults.baseURL}/uploads/${profile.image_path}`
    : "https://i.pravatar.cc/150?u=placeholder");

  // Effects
  useEffect(() => {
    refetchCategories();
  }, [categoryId, refetchCategories]);

  useEffect(() => {
    const seen = localStorage.getItem("app_onboarding_seen_v1");
    if (!seen) navigate("/sign-up");
  }, [navigate]);

  useEffect(() => {
    if (!profile?.id) return;
    socket.emit("register", profile.id);
    audioRef.current = new Audio("/bell-98033.mp3");
    socket.on("user", () => {
      refetch();
      audioRef.current?.play().catch(() => {});
    });
    return () => { socket.off("user"); };
  }, [profile, refetch]);

  // Roles Check
  useEffect(() => {
    if (profile?.role === 'PRESTADOR_COLECTIVO' || profile?.role === 'PRESTADOR_INDIVIDUAL') navigate("/servicos");
    if (profile?.role === 'ADMIN') navigate("/início");
  }, [profile, navigate]);

  // Loading State
  if (!profile || !categories || !profissao) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-background">
        <motion.div className="relative flex items-center justify-center" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
          <div className="absolute w-16 h-16 rounded-full border-t-4 border-b-4 border-t-orange-500 border-b-pink-500" />
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-background flex flex-col antialiased">
      {/* HEADER FIXO */}
      <header className="flex-none sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center gap-3 sm:gap-4">
    
     
    <Link to="/" className="flex-shrink-0 flex items-center gap-2 group mr-2">
        <img src={logo} alt=""className="h-9 w-10" />
      
      <div className="hidden md:flex flex-col">
        <span className="font-black text-lg leading-none tracking-tighter">
          LIBERAL<span className="text-orange-500">.</span>
        </span>
        <span className="text-[10px] font-bold text-muted-foreground leading-none">ANGOLA</span>
      </div>
    </Link>

    {/* PERFIL */}
    <div className="flex items-center gap-3 flex-shrink-0 border-l pl-3 sm:pl-4 border-zinc-200 dark:border-zinc-800">
      <Dialog>
        <DialogTrigger asChild>
          <motion.button whileTap={{ scale: 0.95 }} className="relative group focus:outline-none">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-orange-500/10 group-hover:ring-orange-500 transition-all">
              <AvatarImage src={imageSrc} className="object-cover" />
              <AvatarFallback className="font-bold">{profile?.nome?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          </motion.button>
        </DialogTrigger>
        {/* ... conteúdo do Dialog (mantido igual) ... */}
        <DialogContent className="max-w-md rounded-[2.5rem]">
          <DialogHeader><DialogTitle className="text-center">Minha Conta</DialogTitle></DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative group">
              <img src={imageSrc} className="w-28 h-28 rounded-full object-cover ring-4 ring-orange-400" />
              <label htmlFor="file-up" className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer text-white shadow-lg">
                <Camera size={18} />
              </label>
              <input id="file-up" type="file" className="hidden" onChange={handleFileChange} />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">{profile?.nome}</h3>
              <p className="text-sm text-muted-foreground">+244 {profile?.celular}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 rounded-xl font-bold">Salvar</Button>
            <Button onClick={handleSignOut} variant="outline" className="text-red-500 rounded-xl"><LogOut className="mr-2" size={16}/> Sair</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="hidden lg:flex flex-col truncate max-w-[100px]">
        <span className="text-sm font-bold truncate leading-none">{profile?.nome?.split(' ')[0]}</span>
        <span className="text-[10px] text-orange-500 font-bold uppercase mt-1">Ouro</span>
      </div>
    </div>

    {/* PESQUISA */}
    <div className="flex-1 flex justify-center px-2">
      <DropdownMenu>
        {/* ... conteúdo da pesquisa (mantido igual) ... */}
        <DropdownMenuTrigger asChild>
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
            <Input readOnly placeholder="Buscar mais profissões..." className="h-10 sm:h-11 pl-10 w-full rounded-2xl bg-muted/50 border-transparent cursor-pointer" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[90vw] sm:w-[450px] mt-2 rounded-[2rem] p-0 shadow-2xl overflow-hidden border-zinc-200 dark:border-zinc-800">
          <ScrollArea className="h-[70vh] sm:h-[550px] w-full p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase px-1 mb-4 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-10 py-1">
              Explorar Categorias
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 pb-4">
              {categories?.map((c) => (
                <Link to={`/categorias/${c.id}/profissoes`} key={c.id} className="inline-flex items-center gap-1.5 mt-1">
                  <div onClick={() => handleSearchProfission({ categoryId: String(c.id) })} className="group cursor-pointer p-4 rounded-2xl bg-slate-50 dark:bg-muted/50 hover:bg-white dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-orange-500/20 shadow-sm w-full">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
                        {c.image_path ? (
                          <img src={`${api.defaults.baseURL}/uploads/${c.image_path}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-orange-500 uppercase">{getInialts(c.titulo)}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-sm truncate">{c.titulo}</h4>
                        <div className="flex items-center">
                          <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest">Ver Profissões</span>
                          <ArrowRight size={12} className="text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* AÇÕES */}
    <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
      {/* <ModeToggle /> */}
      {profile && <NotificationDropdownCostumer {...profile} />}
    </div>
  </div>
</header>
      {/* CONTEÚDO COM SCROLL NATIVO (IMPEDE O BLOQUEIO DO SLIDE) */}
      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="max-w-7xl mx-auto px-4  py-3 space-y-8 pb-24">
          
          {/* BOTÕES DE NAVEGAÇÃO HORIZONTAL */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar -pb-1">
            <Link to="/vitrine">
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 border rounded-full shadow-sm">
                <div className="p-2 bg-orange-500 rounded-full text-white"><BookMarked size={16}/></div>
                <div className="flex flex-col"><span className="text-xs font-bold leading-none">Vitrine</span><span className="text-[9px] text-muted-foreground">Explorar</span></div>
              </motion.div>
            </Link>
            <Link to="/comment">
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 border rounded-full shadow-sm">
                <div className="p-2 bg-blue-500 rounded-full text-white"><MessageCircle size={16}/></div>
                <div className="flex flex-col"><span className="text-xs font-bold leading-none">Feedbacks</span><span className="text-[9px] text-muted-foreground">Comunidade</span></div>
              </motion.div>
            </Link>

          <ChatIntegrado></ChatIntegrado>
          </div>


          {/* SEÇÃO DE DESTAQUES (SLIDE AGORA FUNCIONA) */}
        

          {/* GRID DE CATEGORIAS */}
          <section className="space-y-4">
            {/* <h2 className="text-xl font-black tracking-tighter px-1">Todas Categorias</h2> */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {categorias.map((o) => (
                <Link to={o.to} key={o.title} className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-muted shadow-sm hover:shadow-xl transition-all">
                  <img src={o.image} alt={o.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <span className="absolute bottom-4 left-4 text-white text-xs font-black bg-black/60 px-3 py-1.5 rounded-lg uppercase">
                    {o.title}
                  </span>
                </Link>
              ))}
            </div>

              <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tighter flex items-center gap-2 px-1">
              <Sparkles className="text-orange-500" size={20} /> Melhores da Semana
            </h2>
            <AnimatePresence mode="wait">
              {iSLoadingDestaques ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
                </div>
              ) : (
                <DestaquesAuto usuarios={destacados?.usuarios} />
              )}
            </AnimatePresence>
          </section>
          </section>
        </div>
        {/* SEÇÃO DE DOWNLOAD (FOOTER) */}
<AppFooter></AppFooter>
      </main>
      
    </div>
  );
}