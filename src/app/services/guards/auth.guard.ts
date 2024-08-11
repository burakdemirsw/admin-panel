import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../ui/auth.service';
import { SessionService } from '../ui/session.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const token: string = localStorage.getItem('accessToken');
    const decodedToken: string = this.jwtHelper.decodeToken(token);
    const isExpired = this.jwtHelper.isTokenExpired(token);
    if (isExpired || !token) {
      this.router.navigate(['/pages-loginv2'], { queryParams: { returnUrl: state.url } });
      return true;
    }
    return true;
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
