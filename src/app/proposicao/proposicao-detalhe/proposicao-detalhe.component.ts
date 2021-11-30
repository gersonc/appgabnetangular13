import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AndamentoProposicaoListagemInterface, ProposicaoDetalheInterface, ProposicaoListagemInterface } from '../_models';
// import * as html2canvas from 'html2canvas';
// @ts-ignore
// import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { applyPlugin, UserOptions } from 'jspdf-autotable';
applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}
declare var html2canvas: any;
declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}

@Component({
  selector: 'app-proposicao-detalhe',
  templateUrl: './proposicao-detalhe.component.html',
  styleUrls: ['./proposicao-detalhe.component.css']
})
export class ProposicaoDetalheComponent implements OnInit, OnDestroy {

  @ViewChild('tabproposicao', { static: true }) tabproposicao: ElementRef;
  dados: ProposicaoDetalheInterface;
  proposicao: ProposicaoListagemInterface;
  andamento_proposicao: AndamentoProposicaoListagemInterface[];
  andamento_proposicao_titulo: any[];
  proposicao_titulo: any[];
  private campos: string[] = [];
  private alturas: number[] = [];
  private larguras: number[] = [];
  sub: Subscription[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.dados = this.config.data.ppDetalhe;
    this.proposicao = this.dados.proposicao;
    this.proposicao_titulo = this.dados.proposicao_titulo;
    this.andamento_proposicao = this.dados.andamento_proposicao;
    this.andamento_proposicao_titulo = this.dados.andamento_proposicao_titulo;
  }

  fechar() {
    this.ref.close ();
  }


  getPdf (imprimir = false) {
    let doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );
    doc.setFontSize(15);
    doc.text('PROPOSIÇÃO', 15, 15);
    doc.setFontSize(8);
    autoTable (doc, {
      startY: 20,
      html: this.tabproposicao.nativeElement
    });

    const k: string[] = Object.keys(this.proposicao_titulo);
    const t: string[] = Object.values(this.proposicao_titulo);
    const s: string[] = Object.keys(this.proposicao);
    const v: any[] = Object.values(this.proposicao);

    const prop: string[] = [];
    const tit: string[] = [];
    const proposicao: any[] = [];

    for (let i = 0; i < s.length; i++) {
      if (s[i] !== 'proposicao_ementa' && s[i] !== 'proposicao_texto') {
        prop[s[i]] = v[i].toString();
      }
    }

    for (let i = 0; i < k.length; i++) {
      if (k[i] !== 'proposicao_ementa' && k[i] !== 'proposicao_texto') {
        tit[k[i]] = t[i];
      }
    }

    for (let i = 0; i < k.length; i++) {
      if (k[i] !== 'proposicao_ementa' && k[i] !== 'proposicao_texto') {
        proposicao.push([tit[k[i]], prop[k[i]]]);
      }
    }

    const head = [['Proposição', '']];
    autoTable(doc, {
      head: head,
      body: proposicao,
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

    const pageNumber = doc.getNumberOfPages ();


    if (this.proposicao.proposicao_ementa) {
      this.campos.push('ementa');
    }
    if (this.proposicao.proposicao_texto) {
      this.campos.push('texto');
    }

    const promises = [];
    this.campos.forEach(page => {
      promises.push(this.getCanvasData(document.getElementById(page)));
    });

    if (this.andamento_proposicao) {
      doc.addPage('a4', 'l');
      doc.setFontSize(15);
      doc.text('ANDAMENTO', 15, 15);
      doc.setFontSize(8);
      const hcolums: ColumnsInterface[] = [];
      const t5: string[] = Object.keys(this.andamento_proposicao_titulo);
      const v5: string[] = Object.values(this.andamento_proposicao_titulo);
      for (let i = 0; i < t5.length; i++) {
        if (t5[i] !== 'andamento_proposicao_id') {
          hcolums.push({
            header: v5[i],
            dataKey: t5[i]
          });
        }
      }

      let corpo: any[] = [];

      this.andamento_proposicao.forEach(c => {
        corpo.push([
            c.andamento_proposicao_id,
            c.andamento_proposicao_proposicao_id,
            c.andamento_proposicao_data,
            c.andamento_proposicao_texto,
            c.andamento_proposicao_relator_atual,
            c.andamento_proposicao_orgao_id,
            c.andamento_proposicao_orgao_nome,
            c.andamento_proposicao_situacao_id,
            c.andamento_proposicao_situacao_nome
          ])
      });

      // doc.text('OFÍCIO(S) - Esta solicitação está vinculada ao(s) seguinte(s) ofício(s).', 15, doc.autoTable.previous.finalY + 10);
      autoTable(doc, {
        columns: hcolums,
        body: corpo,
        startY: 20,
        pageBreak: 'avoid',
        rowPageBreak: 'auto',
        styles: {cellWidth: 'wrap', fontSize: 8},
        columnStyles: { andamento_proposicao_texto: {cellWidth: 'auto'}},
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

    }


    const nome = this.proposicao.proposicao_tipo_nome.replace(' ', '_').toLowerCase();
    const fileName = `proposicao_${nome}_${new Date().getTime()}.pdf`;


    Promise.all(promises).then(dataUrls => {
      let a = 0;
      let ti = '';
      dataUrls.forEach((dataUrl, i) => {
        switch (this.campos[a]) {
          case 'ementa' : {
            ti = 'Ementa';
            break;
          }
          case 'texto' : {
            ti = 'Texto';
            break;
          }
        }
        doc.addPage('a4', 'p');
        doc.setFontSize(16);
        doc.text(ti, 10, 10);
        doc.addImage(dataUrl, 'PNG', 10, 16, this.larguras[a], this.alturas[a]);
        a++;
      });
      const tempo = (this.campos.length * 500) + 500;
      setTimeout(() => {
        if (imprimir === false) {
          doc.save(fileName);
          doc = null;
        } else {
          const a: string = doc.output('bloburi').toString();
          window.open(a);
          doc.autoPrint();
          doc = null;
        }
      }, tempo);
    });



    /*  const tempo = (this.campos.length * 500) + 500;
      setTimeout(() => {
        if (imprimir === false) {
          doc.save(fileName);
        } else {
          doc.autoPrint();
          // doc.output('dataurlnewwindow');
          window.open(doc.output('bloburl'));
        }
      }, tempo);
    });*/
  }

  getCanvasData = element => {
    return new Promise((resolve, reject) => {
      const self = this;
      html2canvas(element)
        .then(function(canvas) {
          let imgWidth = 190;
          if ((canvas.width / 3.779528) <= 190) {
            imgWidth = (canvas.width / 3.779528);
          }
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          const heightLeft = imgHeight;
          self.alturas.push(imgHeight);
          self.larguras.push(imgWidth);
          resolve(canvas.toDataURL('image/png', 1));
        })
        .catch(function(error) {
          reject(
            'Error while creating canvas for element with ID: ' + element.id
          );
        });
    });
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }


}
