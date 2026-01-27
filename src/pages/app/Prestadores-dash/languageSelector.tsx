import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { ChevronDown } from "lucide-react"
  
  export function LanguageSelectorMini() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none group">
          <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <span className="text-base sm:text-lg leading-none filter grayscale group-hover:grayscale-0 transition-all duration-300">
              🇦🇴
            </span>
            <ChevronDown size={10} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>
        </DropdownMenuTrigger>
  
        <DropdownMenuContent 
          align="end" 
          className="w-32 p-1.5 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl"
        >
          <DropdownMenuItem className="rounded-xl focus:bg-orange-500/10 cursor-pointer py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">🇦🇴</span>
              <span className="text-[10px] font-black uppercase text-zinc-700 dark:text-zinc-300">PT-AO</span>
            </div>
          </DropdownMenuItem>
  
          <DropdownMenuItem className="rounded-xl focus:bg-zinc-100 dark:focus:bg-zinc-900 cursor-pointer py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">🇺🇸</span>
              <span className="text-[10px] font-black uppercase text-zinc-400">EN-US</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }