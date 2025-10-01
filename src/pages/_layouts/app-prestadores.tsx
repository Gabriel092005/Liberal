import { Outlet } from "react-router-dom";
import { BottomNavPrestadores } from "../app/Prestadores-dash/BottomNavPrestadores";

export  function AppLayoutPestadores(){
  return(
    <div className="flex min-h-screen fixed     antialiased ">
         <div className="flex ml-[40px]    flex-1 flex-col ">
        <BottomNavPrestadores/>
        <Outlet/>
      </div>
    </div>
  )

}