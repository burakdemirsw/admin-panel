import { Injectable } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';


@Injectable({
  providedIn: 'root'
})
export class ExportCsvService {

  exportToCsv(data: any[], filename: string, headers: string[]) {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useBom: true,
      noDownload: false,
      headers: headers
    };
    new AngularCsv(data, filename, options);
  }
}
