import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registrar PWA (Service Worker)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (registration) => {
        console.log("Service Worker registrado:", registration);
      },
      (err) => {
        console.log("Erro ao registrar o Service Worker:", err);
      }
    );
  });
}
