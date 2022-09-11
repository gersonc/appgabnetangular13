import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TarefaI, TarefaUsuarioSituacaoAndamentoI} from "../_models/tarefa-i";
import {ColunasI} from "../../_models/colunas-i";
import {ITitulos} from "../../_models/titulo-i";
import {striptags} from "striptags";
import {Stripslashes} from "../../shared/functions/stripslashes";
import jsPDF from 'jspdf'
import {
  applyPlugin,
  autoTable, CellHook,
  Color,
  ColumnInput,
  MarginPaddingInput, PageHook,
  RowInput,
  Styles,
  UserOptions
} from 'jspdf-autotable';

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


  situacaoCol: ColunasI[] = [
    {field: 'tu_usuario_nome', header: 'USUÁRIO', sortable: 'false', width: '124px'},
    {field: 'tus_situacao_nome', header: 'SITAÇÃO', sortable: 'true', width: '124px'},
  ];

  andamentoCol: ColunasI[] = [
    {field: 'tu_usuario_nome', header: 'USUÁRIO', sortable: 'false', width: '250px'},
    {field: 'tus_situacao_nome', header: 'SITAÇÃO', sortable: 'true', width: '150px'},
    {field: 'th_data', header: 'USUÁRIO', sortable: 'false', width: '250px'},
    {field: 'th_historico', header: 'SITAÇÃO', sortable: 'true', width: '150px'},
  ];




  cps0: string[] = [];
  cps1 = [
    'tu_usuario_nome',
    'tus_situacao_nome'
  ];

  idx = 0;
  idx0 = -1;
  idx1 = -1;
  contador = 0;
  total = 0;
  startY = 0;
  tableWidth = 0;

  yPos = 0;

  autoTable: autoTable;

  doc: jsPDFCustom;

  /*doc = new jsPDF (
    {
      orientation: 'l',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    },
  ) as jsPDFCustom;*/

  stl: { cellWidth: string; overflow: string; fontSize: number; fontStyle: string; lineWidth: number; font: string } = {
    font: "helvetica",
    fontStyle: "normal",
    overflow: "linebreak",
    fontSize: 10,
    lineWidth: 1,
    cellWidth: "wrap",
  };


  columns0: ColumnInput[] | null = null;
  columns1: ColumnInput[] | null = null;
  columns2: ColumnInput[] | null = null;

  totalPagesExp = '{total_pages_count_string}';

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.tit);
    // this.cps0 = Object.keys(this.tit['tarefa']);
    this.cps0 = this.campos.map(c => {
      return c.field;
    });
    this.total = this.valores.length;
    this.idx0 = this.cps0.indexOf('tarefa_usuario_situacao');
    this.idx1 = this.cps0.indexOf('tarefa_usuario_situacao_andamento');
    console.log('this.total', this.total);
    console.log(this.cps0, this.idx0, this.idx1);
    this.columns0 = this.getColumsns(this.campos, null);
    this.columns1 = this.getColumsns(this.situacaoCol, 'tarefa_usuario_situacao');
    this.columns2 = this.getColumsns(this.andamentoCol, 'tarefa_usuario_situacao_andamento');
    console.log('this.columns0',this.columns0);
    console.log('this.columns1',this.columns1);

  }

  getColumsns(campos: ColunasI[], campo: string | null = null ): ColumnInput[] {
    if (campo === null) {
      return campos.map((col) => {
        const c: ColumnInput = {
          dataKey: col.field,
          header: {
            title: this.tit['tarefa'][col.field].titulo,
            styles: {
              cellWidth: +col.width.replace('px', '') * 0.9
            }
          }
        }
        return c;
      });
    }

    if (campo === 'tarefa_usuario_situacao') {
      return campos.map((col) => {
        const c: ColumnInput = {
          dataKey: col.field,
        }
        return c;
      });
    }

    if (campo === 'tarefa_usuario_situacao_andamento') {
      return campos.map((col) => {
        const c: ColumnInput = {
          dataKey: col.field,
        }
        return c;
      });
    }
  }

  getCols(n: number): ColumnInput[] {
    switch (n) {
      case 0:
        return this.columns0;
      case 1:
        return this.columns1;
      case 2:
        return this.columns2;
    }
    // return (this.idx !== this.idx0 && this.idx !== this.idx1) ? this.columns0 : (this.idx == this.idx0) ? this.columns1 : this.columns2;
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

  rowColor(vl1: number): string {
    switch (vl1) {
      case 1:
        return '#f69ebc';
      case 2:
        return '#fde4a5';
      case 3:
        return '#b2ddb4';
      default:
        return '#ffffff';
    }
  }

  rowColor2(vl1: number): number[] | null {
    switch (vl1) {
      case 1:
        return [246,158,188];
      case 2:
        return [253,228,165];
      case 3:
        return [178,221,180];
      default:
        return [255,255,255];
    }
  }


  geraTabelaPdf() {
    const estilo = {
      cellPadding: {
        top: 0.5,
        right: 1,
        bottom: 0.5,
        left: 2
      },
      fontSize: 8,
      valign: 'middle'
    }
    this.getTabelaPdf(this.valores, this.getCols(0), 0, 785, estilo, false);
  }


  getTabelaPdf(valores: any[], colunas: ColumnInput[], y: number, width: number, estilo = {},  vertical: boolean = false) {
    if (this.doc === undefined) {
      if (vertical) {
        this.doc = new jsPDF(
          {
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
            putOnlyUsedFonts: true
          }
        ) as jsPDFCustom;
      } else {
        this.doc = new jsPDF(
          {
            orientation: 'l',
            unit: 'pt',
            format: 'a4',
            putOnlyUsedFonts: true
          }
        ) as jsPDFCustom;
      }

      this.doc.setFontSize(15);
      this.doc.text('TAREFAS', 45, 15);
      this.doc.setFontSize(9);
      this.startY = 16;
    }



    // noinspection TypeScriptValidateTypes
    this.doc.autoTable({
      columns: colunas,
      body: valores,
      startY: 20,
      rowPageBreak: 'avoid',
      headStyles: {
        textColor: 255,
        fillColor: '#007bff',
        fontStyle: 'bold',
        fontSize: 11,
        lineWidth: 0.1,
        cellPadding: {
          top: 1,
          right: 1,
          bottom: 1,
          left: 2
        }
      },
      bodyStyles: {
        fillColor: 255,
        textColor: 80,
        fontStyle: 'normal',
        fontSize: 8,
        lineWidth: 0.1,
        minCellHeight: 10.3,
        cellPadding: {
          top: 1,
          right: 1,
          bottom: 0.5,
          left: 2
        }
      },
      didDrawPage: function (hookData) {
        // Footer
        console.log('didDrawPage', hookData);
        let str = 'Página ' + hookData.pageNumber;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof hookData.doc.putTotalPages === 'function') {
          str = str + ' de ' + hookData.pageCount;
        }
        hookData.doc.setFontSize(8);
        let pageSize = hookData.doc.internal.pageSize;
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        let pageWidth = pageSize.width ? pageSize.width : hookData.doc.internal.pageSize.getWidth;
        hookData.doc.text(str, pageWidth - 100, pageHeight - 10);
        hookData.doc.setFontSize(9);
        hookData.doc.putTotalPages('{total_pages_count_string}');
      },
      didParseCell: (HookData) => {
        console.log('HookData', HookData);
        HookData.doc.setFontSize(9);
        if (HookData.cell.section === "body") {
          if (HookData.column.dataKey === 'tarefa_usuario_situacao') {
            if (Array.isArray(HookData.cell.raw)) {
              HookData.row.height = HookData.cell.raw.length * 10.3;
              HookData.cell.styles.cellPadding = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              };
            }
            HookData.cell.text = [];
          }
          if (HookData.column.dataKey === 'tarefa_situacao_nome') {
            HookData.cell.styles.fillColor = this.rowColor(+HookData.row.raw['tarefa_situacao_id']);
          }
          if (HookData.column.dataKey === 'tarefa_usuario_situacao_andamento') {
            if (Array.isArray(HookData.cell.raw)) {

              console.log('andamento', HookData);

              if(Array.isArray(HookData.cell.raw['tarefa_historico'])) {
                HookData.row.height = (HookData.cell.raw.length * (HookData.cell.raw['tarefa_historico'].length + 1)) * 10.3;
              }
              HookData.cell.styles.cellPadding = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              };
            }
            HookData.cell.text = [];
          }
        }
      },
      didDrawCell: data => {
        data.doc.setFontSize(9);
        this.contador = data.row.index;
        if (data.cell.section === "body") {
          if (data.column.dataKey === 'tarefa_usuario_situacao') {
            this.contador = data.row.index;
            if (Array.isArray(data.row.raw['tarefa_usuario_situacao'])) {
              let dc = data.doc;
              dc.autoTable(
                {
                  columns: [
                    {
                      dataKey: 'tu_usuario_nome',
                      header: {
                        styles: {
                          cellWidth: data.cell.width / 2
                        }
                      }
                    },
                    {
                      dataKey: 'tus_situacao_nome',
                      header: {
                        styles: {
                          cellWidth: data.cell.width / 2
                        }
                      }
                    }
                  ],
                  body: data.row.raw['tarefa_usuario_situacao'],// tarefa_situacao_id
                  theme: "grid",
                  startY: data.cell.y,
                  margin: {
                    left: data.cell.x
                  },
                  pageBreak: "auto",
                  tableWidth: data.cell.width,
                  showHead: false,
                  showFoot: false,
                  bodyStyles: {
                    fillColor: 255,
                    textColor: 80,
                    fontStyle: 'normal',
                    fontSize: 8,
                    lineWidth: 0.1,
                    height: 10,
                    minCellHeight: 10,
                    cellPadding: {
                      top: 1,
                      right: 1,
                      bottom: 0.5,
                      left: 2
                    }
                  },
                  didParseCell: (HookData2) => {
                    HookData2.cell.styles.fillColor = this.rowColor(+HookData2.row.raw['tus_situacao_id']);
                  }

                }
              )


            }
          }
          if (data.column.dataKey === 'tarefa_usuario_situacao_andamento') {
            this.contador = data.row.index;
            if (Array.isArray(data.row.raw['tarefa_usuario_situacao_andamento'])) {
              data.row.raw['tarefa_usuario_situacao_andamento'].forEach((dados: TarefaUsuarioSituacaoAndamentoI) => {
              let dc = data.doc;
              dc.autoTable(
                {
                  columns: [
                    {
                      dataKey: 'th_data',
                      header: {

                        styles: {
                          cellWidth: data.cell.width / 3
                        }
                      }
                    },
                    {
                      dataKey: 'th_historico',
                      header: {
                        styles: {
                          cellWidth: data.cell.width * (2/3)
                        },

                      }
                    }
                  ],
                  body: dados,// tarefa_situacao_id
                  theme: "grid",
                  startY: data.cell.y,
                  margin: {
                    left: data.cell.x
                  },
                  pageBreak: "auto",
                  tableWidth: data.cell.width,
                  showHead: false,
                  showFoot: false,
                  bodyStyles: {
                    fillColor: 255,
                    textColor: 80,
                    fontStyle: 'normal',
                    fontSize: 8,
                    lineWidth: 0.1,
                    height: 10,
                    minCellHeight: 10,
                    cellPadding: {
                      top: 1,
                      right: 1,
                      bottom: 0.5,
                      left: 2
                    }
                  },
                  didParseCell: (HookData2) => {
                    HookData2.cell.styles.fillColor = this.rowColor(+HookData2.row.raw['tus_situacao_id']);
                  }

                }
              )


            });

          }
        }
        console.log('contador', this.contador);
      }
    });

    // if (typeof this.putTotalPages === 'function') {
    // this.doc.putTotalPages(this.totalPagesExp)
    // }

    if (this.contador === this.total -1) {
      this.doc.save('table.pdf');
      this.doc = undefined;
    }

  }












































  getTabelaPdf2(valores: any[], colunas: ColumnInput[], y: number, width: number, estilo = {},  vertical: boolean = false) {
    if (this.doc === undefined) {
      if (vertical) {
        this.doc = new jsPDF(
          {
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
            putOnlyUsedFonts: true
          }
        ) as jsPDFCustom;
      } else {
        this.doc = new jsPDF(
          {
            orientation: 'l',
            unit: 'pt',
            format: 'a4',
            putOnlyUsedFonts: true
          }
        ) as jsPDFCustom;
      }

      this.doc.setFontSize(15);
      this.doc.text('TAREFAS', 15, 15);
      this.doc.setFontSize(9);
      this.startY = 16;
    }



    this.doc.autoTable({
      columns: colunas,
      body: valores,
      startY: y,
      styles: estilo,
      /*headStyles: {
        textColor: 255,
        fillColor: '#007bff',
        fontStyle: 'bold',
        fontSize: 9,
        lineWidth: 0.1,
        cellPadding: {
          top: 1,
          right: 1,
          bottom: 0.5,
          left: 2
        }
      },*/
      bodyStyles: {
        fillColor: 255,
        textColor: 80,
        fontStyle: 'normal',
        fontSize: 9,
        lineWidth: 0.1,
        cellPadding: {
          top: 1,
          right: 1,
          bottom: 0.5,
          left: 2
        }
      },
      didDrawPage: function (hookData) {
        // Footer
        console.log('didDrawPage', hookData);
        let str = 'Página ' + hookData.pageNumber;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof hookData.doc.putTotalPages === 'function') {
          str = str + ' de ' + hookData.pageCount;
        }
        hookData.doc.setFontSize(8);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        let pageSize = hookData.doc.internal.pageSize;
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        let pageWidth = pageSize.width ? pageSize.width : hookData.doc.internal.pageSize.getWidth;
        hookData.doc.text(str, pageWidth - 100, pageHeight - 10);
        hookData.doc.setFontSize(9);
        hookData.doc.putTotalPages('{total_pages_count_string}');
      },
      didParseCell: (HookData) => {
        if (HookData.cell.section === "body") {
          if (HookData.column.dataKey === 'tarefa_usuario_situacao') {
          // if (this.idx0 !== -1 && HookData.column.index === this.idx0) {
            const c1 = HookData;
            console.log('didParseCell', c1);

            if (Array.isArray(HookData.cell.raw)) {
              console.log('HookData.cell.raw.length', HookData.cell.raw.length);
              HookData.cell.height = HookData.cell.raw.length * 11;
            }
            HookData.cell.text = [];
            console.log('nestedTable', HookData.cell);
          }
        }
      },
      didDrawCell: data => {
        this.contador = data.row.index;
        if (data.cell.section === "body") {
          if (data.column.dataKey === 'tarefa_usuario_situacao') {
          // if (this.idx0 !== -1 && data.column.index === this.idx0) {
            const c2 = data
            console.log('didDrawCell', data);
            this.contador = data.row.index;
            // this.contador++;
            this.startY = data.cell.y + 4;
            this.tableWidth = data.cell.width - 4;
            const subTableStyle = {
              startY: data.cell.y + 4,
              margin: { left: data.cell.x + 4},
              tableWidth: data.cell.width - 4
            };
            console.log('subTableStyle',subTableStyle);
            const c3 = data.row.raw['tarefa_usuario_situacao'];
            console.log('data.row.raw',c3);
            if (Array.isArray(data.row.raw['tarefa_usuario_situacao'])) {

              this.getTabelaPdf(data.row.raw['tarefa_usuario_situacao'], this.getCols(1),data.cell.y + 4,221,  subTableStyle,  false);
            }

            // const rawNode = data.cell.raw as HTMLTableCellElement;
            // const nestedTable = rawNode.querySelector('table');

            // if there is a nested table draw that table
            /*if (nestedTable) {
              const subTableStyle = {
                html: nestedTable,
                startY: data.cell.y + 4,
                margin: { left: data.cell.x + 4 },
                tableWidth: data.cell.width - 4
              };
              console.log('subTableStyle', subTableStyle);
              this.createAutoTable(nestedTable, subTableStyle)
            }*/
          }
        }
        console.log('contador', this.contador);
      }
    });

    // if (typeof this.putTotalPages === 'function') {
      // this.doc.putTotalPages(this.totalPagesExp)
    // }

    if (this.contador === this.total -1) {
      this.doc.save('table.pdf');
      this.doc = undefined;
    }

  }



    prepareCellTableInterna(cell, nestedTable: any[]) {
      cell.styles.minCellHeight = this.getTotalRowsInterna(nestedTable) * 11; // calc how many rows are needed?
      cell.text = [];
      console.log('prepareCellForNestedTable', cell);
    }


    getTotalRowsInterna(valores: any[]): number {
      console.log('getTotalRows');
      return valores.length;
    }




}
