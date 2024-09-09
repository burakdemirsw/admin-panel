import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from './toaster.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private toasterService: ToasterService, private spinnerService: NgxSpinnerService
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url.includes('get-customer-list-2')) {
      return next.handle(request);
    }
    this.spinnerService.show();
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        var er: Error = new Error();
        er.statusCode = error.error.StatusCode;
        er.message = error.error.Message;
        er.title = error.error.Title;
        er.innerException = error.error.InnerException;

        if (er.statusCode) {
          if (er.statusCode >= 400 && er.statusCode <= 500 || er.statusCode === 0) {
            this.toasterService.warn(` ${er.title + "-" + er.message}`);
            console.error(` ${er.title + "-" + er.message}`);
          } else if (error.status >= 500) {

            this.toasterService.warn(`Sunucu Hatası: ${error.message}`);
            console.error(`Sunucu Hatası: ${error.message}`);
          } else if (er.statusCode == 401) {
            this.toasterService.warn("Yetki Hatası(1)")
          }
          // this.toasterService.warn(`Sunucu Hatası: ${error.message}`);
        } else {
          if (error.status == 401) {
            this.toasterService.warn("Yetki Hatası")
          }
        }

        return throwError(error);

      }),
      finalize(() => {
        this.spinnerService.hide(); // İstek tamamlandığında spinner'ı gizle
      })


    );
  }
}
export class Error {
  statusCode: number
  message: string
  title: string
  innerException: string
}
