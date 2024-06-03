import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from '../ui/toaster.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private toasterService: ToasterService,
    private datePipe: DatePipe
  ) { }

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  isNullOrEmpty(value: string | null | undefined): boolean {
    if (typeof value === 'object') {
      return value === null || value === undefined
    } else {
      return value === null || value === undefined || value.trim() === '';
    }

  }

  beep() {
    const audio = new Audio('assets/music/qrSound.mp3');
    audio.play();
  }
  beep2() {
    const audio = new Audio('assets/music/qrSound.mp3');
    audio.play();
  }
  beep3() {
    const audio = new Audio('assets/music/delete.mp3');
    audio.play();
  }
  beep4() {
    const audio = new Audio('assets/music/congra.mp3');
    audio.play();
  }
  waitAndNavigate(message: string, url: string) {
    this.beep();
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
      this.router.navigate(['/' + url]);
      this.toasterService.success(message);
    }, 1000);
  }

  async generateGUID(): Promise<string> {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid.toUpperCase();
  }

  isGuid(text: string): boolean {
    // Bir GUID'nin genellikle belirli bir deseni vardır
    const guidPattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    // Metni belirtilen desenle karşılaştırarak kontrol et
    return guidPattern.test(text);
  }

  whichRowIsInvalid(form: FormGroup) {
    let invalidFields = '';

    Object.keys(form.controls).forEach((controlName) => {
      const control = form.get(controlName);
      if (control && control.invalid) {
        invalidFields += `${controlName}\n`;
      }
    });

    if (invalidFields) {
      this.toasterService.error(`Form Alanı Geçersiz:\n${invalidFields}`);
    }
  }
  getCurrentDatetime(): string {
    const datetime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    return datetime;
  }
}
