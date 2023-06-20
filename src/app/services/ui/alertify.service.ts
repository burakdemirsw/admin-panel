import { Injectable } from '@angular/core';
declare var   alertify: any;
@Injectable({
  providedIn: 'root',
})
export class AlertifyService {
  constructor() {}

  success(message: string) {
    try {
      alertify.success(message);

    } catch (error:any) {
      console.log(error.message);

    }
  }

  warning(message: string) {
    alertify.set('notifier', 'position', 'bottom-left');
    alertify.warning(message);
  }

  error(message: any) {
    alertify.error(message);
  }

  alert(message: string, message2: string) {
    alertify.alert(message, message2);
  }
  errorbase() {
    alertify.error('Operation Canceled!.');
  }
}
