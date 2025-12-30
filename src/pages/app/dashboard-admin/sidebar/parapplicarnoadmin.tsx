//     <div className="flex items-center">
//   {/* VIEWPORT DESKTOP: Aparece apenas em 'lg' (Large) em diante */}
//   <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
//     {[
//       { to: "/início", label: "Início", icon: HomeIcon },
//       { to: "/Serviços", label: "Serviços", icon: Hammer },
//       { to: "/admin-pedidos", label: "Pedidos", icon: Briefcase },
//       { to: "/clientes", label: "Clientes", icon: Users2 },
//     ].map((item) => (
//       <Link
//         key={item.to}
//         to={item.to}
//         className="group flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-900 shadow-none hover:shadow-sm transition-all duration-300"
//       >
//         <item.icon size={18} className="text-slate-500 group-hover:text-orange-500 transition-colors" />
//         <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-foreground">
//           {item.label}
//         </span>
//       </Link>
//     ))}
//   </nav>

//   {/* VIEWPORT MOBILE/TABLET: Aparece abaixo de 'lg' */}
//   <div className="lg:hidden">
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20">
//           <MenuIcon className="h-6 w-6 text-orange-600" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="right" className="w-[300px] border-l-0 rounded-l-[2.5rem] p-6 backdrop-blur-2xl bg-background/95">
//         <SheetTitle className="text-left mb-8 font-extrabold text-2xl tracking-tighter">
//           Menu <span className="text-orange-500">Principal</span>
//         </SheetTitle>
        
//         <div className="flex flex-col gap-4">
//           {[
//             { to: "/início", label: "Início", icon: HomeIcon, desc: "Voltar para a home" },
//             { to: "/Serviços", label: "Serviços", icon: Hammer, desc: "Gerenciar prestações" },
//             { to: "/admin-pedidos", label: "Pedidos", icon: Briefcase, desc: "Ver solicitações" },
//             { to: "/clientes", label: "Clientes", icon: Users2, desc: "Base de usuários" },
//           ].map((item) => (
//             <Link key={item.to} to={item.to} className="no-underline">
//               <motion.div 
//                 whileTap={{ scale: 0.98 }}
//                 className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 border border-transparent active:border-orange-500/20 active:bg-orange-500/5 transition-all"
//               >
//                 <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm text-orange-500">
//                   <item.icon size={22} />
//                 </div>
//                 <div className="flex flex-col text-left">
//                   <span className="font-bold text-base leading-none">{item.label}</span>
//                   <span className="text-[10px] text-muted-foreground uppercase mt-1 tracking-widest">{item.desc}</span>
//                 </div>
//               </motion.div>
//             </Link>
//           ))}
//         </div>

//         <div className="absolute bottom-10 left-6 right-6 p-6 rounded-3xl bg-gradient-to-br from-orange-500 to-pink-500 text-white">
//           <p className="text-sm font-bold">Suporte Premium</p>
//           <p className="text-[10px] opacity-80 mb-4 font-medium">Precisa de ajuda com o sistema?</p>
//           <Button variant="secondary" size="sm" className="w-full rounded-xl font-bold">Falar agora</Button>
//         </div>
//       </SheetContent>
//     </Sheet>
//   </div>
// </div>