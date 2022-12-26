import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Editor} from 'primeng/editor';
import { saveAs } from 'file-saver';
import * as quillToWord from 'quill-to-word';
import {Config} from 'quill-to-word';

export enum AlignmentType {
  START = 'start',
  END = 'end',
  CENTER = 'center',
  BOTH = 'both',
  JUSTIFIED = 'both',
  DISTRIBUTE = 'distribute',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum UnderlineType {
  SINGLE = 'single',
  WORDS = 'words',
  DOUBLE = 'double',
  THICK = 'thick',
  DOTTED = 'dotted',
  DOTTEDHEAVY = 'dottedHeavy',
  DASH = 'dash',
  DASHEDHEAVY = 'dashedHeavy',
  DASHLONG = 'dashLong',
  DASHLONGHEAVY = 'dashLongHeavy',
  DOTDASH = 'dotDash',
  DASHDOTHEAVY = 'dashDotHeavy',
  DOTDOTDASH = 'dotDotDash',
  DASHDOTDOTHEAVY = 'dashDotDotHeavy',
  WAVE = 'wave',
  WAVYHEAVY = 'wavyHeavy',
  WAVYDOUBLE = 'wavyDouble',
}

interface Configuration {
  paragraphStyles: {
    normal?: {  // this is the name of the text type that you'd like to style
      paragraph?: {
        spacing?: {
          line?: number;
          before?: number;
          after?: number;
        },
        alignment?: AlignmentType // from docx package
        indent?: {
          left?: number;
          hanging?: number;
          right?: number;
        }
      },
      run?: {
        font?: string;
        size?: number;
        bold?: boolean;
        color?: string; // as hex value e.g., ffaaff
        underline?: {
          type?: UnderlineType; // from docx package
          color?: string // just use 'auto'
        }
        italics?: boolean;
        highlight?: string; // must be named values accepted by Word, like 'yellow'
      }
    }
  };
}

@Component({
  selector: 'app-campo-editor',
  template: `
  <p-dropdown *ngIf="configuravelSV" [options]="modelos" [(ngModel)]="modeloSelecionado" (onChange)="onModelo($event)"></p-dropdown>
  <textarea
    *ngIf="!editor"
    #txt
    pInputTextarea
    [(ngModel)]="conteudo"
    [autoResize]="true"
    (blur)="onTextChange($event)"
    style="background-color: var(--formulario-bg-interno-color);border: .5rem solid var(--input-filled);"
  ></textarea>
  <div *ngIf="editor" class="formulario-quill">
    <button id="pdf-btn" (click)="exportWord(qill)">Download PDF</button>
    <p-editor
      #qill
      [(ngModel)]="conteudo"
      [modules]="toolbarEditor"
      (onTextChange)="onTextChange($event)"
      [ngClass]="estilo ? 'oficio' : ''"
    >
      <ng-template pTemplate="header"></ng-template>
    </p-editor>
  </div>`,
})
export class CampoEditorComponent implements OnInit, AfterViewInit {
  @Input() modelo = 'SIMPLES';
  @Input() campo_nome: string | undefined;
  @Input() label?: string;
  @Input() valor?: any = null;
  @Input() configuravelSV = false;
  @Output() resposta = new EventEmitter<any>();

  conteudo: any;
  modelos = ['SIMPLES', 'EDITOR', 'OFÍCIO'];
  modeloSelecionado = 'SIMPLES';
  estilo = false;
  editor = false;
  toolbarEditor = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{'header': 1}, {'header': 2}],               // custom button values
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
      [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
      [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
      // [{'color': []}, {'background': []}],          // dropdown with defaults from theme
      // [{'font': []}],
      // [{'align': []}],
      ['clean'],                                         // remove formatting button
      ['link']]
  };

  public quillInstance: any;
  private quillToWordConfig: Config = {
    exportAs: 'blob'
  };

    constructor(
  ) { }

  ngOnInit(): void {

    this.modeloSelecionado = this.modelo;
    if (this.valor) {
      this.conteudo = this.valor;
    }
  }



  onTextChange(ev: any) {
    this.resposta.emit(this.conteudo);
  }



  onModelo(ev: any) {
    switch (this.modeloSelecionado) {
      case 'SIMPLES':
        this.estilo = false;
        this.editor = false;
        break;
      case 'EDITOR':
        this.estilo = false;
        this.editor = true;
        break;
      case 'OFÍCIO':
        this.estilo = true;
        this.editor = true;
        break;
    }
  }

  async exportWord(ev: { getQuill: () => any; }) {

    const config: Config = {
      paragraphStyles: {
        header_1: {
          paragraph: {
            spacing: {
              before: 3000,
              after: 1500
            }
          },
          run: {
            size: 12,
            bold: false,
            color: 'ffffff'
          }
        }
      },
      exportAs: 'blob'
    };

    this.quillInstance = ev.getQuill();
    // Here is your export function
// Typically this would be triggered by a click on an export button

    const delta = this.quillInstance.getContents();

    const blob: any = await quillToWord.generateWord(delta, config);
    // const blob: any = await quillToWord.generateWord(delta, this.quillToWordConfig);
    saveAs(blob, 'word-export.docx');
  }

  ngAfterViewInit() {
    // viewChildren is set
  }



}
