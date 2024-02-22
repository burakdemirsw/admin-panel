import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, OnChanges {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() barcode: string = null;
  @Input() quantity: string = null;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["barcode"] && !changes["barcode"].isFirstChange()) {
      console.log("Barkod değişti:", changes["barcode"].currentValue);
    }

    if (changes["quantity"] && !changes["quantity"].isFirstChange()) {
      console.log("Quantity değişti:", changes["quantity"].currentValue);
    }
  }
}
