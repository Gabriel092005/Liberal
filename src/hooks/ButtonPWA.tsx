// import { useEffect, useState } from "react";

// export function ButtonPWA() {
  
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
//   const [isInstallable, setIsInstallable] = useState(false);

//   useEffect(() => {
//     const handler = (e: any) => {
//       console.log("📱 Evento beforeinstallprompt DETECTADO!");
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setIsInstallable(true);
//     };

//     window.addEventListener("beforeinstallprompt", handler);

//     return () => window.removeEventListener("beforeinstallprompt", handler);
//   }, []);

//   const handleInstallClick = async () => {
//     // if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;
//     console.log(
//       outcome === "accepted"
//         ? "✅ App instalado com sucesso!"
//         : "❌ Usuário cancelou a instalação"
//     );
//     setDeferredPrompt(null);
//   };

//   // Mostra o botão só se for instalável
//   return (
//     <>
//       {isInstallable && (
//         <button
//           onClick={handleInstallClick}
//           className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium"
//         >
//           📲 Instalar App
//         </button>
//       )}
//     </>
//   );
// }
