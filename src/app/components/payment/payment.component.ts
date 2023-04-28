import { Component } from '@angular/core';
import { IyzicoService } from '../../services/ıyzico.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  cardNumber: string;
  cardHolder: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;

  constructor(private iyzicoService: IyzicoService) {}

  public makePayment(): void {
    const paymentData = {
      'cardNumber': this.cardNumber,
      'expirationMonth': this.expirationMonth,
      'expirationYear': this.expirationYear,
      'cvv': this.cvv
    };
    debugger;
    this.iyzicoService.makePayment(paymentData).subscribe(response => {
      console.log(response);
      // Handle the response here
    });
  }
}
