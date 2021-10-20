import { Injectable } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { CadastroInterface } from '../cadastro/_models';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }

  static toCSVExportFileName(csvFileName: string): string {
    return `${csvFileName}_gabnet_${new Date().getTime()}`;
  }

  public static jsonToCsv(nome_arquivo: string, selectedColumns: any[], gson: any[]) {
    const titulos: string[] = [];
    selectedColumns.forEach((d) => {titulos.push('"' + d.header.toString() + '"'); });
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      noDownload: false,
      headers: titulos,
      nullToEmptyString: false,
    };


    return new Angular5Csv(gson, CsvService.toCSVExportFileName(nome_arquivo), options);
  }

}
