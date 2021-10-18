import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { EmendaDetalheInterface, EmendaListarInterface, HistoricoEmendaInterface } from '../_models';
import { EmendaService } from "../_services";
import { Subscription } from 'rxjs';
import html2canvas from 'html2canvas';

declare var jsPDF: any;

declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}

@Component({
  selector: 'app-emenda-detalhe',
  templateUrl: './emenda-detalhe.component.html',
  styleUrls: ['./emenda-detalhe.component.css']
})
export class EmendaDetalheComponent implements OnInit, OnDestroy {

  @ViewChild('tabemenda', { static: true }) tabemenda: ElementRef;
  @ViewChild('tabhistorico', { static: true }) tabhistorico: ElementRef;
  dados: EmendaDetalheInterface;
  emenda: any[] = [];
  emenda2: any[] = [];
  historico_emenda: HistoricoEmendaInterface[] = null;
  titulos: any[] = null;
  emenda_titulo: any[] = null;
  emenda_titulo_min: any[] = null;
  historico_emenda_titulo: any[] = null;
  historico_emenda_titulo_min: any[] = null;
  private campos: string[] = [];
  private alturas: number[] = [];
  private larguras: number[] = [];
  sub: Subscription[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService,
  ) { }

  ngOnInit() {

    this.dados = this.config.data;
    this.titulos = JSON.parse(sessionStorage.getItem('emenda-titulos'));
    this.emenda_titulo = this.titulos['emenda_titulo'];
    this.emenda_titulo_min = this.titulos['emenda_titulo_min'];
    this.historico_emenda_titulo = this.titulos['historico_emenda_titulo'];
    this.historico_emenda_titulo_min = this.titulos['historico_emenda_titulo_min'];

    const s1: string[] = Object.keys(this.titulos['emenda_titulo']);
    const v1: any[] = Object.values(this.titulos['emenda_titulo']);
    let tit1: any[] = [];
    for (let i = 0; i < s1.length; i++) {
      if (v1[i]) {
        tit1[s1[i]] = v1[i].toString();
      }
    }

    const s2: string[] = Object.keys(this.titulos['emenda_titulo_min']);
    const v2: any[] = Object.values(this.titulos['emenda_titulo_min']);
    let tit2: any[] = [];
    for (let i = 0; i < s2.length; i++) {
      if (v2[i]) {
        tit2[s2[i]] = v2[i].toString();
      }
    }

    const s: string[] = Object.keys(this.dados.emenda);
    const v: any[] = Object.values(this.dados.emenda);
    let eme1: any[] = [];
    for (let i = 0; i < s.length; i++) {
      if (v[i]) {
        eme1[s[i]] = v[i].toString();
      }
    }

    s1.forEach( k => {
      if (eme1[k] && k !== 'emenda_justificativa' && k !== 'historico_emenda' && k !== 'historico_emenda_num') {
        this.emenda.push([tit1[k], eme1[k]]);
      }
    });
    s2.forEach( k => {
      if (eme1[k] && k !== 'emenda_justificativa' && k !== 'historico_emenda' && k !== 'historico_emenda_num') {
        this.emenda2.push([tit2[k], eme1[k]]);
      }
    });

    if (this.dados.emenda.historico_emenda) {
      this.historico_emenda = this.dados.emenda.historico_emenda;
    }

  }

  fechar() {
    this.ref.close ();
  }


  getPdf (imprimir = false) {
    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );
    doc.setFontSize(15);
    doc.text('EMENDA', 15, 15);
    doc.setFontSize(8);

    const head = [['Emenda', '']];

    doc.autoTable({
      head: head,
      body: this.emenda2,
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

    if (this.historico_emenda) {
      const y1 = +doc.autoTable.previous.finalY + 9;
      const y2 = y1 + 5;

      doc.setFontSize(15);
      doc.text('HISTÓRICO', 15, y1);
      doc.setFontSize(8);
      doc.autoTable({
        body: this.historico_emenda,
        columns: [
          {header: this.titulos['historico_emenda_titulo_min'].his_data, dataKey: 'his_data'},
          {header: this.titulos['historico_emenda_titulo_min'].his_usuario, dataKey: 'his_usuario'},
          {header: this.titulos['historico_emenda_titulo_min'].his_texto, dataKey: 'his_texto'}
        ],
        startY: y2,
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
        bodyStyles: {fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1}
      });
      const pageNumber2 = doc.internal.getNumberOfPages();
    }

    if (this.dados.emenda.emenda_justificativa) {
      this.campos.push('justificativa');
    }


    const promises = [];
    this.campos.forEach(page => {
      promises.push(this.getCanvasData(document.getElementById(page)));
    });


    const nome = this.dados.emenda.emenda_cadastro_nome.replace(' ', '_').toLowerCase();
    const fileName = `emenda_${nome}_${new Date().getTime()}.pdf`;


    Promise.all(promises).then(dataUrls => {
      let a = 0;
      let ti = '';
      dataUrls.forEach((dataUrl, i) => {
        switch (this.campos[a]) {
          case 'justificativa' : {
            ti = 'Justificativa';
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

  getPdf2 (imprimir = false) {
    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );
    doc.setFontSize(15);
    doc.text('EMENDA', 15, 15);
    doc.setFontSize(8);
    doc.autoTable ({
      startY: 20,
      html: this.tabemenda.nativeElement
    });
    const nome = this.dados.emenda.emenda_cadastro_nome.replace(' ', '_').toLowerCase();
    const fileName = `emenda_${nome}_${new Date().getTime()}.pdf`;

    setTimeout(() => {
      if (imprimir === false) {
        doc.save(fileName);
      } else {
        doc.autoPrint();
        // doc.output('dataurlnewwindow');
        window.open(doc.output('bloburl'));
      }
    }, 2500);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}

