import {Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { OficioDetalheInterface, OficioListagemInterface } from '../_models';

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
  selector: 'app-oficio-detalhe',
  templateUrl: './oficio-detalhe.component.html',
  styleUrls: ['./oficio-detalhe.component.css']
})
export class OficioDetalheComponent implements OnInit {
  @Input() oficio: OficioListagemInterface = null;
  @Output() hideDetalhe = new EventEmitter<boolean>();
  @ViewChild('taboficio', { static: true }) taboficio: ElementRef;
  dados: OficioDetalheInterface;
  private campos: string[] = [];
  private alturas: number[] = [];
  private larguras: number[] = [];

  constructor() { }

  ngOnInit() {
  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

  getPdf (imprimir = false) {

    let linha = 0;
    let doc = new jsPDF (
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    ) as jsPDFCustom;
    const pageNumber = doc.getNumberOfPages ();

    doc.setFontSize(15);
    doc.text('OFÍCIO', 15, 15);
    doc.setFontSize(10);

    const k = [
      'oficio_id',
      'oficio_processo_numero',
      'oficio_codigo',
      'oficio_numero',
      'oficio_solicitacao_descricao',
      'oficio_prioridade_nome',
      'oficio_municipio_nome',
      'oficio_tipo_solicitante_nome',
      'oficio_cadastro_nome',
      'oficio_assunto_nome',
      'oficio_data_emissao',
      'oficio_data_recebimento',
      'oficio_orgao_solicitado_nome',
      'oficio_descricao_acao',
      'oficio_data_protocolo',
      'oficio_protocolo_numero',
      'oficio_orgao_protocolante_nome',
      'oficio_protocolante_funcionario',
      'oficio_prazo',
      'oficio_tipo_andamento_nome',
      'oficio_tipo_recebimento_nome',
      'oficio_area_interesse_nome',
      'oficio_status',
      'oficio_valor_solicitado',
      'oficio_valor_recebido',
      'oficio_data_pagamento',
      'oficio_data_empenho',
      'solicitacao_local_nome',
      'solicitacao_reponsavel_analize_nome',
    ];
    const t = [
      'ID',
      'NÚMERO DO PROCESSO',
      'CÓDIGO',
      'NÚMERO DO OFÍCIO',
      'DESC. DA SOLICITAÇÃO',
      'PRIORIDADE',
      'MUNICÍPIO',
      'TP SOLICITANTE',
      'SOLICITANTE',
      'ASSUNTO',
      'DATA DA EMISSÃO',
      'DATA DO RECEBIMENTO',
      'ORGÃO SOLICITADO',
      'DESCRIÇÃO',
      'DATA DO RPOTOCOLO',
      'NÚMERO DO PROTOCOLO',
      'ORGÃO PROTOCOLANTE',
      'FUNCIONÁRIO DO ORGÃO',
      'PRAZO DA AÇÃO',
      'TP ANDAMENTO',
      'TP RECEBIMENTO',
      'ÁREA DE INTERESSE',
      'SITUAÇÃO',
      'VALOR SOLICITADO',
      'VALOR RECEBIDO',
      'DATA DO PAGAMENTO',
      'DATA DO EMPENHO',
      'NÚCLEO',
      'RESP. ANALISE',
    ];
    const s: string[] = Object.keys(this.oficio);
    const v: any[] = Object.values(this.oficio);

    const ofi: string[] = [];
    const tit: string[] = [];
    const oficio: any[] = [];

    for (let i = 0; i < k.length; i++) {
      if (k[i] !== 'oficio_descricao_acao' && k[i] !== 'oficio_solicitacao_descricao') {
        const n = s.indexOf(k[i]);
        if (n >= 0 && v[n]) {
          oficio.push([t[i], v[n]]);
        }
      }
    }
    const head = [['Ofício', '']];

    autoTable(doc,{
      head: head,
      body: oficio,
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


    this.campos = [];
    if (this.oficio.oficio_descricao_acao) {
      this.campos.push('descricao');
    }
    if (this.oficio.oficio_solicitacao_descricao) {
      this.campos.push('solicitacao');
    }

    const promises = [];
    this.campos.forEach(page => {
      promises.push(this.getCanvasData(document.getElementById(page)));
    });


    const nome = this.oficio.oficio_cadastro_nome.replace(' ', '_').toLowerCase();
    const fileName = `oficio_${nome}_${new Date().getTime()}.pdf`;


    Promise.all(promises).then(dataUrls => {
      let a = 0;
      let ti = '';
      dataUrls.forEach((dataUrl, i) => {
        switch (this.campos[a]) {
          case 'descricao' : {
            ti = 'Descrição';
            break;
          }
          case 'solicitacao' : {
            ti = 'Solicitacao';
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
