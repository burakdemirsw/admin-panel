import { Pipe, PipeTransform } from '@angular/core';
import { ShelfModel } from '../models/model/shelf/ShelfModel';

@Pipe({
  name: 'filterShelves'
})
export class FilterShelvesPipe implements PipeTransform {

  transform(value: ShelfModel[], filterText?: string): ShelfModel[] {
    var key=filterText ? filterText.toLocaleLowerCase():"";
    return filterText?value.filter((t:ShelfModel)=>t.warehouse?.toLowerCase().indexOf(key)!==-1):value
  }

} 
