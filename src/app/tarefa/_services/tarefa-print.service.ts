import { Injectable } from '@angular/core';
import {TarefaI} from "../_models/tarefa-i";
import {striptags} from "striptags";
import {Stripslashes} from "../../shared/functions/stripslashes";
import jsPDF from 'jspdf'
import {autoTable, applyPlugin, UserOptions } from 'jspdf-autotable';
import {ColunasI} from "../../_models/colunas-i";
import {ITitulos} from "../../_models/titulo-i";
import {emit} from "cluster";
applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

@Injectable({
  providedIn: 'root'
})
export class TarefaPrintService {

  valores: TarefaI[] = [];
  campos: ColunasI[] = [];
  tit: ITitulos[] = [];

  constructor() { }

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

  montaTabela(): string {
    let tp = '';
    tp += '<div id="tarefaid"><h2>TAREFAS</h2></div>';
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

  montaTabela3(): string {

    const cps0: string[] = this.campos.map(c => {
      return c.field;
    });
    const cps1 = [
      'tu_usuario_nome',
      'tus_situacao_nome'
    ];
    let tp = `

<div id="terefaId" style="font-size: 10pt;line-height: 1.3;background: #fff !important; color: #000; width: 5530pt;">
  <table style="width: 5500pt;border-collapse: collapse;text-indent: initial;border-spacing: 1pt;border-color: #000;font-size: 10pt;">
    <caption style="font-size: 14pt;font-weight: 600;text-align: center;">TAREFAS</caption>
    <thead>
    <tr>
    `;
    cps0.forEach((t) => {
      tp += '<th sytle="font-size: 10pt;font-weight: 500;padding-left: 5pt;padding-right: 5pt;padding-top: 2pt;padding-bottom: 2pt;">' + this.tit['tarefa'][t].titulo + '</th>';
    });
    tp += `
    </tr>
    </thead>
    <tbody style="vertical-align: top !important;background-color: #fff;">
    `;
    this.valores.forEach((v) => {
      tp += '<tr>';
      cps0.forEach((c) => {
        if (c !== 'tarefa_situacao_nome' && c !== 'tarefa_usuario_situacao' && c !== 'tarefa_usuario_situacao_andamento') {
          tp += '<td style="padding-left: 5pt;padding-right: 5pt;padding-top: 2pt;padding-bottom: 2pt;">' + v[c] + '</td>';
        }
        if (c === 'tarefa_situacao_nome') {
          tp += '<td class="' + this.rowStyle(+v['tarefa_situacao_id']) + '" style="padding-left: 5pt;padding-right: 5pt;padding-top: 2pt;padding-bottom: 2pt;">' + v[c] + '</td>';
        }
        if (c === 'tarefa_usuario_situacao') {
          tp += `<td style="padding: 0 !important;">
          <div style="line-height: 1.3;background: #fff !important;color: #000;">
            <table style="width: 100%;border-collapse: collapse;border-spacing: 0;box-sizing: border-box;border: 0;">
            `;
          v['tarefa_usuario_situacao'].forEach((s) => {
            tp += '<tr class="' + this.rowStyle(+s['tus_situacao_id']) + '" style="border-top: 1pt solid #000000;border-bottom: 1pt solid #000000;border-left: 0;border-right: 0;"><td style="padding-left: 5pt;padding-right: 5pt;padding-top: 2pt;padding-bottom: 2pt;">' + s['tu_usuario_nome'] + '</td><td style="padding-left: 5pt;padding-right: 5pt;padding-top: 2pt;padding-bottom: 2pt;">' + s['tus_situacao_nome'] + '</td></tr>';
          });
          tp += `
            </table>
          </div>
        </td>`;
        }

        if (c === 'tarefa_usuario_situacao_andamento') {
          tp += `<td class="composta">
          <div style="padding: 0 !important;">
            <table style="width: 100%;border-collapse: collapse;border-spacing: 0;box-sizing: border-box;border: 0;">
            `;
          v['tarefa_usuario_situacao_andamento'].forEach((h) => {
            tp += '<tr class="' + this.rowStyle(+h['tus_situacao_id']) + '" style="border-top: 1pt solid #000000;border-bottom: 1pt solid #000000;border-left: 0;border-right: 0;"><td style="width: 40pt;">' + h['tu_usuario_nome'] + '</td><td></td><td style="width: 50%;padding-left: 5pt;padding-right: 5pt;padding-top: 2pt;padding-bottom: 2pt;">' + h['tus_situacao_nome'] + '</td></tr>';

            h['tarefa_historico'].forEach((hi) => {
              tp += '<tr style="border-top: 1pt solid #000000;border-bottom: 1pt solid #000000;border-left: 0;border-right: 0;"><td style="padding-left: 5pt;padding-right: 5pt;padding-top: 2pt;padding-bottom: 2pt;">' + hi['th_data'] + '</td><td colspan="2" style="padding-left: 5pt;padding-right: 5pt;padding-top: 2pt;padding-bottom: 2pt;">' + this.stripslashes(hi['th_historico']) + '</td></tr>';
            });
          });
          tp += `
            </table>
          </div>
        </td>`;
        }
      });
      tp += '</tr>';
    });
    tp += `</tbody>
  </table>
</div>
`;

    console.log(tp);
    return tp;

  }

  montaTabela4(): string {

    const cps0: string[] = this.campos.map(c => {
      return c.field;
    });
    const cps1 = [
      'tu_usuario_nome',
      'tus_situacao_nome'
    ];
    let tp = `

<div id="terefaId" class="tarefa-print" style="width: 19.5cm !important;">
  <table class="tarefa-print" style="width: 19.5cm;">
    <caption>TAREFAS</caption>
    <thead>
    <tr>
    `;
    cps0.forEach((t) => {
      tp += '<th>' + this.tit['tarefa'][t].titulo + '</th>';
    });
    tp += `
    </tr>
    </thead>
    <tbody>
    `;
    this.valores.forEach((v) => {
      tp += '<tr>';
      cps0.forEach((c) => {
        if (c !== 'tarefa_situacao_nome' && c !== 'tarefa_usuario_situacao' && c !== 'tarefa_usuario_situacao_andamento') {
          tp += '<td>' + v[c] + '</td>';
        }
        if (c === 'tarefa_situacao_nome') {
          tp += '<td class="' + this.rowStyle(+v['tarefa_situacao_id']) + '">' + v[c] + '</td>';
        }
        if (c === 'tarefa_usuario_situacao') {
          tp += `<td class="composta">
          <div class="tarefa-interna-print">
            <table width="100%">
            `;
          v['tarefa_usuario_situacao'].forEach((s) => {
            tp += '<tr class="' + this.rowStyle(+s['tus_situacao_id']) + '"><td>' + s['tu_usuario_nome'] + '</td><td>' + s['tus_situacao_nome'] + '</td></tr>';
          });
          tp += `
            </table>
          </div>
        </td>`;
        }

        if (c === 'tarefa_usuario_situacao_andamento') {
          tp += `<td class="composta">
          <div class="tarefa-interna-print">
            <table width="100%">
            `;
          v['tarefa_usuario_situacao_andamento'].forEach((h) => {
            tp += '<tr class="' + this.rowStyle(+h['tus_situacao_id']) + '"><td style="width: 40px;">' + h['tu_usuario_nome'] + '</td><td></td><td style="width: 50%">' + h['tus_situacao_nome'] + '</td></tr>';

            h['tarefa_historico'].forEach((hi) => {
              tp += '<tr><td>' + hi['th_data'] + '</td><td colspan="2">' + this.stripslashes(hi['th_historico']) + '</td></tr>';
            });
          });
          tp += `
            </table>
          </div>
        </td>`;
        }
      });
      tp += '</tr>';
    });
    tp += `</tbody>
  </table>
</div>
`;

    console.log(tp);
    return tp;

  }

  stripslashes(str?: string): string | null {
    return striptags(Stripslashes(str));
  }

  PrintTarefas() {
    const css = `
    :root {
  --pink-200: #f69ebc;
  --pink2-200: rgba(246,158,188,1.00);
  --yellow-200: #fde4a5;
  --yellow2-200: rgba(253,228,165,1.00);;
  --green-200: #b2ddb4;
  --green2-200: rgba(178,221,180,1.00);
}


body {
  background: rgb(254, 254, 254);
}

page {
  background: white;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
  /*border: 1.25cm solid #000;*/
}

page[size="A4"] {
  width: 21cm;
  height: 29.7cm;
}

page[size="A4"][layout="landscape"] {
  width: 29.7cm;
  height: 21cm;
}

page[size="A3"] {
  width: 29.7cm;
  height: 42cm;
}

page[size="A3"][layout="landscape"] {
  width: 42cm;
  height: 29.7cm;
}

page[size="A5"] {
  width: 14.8cm;
  height: 21cm;
}

page[size="A5"][layout="landscape"] {
  width: 21cm;
  height: 14.8cm;
}

@media print {

  table, pre {
    border-collapse: collapse;
    page-break-inside: avoid
  }

  th {
    page-break-before: avoid;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  /*td .tarefa-print:first-child {
    display: none !important;
    visibility: hidden;
  }

  th .tarefa-print:first-child {
    display: none !important;
    visibility: hidden;
  }
*/
  button {
    display: none !important;
    visibility: hidden;
  }

  .tstatus-1 {
    background-color: var(--pink2-200);
    font-weight: 500;
  }
  .tstatus-2 {
    background-color: var(--yellow2-200);
    font-weight: 500;
  }
  .tstatus-3 {
    background-color: var(--green2-200);
    font-weight: 500;
  }


  .tarefa-print {
    font: 10pt Georgia, "Times New Roman", Times, serif;
    line-height: 1.3;
    background: #fff !important;
    color: #000;
  }


  .tarefa-print table {
    width: 100%;
    border-collapse: collapse;
    text-indent: initial;
    border-spacing: 0.01pt;
    border-color: grey;
  }

  .tarefa-print caption {
    font: 10pt Georgia, "Times New Roman", Times, serif;
    font-size: 2em;
    font-weight: 600;
    text-align: center;
  }

  .tarefa-print tbody {
    vertical-align: top !important;
    background-color: #fff
  }

  .tarefa-print table, tr, th, td {
    border: 0.01pt solid #000000;
  }

  /*.tarefa-print th:first-child {
    display: none !important;
    visibility: hidden;
  }

  .tarefa-print td:first-child {
    display: none !important;
    visibility: hidden;
  }*/

  .tarefa-print th {
    font-size: 1.3em;
    font-weight: 500;
    padding-left: .5em;
    padding-right: .5em;
    padding-top: .2em;
    padding-bottom: .2em;
  }

  .tarefa-print td {
    padding-left: .5em;
    padding-right: .5em;
    padding-top: .2em;
    padding-bottom: .2em;
  }

  .tarefa-print td.composta {
    padding: 0 !important;
  }

  .tarefa-interna-print {
    font: 10pt Georgia, "Times New Roman", Times, serif;
    line-height: 1.3;
    background: #fff !important;
    color: #000;
  }

  .tarefa-interna-print table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    box-sizing: border-box;
    border: 0;
  }


  .tarefa-interna-print tr {
    border-top: 0.01pt solid #000000;
    border-bottom: 0.01pt solid #000000;
    border-left: 0;
    border-right: 0;
  }


  .tarefa-interna-print tr:first-child {
    border-top: 0;
  }

  .tarefa-interna-print tr:last-child {
    border-bottom: 0;
  }

  /*.tarefa-interna-print td:first-child {
    display: table-cell !important;
    visibility: visible;
  }*/

  .tarefa-interna-print td {
    padding-left: .5em;
    padding-right: .5em;
    padding-top: .2em;
    padding-bottom: .2em;
  }

  .tarefa-interna-print td {
    border: 0;
  }

  .tarefa-interna-print td[colspan="2"] {
    border-left: 1px solid #000000;
  }

  .tarefa-interna-print tr:first-child > td {
    padding-top: 0;
  }

  .tarefa-interna-print tr:last-child > td {
    padding-bottom: 0;
  }


  .tarefa-interna-print .segunda {
    border-left: 1px solid #000000;
  }



}


@media screen {
  .tstatus-1 {
    background-color: var(--pink-200);
    font-weight: 500;
  }
  .tstatus-2 {
    background-color: var(--yellow-200);
    font-weight: 500;
  }
  .tstatus-3 {
    background-color: var(--green-200);
    font-weight: 500;
  }


  .tarefa-print {
    font: 10pt Georgia, "Times New Roman", Times, serif;
    line-height: 1.3;
    background: #fff !important;
    color: #000;
  }


  .tarefa-print table {
    width: 100%;
    border-collapse: collapse;
    text-indent: initial;
    border-spacing: 1px;
    border-color: grey;
  }

  .tarefa-print caption {
    font: 10pt Georgia, "Times New Roman", Times, serif;
    font-size: 2em;
    font-weight: 600;
    text-align: center;
  }

  .tarefa-print tbody {
    vertical-align: top !important;
    background-color: #fff
  }

  .tarefa-print table, tr, th, td {
    border: 1px solid #000000;
  }

  .tarefa-print th:first-child {
    display: none !important;
    visibility: hidden;
  }

  .tarefa-print td:first-child {
    display: none !important;
    visibility: hidden;
  }

  .tarefa-print th {
    font-size: 1.3em;
    font-weight: 500;
    padding-left: .5em;
    padding-right: .5em;
    padding-top: .2em;
    padding-bottom: .2em;
  }

  .tarefa-print td {
    padding-left: .5em;
    padding-right: .5em;
    padding-top: .2em;
    padding-bottom: .2em;
  }

  .tarefa-print td.composta {
    padding: 0 !important;
  }

  .tarefa-interna-print {
    font: 10pt Georgia, "Times New Roman", Times, serif;
    line-height: 1.3;
    background: #fff !important;
    color: #000;
  }

  .tarefa-interna-print table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    box-sizing: border-box;
    border: 0;
  }


  .tarefa-interna-print tr {
    border-top: 1px solid #000000;
    border-bottom: 1px solid #000000;
    border-left: 0;
    border-right: 0;
  }


  .tarefa-interna-print tr:first-child {
    border-top: 0;
  }

  .tarefa-interna-print tr:last-child {
    border-bottom: 0;
  }

  .tarefa-interna-print td:first-child {
    display: table-cell !important;
    visibility: visible;
  }

  .tarefa-interna-print td {
    padding-left: .5em;
    padding-right: .5em;
    padding-top: .2em;
    padding-bottom: .2em;
  }

  .tarefa-interna-print td {
    border: 0;
  }

  .tarefa-interna-print td[colspan="2"] {
    border-left: 1px solid #000000;
  }

  .tarefa-interna-print tr:first-child > td {
    padding-top: 0;
  }

  .tarefa-interna-print tr:last-child > td {
    padding-bottom: 0;
  }

  .tarefa-interna-print .segunda {
    border-left: 1px solid #000000;
  }

}

    `;
    let mywindow = window.open('', 'PRINT', 'height=500,width=500');
    mywindow.document.write('<html><head><title>TAREFAS</title>');
    mywindow.document.write('<style>' + css  + '</style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(this.montaTabela3());
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    mywindow.close();
    this.reset();
    return true;
  }

  reset() {
    this.valores = [];
    this.campos = [];
    this.tit = [];
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
    border: 0.3px solid #000000;
  }

  table {
    border: .5px solid #000000;
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

  getPdf2() {
    const css = `
  .tstatus-1 {
    background-color: rgba(246,158,188,1.00);
    font-weight: 500;
  }
  .tstatus-2 {
    background-color: rgba(253,228,165,1.00);
    font-weight: 500;
  }
  .tstatus-3 {
    background-color: rgba(178,221,180,1.00);
    font-weight: 500;
  }


  .tarefa-print {
    font-size: 10pt;
    line-height: 1.3;
    background: #fff !important;
    color: #000;
  }


  .tarefa-print table {
    width: 19.5cm;
    border-collapse: collapse;
    text-indent: initial;
    border-spacing: 1pt;
    border-color: grey;
  }

  .tarefa-print caption {
    font-size: 14pt;
    font-weight: 600;
    text-align: center;
  }

  .tarefa-print tbody {
    vertical-align: top !important;
    background-color: #fff
  }

  .tarefa-print table, tr, th, td {
    border: 1pt solid #000000;
  }

  .tarefa-print th:first-child {
    display: none !important;
    visibility: hidden;
  }

  .tarefa-print td:first-child {
    display: none !important;
    visibility: hidden;
  }

  .tarefa-print th {
    font-size: 10pt;
    font-weight: 500;
    padding-left: 5pt;
    padding-right: 5pt;
    padding-top: 2pt;
    padding-bottom: 2pt;
  }

  .tarefa-print td {
    padding-left: 5pt;
    padding-right: 5pt;
    padding-top: 2pt;
    padding-bottom: 2pt;
  }

  .tarefa-print td.composta {
    padding: 0 !important;
  }

  .tarefa-interna-print {
    line-height: 1.3;
    background: #fff !important;
    color: #000;
  }

  .tarefa-interna-print table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    box-sizing: border-box;
    border: 0;
  }


  .tarefa-interna-print tr {
    border-top: 1pt solid #000000;
    border-bottom: 1pt solid #000000;
    border-left: 0;
    border-right: 0;
  }


  .tarefa-interna-print tr:first-child {
    border-top: 0;
  }

  .tarefa-interna-print tr:last-child {
    border-bottom: 0;
  }

  .tarefa-interna-print td:first-child {
    display: table-cell !important;
    visibility: visible;
  }

  .tarefa-interna-print td {
    padding-left: 5pt;
    padding-right: 5pt;
    padding-top: 2pt;
    padding-bottom: 2pt;
  }

  .tarefa-interna-print td {
    border: 0;
  }

  .tarefa-interna-print td[colspan="2"] {
    border-left: 1pt solid #000000;
  }

  .tarefa-interna-print tr:first-child > td {
    padding-top: 0;
  }

  .tarefa-interna-print tr:last-child > td {
    padding-bottom: 0;
  }

  .tarefa-interna-print .segunda {
    border-left: 1pt solid #000000;
  }
    `;
    let mywindow = window.open('', '_blank', 'height=10,width=10');
    mywindow.document.write('<html><head><title>TAREFAS</title>');
    mywindow.document.write('<meta name="viewport" content="width=20cm, initial-scale=1">');
    // mywindow.document.write('<style>' + css  + '</style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(this.montaTabela3());
    mywindow.document.write('</body>');
    mywindow.document.write('</html>');
    mywindow.document.close();
    /*let doc = new jsPDF (
      {
        orientation: 'l',
        unit: 'px',
        format: 'a4',
      },
    ) as jsPDFCustom;*/
    let doc = new jsPDF();
    const tb = mywindow.document.getElementById('terefaId');
    //doc.html(tb);
    doc.setFontSize(8);
    doc.html(tb, {
      callback: function (doc) {
        doc.save();
      }
    });
    return true;
  }

}
