import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { borderRightStyle } from 'html2canvas/dist/types/css/property-descriptors/border-style';
import { CreateBarcodeFromOrder_RM } from 'src/app/components/Product/create-barcode/models/createBarcode';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { ZTMSG_CreateCargoBarcode_CM } from 'src/app/models/model/cargo/ZTMSG_CreateCargoBarcode_CM';
import { OrderFilterModel } from 'src/app/models/model/filter/orderFilterModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { CargoService } from 'src/app/services/admin/cargo.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { RetailOrderService } from 'src/app/services/admin/retail/retail-order.service';
import { ExportCsvService } from 'src/app/services/export-csv.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-retail-order-management',
  templateUrl: './retail-order-management.component.html',
  styleUrls: ['./retail-order-management.component.css']
})
export class RetailOrderManagementComponent implements OnInit {


  constructor(
    private headerService: HeaderService,
    private toasterService: ToasterService,
    private router: Router,
    private orderService: RetailOrderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private exportCsvService: ExportCsvService,
    private cargoService: CargoService


  ) { }
  //#region  params
  cargoFirms = ClientUrls.cargoFirms;
  numberOfList: number[] = [1, 10, 20, 50, 100,]
  saleOrderModels: SaleOrderModel[]
  selectedOrders: SaleOrderModel[]
  currentPage: number = 1;
  filterForm: FormGroup;
  pageDescription: boolean = false;
  _pageDescription: boolean = false;
  pageDescriptionLine: string = "Alınan Siparişler"
  status = 1;
  invoiceStatus = 2
  first = 5;
  productsToCollect: ProductOfOrder[];
  visible2: boolean = false;
  cargoSelectVisible: boolean = false;
  filterMode = 'lenient';
  columns = [
    "Sipariş Tarihi",
    "Sipariş Numarası",
    "Müşteri Kodu",
    "Müşteri Adı",
    "Satıcı Kodu",
    "Açıklama",
    "Miktar",
    "Tutar",
    "Toplanan Miktar",
    "Toplanalabilir Miktar",
    "Depo",
    "Kargo",
    "Fatura",
    "İşlemler"
  ];
  //#endregion


  getCargoImage(name: string): string {
    switch (name) {
      case 'MNG':
        return 'https://upload.wikimedia.org/wikipedia/tr/5/52/MNG_Kargo.png';
      case 'Aras':
        return 'https://seeklogo.com/images/A/aras-kargo-arac-kaplama-logo-73DA342AF5-seeklogo.com.png';
      case 'Yurtiçi':
        return 'https://logoeps.com/wp-content/uploads/2013/06/yurtici-kargo-vector-logo-200x200.png';
      default:
        return '';
    }
  }

