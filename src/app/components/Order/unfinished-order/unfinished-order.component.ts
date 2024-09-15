import { Component, OnInit } from "@angular/core";
import { HeaderService } from "src/app/services/admin/header.service";
import { OrderService } from "src/app/services/admin/order.service";
import { ToasterService } from "src/app/services/ui/toaster.service";
import {
  ClientOrder,
  ClientOrder_DTO,
  ClientOrderFilter,
} from "../../../models/model/order/nebimOrder";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { GeneralService } from "src/app/services/admin/general.service";
import { UserService } from "src/app/services/admin/user.service";

@Component({
  selector: "app-unfinished-order",
  templateUrl: "./unfinished-order.component.html",
  styleUrls: ["./unfinished-order.component.css"],
})
export class UnfinishedOrderComponent implements OnInit {
  constructor(
    private headerService: HeaderService,
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private userService: UserService
  ) { }
  currentPage = 1;
  orders: ClientOrder_DTO[] = [];
  visible: boolean = false;
  status: boolean;
  currentOrderState: boolean = false;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(p => {

      if (p["status"] == "true") {
        this.status = true;

        this.getOrders(true);

      } else if (p["status"] == "false") {
        this.status = false;
        this.getOrders(false);

      } else {
        this.getOrders(false);

      }

    })
    this.createForm();
  }

  route(order: ClientOrder_DTO) {
    if (order.clientOrder.orderNo.includes("MSG-P")) {
      this.router.navigate([
        "/create-order/retail-order/" + order.clientOrder.id,
      ]);
    } else {
      this.router.navigate([
        "/create-order/quick-order/" + order.clientOrder.id,
      ]);
    }
  }
  clientOrderFilterForm: FormGroup;
  createForm() {
    this.clientOrderFilterForm = this.fb.group({
      customerCode: [null],
      salesPersonCode: [null],
      salesPersonDescription: [null],
      paymentDescription: [null],
      orderNo: [null],
      orderNumber: [null],
      createdDate: [null],
      updatedDate: [null],
      customerDescription: [null],
      isCancelled: [null],
    });
  }

  async onSubmit() {
    const filter: ClientOrderFilter = this.clientOrderFilterForm.value;

    var response = await this.orderService.getClientOrdersByFilter(filter);
    this.orders = [];
    this.orders = response;
    this.filterOrdersByRole();
    this.headerService.updatePageTitle(
      (this.currentOrderState == true ? "Aktarılan" : "Aktarılmamış") +
      " Siparişler"
    );
    // API çağrısı burada yapılabilir
  }
  async getOrders(isCompleted: boolean) {
    this.headerService.updatePageTitle("Panel Siparişleri");
    this.currentOrderState = isCompleted;
    const userId = Number(localStorage.getItem("userId"));

    this.orders = await this.orderService.getClientOrders(isCompleted, userId);

    this.filterOrdersByRole();
    this.headerService.updatePageTitle(
      (this.currentOrderState == true ? "Aktarılan" : "Aktarılmamış") +
      " Siparişler"
    );
  }

  async routePage() {
    const result = await this.generalService.generateGUID()
    location.href = location.origin + "/create-order/quick-order/" + result;
  }

  filterOrdersByRole() {
    const roleDescription = localStorage.getItem("roleDescription");
    const salesPersonCode = localStorage.getItem("salesPersonCode");
    var ui = this.userService.getUserClientInfoResponse();
    var f = (ui.name + ui.surname);
    if (ui.roleDescription != 'Admin') {
      if (this.orders?.length > 0) {
        // Satış personel koduna göre filtreleme
        this.orders = this.orders.filter(
          (order) => order.clientOrder?.userId == ui.userId
        );
      }
    }

  }

  async deleteClientOrder(id: string) {
    var response = await this.orderService.deleteClientOrder(id);
    if (response) {
      this.toasterService.success("Sipariş Silindi");
      this.getOrders(this.currentOrderState);
    }
  }

  async updateClientOrderCancelStatus(id: string, status: boolean) {
    status = status == null ? false : status;
    var response = await this.orderService.updateClientOrderCancelStatus(
      id,
      status
    );
    if (response) {
      this.toasterService.success("Sipariş İptal Edildi");
      this.getOrders(this.currentOrderState);
    }
  }

  async updateCargoStatus(order: ClientOrder) {
    var order_response = await this.orderService.getClientOrder(order.id);
    if (order_response) {
      if (order_response.clientOrder.cargoStatus == "KARGO VAR") {
        order_response.clientOrder.cargoStatus = "KARGO YOK";
      } else {
        order_response.clientOrder.cargoStatus = "KARGO VAR";
      }

      var update_response = await this.orderService.createClientOrder(
        order_response.clientOrder
      );
      if (update_response) {
        this.toasterService.success("Kargo Durumu Güncellendi");
        this.getOrders(this.currentOrderState);
      }
    }
  }
}
