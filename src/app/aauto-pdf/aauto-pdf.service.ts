import { Injectable } from '@angular/core';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { applyPlugin, UserOptions } from 'jspdf-autotable';
import {PdfRelatorioI, PdfTabela} from "../_models/pdf-relatorio-i";
applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}
declare var html2canvas: any;
declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}




@Injectable({
  providedIn: 'root'
})
export class AautoPdfService {

  constructor() { }


  getDetalhePdf (relatorio: PdfRelatorioI, imprimir = false) {
    let pdfVF = true;
    let linha = 0;
    let startY = 0;
    let pag = 1;

    const listab = relatorio.listaTabelas;
    const ntab = listab.length;
    let doc = new jsPDF (
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    ) as jsPDFCustom;
    let pageNumber = doc.getNumberOfPages();

    doc.setFontSize(15);
    doc.text(relatorio.tituloRelatorio, 15, 15);
    doc.setFontSize(10);

    let tb: PdfTabela | null = null;
    let head = [['', '']];
    for (let i = 0; i < ntab; i++) {
      tb = relatorio.tabelas[i];
      head = [[tb.tituloTabela, '']];
      if (tb.disposicao === 'v') {





      }
    }

/*

    const k: string[] = Object.keys(this.processo_titulo);
    const t: string[] = Object.values(this.processo_titulo);
    const s: string[] = Object.keys(this.processo);
    const v: any[] = Object.values(this.processo);

    const proc: string[] = [];
    const tit: string[] = [];
    const processo: any[] = [];

    for (let i = 0; i < s.length; i++) {
      if (s[i] !== 'solicitacao_descricao' && s[i] !== 'solicitacao_aceita_recusada' && s[i] !== 'processo_carta') {
        proc[s[i]] = v[i].toString();
      }
    }

    for (let i = 0; i < k.length; i++) {
      if (k[i] !== 'solicitacao_descricao' && k[i] !== 'solicitacao_aceita_recusada' && k[i] !== 'processo_carta') {
        tit[k[i]] = t[i];
      }
    }

    for (let i = 0; i < k.length; i++) {
      if (k[i] !== 'solicitacao_descricao' && k[i] !== 'solicitacao_aceita_recusada' && k[i] !== 'processo_carta') {
        processo.push([tit[k[i]], proc[k[i]]]);
      }
    }
    // const head = [['Solicitação', '']];

    autoTable(doc,{
      head: head,
      body: processo,
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
      bodyStyles: { fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1 },
      didDrawPage: (d) => {
        linha = d.cursor.y;
      },
    });

    doc.setPage(pageNumber);
    doc.setFontSize(10);


    if (this.processo.solicitacao_descricao) {
      this.campos.push('solicitacao_descricao');
    }
    if (this.processo.solicitacao_aceita_recusada) {
      this.campos.push('solicitacao_aceita_recusada');
    }
    if (this.processo.processo_carta) {
      this.campos.push('processo_carta');
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

      autoTable(doc,{
        head: head2,
        body: cadastro,
        startY: linha,
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
        bodyStyles: { fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1 },
        didDrawPage: (d) => {
          linha = d.cursor.y;
        },
      });

      doc.setPage(pageNumber);
    }



    if (this.oficios) {
      linha += 12;
      doc.text('OFÍCIO(S) - Esta solicitação está vinculada ao(s) seguinte(s) ofício(s).', 15, linha);

      const ofiTitulo: string[] = [];
      const ofiNum = this.oficios.length;
      const k4: string[] = Object.keys(this.oficio_titulo);
      const t4: string[] = Object.values(this.oficio_titulo);
      const imagem: any = null;
      // let ofiTituloDoc: string[] = [];


      for (let i = 0; i < t4.length; i++) {
        ofiTitulo[k4[i]] = t4[i];
      }

      let valY = 10;
      doc.addPage();

      for (let ofic of this.oficios) {
        let idNome = 'acao_' + ofic.oficio_id;
        let titDoc = 'Oficio ';
        /!*if (ofic.oficio_descricao_acao) {
          if (ofic.oficio_codigo) {
            titDoc = titDoc + ' - ' + ofic.oficio_codigo;
          }
          if (ofic.oficio_orgao_solicitado_nome) {
            titDoc = titDoc + ' - ' + ofic.oficio_orgao_solicitado_nome;
          }
        }*!/
        doc.setPage(pageNumber++);

        if (pageNumber > 2) {
          valY = linha += 12;
        }

        let s4: string[] = Object.keys(ofic);
        let v4: any[] = Object.values(ofic);
        let ofi: string[] = [];
        let ofiVal: any[] = [];

        for (let i = 0; i < s4.length; i++) {
          ofi[s4[i]] = v4[i];
        }

        for (let i = 0; i < k4.length; i++) {
          if (ofi[k4[i]]) {
            if (k4[i] !== 'oficio_descricao_acao') {
              // ofiTituloDoc.push()
              ofiVal.push([ofiTitulo[k4[i]], ofi[k4[i]].toString()]);
            }
          }
        }
        const head4 = [['Oficio', '']];

        autoTable(doc,{
          head: head4,
          body: ofiVal,
          startY: valY,
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
          }
        });


        if (ofi['oficio_descricao_acao']) {
          this.campos.push(idNome);
        }

        doc.setPage(pageNumber++);

        s4 = null;
        v4 = null;
        ofi = null;
        ofiVal = null;
        idNome = null;

      }
    }

    if (this.historicos) {
      linha += 12;
      const hcolums: ColumnsInterface[] = [];
      const t5: string[] = Object.keys(this.historico_titulo);
      const v5: string[] = Object.values(this.historico_titulo);
      for (let i = 0; i < t5.length; i++) {
        hcolums.push({
          header: v5[i],
          dataKey: t5[i]
        });
      }
      let historicos: any[] = [];
      this.historicos.forEach( h => {
        historicos.push([h.historico_data, h.historico_andamento]);
      })

      // doc.text('OFÍCIO(S) - Esta solicitação está vinculada ao(s) seguinte(s) ofício(s).', 15, doc.autoTable.previous.finalY + 10);
      autoTable(doc,{
        columns: hcolums,
        body: historicos,
        startY: linha,
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
        bodyStyles: { fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1 },
        didDrawPage: (d) => {
          linha = d.cursor.y;
        },
      });

    }


    const promises = [];
    this.campos.forEach(page => {
      promises.push(this.getCanvasData(document.getElementById(page)));
    });


    const nome = this.cadastro.cadastro_nome.replace(' ', '_').toLowerCase();
    const fileName = `processo_${nome}_${new Date().getTime()}.pdf`;


    Promise.all(promises).then(dataUrls => {
      let a = 0;
      let ti = '';
      dataUrls.forEach((dataUrl, i) => {
        switch (this.campos[a]) {
          case 'solicitacao_descricao' : {
            ti = 'Descrição da solicitação';
            break;
          }
          case 'solicitacao_aceita_recusada' : {
            ti = 'Observações';
            break;
          }
          case 'processo_carta' : {
            ti = 'Carta';
            break;
          }
          default: {
            ti = 'Ofício';
            break;
          }
        }
        doc.addPage();
        doc.setFontSize(16);
        doc.text(ti, 10, 10);
        doc.addImage(dataUrl, 'PNG', 10, 16, this.larguras[a], this.alturas[a]);
        a++;
      });


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
    }, tempo);*/
  }

  /*getCanvasData = element => {
    return new Promise((resolve, reject) => {
      const self = this;
      html2canvas(element)
        .then(function(canvas) {
          console.log('altura, largura', canvas.height, canvas.width);
          console.log('altura2, largura2', canvas.height / 3.779528, canvas.width / 3.779528);
          let imgWidth = 190;
          if ((canvas.width / 3.779528) <= 190) {
            imgWidth = (canvas.width / 3.779528);
          }
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          const heightLeft = imgHeight;
          self.altu = imgHeight;
          self.larg = imgWidth;
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
  }*/



}
