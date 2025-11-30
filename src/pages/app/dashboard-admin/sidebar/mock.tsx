// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Skeleton } from "@/components/ui/skeleton";
// import { DestaquesAuto } from "./destacados";
// import { PrestadoresDestaques } from "@/api/porfissionais-destaques";
// import { useQuery } from "@tanstack/react-query";


  
// export default function Home() {
//     const { data: destacados, isLoading: iSLoadingDestaques } = useQuery({
//     queryKey: ["destaques"],
//     queryFn: PrestadoresDestaques,
//   });

//   const [isLoadingDestaques] = useState(false);

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-md mx-auto">
//           {isLoadingDestaques ? (
//             <motion.div
//               key="loading"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4"
//             >
//               {[...Array(6)].map((_, i) => (
//                 <Skeleton key={i} className="h-40 w-full rounded-xl" />
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="destaques"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, ease: "easeInOut" }}
//             >
//               <DestaquesAuto destacados={destacados?.Usuario} />
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
