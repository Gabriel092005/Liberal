
import { Outlet } from "react-router-dom";
import { Header } from "@/components/header";
import { Menu } from "../app/dashboard-admin/welcome-page";

export function AuthLayout(){
  return(
    <div className="lg:min-h-screen lg:grid lg:grid-cols-2 antialiased dark:bg-black">
      <div className="lg:justify-between h-full border-r border-foreground/5   lg p-10 text-muted-foreground flex flex-col">
             <Menu/>
            <div className="flex items-center gap 3 text-lg font-medium text-foreground">
            </div>
            </div>
          <div className="flex flex-col items-center justify-center">
        <Outlet/>
      </div>
    </div>
  )

}