// import { useEffect, useState } from "react"

// export function usePWAInstall() {
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
//   const [isInstallable, setIsInstallable] = useState(false)

//   useEffect(() => {
//     const handler = (e: Event) => {
//       e.preventDefault()
//       setDeferredPrompt(e)
//       setIsInstallable(true)
//     }

//     window.addEventListener("beforeinstallprompt", handler)

//     return () => {
//       window.removeEventListener("beforeinstallprompt", handler)
//     }
//   }, [])

//   const installApp = async () => {
//     if (!deferredPrompt) return
//     deferredPrompt.prompt()
//     const { outcome } = await deferredPrompt.userChoice
//     if (outcome === "accepted") {
//       console.log("✅ Aplicativo instalado!")
//     } else {
//       console.log("❌ Instalação cancelada")
//     }
//     setDeferredPrompt(null)
//     setIsInstallable(false)
//   }

//   return { isInstallable, installApp }
// }
