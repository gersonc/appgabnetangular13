import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErroOpenWindowService {

  constructor() { }

  mostraErro(erro: any[]) {
    const mywindow = window.open('', '_blank', 'height=800,width=600');
    mywindow.document.write('<html><head><title>ERRO</title>');
    //mywindow.document.write('<style>' + css  + '</style>');
    mywindow.document.write('</head><body >');
    erro.forEach( e => {
      mywindow.document.write(e);
    });

    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    //mywindow.print();
    //mywindow.close();
    //this.valores = [];
    //return true;
  }
}
