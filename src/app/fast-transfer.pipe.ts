import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fastTransfer'
})
export class FastTransferPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
