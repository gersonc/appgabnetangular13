import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TarefaI, TarefaUsuarioSituacaoAndamentoI} from "../_models/tarefa-i";
import {ColunasI} from "../../_models/colunas-i";
import {ITitulos} from "../../_models/titulo-i";
import {striptags} from "striptags";
import {Stripslashes} from "../../shared/functions/stripslashes";
import jsPDF from 'jspdf'
import {autoTable, applyPlugin, UserOptions } from 'jspdf-autotable';
applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}


@Component({
  selector: 'app-tarefa-detalhe',
  templateUrl: './tarefa-detalhe.component.html',
  styleUrls: ['./tarefa-detalhe.component.css']
})
export class TarefaDetalheComponent implements OnInit {
  @ViewChild('tabela1', { static: true }) tabela1: HTMLTableElement;
  @Output() fechar = new EventEmitter<boolean>();
  @Input() tit: ITitulos[] = [];
  @Input() valores: TarefaI[] = [];
  @Input() campos: ColunasI[] = [];


  cps0: string[] = [];
  cps1 = [
    'tu_usuario_nome',
    'tus_situacao_nome'
  ];

  idx0 = -1;
  idx1 = -1;

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.tit);
    // this.cps0 = Object.keys(this.tit['tarefa']);
    this.cps0 = this.campos.map(c => {
      return c.field;
    });
    this.idx0 = this.cps0.indexOf('tarefa_usuario_situacao');
    this.idx1 = this.cps0.indexOf('tarefa_usuario_situacao_andamento');
    console.log(this.cps0, this.idx0, this.idx1);

  }

  stripslashes(str?: string): string | null {
    return striptags(Stripslashes(str));
  }

  rowStyle(vl1: number): string | null {
    switch (vl1) {
      case 1:
        return 'tstatus-1';
      case 2:
        return 'tstatus-2';
      case 3:
        return 'tstatus-3';
      case 4:
        return 'tstatus-4';
      default:
        return 'tstatus-0';
    }
  }


  getPdf(tb: any) {
    let doc = new jsPDF (
      {
        orientation: 'l',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
      },
    ) as jsPDFCustom;
    doc.autoTable({
      useCss: true,
      html: tb,
      theme: "striped",
      willDrawCell: (HookData) => {
        if(HookData.cell.section==="body") {
          if (this.idx0 !== -1 && HookData.column.index === this.idx0) {
            console.log(HookData);
            // @ts-ignore
            if ("innerHTML" in HookData.cell.raw) {
              const tb1: any = cloneNode(HookData.cell.raw.innerHTML);
              const tb2: HTMLTableElement = tb1;
              const idx: string = 'idx-' + HookData.row.index;

              console.log(tb2);
              doc.autoTable({
                useCss: true,
                tableId: idx,
                html: tb2,
                theme: "striped"
              });
            }
          }
        }
      },
      didDrawCell: (HookData) => {

      }
    });
    doc.save('table.pdf')
  }

  getDocumento(idx: string,  tabela: HTMLTableElement) {
    let mywindow = document.implementation.createHTMLDocument("New Document");
    mywindow.write('<html><head><title>TAREFAS</title>');
    mywindow.write('</head><body >');
    //mywindow.write(tabela);
    mywindow.write('</body></html>');
    mywindow.close();




    const doc0 = document.implementation.createHTMLDocument("New Document");
    const body = document.createElement( 'body');
    body.setAttribute('id', 'abc');
    body.appendChild(tabela);
    doc0.documentElement.appendChild(body);

    doc0.close();
    let doc = new jsPDF () as jsPDFCustom;;
    // @ts-ignore
    doc.autoTable({
      useCss: true,
      html: tabela,
      theme: "striped"
    });

  }

}
