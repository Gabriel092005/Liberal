import Logo from '@/assets/IMG-20250924-WA0127.png'
import { Bell, ChevronDown, Timer } from 'lucide-react';


export function Header() {



  return (
    <header className="w-full px-4 dark:bg-black sticky top-0 z-50 m-0 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <img src={Logo} alt="Logo" className="w-14 h-10 relative bottom-9 right-9" /> */}
        </div>

   
                           <div className="flex items-center gap-2">
                 
                                               <div className="flex flex-col leading-none gap-0 p-0 m-0">
              <span className="text-sm"></span>
              <span className="text-muted-foreground text-xs lowercase"></span>
            </div>
        
                      
                     </div>
        </div>
  
    </header>
  );
}
