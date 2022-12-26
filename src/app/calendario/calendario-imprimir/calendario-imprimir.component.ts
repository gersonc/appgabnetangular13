import {Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../_services';
import {Subscription} from 'rxjs';

declare var jsPDF: any;

@Component({
  selector: 'app-calendario-imprimir',
  templateUrl: './calendario-imprimir.component.html',
  styleUrls: ['./calendario-imprimir.component.css'],
})
export class CalendarioImprimirComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dados: any[] = null;
  @ViewChild('impEvento', { static: true }) impEvento: ElementRef;
  acao: string;
  botaoEnviarVF = false;
  sub: Subscription[] = [];
  resp: any[];

  constructor(
    public authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.carregaDados();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.dados.currentValue !== 'undefined') {
      if (changes.dados.currentValue.acao === 'imprimir') {
        this.resp = changes.dados.currentValue.dadosImp;
        // this.carregaDados();
      }
    }
  }

  carregaDados() {
    // this.resp = this.config.data;
  }

  montaHora(allDay: boolean = false, hora: any = null): string {
    let rp = '';
    if (!allDay) {
      if (hora) {
        rp = hora.toString();
      }
    }
    return rp;
  }

  montaLinha(e: any[] = null): string[] {
    if (e) {
      return Object.keys(e);
    }
    return [];
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  imprimir(vf: boolean = true) {

    const divToPrint = document.getElementById('divToPrint').innerHTML;
    const newWindow = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    newWindow.document.open();
    newWindow.document.write(`
    <html>
        <head>
          <title>Calendario - GabNet</title>
          <style>
body {
  font-family: "Open Sans", "Helvetica Neue", sans-serif;
}

.grid-dias {
  display: grid;
  grid-template-columns: 20mm 169mm;
  grid-gap: 0;
}

.grid-dias > div {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  border-top: 1px solid black;
  border-left: 1px solid black;
  border-right: none;
  page-break-before: auto;
}

.grid-dias:last-child > div {
  border-bottom: 1px solid black;
}

.grid-evento {
  display: grid;
  grid-template-columns: 15mm auto;
  grid-gap: 0;
  padding: 0;
  border: 0;
}

.grid-evento > div {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  border-left: none;
  border-bottom: 1px solid black;
}

.grid-evento:last-child > div {
  border-bottom: none;
}

.item3 {
  border-right: 1px solid black;
  border-left: 1px solid black;
}

.item4 {
  border-right: 1px solid black;
}

.grid-dados {
  display: grid;
  grid-template-columns: auto;
  grid-gap: 0;
  padding: 5px;
}

.grid-dados > div {
  text-align: left;
  font-size: 11px;
  font-weight: normal;
  border-bottom: 1px solid black;
}

.grid-dados:last-child > div {
  border-bottom: none;
}

.grid-ano-mes {
  display: grid;
  grid-template-columns: 189mm;
  grid-gap: 0;
  padding: 0;
  border: 0;
}

.grid-ano-mes > div {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  border-top: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
  page-break-before: auto;
}
          </style>
        </head>
        <body onload="window.print();window.close()">
        ${divToPrint}
        </body>
      </html>
    `);
    newWindow.document.close();

  }

}
