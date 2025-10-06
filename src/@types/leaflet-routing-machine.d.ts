import * as L from "leaflet"
// leaflet-routing-machine.d.ts
import 'leaflet';
import 'leaflet-routing-machine';

declare module "leaflet" {
  namespace Routing {
    function control(options?: any): L.Control
    function waypoint(latLng: L.LatLng, name?: string, options?: any): any
  }
}




declare module 'leaflet' {
  namespace Routing {
    interface Control {
      on(event: string, callback: (e: any) => void, context?: any): this;
      // You can add other missing methods here if needed
    }
  }
}