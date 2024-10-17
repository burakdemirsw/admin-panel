import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '../admin/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private userService: UserService
  ) { }


  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // console.log("LocalStorage Size: " + this.getLocalStorageSize() + " KB");


    const token: string = localStorage.getItem('accessToken');
    const decodedToken: string = this.jwtHelper.decodeToken(token);
    const isExpired = this.jwtHelper.isTokenExpired(token);

    if (isExpired || !token) {
      localStorage.clear();
      this.router.navigate(['/pages-loginv2'], { queryParams: { returnUrl: state.url } });
      return false;
    } else {
      const userId: number = Number(localStorage.getItem('userId'));
      const route = state.url.split('/')[1];

      // Daha önce aynı istek yapılmış mı kontrol et
      const cacheKey = `isUserAuthorized_${userId}_${route}`;
      const cachedResponse = localStorage.getItem(cacheKey);

      if (cachedResponse !== null) {
        // Eğer önbellekte bir cevap varsa onu kullan
        return cachedResponse === 'true';
      } else {
        // Eğer önbellekte yoksa istek yap ve cevabı sakla
        try {
          const response = await this.userService.isUserAuthorized(userId, route);

          // Cevabı localStorage'da sakla
          localStorage.setItem(cacheKey, response.toString());

          if (response) {
            return true;
          } else {
            this.router.navigate(['/unauthorized']);
            return false;
          }
        } catch (error) {
          console.error('Authorization check failed', error);
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }
    }
  }
  getLocalStorageSize() {
    let totalSize = 0;

    // localStorage'daki her öğeyi kontrol et
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        // Hem anahtarın hem de değerin boyutunu hesapla
        const keySize = key.length * 2; // Her karakter UTF-16 olduğundan 2 byte
        const valueSize = localStorage.getItem(key).length * 2; // Her karakter UTF-16 olduğundan 2 byte
        totalSize += keySize + valueSize;
      }
    }

    // Byte cinsinden toplam boyutu kilobyte'a çevir ve döndür
    return totalSize / 1024; // Kilobyte (KB) cinsinden sonuç
  }
  async delayAndNavigate() {
    // 2 saniye (2000 milisaniye) bekleyin
    //this.spinnerService.show()
    //this.alertifyService.warning('Oturum Süreniz Doldu');

    //this.spinnerService.hide();

    // Konsola mesaj yazdırın

    // Sayfayı yönlendirin
    this.router.navigate(["/pages-loginv2"]);
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
