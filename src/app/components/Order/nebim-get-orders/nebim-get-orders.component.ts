import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetNebimOrders, GetNebimOrders_RM } from 'src/app/models/model/order/getOrder_RM';
import { GetProductStock, GetProductStock_RM } from 'src/app/models/model/product/getProductStock';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-nebim-get-orders',
  templateUrl: './nebim-get-orders.component.html',
  styleUrls: ['./nebim-get-orders.component.css']
})
export class NebimGetOrdersComponent implements OnInit {
  form: FormGroup;
  activeTab = 1;
  orders: GetNebimOrders[] = [];
  shipmentStatus: any[] = [{ label: "Tamamlandı", value: true }, { label: "Tamamlanmadı", value: false }]
  constructor(private formBuilder: FormBuilder, private orderService: OrderService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      startDate: [null],
      endDate: [null],
      shipmentStatus: [null],
      warehouseCode: [null],
      itemCode: [null],
    });
  }

  async onSubmit(value: any) {
    var request = new GetNebimOrders_RM();
    request = value;

    var response = await this.orderService.getNebimOrders(request);
    if (response) {
      this.orders = response;
      this.toasterService.success("Sipariş Bulundu");
    } else {
      this.toasterService.error("Sipariş Bulunamadı");
    }

  }

  clearBarcode() {
    this.form.reset();
  }
}
