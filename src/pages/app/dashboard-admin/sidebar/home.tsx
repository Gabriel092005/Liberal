import { 
  BookMarked,
  Camera,
  ChevronRight,
  Loader2,
  LogOut,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import servico1 from "@/assets/IMG-20250928-WA0054.jpg";
import servico2 from "@/assets/IMG-20250928-WA0057.jpg";
import servico3 from "@/assets/IMG-20250928-WA0056.jpg";
import servico4 from "@/assets/IMG-20250928-WA0058.jpg";
import servico5 from "@/assets/IMG-20250928-WA0059.jpg";
import servico6 from "@/assets/IMG-20250928-WA0069.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetUserProfile } from "@/api/get-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdatePhoto } from "@/api/update-profile-photo";
import { socket } from "@/lib/socket";
import { PrestadoresDestaques } from "@/api/porfissionais-destaques";
import { DestaquesAuto } from "./destacados";
import { api } from "@/lib/axios";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Logout } from "@/api/log-out";
import { GetCategory } from "@/api/get-categories";
import { getInialts } from "@/lib/utils";
import { FastFazerPedido } from "./DialogFastPrestadoresPedido";
import { GetProfissaoByCategory } from "@/api/fetchProfissionByCategory";
import { GetProfission } from "@/api/get-profissions";
import { NotificationDropdownCostumer } from "./Notification/notif-dropdown-costumer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  const { data: profByCategoy } = useQuery({
    queryKey: ['byCategory', categoryId],
    queryFn: () => GetProfissaoByCategory({ categoryId: Number(categoryId) }),
    enabled: !!categoryId
  });

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
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center gap-2 sm:gap-4">
          
          {/* PERFIL */}
          <div className="flex items-center gap-3 flex-shrink-0">
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
          <div className="flex-1 flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                  <Input readOnly placeholder="O que você precisa hoje?" className="h-10 sm:h-11 pl-10 w-full rounded-2xl bg-muted/50 border-transparent cursor-pointer" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[90vw] sm:w-[450px] mt-2 rounded-[2rem] p-4 shadow-2xl">
                <p className="text-xs font-bold text-muted-foreground uppercase px-1 mb-4">Explorar Categorias</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories?.map((c) => (
                    <div key={c.id} onClick={() => handleSearchProfission({ categoryId: String(c.id) })} className="group cursor-pointer p-4 rounded-2xl bg-slate-50 dark:bg-muted hover:bg-white transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted">
                          {c.image_path ? <img src={`${api.defaults.baseURL}/uploads/${c.image_path}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-orange-500 uppercase">{getInialts(c.titulo)}</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{c.titulo}</h4>
                          <Dialog>
                            <DialogTrigger className="text-[10px] text-orange-500 font-bold uppercase hover:underline">Ver Profissões</DialogTrigger>
                            <DialogContent className="rounded-[2rem]">
                              <DialogHeader><DialogTitle>{c.titulo}</DialogTitle></DialogHeader>
                              <div className="flex flex-col gap-2">
                                {profByCategoy?.map(i => (
                                  <Dialog key={i.id}>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" className="justify-between h-12 rounded-xl bg-muted/30">{i.titulo} <ChevronRight size={16}/></Button>
                                    </DialogTrigger>
                                    <DialogContent><FastFazerPedido selecionado={i.titulo}/></DialogContent>
                                  </Dialog>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* AÇÕES */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <ModeToggle />
            {profile && <NotificationDropdownCostumer {...profile} />}
          </div>
        </div>
      </header>

      {/* CONTEÚDO COM SCROLL NATIVO (IMPEDE O BLOQUEIO DO SLIDE) */}
      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-24">
          
          {/* BOTÕES DE NAVEGAÇÃO HORIZONTAL */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
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
          </div>

          {/* SEÇÃO DE DESTAQUES (SLIDE AGORA FUNCIONA) */}
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

          {/* GRID DE CATEGORIAS */}
          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tighter px-1">Todas Categorias</h2>
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
          </section>
        </div>
        {/* SEÇÃO DE DOWNLOAD (FOOTER) */}
<footer className="mt-12 pb-10 px-1">
  <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-pink-600 p-8 text-white shadow-2xl">
    {/* Decoração de fundo */}
    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

    <div className="relative z-10 flex flex-col items-center text-center gap-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-black tracking-tighter">Leve o talento no bolso</h3>
        <p className="text-sm text-orange-50/80 font-medium">
          Baixe o nosso app oficial para uma experiência completa.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {/* Play Store */}
        <motion.a
          whileTap={{ scale: 0.95 }}
          href="#"
          className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl hover:bg-zinc-900 transition-colors border border-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.66,16.19C19.28,16.55 19.28,17.45 18.66,17.81L5.25,25.56L14.75,16.06L16.81,15.12M20.16,10.81C20.73,11.11 21,11.51 21,12C21,12.49 20.73,12.89 20.16,13.19L18.16,14.34L15.81,12L18.16,9.66L20.16,10.81M5.25,1.56L18.66,9.31C19.28,9.67 19.28,10.57 18.66,10.93L16.81,12L14.75,7.94L5.25,1.56Z" />
          </svg>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold leading-none opacity-70">Disponível no</p>
            <p className="text-lg font-bold leading-tight">Google Play</p>
          </div>
        </motion.a>

        {/* App Store */}
        <motion.a
          whileTap={{ scale: 0.95 }}
          href="#"
          className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl hover:bg-zinc-900 transition-colors border border-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
          </svg>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold leading-none opacity-70">Baixar na</p>
            <p className="text-lg font-bold leading-tight">App Store</p>
          </div>
        </motion.a>
      </div>
    </div>
  </div>

  <div className="mt-8 text-center text-muted-foreground">
    <p className="text-xs font-bold tracking-widest uppercase opacity-50">
      © 2025 SeuApp • Luanda, Angola
    </p>
  </div>
</footer>
      </main>
      
    </div>
  );
}