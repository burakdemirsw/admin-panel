import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from '../ui/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private spinnerService : NgxSpinnerService,
    private router : Router,
    private alertifyService :AlertifyService) { }

  beep(){
    const audio = new Audio('assets/music/scanner.mp3');
    audio.play();
  }

  waitAndNavigate(message:string, url:string){
    this.spinnerService.show()
    setTimeout(() => {
      this.spinnerService.hide();
      this.router.navigate(['/'+url]);
      this.alertifyService.success(message)
    }, 1000);
  }

  generateGUID(): Promise<string> {
    function generateUUID() {
      let dt = new Date().getTime();
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }

    return null;
  }


}
