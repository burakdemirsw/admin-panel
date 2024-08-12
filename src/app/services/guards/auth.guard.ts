import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../ui/auth.service';
import { SessionService } from '../ui/session.service';
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

    const token: string = localStorage.getItem('accessToken');
    const decodedToken: string = this.jwtHelper.decodeToken(token);
    const isExpired = this.jwtHelper.isTokenExpired(token);
    if (isExpired || !token) {
      localStorage.clear();
      this.router.navigate(['/pages-loginv2'], { queryParams: { returnUrl: state.url } });
      return false;
    } else {
      var userId: number = Number(localStorage.getItem('userId'));

      var response = await this.userService.isUserAuthorized(userId, state.url.split('/')[1])
      if (response) {
        return true
      } else {
        // localStorage.clear();
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

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
