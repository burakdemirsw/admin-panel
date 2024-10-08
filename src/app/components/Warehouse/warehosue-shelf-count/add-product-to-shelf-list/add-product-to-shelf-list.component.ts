import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CreateBarcodeFromOrder_RM } from 'src/app/components/Product/create-barcode/models/createBarcode';
import { CountListFilterModel } from 'src/app/models/model/filter/countListFilterModel';
import { InnerLine_VM } from 'src/app/models/model/warehouse/ztmsg_CountedProduct';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ExportCsvService } from 'src/app/services/export-csv.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-add-product-to-shelf-list',
  templateUrl: './add-product-to-shelf-list.component.html',
  styleUrl: './add-product-to-shelf-list.component.css'
})
export class AddProductToShelfListComponent {
  currentPage: number = 1; // Başlangıçta ilk sayfayı göster
  filterForm: FormGroup;
  constructor(

    private toasterService: ToasterService,
    private productService: ProductService,
    private router: Router,
    private formBuilder: FormBuilder,
    private exportCsvService: ExportCsvService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService
  ) { }
  innerProcessCode: string;
  async ngOnInit() {

    //this.spinnerService.show();
    this.formGenerator();
    this.activatedRoute.paramMap.subscribe(params => {
      const param = params.get('innerProcessCode'); // 'id' parametresini alıyoruz, rota yapınıza göre değiştirin
      this.loadData();
      this.items.push({
        label: 'Excel\'e Aktar',
        command: () => {
          this.exportCsv();
        }
      })
    });

  }
  async route(code: string, isReturn?: boolean, isShefBased?: boolean, istransferbetweeenOfficeWarehouses?: boolean) {
    const result = await this.generalService.generateGUID();


    if (isReturn == true && isShefBased == undefined) {
      this.router.navigate([`add-product-to-shelf/${code}/false`], { queryParams: { isReturn: true } });

    }
    else if (isReturn == true && isShefBased == false) {
      this.router.navigate([`add-product-to-shelf/${code}/false/true`], { queryParams: { isReturn: true, isShelfBased: isShefBased } });

    }

    else {
      if (isShefBased != null) {
        this.router.navigate([`add-product-to-shelf/${code}/false`], { queryParams: { isShelfBased: isShefBased } });
      } else {
        this.router.navigate([`add-product-to-shelf/${code}/false`]);

      }

    }
  }

  async loadData() {
    this.activatedRoute.params.subscribe((params) => {

      if (params["innerProcessCode"]) {
        this.innerProcessCode = params["innerProcessCode"];
      }
    });
    if (this.innerProcessCode == "CI") {
      // this.items = [
      //   {
      //     label: 'Yeni Sayım Ekle',
      //     command: () => {
      //       this.route('CI')
      //     }
      //   },
      //   {
      //     label: 'Yeni Sayım Çıkar',
      //     command: () => {
      //       this.route('CO')
      //     }
      //   }
      // ];
      this.items.push({
        label: 'Yeni  Sayım Ekle',
        command: () => {
          this.route('CI', false, false)
        }
      },
        {
          label: 'Yeni  Sayım Çıkar',
          command: () => {
            this.route('CO', false, false)
          }
        })
      this.headerService.updatePageTitle("Rafa Ürün Ekle");
      var request: string[] = ["CI", "CO"];
      await this.getGetCountList(request);
    } else if (this.innerProcessCode == "CO") {
      this.items = [
        {
          label: 'Yeni Sayım Ekle',
          command: () => {
            this.route('CI')
          }
        },
        {
          label: 'Yeni Sayım Çıkar',
          command: () => {
            this.route('CO')
          }
        }
      ];
      this.items.push({
        label: 'Yeni Rafsız Sayım Ekle',
        command: () => {
          this.route('CI', false, false)
        }
      },
        {
          label: 'Yeni Rafsız Sayım Çıkar',
          command: () => {
            this.route('CO', false, false)
          }
        })
      var request: string[] = ["CI", "CO"];
      await this.getGetCountList(request);
      this.headerService.updatePageTitle("Raftan Ürün Çıkar");
    } else if (this.innerProcessCode == "C") {
      this.items = [
        {
          label: 'Yeni',
          command: () => {
            this.route(this.innerProcessCode)
          }
        }
      ];
      var request: string[] = ["C"];
      await this.getGetCountList(request);
      this.headerService.updatePageTitle("Sayım");
    } else if (this.innerProcessCode == "WT" || this.innerProcessCode == "WT-O") {

      // this.items = [
      //   {
      //     label: 'Mağaza Depoları Arası Transfer OLuştur',
      //     command: () => {
      //       this.route("WT")
      //     }
      //   },
      //   {
      //     label: 'Ofis Depoları Arası Transfer OLuştur',
      //     command: () => {
      //       this.route("WT-O", true)
      //     }
      //   }
      // ];
      this.items.push({
        label: ' Mağaza Depoları Arası Transfer Oluştur',
        command: () => {
          this.route("WT", false, false)
        }
      },
        {
          label: ' Ofis Depoları Arası Transfer OLuştur',
          command: () => {
            this.route("WT-O", true, false)
          }
        })
      var request: string[] = ["WT"];
      await this.getGetCountList(request);
      this.headerService.updatePageTitle("Mağazanın Depoları Arası Transfer");
    } else if (this.innerProcessCode == "S") {
      this.items = [
        {
          label: 'Yeni Mağaza Transfer İrsaliyesi Oluştur',
          command: () => {
            this.route(this.innerProcessCode)
          }
        },
        {
          label: 'Yeni Merkeze İade Oluştur',
          command: () => {
            this.route(this.innerProcessCode, true)
          }
        }
      ];
      this.items.push({
        label: 'Yeni Rafsız Mağaza Transfer İrsaliyesi Oluştur',
        command: () => {
          this.route(this.innerProcessCode, false, false)
        }
      },
        {
          label: 'Yeni Rafsız Merkeze İade Oluştur',
          command: () => {
            this.route(this.innerProcessCode, true, false)
          }
        })

      var request: string[] = ["S"];
      await this.getGetCountList(request);
      this.headerService.updatePageTitle("Transferler");
    } else if (this.innerProcessCode == "ST") {
      this.items = [
        {
          label: 'Yeni',
          command: () => {
            this.route(this.innerProcessCode)
          }
        }
      ];
      var request: string[] = ["ST"];
      await this.getGetCountList(request);
      this.headerService.updatePageTitle("Raflar Arası Transfer");

    }

  }


