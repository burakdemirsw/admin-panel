import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExportCsvService {

  exportToCsv(data: any[], filename: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);

    // Dosya adı ve seçenekler
    XLSX.writeFile(wb, filename + '.xlsx');
  }


}

