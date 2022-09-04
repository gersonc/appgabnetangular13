import { Injectable } from '@angular/core';
import {TarefaI} from "../_models/tarefa-i";
import {striptags} from "striptags";
import {Stripslashes} from "../../shared/functions/stripslashes";
import jsPDF from 'jspdf'
import {autoTable, applyPlugin, UserOptions } from 'jspdf-autotable';
applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

@Injectable({
  providedIn: 'root'
})
export class TarefaPrintService {

  valores: TarefaI[] = [];

  constructor() { }

  montaTabela(): string {
    let tp = '';
    tp += '<div><h2>TAREFAS</h2></div>';
    this.valores.forEach(t => {
    tp += `
      <table style="width: 100%;">
        <tr>
          <th style="width: 60pt;">Tarefa:</th>
          <td colspan="3">` + t.tarefa_titulo + `</td>
        </tr>
        <tr>
          <th style="width: 60pt;">Data pedido:</th>
          <td style="width: 60pt;" class="datahora">` + t.tarefa_datahora.substr(0,16) + `</td>
          <th style="width: 60pt;">Prazo:</th>
          <td class="datahora">` + t.tarefa_data.substr(0,16) + `</td>
        </tr>
        <tr>
          <th style="width: 60pt;">Autor</th>
          <td colspan="3">` + t.tarefa_usuario_autor_nome + `</td>
        </tr>
        <tr>
          <th colspan="4">Tarefa</th>
        </tr>
        <tr>
          <td colspan="4">` + this.stripslashes(t.tarefa_tarefa) + `</td>
        </tr>`;
    if (t.tarefa_usuario_situacao_andamento.length > 0) {
      t.tarefa_usuario_situacao_andamento.forEach(ta => {
        tp += `
        <tr>
           <th colspan="2" style="width: 50%;">Demandado:</th>
           <th colspan="2" style="width: 50%;">Situação:</th>
        </tr>
        <tr>
           <td colspan="2" style="width: 50%;">` + ta.tu_usuario_nome + `</td>
           <td colspan="2" style="width: 50%;background-color:` + this.rowColor(ta.tus_situacao_id) + `;">` + ta.tus_situacao_nome + `</td>
        </tr>`;
        if (ta.tarefa_historico.length > 0) {
          tp += `
            <tr>
                <th colspan="4" style="width: 100%;">Andamento(s):</th>
            </tr>
            <tr>
                <th style="width: 60pt">Data:</th>
                <th colspan="3">Andamento:</th>
            </tr>`;
          ta.tarefa_historico.forEach(h => {
            tp += `
              <tr>
                <td class="datahora" style="width: 60pt;">` + h.th_data.substr(0,16) + `</td>
                <td colspan="3">` + this.stripslashes(h.th_historico) + `</td>
              </tr>`;
          });
        }
      });
    }
    tp += `</table><br>`;
    });
    return tp;
  }

  montaTabela2(): string {
    let tp = '';
    tp += '<div><h2>TAREFAS</h2></div>';
    this.valores.forEach(t => {
    tp += `<table style="width: 100%;">`;

      tp += `<tr>
          <th style="width: 60px;">Tarefa:</th>
          <td colspan="3">` + t.tarefa_titulo + `</td>
        </tr>
        <tr>
          <th style="width: 60px;">Data pedido:</th>
          <td style="width: 60px;" class="datahora">` + t.tarefa_datahora.substr(0,16) + `</td>
          <th style="width: 60px;">Prazo:</th>
          <td class="datahora">` + t.tarefa_data.substr(0,16) + `</td>
        </tr>
        <tr>
          <th style="width: 60px;">Autor</th>
          <td colspan="3">` + t.tarefa_usuario_autor_nome + `</td>
        </tr>
        <tr>
          <th colspan="4">Tarefa</th>
        </tr>
        <tr>
          <td colspan="4">` + this.stripslashes(t.tarefa_tarefa) + `</td>
        </tr>`;
      if (t.tarefa_usuario_situacao_andamento.length > 0) {
        t.tarefa_usuario_situacao_andamento.forEach(ta => {
          tp += `
        <tr>
           <th colspan="2" style="width: 50%;">Demandado:</th>
           <th colspan="2" style="width: 50%;">Situação:</th>
        </tr>
        <tr>
           <td colspan="2" style="width: 50%;">` + ta.tu_usuario_nome + `</td>
           <td colspan="2" style="width: 50%;background-color:` + this.rowColor(ta.tus_situacao_id) + `;">` + ta.tus_situacao_nome + `</td>
        </tr>`;
          if (ta.tarefa_historico.length > 0) {
            tp += `
            <tr>
                <th style="width: 60px">Data:</th>
                <th colspan="3">Andamento:</th>
            </tr>`;
            ta.tarefa_historico.forEach(h => {
              tp += `
              <tr>
                <td class="datahora" style="width: 60px;">` + h.th_data.substr(0,16) + `</td>
                <td colspan="3">` + this.stripslashes(h.th_historico) + `</td>
              </tr>`;
            });
          }
        });
      }
      tp += `</table>`;
    });
    return tp;
  }

