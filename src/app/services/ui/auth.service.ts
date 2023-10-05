import { Injectable } from '@angular/core';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   

  constructor(private router : Router,
     private alertifyService : AlertifyService) { }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      // Yönlendirme işlemi burada gerçekleştirilir
      this.alertifyService.success('Giriş başarılı!');
       this.setSession(120);
      //this.isLoggedInFlag = true;
      this.router.navigate(['/dashboard'])
      return true;  
    } else {
      this.alertifyService.success('Kullanıcı adı veya şifre hatalı.');
      return false;
    }
  }

  private sessionKey = 'userSession';
  private sessionExpirationKey = 'sessionExpiration';

  setSession(durationMinutes: number) {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + durationMinutes);
    localStorage.setItem(this.sessionKey, 'active');
    localStorage.setItem(this.sessionExpirationKey, expirationDate.toISOString());
  }

  // logout(): void {
  //   this.isLoggedInFlag = false;
  // }

  // isLoggedIn(): boolean {
  //   return this.isLoggedInFlag;
  // }
}
