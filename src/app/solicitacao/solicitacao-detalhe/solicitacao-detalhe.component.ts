import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../_services';
import {
  SolicitacaoCadastroInterface,
  SolicitacaoDetalheInterface,
  SolicitacaoInterface, SolicitacaoListar12Interface, SolicitacaoListar345Interface,
  SolicitacaoOficioInterface,
  SolicitacaoOficioNumInterface,
  SolicitacaoProcessoInterface,
  SolicitacaoProcessoNumInterface
} from '../_models';
// @ts-ignore
import * as jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';

declare var html2canvas: any;

declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}

@Component({
  selector: 'app-solicitacao-detalhe',
  templateUrl: './solicitacao-detalhe.component.html',
  styleUrls: ['./solicitacao-detalhe.component.css'],
})
export class SolicitacaoDetalheComponent implements OnInit {
  @Input() solDetalhe: SolicitacaoDetalheInterface = null;
  @Output() hideDetalhe = new EventEmitter<boolean>();

  public solicitacao: SolicitacaoListar12Interface | SolicitacaoListar345Interface;
  public solicitacao_titulo: any[];
  public cadastro: SolicitacaoCadastroInterface;
  public cadastro_titulo: any[];
  public processo_num: SolicitacaoProcessoNumInterface[] = null;
  public processo: SolicitacaoProcessoInterface[];
  public processo_titulo: any[];
  public oficio_num: SolicitacaoOficioNumInterface[] = null;
  public oficio: SolicitacaoOficioInterface[];
  public oficio_titulo: any[];
  public erro: any[] = null;
  public vinculos = false;
  private campos: string[] = [];
  private alturas: number[] = [];
  private larguras: number[] = [];
  public textoEditor = false;