  async ngOnInit() {
    //this.spinnerService.show();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['status']) {
        this.status = params['status']
      }
      if (params['invoiceStatus']) {
        this.invoiceStatus = params['invoiceStatus']
      }


    });
    if (location.href.includes("missing-list")) {
      this.pageDescription = true
      this.pageDescriptionLine = "Eksik Siparişler"
    }

    this.formGenerator()
    await this.getOrders(this.status, this.invoiceStatus);
    //this.spinnerService.hide();
    this.setPageDescription();

  }



  setPageDescription() {

    if (this.status == 1 && this.invoiceStatus == 2) {

      this.pageDescriptionLine = "Toplanabilir Faturalandırılmayan Siparişler"
    }
    if (this.status == 0 && this.invoiceStatus == 2) {

      this.pageDescriptionLine = "Toplanamaz Siparişler"
    } if (this.status == -1 && this.invoiceStatus == -1) {

      this.pageDescriptionLine = "Eksik Ürünlü Siparişler"
    } if (this.status == 1 && this.invoiceStatus == 1) {

      this.pageDescriptionLine = "Faturalandırılan Siparişler"
    } if (this.status == 1 && this.invoiceStatus == 2) {

      this.pageDescriptionLine = "Toplanabilir Siparişler"
    } if (this.status == 0 && this.invoiceStatus == 3) {

      this.pageDescriptionLine = "Kısmi Faturalaştırılan Siparişler"
    }
    this.headerService.updatePageTitle(this.pageDescriptionLine);

  }
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
  async onSubmit(model: OrderFilterModel) {
    // this.saleOrderModels = await this.orderService.getOrdersByFilter(model)
    this.toasterService.warn('Bu özellik şu anda kullanılamıyor.')

  }
  exportCsv() {
    this.exportCsvService.exportToCsv(this.selectedOrders, 'my-orders', this.columns);
  }
  getSelectedOrders() {
    console.log(this.selectedOrders)
  }

  //toplanan ürünler sayfasına akatarır fakat önce ilgili siparişin içeriğinden paketNo'değerini çeker.
  async routeToCPP(number: string) {

    if (number == null || number == '') {
      this.toasterService.warn('Lütfen Bir Müktar Seçiniz');
    } else {
      try {


        const data = await this.orderService.getProductOfOrder(number.toString());

        this.productsToCollect = data;


        if (this.productsToCollect.length > 0) {

          //5 adet ürünü toplamak için oluşturur
          this.router.navigate(['/collect-product-of-order/' + this.productsToCollect[0].packageNo]);
        } else {

          this.toasterService.warn('İşlem Yapıclacak Veri Gelmedi.');
        }


      } catch (error: any) {
        console.log('Error fetching products:', error.message);
      }
    }
  }
  async getMissingOrders() {
    // this.status = -1
    // this.invoiceStatus = -1;
    // const response =
    //   this.saleOrderModels = await this.orderService.getMissingOrders()


    // this.filterOrdersByRole();
    // this.setPageDescription();
    this.toasterService.warn('Bu özellik şu anda kullanılamıyor.')

  }
  async getOrders(status: number, invoiceStatus: number): Promise<any> {

    this.status = status;
    this.invoiceStatus = invoiceStatus;
    if (location.href.includes("missing-list")) {
      // const response =
      //   this.saleOrderModels = await this.orderService.getMissingOrders()
      this.toasterService.warn('Bu özellik şu anda kullanılamıyor.')
    } else {
      const response =
        this.saleOrderModels = await this.orderService.getOrders(status, invoiceStatus)
      console.log(this.saleOrderModels)
    }
    this.filterOrdersByRole();
    this.setPageDescription();

  }

  filterOrdersByRole() {
    if (localStorage.getItem('roleDescription') != 'Admin') {
      this.saleOrderModels = this.saleOrderModels.filter(x => x.salespersonCode == localStorage.getItem('salesPersonCode'))
      this.toasterService.info('Sadece Kendi Siparişlerinizi Görebilirsiniz.')
    }
  }



  async routeNewPage3(orderNumber: string) {
    this.router.navigate(["/order-operation/" + "MIS-" + orderNumber])
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


  async createMarketplaceCargoBarcode(orderNumber: string) {
    if (!orderNumber.includes('B')) {
      if (confirm('Bu sipariş Beymen siparişi değil. Yine de yazdırmak istiyor musunuz?') == false) {
        return;
      } else {
        var response = await this.orderService.createMarketplaceCargoBarcode(orderNumber);
        if (response) {
          this.toasterService.success("İşlem Başarılı")
        } else {
          this.toasterService.error("İşlem Başarısız")
        }
      }
    }

  }


  selectCargo(cargo: any) {
    this.createCargoBulk(this.selectedOrders, cargo.id)
  }


  async createCargoBulk(request: SaleOrderModel[], cargoFirmId: number) {

    if (cargoFirmId == 2) {
      this.toasterService.warn('Bu kargo firması ile işlem yapamazsınız.')
      return;
    }
    if (this.selectedOrders.length > 0) {
      if (window.confirm("Seçili Siparişleri Kargoya Göndermek İstediğinize Emin Misiniz?")) {

        var request = this.selectedOrders.filter(x => x.isShipped == false);
        var _request: ZTMSG_CreateCargoBarcode_CM[] = [];
        for (let i = 0; i < request.length; i++) {
          var __request = new ZTMSG_CreateCargoBarcode_CM();
          __request.orderNumber = request[i].orderNumber;
          __request.cargoFirmId = cargoFirmId;
          _request.push(__request);
        }
        var response = await this.cargoService.createCargoBulk(_request);
        if (response) {
          this.getOrders(this.status, this.invoiceStatus)
          this.toasterService.success("İşlem Başarılı")
        } else {
          this.toasterService.error("İşlem Başarısız")
        }

      }
    } else {
      this.toasterService.warn('Lütfen En Az Bir Sipariş Seçiniz.')
    }


  }

}
