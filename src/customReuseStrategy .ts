// import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

// export class CustomReuseStrategy implements RouteReuseStrategy {
//   storedRoutes = new Map<string, DetachedRouteHandle>();

//   shouldDetach(route: ActivatedRouteSnapshot): boolean {
//     return true; // Tüm rotalar için bileşeni sakla
//   }

//   store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
//     this.storedRoutes.set(route.routeConfig.path, handle); // Rotayı sakla
//   }

//   shouldAttach(route: ActivatedRouteSnapshot): boolean {
//     return this.storedRoutes.has(route.routeConfig.path); // Saklanan rota var mı kontrol et
//   }

//   retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
//     return this.storedRoutes.get(route.routeConfig.path); // Saklanan rotayı geri döndür
//   }

//   shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
//     return future.routeConfig === curr.routeConfig; // Aynı rota mı kontrol et ve yeniden kullan
//   }
// }
