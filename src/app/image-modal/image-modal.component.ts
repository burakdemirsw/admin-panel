// image-modal.component.ts
import { Component, Input } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {
  @Input() imageUrl: string;
  @Input() title: string;
  formModal :any;

}
