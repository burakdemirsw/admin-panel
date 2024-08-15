import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogFilterModel } from 'src/app/models/model/log/logFilterModel ';
import { Log_VM } from 'src/app/models/model/log/log_VM';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { HeaderService } from 'src/app/services/admin/header.service';
import { LogService } from 'src/app/services/admin/log.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
@Component({
  selector: 'app-log-managament',
  templateUrl: './log-managament.component.html',
  styleUrls: ['./log-managament.component.css']
})
export class LogManagamentComponent implements OnInit {


  currentPage: number = 1;
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private logService: LogService,
    private formBuilder: FormBuilder, private headerService: HeaderService

  ) { }
  filterForm: FormGroup;
  log_VMList: Log_VM[] = []
  selectedLogs: Log_VM[] = []
  async ngOnInit() {
    this.headerService.updatePageTitle("Log Yönetimi")
    this.spinnerService.show();
    this.formGenerator()

    await this.getLogs();
    this.spinnerService.hide();


  }
  productsToCollect: ProductOfOrder[];



  formGenerator() {
    this.filterForm = this.formBuilder.group({
      messageHeader: [null],
      level: [null],

      createdDate: [null],
      endDate: [null],
    });
  }
  async onSubmit(model: LogFilterModel) {
    var filter: LogFilterModel = new LogFilterModel();
    filter = model;
    this.log_VMList = await this.logService.getLogs(filter)
  }



  //toplanan ürünler sayfasına akatarır fakat önce ilgili siparişin içeriğinden paketNo'değerini çeker.
  async routeToCPP() {
    let listNumber: string = (document.getElementById('numberOfList') as HTMLInputElement).value;

    if (listNumber == null || listNumber == '') {
      this.alertifyService.warning('Lütfen Bir Müktar Seçiniz');
    } else {
      try {
        // Wait for the products to be fetched before navigating
        this.spinnerService.show()

        setTimeout(async () => { // async işlev içinde setTimeout kullanıldı
          const listNumber = 123; // Örnek bir liste numarası
          const data = await this.httpClientService.get<ProductOfOrder>({
            controller: 'Order/GetProductsOfOrders/' + listNumber.toString(),
          }).toPromise();

          this.productsToCollect = data;

          // Veriler çekildikten sonra productsToCollect dizisine erişebilirsiniz
          if (this.productsToCollect.length > 0) {
            this.router.navigate(['/collect-product-of-order/' + this.productsToCollect[0].packageNo]);
          } else {
            // Hiç ürün bulunamadığında nasıl bir işlem yapılacağını ele alın
            this.alertifyService.warning('İşlem Yapıclacak Veri Gelmedi.');
          }

          this.spinnerService.hide();
        }, 1000); // 1000 milisaniye (1 saniye) bekle



      } catch (error: any) {
        console.log('Error fetching products:', error.message);
      }
    }
  }
  async getLogs(): Promise<any> {
    var filter: LogFilterModel = new LogFilterModel();
    this.log_VMList = await this.logService.getLogs(filter)


  }

}
