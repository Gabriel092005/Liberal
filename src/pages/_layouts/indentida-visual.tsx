
import { Outlet } from "react-router-dom";
// import { BottomNavIndentidade } from "../app/home-inicial/Bottom-Nav-Indentidade";



export  function IdentidadeLayoutAdmin(){
  return(
    <div className="flex min-h-screen fixed     antialiased ">
         <div className="flex     flex-1 flex-col ">
          {/* <BottomNavIndentidade/> */}
        <Outlet/>
      </div>
    </div>
  )

}