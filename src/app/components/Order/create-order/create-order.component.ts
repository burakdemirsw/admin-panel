import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  selectedCustomers: any[] = [] //kadir abi sp yazıcak
  selectedProducts: any[] = [] //kadir abi sp yazıcak
  selectedAddresses: any[] = [] //kadir abi sp yazıcak

  //---------------------------------------------------- Dialog değişkenleri ve metodları
  findExistingMemberDialog: boolean = false;
  findProductDialog: boolean = false;
  openDialog(dialogName: string) {
    if (dialogName === "findExistingMemberDialog") {
      this.findExistingMemberDialog = !this.findExistingMemberDialog
    }
    if (dialogName === "findProductDialog") {
      this.findProductDialog = !this.findProductDialog
    }
  }
  //----------------------------------------------------

  constructor(private formBuilder: FormBuilder) { }
  createCustomerForm: FormGroup;
  ngOnInit(): void {
  }

}
