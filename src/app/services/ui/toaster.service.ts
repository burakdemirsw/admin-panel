import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GeneralService } from '../admin/general.service';

@Injectable({
  providedIn: 'root',

})
export class ToasterService {

  constructor(private messageService: MessageService) { }
  success(message: string) {
    this.messageService.add({ key: 'bc', severity: 'success', summary: 'İşlem Başarılı', detail: message });
  }
  error(message: string) {
    this.messageService.add({ key: 'bc', severity: 'error', summary: 'İşlem Başarısız', detail: message });
  }

  warn(message: string) {
    this.messageService.add({ key: 'bc', severity: 'error', summary: 'Kontrol Ediniz', detail: message });
  }
  info(message: string) {
    this.messageService.add({ key: 'bc', severity: 'info', summary: 'Bilgilendirme', detail: message });
  }
}
