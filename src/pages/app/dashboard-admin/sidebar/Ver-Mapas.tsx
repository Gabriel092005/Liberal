import { MapRoute } from "../mapas";



export function VerMapas(){
      return(
     <div className="relative w-full h-[60vh] md:h-[500px] rounded-xl overflow-hidden shadow-md border">
              <MapRoute></MapRoute>
          </div>
      )
}