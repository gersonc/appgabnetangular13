import {Component, OnInit} from '@angular/core';
import * as quillToWord from "quill-to-word";
import {saveAs} from "file-saver";
import {CelulaService} from "../../_services/celula.service";
import { pdfExporter } from 'quill-to-pdf';
import * as printJS from 'print-js';
import {nomeArquivo} from "../functions/nome-arquivo";
// import {Configuration} from "print-js";

@Component({
  selector: 'app-exporter-texto',
  templateUrl: './exporter-texto.component.html',
  styleUrls: ['./exporter-texto.component.css']
})
export class ExporterTextoComponent implements OnInit {
  readOnly = false;

  constructor(
    public cs: CelulaService
  ) { }

  ngOnInit(): void {
  }

  escondeTexto() {
    this.cs.fecharTexto();
  }

  async exportWord(dt:any) {
    const quillToWordConfig = {
      exportAs: 'blob'
    };
    // @ts-ignore
    const docAsBlob: Blob = await quillToWord.generateWord(dt, quillToWordConfig);
    saveAs(docAsBlob, nomeArquivo('docx', this.cs.modulo));
  }

  async exportPdf(dt: any) {
    const pdfAsBlob = await pdfExporter.generatePdf(dt); // converts to PDF
    saveAs(pdfAsBlob, nomeArquivo('pdf', this.cs.modulo)); // downloads from the browser
  }

  imprimir() {
    const css: string[] = [
      'assets/css/impressao.css',
      'assets/css/quill/quill.core.css',
      'assets/css/quill/quill.bubble.css',
      'assets/css/quill/quill.snow.css'
    ]
    let cfg: printJS.Configuration = {
      printable: this.cs.celula.cphtml,
      css: css,
      documentTitle: this.cs.celula.header,
      header: this.cs.modulo,
      repeatTableHeader: false,
      scanStyles: false,
      showModal: false,
      type: 'raw-html'
    };
    printJS(cfg);
  }


}
