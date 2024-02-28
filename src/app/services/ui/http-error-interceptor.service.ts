import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AlertifyService } from './alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private alertifyService: AlertifyService, private spinnerService: NgxSpinnerService
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.spinnerService.show();
    setInterval(() => {

    }, 2000);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 400 && error.status <= 500 || error.status === 0) {
          this.alertifyService.warning(` ${error.status + "-" + error.statusText}: ${error.error}`);
          console.error(` ${error.status + "-" + error.statusText}: ${error.error}`);
        } else if (error.status >= 500) {
          console.error(`Sunucu Hatası: ${error.message}`);
        }
        return throwError(error);

      }),
      finalize(() => {
        this.spinnerService.hide(); // İstek tamamlandığında spinner'ı gizle
      })


    );
  }
}
