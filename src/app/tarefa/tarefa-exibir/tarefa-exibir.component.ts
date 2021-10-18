import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MessageService, SelectItem, Message } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CarregadorService } from "../../_services";
import { TarefaService } from "../_services";
import {TarefaHistroricoInterface, TarefaListarInterface, TarefaUsuarioSituacaoInteface} from "../_models";
declare var html2canvas: any;
declare var jsPDF: any;

declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}

@Component({
  selector: 'app-tarefa-exibir',
  templateUrl: './tarefa-exibir.component.html',
  styleUrls: ['./tarefa-exibir.component.css']
})
export class TarefaExibirComponent implements OnInit {
  @ViewChild('tabtarefa', { static: true }) tabtarefa: ElementRef;
  @ViewChild('tabsituacao', { static: true }) tabsituacao: ElementRef;
  @ViewChild('tabhistorico', { static: true }) tabhistorico: ElementRef;

  tf: TarefaListarInterface = null;
  titulos: any[] = null;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService,
    private cs: CarregadorService,
    private ts: TarefaService,
  ) { }

  ngOnInit(): void {
    this.carregaDados();
  }

  carregaDados(): void {
    this.titulos = this.ts.getTitulos();
    this.tf = this.config.data.tarefa;
    console.log('this.config.data', this.config.data);
    console.log('this.titulos', this.titulos);
  }

  fechar() {
    this.ref.close();
  }

  tarefaHora(hora: string): string {
    const hr: string = hora === '00:00' ? '--:--' : hora;
    return hr;
  }

  fcor(x: number) {
    let cor: string;
    switch (x) {
      case 1:
        cor = '#FF8C8C';
        break;
      case 2:
        cor = '#F3F198';
        break;
      case 3:
        cor = '#BBEABE';
        break;
      default:
        cor = '#BBEABE';
    }
    return cor;
  }

  getPdf(vf: boolean) {
    console.log('this.titulos', this.ts.titulos);
    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );

    doc.setFontSize(15);
    doc.text('TAREFA', 15, 15);
    doc.setFontSize(8);

    const k: string[] = Object.keys(this.ts.titulos['tarefa_titulo']);
    const t: string[] = Object.values(this.ts.titulos['tarefa_titulo']);
    const s: string[] = Object.keys(this.tf);
    const v: any[] = Object.values(this.tf);

    const taref: string[] = [];
    const tarefTit: string[] = [];
    const tarefa: any[] = [];

    for (let i = 0; i < s.length; i++) {
      taref[s[i]] = v[i].toString();
    }

    for (let i = 0; i < k.length; i++) {
      tarefTit[k[i]] = t[i];
    }

    for (let i = 0; i < k.length; i++) {
      tarefa.push([tarefTit[k[i]], taref[k[i]]]);
    }
    const head = [['Tarefa', '']];

    doc.autoTable({
      head: head,
      body: tarefa,
      startY: 20,
      pageBreak: 'avoid',
      styles: { cellPadding: {top: 0.5, right: 0.5, bottom: 0.5, left: 2}, fontSize: 8 },
      headStyles: {
        textColor: 255,
        fillColor: '#007bff',
        fontStyle: 'bold',
        fontSize: 10,
        lineWidth: 0,
        cellPadding: {
          top: 1,
          right: 0.5,
          bottom: 0.5,
          left: 2}
      },
      bodyStyles: { fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1 }
    });

    let pageNumber = doc.internal.getNumberOfPages();

    const t2: string[] = Object.values(this.ts.titulos['tarefa_usuario_titulo']);
    const v2: any[] = Object.values(this.tf.usuario_situacao);
    const demandados: any[] = [];

    demandados.push([t2[0], t2[1]]);

    for (let i = 0; i < v2.length; i++) {
      let vd: TarefaUsuarioSituacaoInteface = v2[i];
      demandados.push([vd.tu_usuario_nome, vd.tus_situacao_nome]);
    }

    const head2 = [['Demandado(s)', '']];

    doc.autoTable({
      head: head2,
      body: demandados,
      startY: doc.autoTable.previous.finalY + 8,
      pageBreak: 'avoid',
      styles: { cellPadding: {top: 0.5, right: 0.5, bottom: 0.5, left: 2}, fontSize: 8 },
      headStyles: {
        textColor: 255,
        fillColor: '#007bff',
        fontStyle: 'bold',
        fontSize: 10,
        lineWidth: 0,
        cellPadding: {
          top: 1,
          right: 0.5,
          bottom: 0.5,
          left: 2}
      },
      bodyStyles: { fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1 }
    });

    doc.setPage(pageNumber);

    if (this.tf.tarefa_historico) {
      if (this.tf.tarefa_historico.length > 0) {
        const t3: TarefaHistroricoInterface = this.ts.titulos['tarefa_historico_titulo'];
        const historico: any[] = [];

        historico.push([t3.th_data, t3.th_hora, t3.th_usuario_nome, t3.th_historico]);

        for (let i = 0; i < this.tf.tarefa_historico.length; i++) {
          let hs: TarefaHistroricoInterface = this.tf.tarefa_historico[i];
          historico.push([hs.th_data, hs.th_hora, hs.th_usuario_nome, hs.th_historico]);
        }

        const head3 = [['Andamento(s)', '', '', '']];

        doc.autoTable({
          head: head3,
          body: historico,
          startY: doc.autoTable.previous.finalY + 8,
          pageBreak: 'avoid',
          styles: { cellPadding: {top: 0.5, right: 0.5, bottom: 0.5, left: 2}, fontSize: 8 },
          headStyles: {
            textColor: 255,
            fillColor: '#007bff',
            fontStyle: 'bold',
            fontSize: 10,
            lineWidth: 0,
            cellPadding: {
              top: 1,
              right: 0.5,
              bottom: 0.5,
              left: 2}
          },
          bodyStyles: { fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1 }
        });
        let pageNumber2 = doc.internal.getNumberOfPages();
        doc.setPage(pageNumber2);
      }
    }


    const fileName = `tarefa_${this.tf.tarefa_id}_${new Date().getTime()}.pdf`;
    setTimeout(() => {
      if (vf === false) {
        doc.save(fileName);
      } else {
        doc.autoPrint();
        // doc.output('dataurlnewwindow');
        window.open(doc.output('bloburl'));
      }
    }, 2000);
  }

}
