import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderFilterModel } from 'src/app/models/model/filter/orderFilterModel';
import { PrinterInvoiceRequestModel } from 'src/app/models/model/order/printerInvoiceRequestModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-purchase-order-managament',
  templateUrl: './purchase-order-managament.component.html',
  styleUrls: ['./purchase-order-managament.component.css']
})
export class PurchaseOrderManagamentComponent implements OnInit {

  numberOfList: number[] = [1, 10, 20, 50, 100]
  saleOrderModels: SaleOrderModel[]
  currentPage: number = 1;
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private orderService: OrderService,
    private formBuilder: FormBuilder



  ) { }
  filterForm: FormGroup;
  async ngOnInit() {
    //this.spinnerService.show();
    this.formGenerator();
    await this.getPurchaseOrders();
    //this.spinnerService.hide();


  }
  productsToCollect: ProductOfOrder[];
  formGenerator() {
    this.filterForm = this.formBuilder.group({
      orderNo: [null],
      currAccCode: [null], // Add other form controls here
      customerName: [null],
      sellerCode: [''],
      startDate: [null],
      endDate: [null],
    });
  }

  async onSubmit(model: OrderFilterModel) {
    this.saleOrderModels = await this.orderService.getPurchaseOrdersByFilter(model);
  }
  //toplanan ürünler sayfasına akatarır fakat önce ilgili siparişin içeriğinden paketNo'değerini çeker.
  async routeToCPP() {
    let listNumber: string = (document.getElementById('numberOfList') as HTMLInputElement).value;

    if (listNumber == null || listNumber == '') {
      alert('Lütfen Bir Müktar Seçiniz');
    } else {
      try {
        // Wait for the products to be fetched before navigating
        await this.httpClientService.get<ProductOfOrder>({
          controller: 'Order/GetProductsOfOrders/' + listNumber.toString(),
        }).subscribe((data) => {
          this.productsToCollect = data;

          // After the data is fetched, you can access the first item in the productsToCollect array
          if (this.productsToCollect.length > 0) {
            this.router.navigate(['/collect-product-of-order/' + this.productsToCollect[0].packageNo]);
          } else {
            // Handle the case when no products are returned
            console.log('No products found for the given packageNo');
          }
        });
      } catch (error: any) {
        console.log('Error fetching products:', error.message);
      }
    }
  }

  async deleteInvoiceProducts(orderNumber: string) {

    const confirmDelete = window.confirm("Bu transferi silmek istediğinizden emin misiniz?");
    if (confirmDelete) {
      // Kullanıcı onayladıysa silme işlemini gerçekleştir
      const response = await this.orderService.deleteInvoiceProducts(orderNumber);
      if (response === true) {
        location.reload();
        this.alertifyService.success("İşlem Başarılı")
      } else {
        this.alertifyService.error("İşlem Başarısız")

      }
    }
  }

  async getPurchaseOrders(): Promise<any> {
    const response =
      this.saleOrderModels = await this.orderService.getPurchaseOrders()

  }


}
