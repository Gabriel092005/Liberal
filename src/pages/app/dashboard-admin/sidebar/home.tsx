import {
  BookMarked,
  Camera,
  ChevronRight,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
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
import { Link,useNavigate,useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SearchServices } from "./Search";
// import { MaisProfissao } from "./Categorias/MaisProfissao";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetUserProfile } from "@/api/get-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdatePhoto } from "@/api/update-profile-photo";
import { socket } from "@/lib/socket";

import { NotificationDropdown } from "./Notification/notification-dropdown";
import { PrestadoresDestaques } from "@/api/porfissionais-destaques";
import { DestaquesAuto } from "./destacados";
import { api } from "@/lib/axios";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Logout } from "@/api/log-out";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GetCategory } from "@/api/get-categories";
import { getInialts } from "@/lib/utils";
import { FastFazerPedido } from "./DialogFastPrestadoresPedido";
import { GetProfissaoByCategory } from "@/api/fetchProfissionByCategory";
import { GetProfission } from "@/api/get-profissions";

export function Home() {

 const categorias = [
    { 
       image :servico3,
       title:'Madeira & Oficios',
       to:'/madeira'
    },
      { 
       image :servico1,
       title:'Electricidade & Manuntenção',
       to:'/electricidade'
      },
          { 
       image :servico2,
       title:'Educação',
       to:'/ensino'
      },
           { 
       image :servico4,
       title:'Beleza & Moda',
       to:'/moda'
      },
{ 
       image :servico5,
       title:'Serviços Domésticos',
       to:'/domestica'
      },
     { 
       image :servico6, 
       title:'Tecnologias & Design',
       to:'/tecnologia'
      },
             { 
       image :servico4,
       title:'Mais Profissionais',
       to:'/mais'
      }
 ]



interface SearchProfissionTypes  {
  categoryId:string
}

   const [searchParams, setSearchParams] = useSearchParams();
   const categoryId = searchParams.get("category")

 function handleSearchProfission({categoryId}:SearchProfissionTypes){
  console.log("peguei", categoryId)
     setSearchParams((state) => {
    categoryId ? state.set("category", categoryId) : state.delete("category");
    return state;
  });
 }
 const {data:categories,refetch:refetchCategories,isLoading:isLoadingategories} = useQuery({
  queryKey:['category',categoryId],
  queryFn:()=>GetCategory({query:''})
 })

 useEffect(()=>{
  refetchCategories()
 },[categoryId,refetchCategories])

  // Filtra o array pelo valor digitado
  // const profissoesFiltradas = profissoesAngola.filter((p) =>
  //   p.nome.toLowerCase().includes(filtro.toLowerCase())
  // );
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();



  const { data: destacados, isLoading: iSLoadingDestaques } = useQuery({
  queryKey: ["destaques"],
  refetchOnWindowFocus: true,     // Rebusca ao voltar ao foco
  refetchOnReconnect: true,       // Rebusca se a internet voltar
  refetchOnMount: true,           // Rebusca sempre que o componente monta
  staleTime: 0,    
    queryFn: PrestadoresDestaques,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const {data:profByCategoy} =  useQuery({
    queryKey:['byCategory',categoryId],
    queryFn:()=>GetProfissaoByCategory({categoryId:Number(categoryId)})
  })


    const {data:profissao} = useQuery({
      queryKey:['profissao'],
      queryFn:GetProfission
    })



  const { data: profile, isLoading: isLoadingUserProfile, refetch } = useQuery({
  queryKey: ["profile"],
  refetchOnWindowFocus: true,     // Rebusca ao voltar ao foco
  refetchOnReconnect: true,       // Rebusca se a internet voltar
  refetchOnMount: true,           // Rebusca sempre que o componente monta
  staleTime: 0,    
  queryFn: GetUserProfile,
  });

    const {mutateAsync:Sair} = useMutation({
      mutationFn:Logout
    })
    async function handleSignOut(){
      await Sair()
      
    }

  const { mutateAsync: changeProfilePhoto } = useMutation({
    mutationFn: UpdatePhoto,
  });

  const handleSave = () => {
    if (!selectedFile) return;
    changeProfilePhoto({
      image_path: selectedFile,
    });
    console.log("Nova imagem:", selectedFile);
  };

  const imageSrc =
    preview ||
    (profile?.image_path
      ? `${api.defaults.baseURL}/uploads/${profile.image_path}`
      : "https://i.pravatar.cc/150?u=placeholder");

  useEffect(() => {
    const seen = localStorage.getItem("app_onboarding_seen_v1");
    if (!seen) {
      navigate("/sign-up");
    }
  }, [navigate]);

  const [_, setNotif] = useState<any[]>([]);
 
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!profile?.id) return;
    socket.emit("register", profile.id);
    console.log("🔗 Registrado no socket como:", profile.id);
  }, [profile]);

  useEffect(() => {
    audioRef.current = new Audio("/bell-98033.mp3");
    audioRef.current.volume = 0.7;

    socket.on("user", (data) => {
      console.log("🔔 Nova notificação recebida:", data);
      refetch();
      setNotif((prev) => {
        if (prev.length < data.length && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        return data;
      });
    });
    return () => {
      socket.off("user");
    };
  }, [refetch]);
    if(destacados?.usuarios.length===0  || !destacados || !profile){
        <div className="w-full  overflow scroll-y-auto h-full flex flex-col items-center justify-center gap-4">
      <motion.div
        className="relative flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      >
        <div className="absolute w-16 h-16 rounded-full border-t-4 border-b-4 border-transparent border-t-orange-500 border-b-pink-500" />
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-medium text-muted-foreground"
      >
         <Loader2 className="animate-spin"></Loader2>
      </motion.p>
    </div>
  }

   if(profile?.role =='PRESTADOR_COLECTIVO' || profile?.role=='PRESTADOR_INDIVIDUAL'){
     navigate("/servicos")
  }

     if(profile?.role=='ADMIN'){
     navigate("/início")
  }


  if(!categories || !profByCategoy || !profissao){
    return
  }

 

  
  return (
    <div className="flex flex-col h-screen w-full right-1 fixed overflow-hidden bg-background text-foreground">
      <motion.div
        className="flex flex-col relative -top-2 flex-1 px-4 py-4 gap-4 items-center justify-center pb-[1rem]"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        >
        {/* HEADER */}
        <header className="w-full flex justify-center   flex-col items-center gap-44">
          <div className="flex items-center gap-11 justify-between">
            <div className="flex items-center gap-2 mr-3">
              <div className="relative inline-block">
                <Dialog>
                  <DialogTrigger asChild>
                    {isLoadingUserProfile ? (
                      <Skeleton className="h-16 w-16 rounded-full" />
                    ) : (
                      <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-orange-400">
                        <AvatarImage src={imageSrc} />
                        <AvatarFallback>
                          {profile?.nome?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </DialogTrigger>

                  <DialogContent className="max-w-md">
                   
                    <DialogHeader>
                      <DialogTitle>Editar Foto de Perfil</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-5 py-4">
                      <div className="relative">
                        <img
                          src={imageSrc}
                          alt="Preview"
                          className="w-40 h-40 rounded-full object-cover ring-4 ring-orange-400 shadow-lg"
                        />
                        <label
                          htmlFor="file-upload"
                          className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 p-2 rounded-full cursor-pointer shadow-md transition"
                        >
                          <Camera className="w-4 h-4 text-white" />
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Clique no ícone da câmera para escolher uma nova foto.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                         <DialogFooter>
                      <Button onClick={handleSave}>Salvar foto</Button>
                    </DialogFooter>
                    <Link to='/sign-in'>
           <Button onClick={handleSignOut} className="text-red-500 flex-1 w-full" variant='outline'>
             <LogOut></LogOut>
             <span>Sair</span>
          </Button></Link>

                    </div>
                 
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-col">
                {isLoadingUserProfile ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-32 h-3" />
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-nowrap text-muted-foreground text-xs truncate max-w-28">{profile?.nome}</span>
                    <span className="text-muted-foreground text-xs text-nowrap">
                    +244{profile?.celular}
                    </span>
                  </div>
                )}
              </div>
            </div>
              <Menu className="hidden lg:block" />
            <div className="flex gap-2">
            <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full h-10 w-10 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:opacity-90">
          <Plus />
        </Button>
      </DialogTrigger>
           <ModeToggle></ModeToggle>

      <DialogContent className="flex flex-col overlay-none border-0  items-center gap-4 h-full sm:h-auto sm:max-w-lg rounded-xl p-6 bg-background shadow-lg">
        {/* Input única */}
        <div className="relative flex items-center mt-5 w-full max-w-md mx-auto">
          <Search className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none" size={18} />
          <Input
            type="text"
            placeholder="O que você precisa?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-muted text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-orange-400 transition-all"
            />
        </div>
        {query && (
          <div className="flex flex-col gap-2 mt-2 text-sm">
            <p className="text-muted-foreground">Sugestões:</p>
            {profissao.profissao.length > 0 ? (
              profissao.profissao.map((p) => (
                  <Dialog>
                    <DialogTrigger asChild>
                       <Button variant="outline" className=" flex flex-1 w-screen justify-between">
                    <span className="text-orange-600">{p.titulo}</span>
                    <ChevronRight className="text-orange-600" />
                  </Button>
                    </DialogTrigger>
                     <FastFazerPedido selecionado={p.titulo}/>
                  </Dialog>
              ))
            ) : (
              <p className="text-gray-400">Nenhuma profissão encontrada.</p>
            )}
          </div>
        )}

     <ScrollArea className="max-h-90 w-screen p-4">
  {categories?.length <= 0 && (
    <span className="text-muted-foreground text-sm">Nenhuma Categoria</span>
  )}
  {isLoadingategories && (
    <div>
       <Skeleton className="w-24  h-10"></Skeleton>
       <Skeleton className="w-24  h-10"></Skeleton>
       <Skeleton className="w-24  h-10"></Skeleton>
       <Skeleton className="w-24  h-10"></Skeleton>
    </div>
  )}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-1 border-0 ">
    {categories?.map((c) => (
      <Dialog key={c.id}>
        <div
          onClick={() => handleSearchProfission({ categoryId: String(c.id) })}
          className="
            group cursor-pointer rounded-xl overflow-hidden bg-card border-0
            hover:shadow-lg transition-all duration-300 
            hover:-translate-y-1 
          "
        >
          <div className="flex flex-col items-center p-4 gap-3">

            {/* Título */}
            <h2 className="text-lg font-semibold text-muted-foreground group-hover:text-primary transition">
              {c.titulo}
            </h2>

            {/* IMAGEM */}
         <DialogTrigger asChild>
  {c.image_path ? (
    <div
      tabIndex={0}
      role="button"
      className="w-full cursor-pointer"
    >
      <img
        src={`${api.defaults.baseURL}/uploads/${c.image_path}`}
        alt=""
        className="
          h-48 w-full rounded-lg object-cover 
          group-hover:brightness-105 group-hover:scale-[1.02]
          transition-all duration-300 shadow
        "
      />
    </div>
  ) : (
    <div
      tabIndex={0}
      role="button"
      className="h-32 w-full rounded-lg bg-muted flex items-center 
                 justify-center text-3xl font-bold cursor-pointer"
    >
      {getInialts(c.titulo)}
    </div>
  )}
</DialogTrigger>

          </div>
        </div>

        {/* DIÁLOGO PRINCIPAL */}
        <DialogContent className="max-h-[90vh] overflow-auto rounded-xl shadow-xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold">Profissões</DialogTitle>
            <DialogDescription className="text-sm">
              Profissões organizadas por categoria.
            </DialogDescription>

            <span className="text-muted-foreground font-medium border-b pb-1">
              {c.titulo}
            </span>
          </DialogHeader>

          {/* Caso sem profissões */}
          {profByCategoy.length <= 0 && (
            <div className="p-3 rounded-md bg-muted/30 text-muted-foreground text-sm">
              Nenhuma profissão encontrada nesta categoria
            </div>
          )}

          {/* Lista de Profissões */}
          <div className="mt-1 flex flex-col gap-3">
            {profByCategoy?.map((i) => (
              <Dialog key={i.id}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="
                      w-full flex justify-between items-center py-4 rounded-lg
                      border-primary/20 hover:border-primary 
                      hover:bg-primary/10 transition-all
                    "
                  >
                    <span className="text-primary font-semibold">
                      {i.titulo}
                    </span>
                    <ChevronRight className="text-primary" />
                  </Button>
                </DialogTrigger>

                <DialogContent className="rounded-xl shadow-lg">
                  <FastFazerPedido selecionado={i.titulo} />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    ))}
  </div>
</ScrollArea>

     
      </DialogContent>
    </Dialog>
            {isLoadingUserProfile || !profile ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <NotificationDropdown {...profile} />
            )}

            </div>
          </div>
        </header>
           <div className="flex items-center gap-1">
            <Link to='/vitrine'>
              <Button variant='outline' className="flex">
                <BookMarked size={12} className="text-xs text-orange-300"></BookMarked>
                <span className="text-xs">Vitrine</span>
              </Button>
            </Link>
             <Link to='/comment'>
                <Button variant='outline' className="flex">
                <MessageCircle size={12} className="text-xs text-blue-300"></MessageCircle>
                <span className="text-xs">Comentários</span>
              </Button>
             </Link>
           </div>

        <Dialog>
          <DialogTrigger asChild>
            <form className="relative -mt-2 w-full max-w-md mx-auto">
              <Input
                placeholder="O que você precisa?"
                className="pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-muted text-sm focus-visible:ring-2 focus-visible:ring-orange-400 shadow-sm transition-all"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
            </form>
          </DialogTrigger>
          <SearchServices />
        </Dialog>
    <AnimatePresence mode="wait">
      {iSLoadingDestaques ? (
        <motion.div
        key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 -mt-1"
          >
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </motion.div>
      ) : (
        
        <DestaquesAuto usuarios={destacados?.usuarios} />
        
      )}
      <ScrollArea className="max-h-60 border  border-none w-screen p-2">
            {categories?.length<=0 &&(
               <>
                <span className="text-muted-foreground">Nenhuma Categoria</span>
               </>
            )}
    
           <Dialog>
             {/* <div onClick={()=>handleSearchProfission({categoryId:String(c.id)})}  >
                     <h2 className="text-xl lg:text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                       {c.titulo}
                        </h2>
                <DialogTrigger asChild>
              {c.image_path ?(
                           <img src={`${api.defaults.baseURL}/uploads/${c.image_path}`} alt="" className="h-32 w-full gap-2 object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
 />
              ):(
                <div>{getInialts(c.titulo)}</div>
                )}
                </DialogTrigger>
          </div> */}
             {!query && (
    <div className="grid grid-cols-2 gap-4 mt-5">
  {categorias.map((o) => (
    <Link to={o.to} key={o.title}>
      <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md">
        {/* Imagem de fundo */}
        <img
          src={o.image}
          alt={o.title}
          className="h-32 w-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />

        {/* Overlay suave para destacar o texto */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 rounded-lg" />

        {/* Título */}
        <span className="absolute bottom-2 left-2 text-white text-xs font-semibold bg-black/60 px-2 py-1 rounded-md">
          {o.title}
        </span>
      </div>
    </Link>
  ))}
</div>

        )}
                <DialogContent className="h-full">
                       {/* {profByCategoy.length<=0 &&(
                          <div>
                          <span className="text-muted-foreground">Nenhuma profissão encontrada nesta categoria</span>
                          </div>
                          )} */}
                
                       
       
                      
                    
                </DialogContent>
            </Dialog>
     
      </ScrollArea>
    </AnimatePresence>
      </motion.div>
    </div>
  );
}