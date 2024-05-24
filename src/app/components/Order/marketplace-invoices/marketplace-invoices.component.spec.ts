import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceInvoicesComponent } from './marketplace-invoices.component';

describe('MarketplaceInvoicesComponent', () => {
  let component: MarketplaceInvoicesComponent;
  let fixture: ComponentFixture<MarketplaceInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarketplaceInvoicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarketplaceInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
