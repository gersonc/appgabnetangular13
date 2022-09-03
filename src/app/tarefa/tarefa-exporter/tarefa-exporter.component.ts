import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ColunasI} from "../../_models/colunas-i";
import {TarefaI} from "../_models/tarefa-i";
import * as printJS from 'print-js';


@Component({
  selector: 'app-tarefa-exporter',
  templateUrl: './tarefa-exporter.component.html',
  styleUrls: ['./tarefa-exporter.component.css']
})
export class TarefaExporterComponent implements OnInit {
  @ViewChild('imp', {static: false}) public imp: any;
  @Input() campos: ColunasI[];
  @Input() valores: TarefaI[];
  @Input() titulos: any[];

  tipo = 1;

  tabela = [
    'tarefa_usuario',
    'tarefa_usuario_situacao',
    'tarefa_historico',
    'tarefa_usuario_situacao_andamento',
  ];

  tarefaUsuario = [
    'tu_usuario_nome'
  ];

  tarefaUsuarioSituacao = [
    'tu_usuario_nome',
    'tus_situacao_nome',
  ];

  tarefaHistorico = [
    'th_data',
    'th_usuario_nome',
    'th_historico',
  ];

  tarefaUsuarioSituacaoAndamento = [
    'tu_usuario_nome',
    'tus_situacao_nome',
    'tarefa_historico',
  ];


  css = `
  @media print {
  .a4-p table {
    width: 100%;
    border-collapse: collapse !important;
    font-size: 10pt;
    overflow-wrap: break-word;
  }

  .a4-p caption {
    font-size: 14pt;
    font-weight: bold;
  }

  .a4-p thead > .a4-p th {
    background: #aeb1b5 !important;
  }

  .a4-p table, .a4-p td, .a4-p th {
    word-break: break-word;
    border: .01pt solid;
  }

  .a4-p td, .a4-p th {
    padding-right: 2pt;
    padding-left: 2pt;
    white-space: normal;
  }

  .a4-p th {
    font-size: 8pt;
    font-weight: bold;
  }

  .a4-p td {
    font-size: 6pt;
    vertical-align: text-top;
  }

  .nao-imprimir, .nao-imprimir * {
    display: none !important;
  }

  .imprimir, .imprimir * {
    visibility: visible;
  }

  .a4-p table {
    width: 100%;
    border-collapse: collapse !important;
  }

  .a4-p table, .a4-p td, .a4-p th {
    border: .01pt solid;
  }

  .a4-p td, .a4-p th {
    padding-right: 2pt;
    padding-left: 2pt;
    white-space: normal;
  }

  .reltarefa {
    /*font: 10pt Georgia, "Times New Roman", Times, serif;*/
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    line-height: 1.3;
    background: #fff !important;
    color: #000;
  }



  .reltarefa table {
    table-layout: auto;
    width: 100%;
    border-collapse: collapse;
  }

  .reltarefa table, .reltarefa th, .reltarefa td {
    border: 2pt solid;
  }

  .reltarefa th {
    text-align: left;
  }

  .reltarefa th {
    width: 100pt;
  }

  .reltarefa th:nth-of-type(2) {
    width: 100pt;
  }

}`;

  css2 = `
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

  caption {
    font-size: 14pt;
    font-weight: bold;
  }

  thead > th {
    background: #aeb1b5 !important;
  }


  td, th {
    padding-right: 2pt;
    padding-left: 2pt;
    white-space: normal;
  }

  table, td, th {
    border: .01pt solid;
  }

  th {
    font-size: 12pt;
    font-weight: bold;
  }

  th {
    text-align: left;
  }

  td {
    font-size: 12pt;
    vertical-align: text-top;
  }

  .nao-imprimir, .nao-imprimir * {
    display: none !important;
  }

  .imprimir, .imprimir * {
    visibility: visible;
  }

  .ql-editor {
    font-size: 12pt;
    box-sizing: border-box;
    line-height: 1.2;
    height: 100%;
    outline: none;
    overflow-y: auto;
    padding: 2pt 2pt !important;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: anywhere;
  }

}`;



  constructor() { }

  ngOnInit(): void {
    console.log(this.valores);
  }

  verificaCampo(campo: string): boolean {
    return (this.tabela.indexOf(campo) === -1);
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

  PrintElem(elem)
  {
    var mywindow = window.open('', 'PRINT', 'height=1200,width=800');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('<style>' + this.css2  + '</style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    // mywindow.document.write(this.imp);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  }

}