  stripslashes(str?: string): string | null {
    return striptags(Stripslashes(str));
  }

  rowColor(tus_situacao_id?: number): string | null {
    switch (tus_situacao_id) {
      case 1:
        return '#f69ebc';
      case 2:
        return '#fde4a5';
      case 3:
        return '#90cd93';
      case 4:
        return '#75bef8';
      default:
        return '#9caeb7';
    }
  }

  PrintElem() {
    const css = `
  @media print {

  table {
    width: 100%;
    border-collapse: collapse !important;
    font-size: 10pt;
    overflow-wrap: anywhere;
  }

  table {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    line-height: 1.3;
    background: #fff !important;
    color: #000;
  }

  caption, h1, h2 {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14pt;
    font-weight: bold;
  }

  thead > th {
    background: #f0f0f0 !important;
  }


  td, th {
    padding-right: 2pt;
    padding-left: 5pt;
    white-space: normal;
  }

  table, td, th {
    border: .01pt solid;
  }

  th {
    font-size: 12pt;
    font-weight: bold;
    text-align: left;
  }

  th {
    background: #f0f0f0;
  }

  td {
    font-size: 12pt;
    vertical-align: text-top;
  }

  td.datahora {
    font-size: 10pt;
    vertical-align: text-top;
  }

  .nao-imprimir, .nao-imprimir * {
    display: none !important;
  }

  .imprimir, .imprimir * {
    visibility: visible;
  }

}`;
    let mywindow = window.open('', 'PRINT', 'height=500,width=500');
    mywindow.document.write('<html><head><title>TAREFAS</title>');
    mywindow.document.write('<style>' + css  + '</style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(this.montaTabela());
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
    this.valores = [];
    return true;
  }

  getPdf() {
    const css = `
  table {
    width: 100%;
    border-collapse: collapse !important;
    font-size: 10px;
    overflow-wrap: anywhere;
  }

  table {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    line-height: 1.3;
    background: #fff !important;
    color: #000;
  }

  caption, h1, h2 {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
  }

  thead > th {
    background: #d9d9d9 !important;
  }


  td, th {
    padding-right: 2px;
    padding-left: 5px;
    white-space: normal;
  }

  table {
    border: 1px solid #000000;
  }

  th {
    font-size: 12px;
    font-weight: bold;
    text-align: left;
  }

  th {
    background: #d9d9d9;
  }

  td {
    font-size: 12px;
    vertical-align: text-top;
  }

  td.datahora {
    font-size: 10px;
    vertical-align: text-top;
  }

  .nao-imprimir, .nao-imprimir * {
    display: none !important;
  }

  .imprimir, .imprimir * {
    visibility: visible;
  }
`;
    let mywindow = window.open('', '_blank', 'height=10,width=10');
    mywindow.document.write('<html><head><title>TAREFAS</title>');
    mywindow.document.write('<style>' + css  + '</style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(this.montaTabela2());
    mywindow.document.write('</body>');
    mywindow.document.write('</html>');

    let doc = new jsPDF (
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
      },
    ) as jsPDFCustom;

    doc.text("TAREFAS", 14, 10);
    const tb = mywindow.document.getElementsByTagName('table');

    let hook: any;
    let hook2: any;
    const x = 14.1111;
    let y = 0;

    for (let i = 0; i < tb.length; i++) {
      doc.autoTable({
        useCss: true,
        html: tb[i],
        theme: "striped",
        pageBreak: 'avoid',
        didDrawCell: (HookData) => {
          y = HookData.cursor.y;
        }
      });
      y += 9.42;
      doc.moveTo(x, y);
    }
    doc.save(`Tarefa${new Date().getTime()}.pdf`);
    mywindow.document.close();
    mywindow.close();
    this.valores = [];
    return true;
  }

}
