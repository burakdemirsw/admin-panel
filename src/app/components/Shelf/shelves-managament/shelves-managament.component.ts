import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShelfModel } from 'src/app/models/model/shelf/ShelfModel';
import { CategoryModel } from 'src/app/models/model/category/categoryModel';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-shelves-managament',
  templateUrl: './shelves-managament.component.html',
  styleUrls: ['./shelves-managament.component.css']
})
export class ShelvesManagamentComponent implements OnInit {

  shelveModels : ShelfModel[]
  filterText : string = ''
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.getShelves();
    this.spinnerService.hide();

  }
  generateQRCode(id: string): string {
    const qrCodeData = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(id)}&size=50x50`;
    return qrCodeData;
  }
  idList: Array<string> = [];

  
  printQRCode(id: string) {
    const qrCodeData = this.generateQRCode(id); // generateQRCode() fonksiyonunuzun QR kodu oluşturma mantığını kullanın
  
    const printWindow = window.open('', '_blank', 'width=1600,height=800');
    printWindow?.document.open();
    printWindow?.document.write(`
      <html>
        <head>
          <title>QR Kod Yazdır</title>
        </head>
        <body>
          <img src="${qrCodeData}" alt="QR Code" style="width: 600px; height: 600px;">
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow?.document.close();
  }
  addIdToList(id: number) {
    if (!this.idList.includes(id.toString())) {
      this.idList.push(id.toString());
    } else {
      const index = this.idList.indexOf(id.toString());
      this.idList.splice(index, 1);
    }
  }
  getShelves(): any {
    try {
      this.httpClientService
        .get<ShelfModel>({  
          controller: 'Shelves/{id}',
        })
        .subscribe((data) => {
          //console.log(data);
          this.shelveModels = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

}
