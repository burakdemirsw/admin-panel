import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { OrderFilterModel } from 'src/app/models/model/filter/orderFilterModel';
import { PrinterInvoiceRequestModel } from 'src/app/models/model/order/printerInvoiceRequestModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-order-managament',
  templateUrl: './order-managament.component.html',
  styleUrls: ['./order-managament.component.css']
})
export class OrderManagamentComponent implements OnInit {

  numberOfList : number[] = [1,10,20,50,100]
  saleOrderModels : SaleOrderModel[]
  currentPage : number = 1;
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private router : Router,
    private orderService : OrderService,
    private formBuilder : FormBuilder

  ) { }
  filterForm: FormGroup;

  async ngOnInit() {
    this.spinnerService.show();
    this.formGenerator()
    await this.getOrders();
    this.spinnerService.hide();


  }
  productsToCollect: ProductOfOrder[];

  formGenerator() {
    this.filterForm = this.formBuilder.group({
      orderNo: [null],
      currAccCode: [null],
      customerName: [null],
      sellerCode: [null],
      startDate: [null],
      endDate: [null],
    });
  }
  async onSubmit(model:OrderFilterModel){
    this.saleOrderModels = await this.orderService.getOrdersByFilter(model)
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
  async getOrders(): Promise<any> {
    const response = 
    this.saleOrderModels =  await this.orderService.getOrders()
 

  }
  printPicture(url:string){
   var  model : PrinterInvoiceRequestModel = new PrinterInvoiceRequestModel();
   model.printerName = "EPSON-DEPO (L3150 Series)"
   model.url= url;
    try {
      this.httpClientService
        .post<PrinterInvoiceRequestModel>({
          controller: 'Order/TryPrintPicture',  
        },model)
        .subscribe((data) => {
          console.log(data);
          // this.saleOrderModels = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
    }
  }




