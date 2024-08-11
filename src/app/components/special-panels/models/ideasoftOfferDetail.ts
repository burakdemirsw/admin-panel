import { BaseEntity } from "src/app/models/entity/baseEntity";


export class IdeasoftOfferDetail extends BaseEntity {
  ideasoftOffer: IdeasoftOffer;
  offerId: number;
  coupon?: string;
  couponId: number;
  couponCreatedDate?: Date;
  couponEndDate?: Date;
  couponValue?: number;
  isPercentageDiscount: boolean;
}

export class IdeasoftOffer extends BaseEntity {
  orderNo: string;
  userId: number;
  salesUrl: string;
  customerName?: string;
  customerSurname?: string;
  childName?: string;
  childSurname?: string;
  childBornDate?: Date;
  ideasoftOfferDetails?: IdeasoftOfferDetail[];

}
