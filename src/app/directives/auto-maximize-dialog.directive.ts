import { Directive, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Directive({
  selector: 'p-dialog' // Tüm p-dialog'lar için geçerli olacak
})
export class AutoMaximizeDialogDirective implements AfterViewInit {
  constructor(private dialog: Dialog) { }

  ngAfterViewInit(): void {
    // Dialog header'ını "BURAK" olarak ayarla
    if (this.dialog) {
      this.dialog.modal = true;
      this.dialog.maximizable = true;
      this.dialog.closable = true;
      this.dialog.position = 'center';
      this.dialog.resizable = true;
      this.dialog.style = { 'min-width': '50vw' }; // Stil nesnesi olarak atanmalı

    }

  }
}

