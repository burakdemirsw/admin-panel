import { Component } from '@angular/core';

@Component({
  selector: 'app-marketplace-invoices',
  templateUrl: './marketplace-invoices.component.html',
  styleUrl: './marketplace-invoices.component.css'
})
export class MarketplaceInvoicesComponent {
  products: any[] = [{ code: "1", name: "Product 1", category: "T-SHIRT", quantity: 1 },
  { code: "1", name: "Product 1", category: "T-SHIRT", quantity: 1 },
  { code: "1", name: "Product 1", category: "T-SHIRT", quantity: 1 },
  { code: "1", name: "Product 1", category: "T-SHIRT", quantity: 1 },
  { code: "1", name: "Product 1", category: "T-SHIRT", quantity: 1 },
  { code: "1", name: "Product 1", category: "T-SHIRT", quantity: 1 },
  { code: "1", name: "Product 1", category: "T-SHIRT", quantity: 1 },
  { code: "1", name: "Product 1", category: "T-SHIRT", quantity: 1 }
  ]
  orderIdFilter: any;
  selectedProducts: any[] = [];
}
