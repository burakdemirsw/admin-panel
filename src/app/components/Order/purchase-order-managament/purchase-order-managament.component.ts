import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderFilterModel } from 'src/app/models/model/filter/orderFilterModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CreateBarcodeFromOrder_RM } from '../../Product/create-barcode/models/createBarcode';
import { Product } from 'src/app/models/model/product/product';
import { ProductService } from 'src/app/services/admin/product.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ExportCsvService } from 'src/app/services/admin/export-csv.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-purchase-order-managament',
  templateUrl: './purchase-order-managament.component.html',
  styleUrls: ['./purchase-order-managament.component.css']
})
export class PurchaseOrderManagamentComponent implements OnInit {

  numberOfList: number[] = [1, 10, 20, 50, 100]
  saleOrderModels: SaleOrderModel[] = []
  selectedOrders: SaleOrderModel[] = []
  currentPage: number = 1;
  items: MenuItem[] = [
    {
      label: 'Excele Aktar',
      command: () => {
        this.exportCsv();
      }
    }
  ];
  constructor(
    private httpClientService: HttpClientService,
    private toasterService: ToasterService,
    private router: Router,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private headerService: HeaderService,
    private exportCsvService: ExportCsvService


  ) { }
  filterForm: FormGroup;
  async ngOnInit() {
    this.headerService.updatePageTitle("Verilen Siparişler");
    this.formGenerator();
    await this.getPurchaseOrders();
    //this.spinnerService.hide();


  }
  exportCsv() {
    this.exportCsvService.exportToCsv(this.saleOrderModels, 'my-orders');
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
        this.toasterService.success("İşlem Başarılı")
      } else {
        this.toasterService.error("İşlem Başarısız")

      }
    }
  }

  async getPurchaseOrders(): Promise<any> {

    this.saleOrderModels = await this.orderService.getPurchaseOrders()

  }

  visible: boolean = false;
  selectedOrderNo: string;
  showModal(operationNo: string) {
    this.selectedOrderNo = operationNo;
    this.visible = !this.visible;
  }
  async sendBarcodesToNebim(isPackage: boolean) {
    var request = new CreateBarcodeFromOrder_RM(isPackage)
    request.operationNo = this.selectedOrderNo;
    request.from = "order-operation";
    request.products = null;
    var response = await this.productService.sendBarcodesToNebim(request);
    if (response) {
      this.toasterService.success("İşlem Başarılı")
    } else {
      this.toasterService.error("İşlem Başarısız")
    }
  }

}
