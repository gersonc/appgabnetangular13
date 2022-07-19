import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Stripslashes} from "../functions/stripslashes";
import {InOutCampoTexto, InOutCampoTextoI} from "../../_models/in-out-campo-texto";
import * as printJS from "print-js";
import * as quillToWord from "quill-to-word";
import {saveAs} from "file-saver";
import {nomeArquivo} from "../functions/nome-arquivo";
import {pdfExporter} from "quill-to-pdf";
import {QuillEditorComponent} from "ngx-quill";

interface KillI {
  html?: string | null;
  delta?: string | null;
}


@Component({
  selector: 'app-kill-view',
  templateUrl: './kill-view.component.html',
  styleUrls: ['./kill-view.component.css']
})
export class KillViewComponent implements OnInit, OnChanges {
  @Input() kill: KillI;
  @ViewChild('q', { static: false }) q!: QuillEditorComponent;

  botoes = false;
  editorAtivo = false;
  readOnly = true;
  valor: string | null = null;
  valorKill: InOutCampoTextoI = null;
  format: 'html' | 'object' | 'text' | 'json' = 'html';

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.print) {
        this.editorAtivo = !changes.print.currentValue;
      }
      if (changes.kill) {
        if (changes.kill.currentValue !== undefined) {
          this.kill.html = Stripslashes(this.kill.html);
          this.valorKill = InOutCampoTexto(this.kill.html, this.kill.delta);
          this.format = this.valorKill.format;
        }
      }
  }

  ngOnInit(): void {
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  imprimir() {
    const css: string[] = [
      'assets/css/impressao.css',
      'assets/css/quill/quill.core.css',
      'assets/css/quill/quill.bubble.css',
      'assets/css/quill/quill.snow.css'
    ]
    let cfg: printJS.Configuration = {
      printable: this.kill.html,
      css: css,
      repeatTableHeader: false,
      scanStyles: false,
      showModal: false,
      type: 'raw-html'
    };
    printJS(cfg);
  }

  getPdf() {
    this.editorAtivo = true;
    const e = this.q.quillEditor;

    console.log(e.getContents());
  }

  async exportWord(dt:any) {

    const quillToWordConfig = {
      paragraphStyles: {
        normal: {
          paragraph: {
            spacing: {
              line: 276,
              before: 0,
              after:0
            }
          },
          run: {
            size: 24
          }
        },
        header_1: {
          run: {
            font: 'Calibri',
            size: 30,
            bold: true
          },
          paragraph: {
            spacing: {
              before: 300,
              after: 200
            }
          }
        },
        header_2: {
          run: {
            font: 'Calibri',
            size: 26,
            bold: true
          },
          paragraph: {
            spacing: {
              before: 200,
              after: 100
            }
          }
        },
        list_paragraph: {
          run: {
            size: 24
          }
        },
        block_quote: {
          run: {
            italics: true
          },
          paragraph: {
            indent: { left: 440 },
          }
        },
        citation: {
          run: {
            size: 24
          },
          paragraph: {
            indent: {
              left: 0,
              hanging: 320
            },
            spacing: {
              line: 380
            }
          }
        },
        code_block: {
          run: {
            size: 14,
            font: 'Courier New'
          },
          paragraph: {
            indent: { left: 720, right: 720 }
          }
        }
      },
      exportAs: 'blob'
    };

    // @ts-ignore
    const docAsBlob: Blob = await quillToWord.generateWord(dt, quillToWordConfig);
    saveAs(docAsBlob, nomeArquivo('docx', 'GebNet'));
  }

  async exportPdf(dt: any) {
    const pdfAsBlob = await pdfExporter.generatePdf(dt); // converts to PDF
    saveAs(pdfAsBlob, nomeArquivo('pdf', 'GebNet')); // downloads from the browser
  }

  mouseenter() {
    this.editorAtivo = true;
  }

  mouseleave(){
    this.editorAtivo = false;
  }


}