  constructor (
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.solicitacao = this.solDetalhe.solicitacao;
    this.solicitacao_titulo = this.solDetalhe.solicitacao_titulo;

    if (this.authenticationService.cadastro_listar) {
      this.cadastro = this.solDetalhe.cadastro;
      this.cadastro_titulo = this.solDetalhe.cadastro_titulo;
      this.textoEditor = true;
    }
    if (this.authenticationService.processo_listar && this.solDetalhe.processo.length > 0) {
      this.processo = this.solDetalhe.processo;
      this.processo_titulo = this.solDetalhe.processo_titulo;
      this.textoEditor = true;
    }
    if (this.authenticationService.oficio_vizualizar && this.solDetalhe.oficio.length > 0) {
      this.oficio = this.solDetalhe.oficio;
      this.oficio_titulo = this.solDetalhe.oficio_titulo;
      this.textoEditor = true;
    }
    if (this.solDetalhe.processo_num.length > 0 || this.solDetalhe.oficio_num.length > 0) {
      this.vinculos = true;
      if (this.solDetalhe.processo_num.length > 0) {
        this.processo_num = this.solDetalhe.processo_num;
      }
      if (this.solDetalhe.oficio_num.length > 0) {
        this.oficio_num = this.solDetalhe.oficio_num;
      }
    }
    this.erro = this.solDetalhe.erro;
  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

  getPdf (imprimir = false) {
    // @ts-ignore
    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );
    doc.setFontSize(15);
    doc.text('SOLICITAÇÃO', 15, 15);
    doc.setFontSize(8);

    const k: string[] = Object.keys(this.solicitacao_titulo);
    const t: string[] = Object.values(this.solicitacao_titulo);
    const s: string[] = Object.keys(this.solicitacao);
    const v: any[] = Object.values(this.solicitacao);

    const sol: string[] = [];
    const tit: string[] = [];
    const solicitacao: any[] = [];

    for (let i = 0; i < s.length; i++) {
      if (s[i] !== 'solicitacao_descricao' && s[i] !== 'solicitacao_aceita_recusada' && s[i] !== 'solicitacao_carta') {
        sol[s[i]] = v[i].toString();
      }
    }

    for (let i = 0; i < k.length; i++) {
      if (k[i] !== 'solicitacao_descricao' && k[i] !== 'solicitacao_aceita_recusada' && k[i] !== 'solicitacao_carta') {
        tit[k[i]] = t[i];
      }
    }

    for (let i = 0; i < k.length; i++) {
      if (k[i] !== 'solicitacao_descricao' && k[i] !== 'solicitacao_aceita_recusada' && k[i] !== 'solicitacao_carta') {
        solicitacao.push([tit[k[i]], sol[k[i]]]);
      }
    }
    const head = [['Solicitação', '']];

    doc.autoTable({
      head: head,
      body: solicitacao,
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

    const pageNumber = doc.internal.getNumberOfPages();


    if (this.solicitacao.solicitacao_descricao) {
      this.campos.push('descricao');
    }
    if (this.solicitacao.solicitacao_aceita_recusada) {
      this.campos.push('observacao');
    }
    if (this.solicitacao.solicitacao_carta) {
      this.campos.push('carta');
    }


    if (this.cadastro) {
      const k2: string[] = Object.keys(this.cadastro_titulo);
      const t2: string[] = Object.values(this.cadastro_titulo);
      const s2: string[] = Object.keys(this.cadastro);
      const v2: any[] = Object.values(this.cadastro);

      const cad: string[] = [];
      const tit2: string[] = [];
      const cadastro: any[] = [];

      for (let i = 0; i < s2.length; i++) {
        cad[s2[i]] = v2[i].toString();
      }

      for (let i = 0; i < k2.length; i++) {
        tit2[k2[i]] = t2[i];
      }

      for (let i = 0; i < k2.length; i++) {
        cadastro.push([tit2[k2[i]], cad[k2[i]]]);
      }
      const head2 = [['Solicitante', '']];

      doc.autoTable({
        head: head2,
        body: cadastro,
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
    }


    if (this.vinculos) {
      if (this.solDetalhe.processo_num.length > 0) {
        const txtpro = 'Esta solicitaçãoo está vinculada ao processo ' + this.processo_num + '.';
        doc.text(txtpro, 15, doc.autoTable.previous.finalY + 8);
      }
      if (this.solDetalhe.oficio_num.length > 0) {
        const txtofi = 'Esta solicitaçãoo está vinculada a ' + this.oficio_num + ' ofício(s).';
        doc.text(txtofi, 15, doc.autoTable.previous.finalY + 16);
      }
    }


    if (this.processo) {
      const colums3: ColumnsInterface[] = [];
      const t3: string[] = Object.keys(this.processo_titulo);
      const v3: string[] = Object.values(this.processo_titulo);
      for (let i = 0; i < t3.length; i++) {
        colums3.push({
          header: v3[i],
          dataKey: t3[i]
        });
      }
      doc.text('PROCESSOS - Esta solicitação está vinculada ao seguinte processo.', 15, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        columns: colums3,
        body: this.processo,
        startY: doc.autoTable.previous.finalY + 12,
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
    }

    if (this.oficio) {
      const colums4: ColumnsInterface[] = [];
      const t4: string[] = Object.keys(this.oficio_titulo);
      const v4: string[] = Object.values(this.oficio_titulo);
      for (let i = 0; i < t4.length; i++) {
        colums4.push({
          header: v4[i],
          dataKey: t4[i]
        });
      }
      doc.text('OFÍCIO(S) - Esta solicitação está vinculada ao(s) seguinte(s) ofício(s).', 15, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        columns: colums4,
        body: this.oficio,
        startY: doc.autoTable.previous.finalY + 12,
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
    }


    const promises = [];
    this.campos.forEach(page => {
      promises.push(this.getCanvasData(document.getElementById(page)));
    });


    const nome = this.solicitacao.solicitacao_cadastro_nome.replace(' ', '_').toLowerCase();
    const fileName = `solicitacao_${nome}_${new Date().getTime()}.pdf`;


    Promise.all(promises).then(dataUrls => {
        let a = 0;
        let ti = '';
        dataUrls.forEach((dataUrl, i) => {
          switch (this.campos[a]) {
            case 'descricao' : {
              ti = 'Descrição';
              break;
            }
            case 'observacao' : {
              ti = 'Observações';
              break;
            }
            case 'carta' : {
              ti = 'Carta';
              break;
            }
          }
          doc.addPage();
          doc.setFontSize(16);
          doc.text(ti, 10, 10);
          doc.addImage(dataUrl, 'PNG', 10, 16, this.larguras[a], this.alturas[a]);
          a++;
        });
      const tempo = (this.campos.length * 500) + 500;
      setTimeout(() => {
        if (imprimir === false) {
          doc.save(fileName);
        } else {
          doc.autoPrint();
          // doc.output('dataurlnewwindow');
          window.open(doc.output('bloburl'));
        }
      }, tempo);
    });
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
}
