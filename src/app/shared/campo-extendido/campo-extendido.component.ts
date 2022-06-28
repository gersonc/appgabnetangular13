import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CampoExtendidoI} from "./campo-extendido-i";
import {CAMPOSCOMUNICACAO, getComunicacao} from "../email-telefone-celular/email-telefone-celular-i";
import {CAMPOSTEXTOS} from "./constantes";
import {InOutCampoTextoI} from "../../_models/in-out-campo-tezto";

@Component({
  selector: 'app-campo-extendido',
  templateUrl: './campo-extendido.component.html',
  styleUrls: ['./campo-extendido.component.css']
})
export class CampoExtendidoComponent implements OnInit, OnChanges {
  @Input() ce?: CampoExtendidoI;

  titulo?: string;
  field?: string;
  valor?: any;
  valorOriginal?; string = null;
  tipo = 100;
  cpdelta: string | null = null;
  cphtml: string | null = null;

  showCampoTexto = false;

  constructor() { }

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

  exportWord() {

  }

  ngOnInit(): void {
  }

}
