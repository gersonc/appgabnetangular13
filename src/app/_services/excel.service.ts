import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {ColunasI} from "../_models/colunas-i";

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public static exportAsExcelFile(excelFileName: string, json: any[], selectedColumns: ColunasI[], campo_id?: string): void {
    /*const cp = Object.keys(json[0]);
    const meuTit: any[] = [];
    cp.forEach((cc) => {
      // @ts-ignore
      meuTit[cc] = tit[cc];
    });*/



    const titulos: any[] = [];
    // titulos.push("ID");

    // keys.push('"' + campo_id + '"');
    selectedColumns.forEach((d) => {
      titulos[d.field]= d.header;
    });
    const keys = Object.keys(titulos);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([keys], {header: titulos, skipHeader: true});
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    XLSX.utils.sheet_add_json(worksheet, json, {header: keys, origin: 'A2', skipHeader: true});
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet( workbook, worksheet, excelFileName);
    XLSX.writeFile(workbook, ExcelService.toExportFileName(excelFileName));
  }

  public static exportAsExcelFile2(excelFileName: string, json: any[], tit: any[]): void {
    const cp = Object.keys(json[0]);
    // const meuTit: any[] = [];
    const meuTit: string[] = [];
    cp.forEach((cc) => {
      // @ts-ignore
      meuTit.push(tit[cc]);
    });
    const tabela = [];
    json.forEach( (linha: any) => {
      tabela.push(Object.values(linha));
    });

    tabela.unshift(meuTit);



    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([meuTit], {header: cp, skipHeader: true});
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tabela);
    // XLSX.utils.sheet_add_json(worksheet, json, {header: cp, origin: 'A2', skipHeader: true});
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet( workbook, worksheet, excelFileName);
    XLSX.writeFile(workbook, ExcelService.toExportFileName(excelFileName));
  }
}
