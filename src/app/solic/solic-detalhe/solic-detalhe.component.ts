import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import {
  AuthenticationService,
  CarregadorService,
  CsvService,
  ExcelService, MenuInternoService,
  PrintJSService,
  TabelaPdfService
} from "../../_services";

import html2canvas from "html2canvas";
import {SolicDetalheI} from "../_models/solic-detalhe-i";

import {jsPDF} from "jspdf";
import autoTable, {applyPlugin} from "jspdf-autotable";
import {ColumnsInterface} from "../../_models";
import {SolicService} from "../_services/solic.service";
import {SolicSeparaSolicitaca} from "../_services/solic-separa-solicitaca";
import {TSMap} from "typescript-map";
import {ArquivoInterface} from "../../arquivo/_models";
import {SolicListarI} from "../_models/solic-listar-i";
import {VersaoService} from "../../_services/versao.service";

applyPlugin(jsPDF);

/*interface jsPDFCustom {
}*/

@Component({
  selector: 'app-solic-detalhe',
  templateUrl: './solic-detalhe.component.html',
  styleUrls: ['./solic-detalhe.component.css']
})
export class SolicDetalheComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('dtlh', { static: true }) dtlh:TemplateRef<any>;
  @Input() solicitacao: SolicListarI;
  @Output() hideDetalhe = new EventEmitter<boolean>();

  private campos: string[] = [];
  private alturas: number[] = [];
  private larguras: number[] = [];
  public textoEditor = false;
  impressao = false;
  detalhe:  SolicDetalheI;
  sol: SolicListarI;

  z = 0;
  w = 0;
  // arquivoOficio: TSMap<number, ArquivoInterface[]>;

  titulos: TSMap<string, TSMap<string, string>>;
  public detalhes = new TSMap<string, string[] | string[][]>();

  constructor (
    private vref: ViewContainerRef,
    public aut: AuthenticationService,
    public ss: SolicService,
    public vs: VersaoService

  ) {
    console.log('sol', this.sol);
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.solicitacao) {
      this.sol = changes.solicitacao.currentValue;
      this.vref.createEmbeddedView(this.dtlh);
    }
  }

  ngOnInit() {
    console.log('ngOnInit');
    // this.arquivoOficio = this.getArquivos();
  }

  getArquivos(): TSMap<number, ArquivoInterface[]> {
    let af = new TSMap<number, ArquivoInterface[]>();
    if (this.detalhe.arquivos) {
      const arqt: ArquivoInterface[]  = this.detalhe.arquivos.filter( a =>  a.arquivo_modulo === 'oficio');
      if (arqt.length > 0) {
        this.detalhe.oficio.forEach(b => {
          const arqt2 = arqt.filter(a => a.arquivo_registro_id === b.oficio_id);
          if (arqt2.length > 0) {
            af.set(b.oficio_id, arqt2);
          }
        });
        return af;
      } else {
        return af.set(0,[]);
      }
    } else {
      return af.set(0,[]);
    }
  }

  botoesVF(ev: boolean){

  }




  /*montaDetalhes(): TSMap<string, string[] | string[][]> {
    let t = new SolicSeparaSolicitaca(
      this.detalhe,
      [
        'solicitacao',
        'cadastro',
        'historico_solicitacao',
        'processo',
        'oficio',
        'historico_processo'
      ],
      [
        'vertical',
        'vertical',
        'horizontal',
        'vertical',
        'vertical',
        'horizontal'
      ],
      this.ss.tabela.titulos,
      [
        'solicitacao_descricao',
        'solicitacao_aceita_recusada',
        'solicitacao_carta',
        'historico_andamento',
        'oficio_descricao_acao'
      ],
      [
        true,
        true,
        true,
        false,
        true
      ]
      );
    return t.getSeparaSolicitacao();
  }*/

  /*montagem() {
    const k: string[] = Object.keys(this.solicitacao_titulo);
    const t: string[] = Object.values(this.solicitacao_titulo);
    const s: string[] = Object.keys(this.solicitacao);
    const v: any[] = Object.values(this.solicitacao);
  }*/


  /*ngOnInit() {
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
  }*/


  getPdf(aa) {}

  fechar() {
    this.hideDetalhe.emit(true);
  }

  /*getPdf (imprimir = false) {

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
    doc.text('SOLICITAÇÃO', 15, 15);
    doc.setFontSize(10);

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

    autoTable(doc, {
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
      bodyStyles: { fillColor: 255, textColor: 80, fontStyle: 'normal', lineWidth: 0.1 },
      didDrawPage: (d) => {
        linha = d.cursor.y;
      },
    });

    doc.setPage(pageNumber);
    doc.setFontSize(10);


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


    if (this.vinculos) {
      if (this.solDetalhe.processo_num.length > 0) {
        linha += 8;
        const txtpro = 'Esta solicitaçãoo está vinculada ao processo ' + this.processo_num + '.';
        doc.text(txtpro, 15, linha);
      }
      if (this.solDetalhe.oficio_num.length > 0) {
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
      this.processo.forEach( p => {
        pc.push([p.processo_numero, p.processo_status_nome]);
      })
      doc.text('PROCESSO - Esta solicitação está vinculada ao seguinte processo.', 15, linha);
      linha += 2;
      autoTable(doc, {
        columns: colums3,
        body: pc,
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
      this.oficio.forEach( p => {
        oficio.push([p.oficio_status, p.oficio_codigo, p.oficio_numero, p.oficio_data_emissao, p.oficio_orgao_solicitado_nome]);
      });

      doc.text('OFÍCIO(S) - Esta solicitação está vinculada ao(s) seguinte(s) ofício(s).', 15, linha);
      linha += 2;
      autoTable(doc, {
        columns: colums4,
        body: oficio,
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
          doc = null;
        } else {
          const a: string = doc.output('bloburi').toString();
          window.open(a);
          doc.autoPrint();
          doc = null;
        }
      }, tempo);
    });
  }*/

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
