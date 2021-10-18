import { Injectable } from '@angular/core';
import { UrlService } from "../../util/_services";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { GraficoInterface } from "../_models/grafico";

declare var jsPDF: any;

@Injectable({
  providedIn: 'root'
})
export class GraficosService {

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  geraCor(): string {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
  }

  calculaAltura(nr: number): string {
    if (nr > 25) {
      nr = nr * 20;
    }
    return nr + 'px';
  }

  configuraCalendario() {
    return {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro',
        'outubro', 'novembro', 'dezembro'],
      monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy'
    };
  }

  postListarAll(tabela: string, dados?: any): Observable<any[]> {
    console.log('aaaaaaaaaaaaaaaaa', dados);
    const url = this.url.grafico + '/' + tabela;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  printImg(cte, titulo) {
    let canvas: HTMLCanvasElement = cte.nativeElement.children[0].children[1];
    let canvasImg = canvas.toDataURL("image/png", 1.0);
    let windowContent = '<!DOCTYPE html>';
    windowContent += '<html lang="pt-br">';
    windowContent += '<head><title>' + titulo.toUpperCase() + '</title></head>';
    windowContent += '<div style="' + 'text-align: center; font-family: Arial, Helvetica, sans-serif"' + '><h2>' + titulo.toUpperCase() + '</h2></div><br><br><br>';
    windowContent += '<body>';
    windowContent += '<img src="' + canvasImg + '" style="width:200mm;height:100mm;">';
    windowContent += '</body>';
    windowContent += '</html>';
    let printWin = window.open('', '', 'width=800,height=600');
    printWin.document.open();
    printWin.document.write(windowContent);

    printWin.document.addEventListener('load', function() {
      printWin.focus();
      printWin.print();
      printWin.document.close();
      printWin.close();
    }, true);
  }

  printImg2(cte, titulo, linhas) {
    const ht = linhas * 2.6;
    let canvas: HTMLCanvasElement = cte.nativeElement.children[0].children[1];
    let canvasImg = canvas.toDataURL("image/png", 1.0);
    let windowContent = '<!DOCTYPE html>';
    windowContent += '<html lang="pt-br">';
    windowContent += '<head><title>'+ titulo.toUpperCase() +'</title></head>';
    windowContent += '<div style="' + 'text-align: center; font-family: Arial, Helvetica, sans-serif"' + '><h2>' + titulo.toUpperCase() + '</h2></div><br>';
    windowContent += '<body>';
    windowContent += '<img src="' + canvasImg + '" style="width:200mm;height:' + ht + 'mm;">';
    windowContent += '</body>';
    windowContent += '</html>';
    let printWin = window.open('','','width=800,height=600');
    printWin.document.open();
    printWin.document.write(windowContent);

    printWin.document.addEventListener('load', function() {
      printWin.focus();
      printWin.print();
      printWin.document.close();
      printWin.close();
    }, true);

  }

  imprimir(cte, titulo) {
    let canvas: HTMLCanvasElement = cte.nativeElement.children[0].children[1];
    let canvasImg = canvas.toDataURL("image/png", 1.0);
    const nomeArq = titulo.toLowerCase() + '.pdf';

    var doc = new jsPDF(
      {
        orientation: 'l',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );
    doc.setFontSize(16);
    doc.text(titulo.toUpperCase(), 10, 15);
    doc.addImage(canvasImg, 'png', 10, 35, 270, 135);
    doc.save(nomeArq);

  }

  imprimir2(cte, titulo, linhas) {
    let canvas: HTMLCanvasElement = cte.nativeElement.children[0].children[1];
    let canvasImg = canvas.toDataURL("image/png", 1.0);
    const h = linhas * 3;
    const nomeArq = titulo.toLowerCase() + '.pdf';


    var doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );
    doc.addImage(canvasImg, 'png', 0, 10, 200, h);
    doc.save(nomeArq);
  }

}
