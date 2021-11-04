import {Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import { CadastroInterface } from '../_models';
import {
  CadastroDetalheCompletoInterface,
  CadastroOficioOrgaoProtocolanteInterface, CadastroOficioOrgaoProtocolanteNumInterface,
  CadastroOficioOrgaoSolicitadoInterface, CadastroOficioOrgaoSolicitadoNumInterface,
  CadastroOficioResponsavelInterface, CadastroOficioResponsavelNumInterface,
  CadastroProcessoInterface, CadastroProcessoNumInterface,
  CadastroSolicitacaoInterface, CadastroSolicitacaoNumInterface
} from '../_models';
import { AuthenticationService } from '../../_services';
// import { jsPDF } from "jspdf";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import { applyPlugin, UserOptions } from 'jspdf-autotable';
applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}

@Component ({
  selector: 'app-cadastro-detalhe',
  templateUrl: './cadastro-detalhe.component.html',
  styleUrls: ['./cadastro-detalhe.component.css']
})

export class CadastroDetalheComponent implements OnInit, OnChanges {
  @Input() dataDetalhe: any;
  @Output() onFechar = new EventEmitter<any>();
  @ViewChild('tabcadastro', { static: true }) tabcadastro: ElementRef;
  public ht: any;
  private dados: CadastroDetalheCompletoInterface;
  public cadastro: CadastroInterface = null;
  public solicitacao: CadastroSolicitacaoInterface[] = null;
  public processo: CadastroProcessoInterface[] = null;
  public oficio_orgao_solicitado: CadastroOficioOrgaoSolicitadoInterface[] = null;
  public oficio_orgao_protocolante: CadastroOficioOrgaoProtocolanteInterface[] = null;
  public oficio_cadastro_responsavel: CadastroOficioResponsavelInterface[] = null;
  public erro: any[] = null;
  public solicitacao_num: CadastroSolicitacaoNumInterface[] = null;
  public processo_num: CadastroProcessoNumInterface[] = null;
  public oficio_orgao_solicitado_num: CadastroOficioOrgaoSolicitadoNumInterface[] = null;
  public oficio_orgao_protocolante_num: CadastroOficioOrgaoProtocolanteNumInterface[] = null;
  public oficio_cadastro_responsavel_num: CadastroOficioResponsavelNumInterface[] = null;
  public cadastro_titulo: any[];
  public solicitacao_titulo: any[];
  public processo_titulo: any[];
  public oficio_orgao_solicitado_titulo: any[];
  public oficio_orgao_protocolante_titulo: any[];
  public oficio_cadastro_responsavel_titulo: any[];
  public vinculos = false;

  constructor (
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit () {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataDetalhe) {
      if (changes.dataDetalhe.currentValue !== null) {
        this.dados = changes.dataDetalhe.currentValue;
        this.carregaDados();
      }
    }
  }

