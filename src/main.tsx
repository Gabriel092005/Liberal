    import React from "react";
    import ReactDOM from "react-dom/client";
    import { App } from "./App";

    // Import the service worker file


    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
// src/main.js or src/main.ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/service-worker.js' : '/dev-sw.js?dev-sw',
    { type: import.meta.env.MODE === 'production' ? 'classic' : 'module' }
  )
}