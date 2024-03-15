import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionKey = 'userSession';
  private sessionExpirationKey = 'sessionExpiration';

  constructor(private router: Router, private toasterService: ToasterService, private authService: AuthService) { }

  // Oturum süresini dakika cinsinden belirleyerek oturum oluşturma fonksiyonu

  setSession(durationMinutes: number) {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + durationMinutes);
    localStorage.setItem(this.sessionKey, 'active');
    localStorage.setItem(this.sessionExpirationKey, expirationDate.toISOString());
  }

  // Oturumu temizleme fonksiyonu
  clearSession() {
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.sessionExpirationKey);
  }

  // ... (diğer metodlar aynı kalacak)

  // Oturumun kalan süresini dakika cinsinden hesaplayan fonksiyon
  private getSessionRemainingTime(): number {
    const expirationDate = localStorage.getItem(this.sessionExpirationKey);
    if (expirationDate) {
      const expirationTime = new Date(expirationDate).getTime();
      const currentTime = new Date().getTime();
      const remainingTime = expirationTime - currentTime;
      return Math.floor(remainingTime / 60000); // Dakikaya çevir
    }
    return 0;
  }

  // ... (diğer metodlar aynı kalacak)

  // Oturumun hala geçerli olup olmadığını kontrol eden fonksiyon
  async isSessionValid(): Promise<boolean> {
    const expirationDate = localStorage.getItem(this.sessionExpirationKey);

    if (expirationDate) {
      const expirationTime = new Date(expirationDate);
      if (expirationTime > new Date()) {
        const remainingMinutes = this.getSessionRemainingTime();
        //this.toasterService.success(`Oturum süresi: ${remainingMinutes} dakika`); // Oturum süresini göster
        return true; // Oturum hala geçerli
      } else {

        this.clearSession(); // Oturum süresi dolmuş, oturumu temizle
        return false;
      }
    } else {

      // this.setSession(60); // Oturum verisi yoksa, yeni bir oturum oluştur (örneğin, 30 dakika)
      this.clearSession(); // Oturum süresi dolmuş, oturumu temizle
      this.delayAndNavigate();

      return true; // Oturum oluşturuldu, dolayısıyla oturum hala geçerli
    }
  }

  async delayAndNavigate() {
    // 2 saniye (2000 milisaniye) bekleyin
    this.toasterService.warn('Oturum Süreniz Doldu');


    // Konsola mesaj yazdırın

    // Sayfayı yönlendirin
    this.router.navigate(['/pages-login']);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}