  carregaDados() {
    this.cadastro = this.dados.cadastro;
    this.cadastro_titulo = this.dados.cadastro_titulo;
    if (this.authenticationService.solicitacao_listar && this.dados.solicitacao.length > 0) {
      this.solicitacao = this.dados.solicitacao;
      this.solicitacao_titulo = this.dados.solicitacao_titulo;
    }
    if (this.authenticationService.processo_listar && this.dados.processo.length > 0) {
      this.processo = this.dados.processo;
      this.processo_titulo = this.dados.processo_titulo;
    }
    if (this.authenticationService.oficio_vizualizar && this.dados.oficio_orgao_solicitado.length > 0) {
      this.oficio_orgao_solicitado = this.dados.oficio_orgao_solicitado;
      this.oficio_orgao_solicitado_titulo = this.dados.oficio_orgao_solicitado_titulo;
    }
    if (this.authenticationService.oficio_vizualizar && this.dados.oficio_orgao_protocolante.length > 0) {
      this.oficio_orgao_protocolante = this.dados.oficio_orgao_protocolante;
      this.oficio_orgao_protocolante_titulo = this.dados.oficio_orgao_protocolante_titulo;
    }
    if (this.authenticationService.oficio_listar && this.dados.oficio_cadastro_responsavel.length > 0) {
      this.oficio_cadastro_responsavel = this.dados.oficio_cadastro_responsavel;
      this.oficio_cadastro_responsavel_titulo = this.dados.oficio_cadastro_responsavel_titulo;
    }

    if (this.dados.solicitacao_num.length > 0 ||
      this.dados.processo_num.length > 0 ||
      this.dados.oficio_orgao_solicitado_num.length > 0 ||
      this.dados.oficio_orgao_protocolante_num.length > 0 ||
      this.dados.oficio_cadastro_responsavel_num.length > 0) {
      this.vinculos = true;
      if (this.dados.solicitacao_num) {
        if (this.dados.solicitacao_num.length > 0) {
          this.solicitacao_num = this.dados.solicitacao_num;
        }
      }
      if (this.dados.processo_num) {
        if (this.dados.processo_num.length > 0) {
          this.processo_num = this.dados.processo_num;
        }
      }
      if (this.dados.oficio_orgao_solicitado_num) {
        if (this.dados.oficio_orgao_solicitado_num.length > 0) {
          this.oficio_orgao_solicitado_num = this.dados.oficio_orgao_solicitado_num;
        }
      }
      if (this.dados.oficio_orgao_protocolante_num) {
        if (this.dados.oficio_orgao_protocolante_num.length > 0) {
          this.oficio_orgao_protocolante_num = this.dados.oficio_orgao_protocolante_num;
        }
      }
      if (this.dados.oficio_cadastro_responsavel_num) {
        if (this.dados.oficio_cadastro_responsavel_num.length > 0) {
          this.oficio_cadastro_responsavel_num = this.dados.oficio_cadastro_responsavel_num;
        }
      }
    }
    if (this.dados.erro) {
      this.erro = this.dados.erro;
    }
  }

