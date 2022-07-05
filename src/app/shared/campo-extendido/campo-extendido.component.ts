import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {passiveSupport} from 'passive-events-support/src/utils'
import {CampoExtendidoI} from "./campo-extendido-i";
import {CAMPOSCOMUNICACAO} from "../email-telefone-celular/email-telefone-celular-i";
import {CAMPOSTEXTOS} from "./constantes";
import {InOutCampoTextoI} from "../../_models/in-out-campo-texto";
import {saveAs} from 'file-saver';
import * as quillToWord from 'quill-to-word';

@Component({
  selector: 'app-campo-extendido',
  templateUrl: './campo-extendido.component.html',
  styleUrls: ['./campo-extendido.component.css']
})
export class CampoExtendidoComponent implements OnInit, OnChanges {
  @Input('campo-extendido') ce?: CampoExtendidoI;

  titulo?: string;
  field?: string;
  valor?: any;
  valorOriginal?;
  string = null;
  tipo = 100;
  cpdelta: string | null = null;
  cphtml: string | null = null;

  showCampoTexto = false;

  constructor() {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.ce) {
      if (changes.ce.currentValue !== undefined) {
        this.titulo = this.ce.titulo;
        this.field = this.ce.field;
        this.valor = this.ce.valor;
        this.valorOriginal = this.ce.valorOriginal;
        this.getDestino(this.ce.field);
      }
    }
    console.log('ps', passiveSupport({
      listeners: [
        {
          element: '.p-dialog',
          event: 'touchstart',
          prevented: true // (optional) will force { passive: false }
        },
        {
          element: '.p-dialog',
          event: 'touchmove'
        }
      ]
    }));
  }

  getDestino(field) {
    if (CAMPOSTEXTOS.indexOf(field) === -1 && CAMPOSCOMUNICACAO.indexOf(field) === -1) {
      if (this.ce.valorOriginal.length > 40) {
        this.tipo = 1;
      } else {
        this.tipo = 0;
      }
    }

    if (CAMPOSTEXTOS.indexOf(field) !== -1) {
      if (this.ce.valorOriginal.length < 41) {
        this.tipo = 0;
      } else {
        this.tipo = 1;
      }
    }

    if (CAMPOSCOMUNICACAO.indexOf(field) !== -1) {
      this.tipo = 2;
    }
  }

  mostraTexto() {
    const inOutCampoTexto: InOutCampoTextoI = this.ce.valor;
    if (inOutCampoTexto.format === 'json') {
      this.cpdelta = inOutCampoTexto.valor;
      this.cphtml = null;
    }
    if (inOutCampoTexto.format === 'html') {
      this.cphtml = inOutCampoTexto.valor;
      this.cpdelta = null;
    }

    if (inOutCampoTexto.format === undefined || (inOutCampoTexto.format !== 'html' && inOutCampoTexto.format !== 'json')) {
      this.cphtml = this.ce.valorOriginal;
      this.cpdelta = null;
    }

    this.showCampoTexto = true;
  }

  escondeTexto() {
    this.showCampoTexto = false;
    this.cphtml = null;
    this.cpdelta = null;
  }

  async exportWord() {
    console.log(this.cpdelta);
    let delta: any = JSON.parse(this.cpdelta);
    console.log(delta);
    const quillToWordConfig = {
      exportAs: 'blob'
    };
    // @ts-ignore
    const docAsBlob: Blob = await quillToWord.generateWord(delta, quillToWordConfig);
    const nome: string = `Gabnet_${this.titulo}_${new Date().getTime()}.docx`
    saveAs(docAsBlob, nome);
  }

  ngOnInit(): void {
  }

}
