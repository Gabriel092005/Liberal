import { MapRoute } from "../mapas";



export function VerMapas(){
      return(
     <div className="relative w-[70rem] h-[100vh] md:h-[500px] right-[10rem] rounded-xl overflow-hidden shadow-md border">
              <MapRoute></MapRoute>
          </div>
      )
}