import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})

export class ServiceExcel {
  mappedItem: any;
    constructor(  private router: Router,
                private http: HttpClient
             ) {}

  exportToExcel(selectedList: any[], fileName: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, fileName + '.xlsx');
  }

}