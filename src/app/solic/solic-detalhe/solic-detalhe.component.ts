import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthenticationService,} from "../../_services";
import {SolicService} from "../_services/solic.service";
import {SolicListarI} from "../_models/solic-listar-i";
import {VersaoService} from "../../_services/versao.service";

@Component({
  selector: 'app-solic-detalhe',
  templateUrl: './solic-detalhe.component.html',
  styleUrls: ['./solic-detalhe.component.css']
})
export class SolicDetalheComponent implements OnInit {
  @ViewChild('detsolicitacao', {static: false}) el!: ElementRef;
  @ViewChild('detalhesolicitacao', {static: false}) detalhesolicitacao: ElementRef;
  @Input() sol: SolicListarI;
  @Output() hideDetalhe = new EventEmitter<boolean>();

  impressao = false;

  constructor(
    public aut: AuthenticationService,
    public ss: SolicService,
    public vs: VersaoService
  ) {
  }


  ngOnInit() {
  }

  fechar() {
    this.hideDetalhe.emit(true);
  }


  /*getPdf4() {
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
      columns: [{header: 'field', dataKey: 'field'}, {header: 'mtitulo', dataKey: 'mtitulo'}, {
        header: 'titulo',
        dataKey: 'titulo'
      }],
      body: titulos.t,
      styles: {cellPadding: 0.5, fontSize: 8},
      theme: 'grid'
    });

    doc.save('table.pdf');
    // @ts-ignore
    doc = null;

  }*/

/*  getPdf3() {
    let tableElements: HTMLCollectionOf<Element> = document.getElementsByClassName('tabela');

    if (tableElements.length > 0) {
      let doc = new jsPDF(
        {
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );

      Array.from(tableElements).forEach(function (element: HTMLTableElement) {
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
      let doc = new jsPDF(
        {
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true
        }
      );

      Array.from(tableElements).forEach(function (element: HTMLTableElement) {
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
    let doc = new jsPDF(
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

  }*/



}
