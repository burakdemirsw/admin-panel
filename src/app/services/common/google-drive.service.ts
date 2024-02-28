import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  constructor(private spinnerService: NgxSpinnerService, private httpClientService: HttpClientService) { }


  async addPicture(file: File): Promise<any> {
    this.spinnerService.show();

    var formdata: FormData = new FormData();
    formdata.append('file', file);
    try {
      const response = await this.httpClientService.post<FormData>({ controller: "files/upload-file" }, formdata).toPromise();
      if (response) {
        //   this.toasterService.showSuccessToast("İşlem Başarılı", response.url);
        console.log(response)

        return response;
      }
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
      // this.toasterService.showSuccessToast("Hata", "Dosya yüklenirken bir hata oluştu.");
      return null;
    }

    this.spinnerService.hide();
  }
  async addPictures(files: File[]): Promise<any> {
    this.spinnerService.show();

    var formdata: FormData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formdata.append('files', files[i]);
    }

    try {
      const response = await this.httpClientService.post<FormData>({ controller: "files/upload-files" }, formdata).toPromise();
      if (response) {
        // this.toasterService.showSuccessToast("İşlem Başarılı", response.url);
        console.log(response);
        return response;
      }
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
      //  this.toasterService.showSuccessToast("Hata", "Dosya yüklenirken bir hata oluştu.");
      return null;
    } finally {
      this.spinnerService.hide();
    }
  }
}
