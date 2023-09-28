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
}
