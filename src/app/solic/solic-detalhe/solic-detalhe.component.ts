import {
  AfterViewInit,
  Component, ElementRef,
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
} from "../../_services";

// import html2canvas from "html2canvas";
// import {SolicDetalheI} from "../_models/solic-detalhe-i";

import {jsPDF} from "jspdf";
import autoTable, {applyPlugin} from "jspdf-autotable";
import {SolicService} from "../_services/solic.service";
import {TSMap} from "typescript-map";
import {ArquivoInterface} from "../../arquivo/_models";
import {SolicListarI} from "../_models/solic-listar-i";
import {VersaoService} from "../../_services/versao.service";
import {nomeArquivo} from "../../shared/functions/nome-arquivo";

/*

applyPlugin(jsPDF);

interface jsPDFCustom {
}
*/

@Component({
  selector: 'app-solic-detalhe',
  templateUrl: './solic-detalhe.component.html',
  styleUrls: ['./solic-detalhe.component.css']
})
export class SolicDetalheComponent implements OnInit {
  // @ViewChild('dtlh', { static: true }) dtlh:TemplateRef<any>;
  @ViewChild('detsolicitacao', { static: false }) el!: ElementRef;
  @ViewChild('detalhesolicitacao', { static: false }) detalhesolicitacao: ElementRef;
  @Input() sol: SolicListarI;
  @Output() hideDetalhe = new EventEmitter<boolean>();

  // private campos: string[] = [];
  // private alturas: number[] = [];
  // private larguras: number[] = [];
  // public textoEditor = false;
  impressao = false;
  // detalhe:  SolicDetalheI;

  // z = 0;
  // w = 0;

  // titulos: TSMap<string, TSMap<string, string>>;
  // public detalhes = new TSMap<string, string[] | string[][]>();

  constructor (
    public aut: AuthenticationService,
    public ss: SolicService,
    public vs: VersaoService

  ) { }


  ngOnInit() {
  }

/*  getArquivos(): TSMap<number, ArquivoInterface[]> {
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
  }*/


// Todo -- Terminas o PDF e criar Fábrica de Pdf - configurar gravação do vome do arquivo pdf

  getPdf4() {
    let titulos: any = this.ss.getTudo();
    console.log(titulos);


    let doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );

    autoTable(doc, {
      columns: [{header: 'field', dataKey: 'field'},{header: 'mtitulo', dataKey: 'mtitulo'},{header: 'titulo', dataKey: 'titulo'}],
      body: titulos.t,
      styles: { cellPadding: 0.5, fontSize: 8},
      theme: 'grid'
    });

    doc.save('table.pdf');
    // @ts-ignore
    doc = null;

  }


  getPdf3() {
    let tableElements: HTMLCollectionOf<Element> = document.getElementsByClassName('tabela');

    if (tableElements.length > 0) {
      let doc = new jsPDF (
        {
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );

      Array.from(tableElements).forEach(function(element: HTMLTableElement) {
        autoTable(doc, {
          html: element,
          headStyles: {
            fillColor: '#007bff',
            textColor: '#ffffff',
            halign: 'center',
            fontSize: 10,
            fontStyle: 'bold',
            lineWidth: 0.2
          },
        })
      });

      doc.save('teste.pdf');

    }
  }



  getPdf2() {
    let tableElements: HTMLCollectionOf<Element> = document.getElementsByClassName('tabela');
    if (tableElements) {
      console.log('n tbls', tableElements.length);
      console.log('n tbls', tableElements);
    }

    if (tableElements.length > 0) {
      let doc = new jsPDF (
        {
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );

      Array.from(tableElements).forEach(function(element: HTMLTableElement) {
        autoTable(doc, {
          html: element,
          headStyles: {
            fillColor: '#007bff',
            textColor: '#ffffff',
            halign: 'center',
            fontSize: 10,
            fontStyle: 'bold',
            lineWidth: 0.2
          },
        })
        // doc.addPage();
      });

      doc.save(nomeArquivo('pdf', 'solicitacao_detalhe'));

    }
  }




  getPdf(aa) {
    let doc = new jsPDF (
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );

    autoTable(doc, {
      html: this.el.nativeElement,
      headStyles: {
        fillColor: '#007bff',
        textColor: '#ffffff',
        halign: 'center',
        fontSize: 10,
        fontStyle: 'bold',
        lineWidth: 0.2
      },
      bodyStyles: {lineWidth: 0.2, fontStyle: 'bold', valign: "middle", cellPadding: [0.7, 1.5, 0.7, 1.5]},
      columnStyles: {0: {cellWidth: 35, fontStyle: 'normal', halign: "right", valign: "middle"}},
    })
    doc.save('teste.pdf');

  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

}
