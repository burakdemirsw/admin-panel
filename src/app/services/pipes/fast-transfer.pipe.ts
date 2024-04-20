import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fastTransfer'
})
export class FastTransferPipe implements PipeTransform {
  transform(items: any[], searchText: string, fieldNames: string[]): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();
    return items.filter(item => {
      for (let fieldName of fieldNames) {
        if (item[fieldName] && item[fieldName].toString().toLowerCase().includes(searchText)) {
          return true;
        }
      }
      return false;
    });
  }

}
