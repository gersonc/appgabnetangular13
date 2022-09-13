import { Injectable } from '@angular/core';
import jsPDF from 'jspdf'
import {applyPlugin, autoTable, ColumnInput, UserOptions } from 'jspdf-autotable';
import {TarefaI, TarefaUsuarioSituacaoAndamentoI} from "../_models/tarefa-i";
import {ColunasI} from "../../_models/colunas-i";
import {ITitulos} from "../../_models/titulo-i";
import {striptags} from "striptags";
import {Stripslashes} from "../../shared/functions/stripslashes";
applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

interface TarefaHistoricoI2 {
  th_id?: number;
  th_tarefa_id?: number;
  th_data?: string;
  th_data2?: string;
  th_data3?: Date;
  th_usuario_id?: number;
  th_usuario_nome?: string;
  th_historico?: string;
  th_historico_delta?: string;
  th_historico_texto?: string;
  usuarioSn?: boolean;
  situacao_id?: number;
}

@Injectable({
  providedIn: 'root'
})


export class TarefaPdfService {

  constructor() { }

  geraTabelaPdf(valores: TarefaI[], campos: ColunasI[], tit: ITitulos[]) {
    const t:[number, ColumnInput[]] = this.getColumsns(campos, tit)
    this.getTabelaPdf(valores, t[1], t[0]);
  }

  getTabelaPdf(valores: any[], colunas: ColumnInput[], largura: number) {
    let contador = 0;
    let total: number = valores.length;
    let autoTable: autoTable;
    let doc: jsPDFCustom;

    if (largura <= 510) {
      doc = new jsPDF(
        {
          orientation: 'p',
          unit: 'pt',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      ) as jsPDFCustom;
    } else {
      doc = new jsPDF(
        {
          orientation: 'l',
          unit: 'pt',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      ) as jsPDFCustom;
    }



    let totalPagesExp = '{total_pages_count_string}';
    doc.setFontSize(13);
    doc.text('TAREFAS', 40, 39);
    doc.setFontSize(9);

    doc.autoTable({
      columns: colunas,
      body: valores,
      startY: 45,
      theme: "striped",
      rowPageBreak: 'avoid',
      horizontalPageBreak: true,
      headStyles: {
        textColor: 255,
        fillColor: '#007bff',
        fontStyle: 'bold',
        fontSize: 11,
        lineWidth: 1,
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
        lineWidth: 1,
        minCellHeight: 10.3,
        cellPadding: {
          top: 1,
          right: 1,
          bottom: 0.5,
          left: 2
        }
      },
      didParseCell: (HookData) => {
        HookData.doc.setFontSize(9);
        if (HookData.cell.section === "body") {
          if (HookData.column.dataKey === 'tarefa_tarefa') {
            HookData.cell.raw = this.stripslashes(HookData.cell.raw.toString());
            HookData.cell.text[0] = this.stripslashes(HookData.cell.text[0]);
          }
          if (HookData.column.dataKey === 'tarefa_usuario_situacao') {
            if (Array.isArray(HookData.cell.raw)) {
              HookData.row.height = HookData.cell.raw.length * 10.3 + (HookData.cell.raw.length - 1);
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
            if(Array.isArray(HookData.cell.raw)) {
              const n1: any[] = HookData.cell.raw;
              const n2: TarefaUsuarioSituacaoAndamentoI[] = n1;
              let n0 = 0;
              n2.forEach( h => {
                n0 += h.tarefa_historico.length + 1
              });
              HookData.row.height = n0 * 10.3;
              HookData.cell.styles.cellPadding = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              };
              HookData.cell.text = [];
            }
          }
        }
      },
      didDrawCell: data => {
        data.doc.setFontSize(9);
        contador = data.row.index;
        if (data.cell.section === "body") {
          if (data.column.dataKey === 'tarefa_usuario_situacao') {
            contador = data.row.index;
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
                  theme: "striped",
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
                    lineWidth: 1,
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
            if (Array.isArray(data.row.raw['tarefa_usuario_situacao_andamento'])) {
              let dados: any[] = [];
              data.row.raw['tarefa_usuario_situacao_andamento'].forEach((d: TarefaUsuarioSituacaoAndamentoI) => {
                const u: TarefaHistoricoI2 = {
                  th_data: d.tu_usuario_nome,
                  th_historico: d.tus_situacao_nome,
                  th_usuario_id: d.tarefa_situacao_id,
                  situacao_id: d.tus_situacao_id,
                  usuarioSn: true
                }
                const h2: TarefaHistoricoI2[] = d.tarefa_historico.map(h => {
                  let hh: TarefaHistoricoI2 = h;
                  hh.situacao_id = 0;
                  hh.usuarioSn = false;
                  return hh;
                })
                let h: TarefaHistoricoI2[] = h2.reverse();
                h.push(u);
                h.reverse();
                dados.push(...h);
              });
              let da = data.doc;
              da.autoTable(
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
                        }
                      }
                    }
                  ],
                  body: dados,// tarefa_situacao_id
                  theme: "striped",
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
                    lineWidth: 1,
                    height: 10,
                    minCellHeight: 10,
                    cellPadding: {
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0
                    }
                  },
                  didParseCell: (HookData4) => {
                    if (HookData4.section === 'body') {
                      if (HookData4.column.dataKey === 'th_historico') {
                        HookData4.cell.raw = this.stripslashes(HookData4.cell.raw.toString());
                        HookData4.cell.text[0] = this.stripslashes(HookData4.cell.text[0]);
                      }
                      if (HookData4.column.dataKey === 'th_data' || HookData4.column.dataKey === 'th_historico') {
                        if (HookData4.row.raw['usuarioSn']) {
                          HookData4.cell.styles.fillColor = this.rowColor(+HookData4.row.raw['situacao_id']);
                        }
                      }
                    }
                  }
                });
            }
          }
        }
      },
      didDrawPage: function (hookData) {
        let str = 'Página ' + hookData.doc.internal.getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof hookData.doc.putTotalPages === 'function') {
          str = str + ' de ' + totalPagesExp;
        }
        hookData.doc.setFontSize(8);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        let pageSize = hookData.doc.internal.pageSize;
        let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        let pageWidth = pageSize.width ? pageSize.width : hookData.doc.internal.pageSize.getWidth;
        hookData.doc.text(str, pageWidth - 100, pageHeight - 10);
        hookData.doc.setFontSize(9);
      }

    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp)
    }

    if (contador === total -1) {
      doc.save('table.pdf');
      doc = undefined;
    }

  }

  getColumsns(campos: ColunasI[], tit: ITitulos[]): [number, ColumnInput[]] {
    let tableWidth = 0;
    let colunms = campos.map((col) => {
      tableWidth += +col.width.replace('px', '') * 0.9;
      const c: ColumnInput = {
        dataKey: col.field,
        header: {
          title: tit['tarefa'][col.field].titulo,
          styles: {
            cellWidth: +col.width.replace('px', '') * 0.9
          }
        }
      }
      return c;
    });
    return [tableWidth, colunms]
  }

  stripslashes(str?: string): string | null {
    return striptags(Stripslashes(str));
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

}
