import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "../../_services";

import html2canvas from "html2canvas";
import {SolicDetalheI} from "../_models/solic-detalhe-i";

import {jsPDF} from "jspdf";
import autoTable, {applyPlugin} from "jspdf-autotable";
import {ColumnsInterface} from "../../_models";
import {SolicService} from "../_services/solic.service";

applyPlugin(jsPDF);

/*interface jsPDFCustom {
}*/

@Component({
  selector: 'app-solic-detalhe',
  templateUrl: './solic-detalhe.component.html',
  styleUrls: ['./solic-detalhe.component.css']
})
export class SolicDetalheComponent implements OnInit {
  @Input() detalhe: SolicDetalheI = null;
  @Input() solicitacaoListagem: any[] = [];
  @Output() hideDetalhe = new EventEmitter<boolean>();

  private alturas: number[] = [];
  private larguras: number[] = [];
  public textoEditor = false;
  jsPDFCustom: jsPDF;

  constructor(
    private authenticationService: AuthenticationService,
    public ss: SolicService
  ) {
  }

  ngOnInit() {
  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

  getPdf(imprimir = false) {
    const k: string[] = Object.keys(this.ss.titulos);
    const t: string[] = Object.values(this.ss.titulos);
    const s: string[] = Object.keys(this.detalhe);
    const v: any[] = Object.values(this.detalhe);



    let linha = 0;
    let doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );
    const pageNumber = doc.getNumberOfPages();

    doc.setFontSize(15);
    doc.text('SOLICITAÇÃO', 15, 15);
    doc.setFontSize(10);



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

    for (let i = 0; i < this.soli.length; i++) {
      if (k[i] !== 'solicitacao_descricao' && k[i] !== 'solicitacao_aceita_recusada' && k[i] !== 'solicitacao_carta') {
        solicitacao.push([tit[k[i]], sol[k[i]]]);
      }
    }
    const head = [['Solicitação', '']];

    autoTable(doc, {
      head: head,
      body: solicitacao,
      startY: 20,
      pageBreak: 'avoid',
      styles: {cellPadding: {top: 0.5, right: 0.5, bottom: 0.5, left: 2}, fontSize: 8},
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
          left: 2
        }
      },
      bodyStyles: {fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1},
      didDrawPage: (d) => {
        linha = d.cursor.y;
      },
    });

    doc.setPage(pageNumber);
    doc.setFontSize(10);


    if ("solicitacao_descricao" in this.solicitacao && this.solicitacao.solicitacao_descricao) {
      this.campos.push('descricao');
    }
    if ("solicitacao_aceita_recusada" in this.solicitacao && this.solicitacao.solicitacao_aceita_recusada) {
      this.campos.push('observacao');
    }
    if ("solicitacao_carta" in this.solicitacao && this.solicitacao.solicitacao_carta) {
      this.campos.push('carta');
    }


    if (this.cadastro) {
      linha += 12;
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

      autoTable(doc, {
        head: head2,
        body: cadastro,
        startY: linha,
        pageBreak: 'avoid',
        styles: {cellPadding: {top: 0.5, right: 0.5, bottom: 0.5, left: 2}, fontSize: 8},
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
            left: 2
          }
        },
        bodyStyles: {fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1},
        didDrawPage: (d) => {
          linha = d.cursor.y;
        },
      });

      doc.setPage(pageNumber);
    }


    if (this.vinculos) {
      if (this.solDetalhe.processo_num.num > 0) {
        linha += 8;
        const txtpro = 'Esta solicitaçãoo está vinculada ao processo ' + this.processo_num + '.';
        doc.text(txtpro, 15, linha);
      }
      if (this.solDetalhe.oficio_num.num > 0) {
        linha += 8;
        const txtofi = 'Esta solicitaçãoo está vinculada a ' + this.oficio_num + ' ofício(s).';
        doc.text(txtofi, 15, linha);
      }
    }


    if (this.processo) {
      const colums3: ColumnsInterface[] = [
        {header: 'NÚMERO', dataKey: 'processo_numero'},
        {header: 'SITUAÇÃO', dataKey: 'processo_situacao'}
      ];
      linha += 12;
      let pc: any[] = [];
      /*this.processo.forEach( p => {
        pc.push([p.processo_numero, p.processo_status]);
      });*/
      pc.push([this.solDetalhe.processo.processo_numero, this.solDetalhe.processo.processo_status])
      doc.text('PROCESSO - Esta solicitação está vinculada ao seguinte processo.', 15, linha);
      linha += 2;
      autoTable(doc, {
        columns: colums3,
        body: pc,
        startY: linha,
        pageBreak: 'avoid',
        styles: {cellPadding: {top: 0.5, right: 0.5, bottom: 0.5, left: 2}, fontSize: 8},
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
            left: 2
          }
        },
        bodyStyles: {fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1},
        didDrawPage: (d) => {
          linha = d.cursor.y;
        },
      });
    }

    if (this.oficio) {
      linha += 12;
      const colums4: ColumnsInterface[] = [
        {header: 'POSIÇÃO', dataKey: 'oficio_status'},
        {header: 'CÓDIGO', dataKey: 'oficio_codigo'},
        {header: 'NÚMERO', dataKey: 'oficio_numero'},
        {header: 'DATA', dataKey: 'oficio_data_emissao'},
        {header: 'ORGÃO SOLICITADO', dataKey: 'oficio_orgao_solicitado_nome'},
      ];

      let oficio: any[] = [];
      this.oficio.forEach(p => {
        oficio.push([p.oficio_status, p.oficio_codigo, p.oficio_numero, p.oficio_data_emissao, p.oficio_orgao_solicitado_nome]);
      });

      doc.text('OFÍCIO(S) - Esta solicitação está vinculada ao(s) seguinte(s) ofício(s).', 15, linha);
      linha += 2;
      autoTable(doc, {
        columns: colums4,
        body: oficio,
        startY: linha,
        pageBreak: 'avoid',
        styles: {cellPadding: {top: 0.5, right: 0.5, bottom: 0.5, left: 2}, fontSize: 8},
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
            left: 2
          }
        },
        bodyStyles: {fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1},
        didDrawPage: (d) => {
          linha = d.cursor.y;
        },
      });
    }


    const promises = [];
    this.campos.forEach(page => {
      promises.push(this.getCanvasData(document.getElementById(page)));
    });

    let nome = 'solicitacao';
    if ("solicitacao_cadastro_nome" in this.solicitacao) {
      nome = this.solicitacao.solicitacao_cadastro_nome.replace(' ', '_').toLowerCase();
    }
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
          doc = null;
        } else {
          const a: string = doc.output('bloburi').toString();
          window.open(a);
          doc.autoPrint();
          doc = null;
        }
      }, tempo);
    });
  }

  getCanvasData = element => {
    return new Promise((resolve, reject) => {
      const self = this;
      html2canvas(element)
        .then(function (canvas) {
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
        .catch(function (error) {
          reject(
            'Error while creating canvas for element with ID: ' + element.id
          );
        });
    });
  }
}
