import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CargoService } from 'src/app/services/admin/cargo.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { BulkDeleteShipment_CM, BulkDeleteShipment_RM, CargoBarcode_VM, GetPackageStatus_MNG_Response } from '../create-cargo/models/models';
import { MenuItem } from 'primeng/api';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { MarketplaceService } from 'src/app/services/admin/marketplace.service';

@Component({
  selector: 'app-cargo-list',
  templateUrl: './cargo-list.component.html',
  styleUrls: ['./cargo-list.component.css']
})
export class CargoListComponent implements OnInit {

  constructor(private headerService: HeaderService, private toasterService: ToasterService, private cargoService: CargoService,
    private marketplaceService: MarketplaceService
  ) { }
  currentPage = 1;
  cargos: CargoBarcode_VM[] = [];
  selectedCargos: CargoBarcode_VM[] = [];

  visible: boolean = false;
  items: MenuItem[] = [
    {
      label: 'Yazdır',
      command: () => {
        this.createYurticiBarcode()
      }
    },
    {
      label: 'Sil',
      command: () => {
        this.deleteCargoBulk(this.selectedCargos)
      }
    },

  ];
  cargoState: boolean = false;
  ngOnInit(): void {
    this.headerService.updatePageTitle("Kargolar");
    this.getCargos(this.cargoState);
  }

  async getCargos(isPrinted: boolean) {
    this.cargoState = isPrinted;
    this.cargos = await this.cargoService.getShippedCargos(this.cargoState);
  }
  // async printSingleBarcode(zplCode) {
  //   var response = await this.cargoService.printSingleBarcode(zplCode);
  // }

  async deleteCargo(cargo: CargoBarcode_VM, cargoFirmId: number) {
    var windowResponse = window.confirm("Gönderiyi silmek istediğinize emin misiniz?")
    if (windowResponse) {

      var response = await this.cargoService.deleteCargo(cargo, cargoFirmId)
      if (response) {
        this.toasterService.success("Gönderi Silindi")
        this.getCargos(this.cargoState);
      } else {
        this.toasterService.warn("Gönderi Silinemedi")
      }
    }



  }

  async deleteCargoBulk(cargo: CargoBarcode_VM[]) {
    var windowResponse = window.confirm("Gönderiyi silmek istediğinize emin misiniz?")
    if (windowResponse) {
      var request: BulkDeleteShipment_CM[] = [];
      cargo.forEach(element => {
        request.push({ referenceId: element.referenceId, cargoFirmId: element.cargoFirmId })
      });
      var response: BulkDeleteShipment_RM[] = await this.cargoService.deleteCargoBulk(request)
      if (response) {
        this.toasterService.info(response.length + " Adet Gönderiden " + response.filter(x => x.status === true).length + " Gönderi Silindi")
        this.getCargos(this.cargoState);

      } else {
        this.toasterService.warn("Gönderi Silinemedi")
      }
    }



  }
  packageStatus: GetPackageStatus_MNG_Response = null;
  async getCargoDetail(cargo: CargoBarcode_VM, openDialog: boolean) {
    var response = await this.cargoService.getPackageStatus(cargo.referenceId);

    if (openDialog) {
      this.visible = true
      this.packageStatus = response
    } else {
      window.open(response.trackingUrl, "_blank");
    }
  }


  async createBarcode(referenceId: string) {

    if (window.confirm("Barkod yazdırmak istediğinize emin misiniz?")) {
      var data = await this.cargoService.createBarcode(referenceId);
      if (data) {


        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        // Create a temporary link element
        const downloadLink = document.createElement('a');
        downloadLink.href = fileURL;
        downloadLink.download = "marketplace-order-cargo-barcode.pdf";  // Set the filename for the download
        document.body.appendChild(downloadLink); // Append to body
        downloadLink.click();  // Trigger the download
        document.body.removeChild(downloadLink); // Remove the link after triggering the download
        URL.revokeObjectURL(fileURL); // Clean up the URL object



        const _file = new Blob([data], { type: 'application/pdf' });
        const _fileURL = URL.createObjectURL(_file);

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';  // Hide the iframe
        iframe.src = _fileURL;

        // Append the iframe to the body
        document.body.appendChild(iframe);

        // Wait until the iframe is loaded, then call print
        iframe.onload = () => {
          iframe.contentWindow?.print();
        };
        this.toasterService.success("BARKOD YAZDIRILDI");

        this.getCargos(this.cargoState);
      } else
        this.toasterService.error("BARKOD YAZDIRILAMADI");




    }
  }
  async createYurticiBarcode() {
    if (this.selectedCargos.length > 0) {
      this.selectedCargos = this.selectedCargos.filter(x => x.cargoFirmId === 3);
      var request: string[] = [];
      this.selectedCargos.forEach(element => {
        request.push(element.referenceId)
      });
      var response = await this.cargoService.createYurticiBarcode(request);
      if (response) {
        this.toasterService.success("BARKOD YAZDIRILDI");
        this.getCargos(this.cargoState);
      } else {
        this.toasterService.error("BARKOD YAZDIRILAMADI");
      }
    }
  }

  async createMarketplaceCargoBarcode(orders: CargoBarcode_VM[]) {

    var orderNoList: string[] = [];
    for (const element of orders) {
      // if (!element.description.includes('B')) {
      //   this.toasterService.warn('Sadece Beymen Siparişleri Seçilebilir.');
      //   return;
      // }
      orderNoList.push(element.orderNo);
    }

    var response = await this.cargoService.createMarketplaceCargoBarcode(orderNoList);
    if (response) {
      this.toasterService.success("İşlem Başarılı");
    } else {
      this.toasterService.error("İşlem Başarısız");
    }



  }

}
