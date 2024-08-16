import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/admin/general.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { IdeasoftOffer, IdeasoftOfferDetail } from '../models/ideasoftOfferDetail';
import { HeaderService } from 'src/app/services/admin/header.service';

@Component({
  selector: 'app-ideasoft-offers',
  templateUrl: './ideasoft-offers.component.html',
  styleUrls: ['./ideasoft-offers.component.css']
})
export class IdeasoftOffersComponent implements OnInit {
  offers: IdeasoftOffer[] = [];
  selectedOffers: IdeasoftOffer[] = [];
  selectedCoupons: IdeasoftOfferDetail[] = [];
  dialog = false;

  constructor(
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private toasterService: ToasterService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClientService: HttpClientService,
    private headerService: HeaderService
  ) { }

  async ngOnInit() {
    this.headerService.updatePageTitle("Kupon Listesi")
    await this.getIdeasoftOfffers();
  }

  async getIdeasoftOfffers() {
    const response = await this.httpClientService.get<any>({ controller: `Marketplaces/get-ideasoft-offers` }).toPromise();
    this.offers = response;
    return response;
  }

  async deleteOffer(id: number) {
    const response = await this.httpClientService.get<any>({ controller: `Marketplaces/delete-ideasoft-offer` }, id.toString()).toPromise();
    if (response) {
      this.toasterService.success('Silindi')
      await this.getIdeasoftOfffers();
    } else {
      this.toasterService.success('Silinemedi')
    }
    return response;
  }

  async deleteOfferDetail(id: number) {
    const response = await this.httpClientService.get<any>({ controller: `Marketplaces/delete-offer-detail` }, id.toString()).toPromise();
    if (response) {
      this.dialog = false;
      this.toasterService.success('Kupon Silindi')
      this.getIdeasoftOfffers();
    } else {
      this.toasterService.success('Kupon Silinemedi')
    }
    return response;
  }

  async runOfferService() {
    const response = await this.httpClientService.get<any>({ controller: `Marketplaces/run-offer-service` }).toPromise();
    if (response) {
      this.toasterService.success('Servis Çalıştı')
      this.getIdeasoftOfffers();
    } else {
      this.toasterService.success('Servis Çalışmadı')
    }
    return response;
  }
  couponDialog = false;
  couponType: boolean;
  couponValue: number;
  couponResponse: string;
  async createCoupon(isPercentage: boolean, value: number) {
    if (isPercentage && !(value >= 1 && value <= 100)) {
      this.toasterService.error("Değer 0 ile 100 arasında olmalıdır")
      return;
    }
    var query = `${isPercentage}/${value}`
    const response = await this.httpClientService.get_new<any>({ controller: `Marketplaces/add-ideasoft-coupon` }, query).toPromise();
    if (response) {
      this.couponResponse = response ? response.code : 'Servis Çalışmadı';
      this.toasterService.success('Servis Çalıştı')
      this.getIdeasoftOfffers();
    } else {
      this.toasterService.success('Servis Çalışmadı')
    }
  }

  viewDetails(offer: IdeasoftOffer) {
    this.selectedCoupons = offer.ideasoftOfferDetails;
    this.dialog = true;
  }
}
