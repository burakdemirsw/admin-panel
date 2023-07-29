import { Injectable } from '@angular/core';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';

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

      //this.isLoggedInFlag = true;
      this.router.navigate(['/dashboard'])
      return true;  
    } else {
      this.alertifyService.success('Kullanıcı adı veya şifre hatalı.');
      return false;
    }
  }

  // logout(): void {
  //   this.isLoggedInFlag = false;
  // }

  // isLoggedIn(): boolean {
  //   return this.isLoggedInFlag;
  // }
}