  exportCsv() {
    this.exportCsvService.exportToCsv(this.countList, 'my-data');
  }

  items: MenuItem[] = [];

  innerNumberList: string[] = [];
  addInnerNumberToList(innerNumber: string) {
    if (!this.innerNumberList.includes(innerNumber)) {
      this.innerNumberList.push(innerNumber);
    } else {
      const index = this.innerNumberList.indexOf(innerNumber);
      this.innerNumberList.splice(index, 1);
    }
  }
  async newCount() {
    try {
      const orderNo: string = await this.generalService.generateGUID();
      this.router.navigate(['/warehouse-shelf-count/count/' + orderNo]);
    } catch (error: any) {
      console.log(error.message);
    }

  }
  async newCount2() {
    try {
      const orderNo: string = await this.generalService.generateGUID();
      this.router.navigate(['/warehouse-shelf-count/CI']);
    } catch (error: any) {
      console.log(error.message);
    }

  }
  async newCount3() {
    try {
      const orderNo: string = await this.generalService.generateGUID();
      this.router.navigate(['/warehouse-shelf-count/CO']);
    } catch (error: any) {
      console.log(error.message);
    }

  }

  countList: InnerLine_VM[]

  async getGetCountList(request: string[]): Promise<any> {
    try {
      this.countList = await this.warehouseService.getInnerHeaders(request);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  formGenerator() {
    this.filterForm = this.formBuilder.group({
      orderNo: [null, Validators.required],
      totalProduct: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]

    });
  }

  async deleteCountFromId(orderNumber: string) {
    // Silme işleminden önce kullanıcıya emin olup olmadığını sormak için bir onay penceresi göster
    const confirmDelete = window.confirm("Bu transferi silmek istediğinizden emin misiniz?");

    if (confirmDelete) {
      // Kullanıcı onayladıysa silme işlemini gerçekleştir
      const response = await this.warehouseService.deleteCountFromId(orderNumber);
      if (response === true) {
        location.reload();
        this.toasterService.success("İşlem Başarılı")
      } else {
        this.toasterService.error("İşlem Başarısız")

      }
    }
  }


  async onSubmit(model: CountListFilterModel) {
    //this.spinnerService.show()
    const response = await this.warehouseService.GetCountListByFilter(model)
    if (response) {
      this.countList = response;
      //this.spinnerService.hide()
    }
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
    request.from = "warehouse-shelf-count";
    request.products = null;
    var response = await this.productService.sendBarcodesToNebim(request);
    if (response) {
      this.toasterService.success("İşlem Başarılı")
    } else {
      this.toasterService.error("İşlem Başarısız")
    }
  }
}
