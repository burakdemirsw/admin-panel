import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GeneralService } from '../admin/general.service';

@Injectable({
  providedIn: 'root',

})
export class ToasterService {

  constructor(private messageService: MessageService) { }
  success(message: string) {
    this.messageService.add({ severity: 'success', summary: 'İşlem Başarılı', detail: message, life: 1000, key: 'bc' });
  }
  error(message: string) {
    this.messageService.add({ severity: 'error', summary: 'İşlem Başarısız', detail: message, life: 1000, key: 'bc' });
  }

  warn(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Kontrol Ediniz', detail: message, life: 1000, key: 'bc' });
  }
  info(message: string) {
    this.messageService.add({ severity: 'info', summary: 'Bilgilendirme', detail: message, life: 1000, key: 'bc' });
  }
}
