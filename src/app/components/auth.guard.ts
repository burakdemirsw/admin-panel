import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/ui/auth.service';
import { AlertifyService } from '../services/ui/alertify.service';
import { SessionService } from '../services/ui/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertifyService: AlertifyService,
    private sessionService: SessionService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
      if (this.sessionService.isSessionValid()) { 
 
        return true;
      } else {
        this.sessionService.clearSession(); // Clear expired session
      }
    

    // Redirect to login page if not logged in or session expired
    this.router.navigate(['/pages-login']);
    return false;
  }
}