  getPdf (imprimir: boolean) {

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
    const head2 = [['Cadastro', '']];

    autoTable(doc, {
      head: head2,
      body: cadastro,
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

    if (this.vinculos) {
      if (this.dados.solicitacao_num.length > 0) {
        linha += 8;
        const txtsol = 'Este cadastro está vinculado a ' + this.solicitacao_num + ' solicitação(ões).';
        doc.text(txtsol, 15, linha);
      }
      if (this.dados.processo_num.length > 0) {
        linha += 8;
        const txtpro = 'Este cadastro está vinculado a ' + this.processo_num + ' processo(s).';
        doc.text(txtpro, 15, linha);
      }
      if (this.dados.oficio_orgao_solicitado_num.length > 0) {
        linha += 8;
        const txt1 = 'Este cadastro é orgão solicitado de ' + this.oficio_orgao_solicitado_num + ' ofício(s).';
        doc.text(txt1, 15, linha);
      }
      if (this.dados.oficio_orgao_protocolante_num.length > 0) {
        linha += 8;
        const txt2 = 'Este cadastro é orgão protocolante de ' + this.oficio_orgao_protocolante_num + ' ofício(s).';
        doc.text(txt2, 15, linha);
      }
      if (this.dados.oficio_cadastro_responsavel_num.length > 0) {
        linha += 8;
        const txt3 = 'Este cadastro é responsável de ' + this.oficio_cadastro_responsavel_num + ' ofício(s).';
        doc.text(txt3, 15, linha);
      }
    }

    if (this.solicitacao) {
      linha += 12;
      doc.text ('SOLICITAÇÕES - Este cadastro possui a(s) sequinte(s) solicitação(ões).', 15, linha);
      linha += 2;
      const colums0: ColumnsInterface[] = [];
      const t: string[] = Object.keys (this.solicitacao_titulo);
      const v: string[] = Object.values (this.solicitacao_titulo);
      for (let i = 0; i < t.length; i++) {
        colums0.push ({
          header: v[i],
          dataKey: t[i]
        });
      }

      let solpdf: any[] = [];
      this.solicitacao.forEach( s => {
        solpdf.push([s.solicitacao_data, s.solicitacao_assunto_nome, s.solicitacao_posicao]);
      } );

      autoTable (doc,{
        columns: colums0,
        body: solpdf,
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

    if (this.processo) {
      linha += 12;
      const colums1: ColumnsInterface[] = [];
      const t: string[] = Object.keys (this.processo_titulo);
      const v: string[] = Object.values (this.processo_titulo);
      for (let i = 0; i < t.length; i++) {
        colums1.push ({
          header: v[i],
          dataKey: t[i]
        });
      }

      let pc: any[] = [];
      this.processo.forEach( p => {
        pc.push([p.processo_numero, p.processo_status, p.solicitacao_assunto_nome]);
      })


      doc.text ('PROCESSOS - Este cadastro está incluido ao(s) seguinte(s) processo(s).', 15, linha);
      linha += 2;
      autoTable (doc, {
        columns: colums1,
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

    if (this.oficio_orgao_solicitado) {
      linha += 12;
      const colums2: ColumnsInterface[] = [];
      const t: string[] = Object.keys (this.oficio_orgao_solicitado_titulo);
      const v: string[] = Object.values (this.oficio_orgao_solicitado_titulo);
      for (let i = 0; i < t.length; i++) {
        colums2.push ({
          header: v[i],
          dataKey: t[i]
        });
      }

      let ors: any[] = [];
      this.oficio_orgao_solicitado.forEach( o => {
        ors.push([o.oficio_id, o.oficio_codigo, o.oficio_numero, o.oficio_data_emissao, o.oficio_status, o.oficio_cadastro_nome]);
      });

      doc.text ('OFÍCIO(S) - Este cadastro é o orgão solicitado do(s) seguinte(s) ofício(s).', 15, linha);
      linha += 2;
      autoTable (doc,{
        columns: colums2,
        body: ors,
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

    if (this.oficio_orgao_protocolante) {
      linha += 12;
      const colums3: ColumnsInterface[] = [];
      const t: string[] = Object.keys (this.oficio_orgao_protocolante_titulo);
      const v: string[] = Object.values (this.oficio_orgao_protocolante_titulo);
      for (let i = 0; i < t.length; i++) {
        colums3.push ({
          header: v[i],
          dataKey: t[i]
        });
      }

      let oop: any[] = [];
      this.oficio_orgao_protocolante.forEach( o => {
        oop.push([o.oficio_id, o.oficio_codigo, o.oficio_numero, o.oficio_data_emissao, o.oficio_status, o.oficio_cadastro_nome]);
      });


      doc.text ('OFÍCIO(S) - Este cadastro é o orgão protocolante do(s) seguinte(s) ofício(s).', 15, linha);
      linha += 2;
      autoTable (doc,{
        columns: colums3,
        body: oop,
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

    if (this.oficio_cadastro_responsavel) {
      linha += 12;
      const colums4: ColumnsInterface[] = [];
      const t: string[] = Object.keys (this.oficio_cadastro_responsavel_titulo);
      const v: string[] = Object.values (this.oficio_cadastro_responsavel_titulo);
      for (let i = 0; i < t.length; i++) {
        colums4.push ({
          header: v[i],
          dataKey: t[i]
        });
      }

      let ocr: any[] = [];
      this.oficio_cadastro_responsavel.forEach(o => {
        ocr.push([o.oficio_id, o.oficio_codigo, o.oficio_numero, o.oficio_data_emissao, o.oficio_status, o.oficio_orgao_solicitado_nome]);
      })

      doc.text ('OFÍCIO(S) - Este cadastro é o responável pelo(s) seguinte(s) ofício(s).', 15, linha);
      linha += 2;
      autoTable (doc,{
        columns: colums4,
        body: ocr,
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

    const nome = this.cadastro.cadastro_nome.replace (' ', '_').toLowerCase ();
    const fileName = `cadastro_${nome}_${new Date ().getTime ()}.pdf`;
    if (!imprimir) {
      doc.save (fileName);
    }
    if (imprimir) {
      const a: string = doc.output('bloburi').toString();
      window.open(a);
      doc.autoPrint();
    }
    doc = null;
  }

  fechar () {
    this.onFechar.emit({acao: 'detalhe'});
  }

}
