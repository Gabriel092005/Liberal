
import { Outlet } from "react-router-dom";
import { BottomNav} from "../app/dashboard-admin/sidebar/BottomNav";



export  function AppLayoutAdmin(){
  return(
    <div className="flex min-h-screen fixed    antialiased ">
         <div className="flex ml-[40px]    flex-1 flex-col ">
          <BottomNav/>
        <Outlet/>
      </div>
    </div>
  )

}