import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/ui/auth.service';
import { AlertifyService } from '../services/ui/alertify.service';
import { SessionService } from '../services/ui/session.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertifyService: AlertifyService,
    private sessionService: SessionService,
    private spinnerService : NgxSpinnerService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean>{
    
      if (this.sessionService.isSessionValid()) { 
 
        return true;
      } else {
        this.sessionService.clearSession(); // Clear expired session
      }
    

      await this.delayAndNavigate();
    return false;  
  }

  async delayAndNavigate() {
    // 2 saniye (2000 milisaniye) bekleyin
    this.spinnerService.show()
    this.alertifyService.warning('Oturum Süreniz Doldu');
 
    this.spinnerService.hide();
  
    // Konsola mesaj yazdırın
  
    // Sayfayı yönlendirin
    this.router.navigate(['/pages-login']);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  
}
