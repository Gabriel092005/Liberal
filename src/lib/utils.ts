import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInialts(name:string){
    const initials= name.split('').map((word)=>word.charAt(0).toUpperCase())
    .slice(0,2)
    .join('')
    return initials
  }

  // utils/formatCurrency.ts
export function formatCurrencyKZ(amount: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
  }).format(amount);
}



 export function formatNotificationDate(dateString: string|Date) {
  const date = new Date(dateString);
  const now = new Date();

  // Verifica se é hoje
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return isToday ? `Hoje, ${time}` : date.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" }) + `, ${time}`;
}


