import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {CelulaQuillI} from "../../_models/celula-quill-i";
import {CAMPOSTEXTOS} from "../campo-extendido/constantes";

@Component({
  selector: 'app-celula-quill',
  templateUrl: './celula-quill.component.html',
  styleUrls: ['./celula-quill.component.css']
})
export class CelulaQuillComponent implements OnInit, OnChanges, OnDestroy {
  @Input() celula: CelulaQuillI;
  tipo = 100;
  txt: string | null = null;
  cphtml: any = null;
  cpdelta: string | null = null;
  titulo: string | null = null;
  showCampoTexto = false;
  impressao = false;
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.celula.currentValue !== undefined && changes.celula.currentValue !== null) {
        const n = this.chacaTipo();
        if (!this.impressao) {
          this.tipo = n;
        } else {
          this.tipo = 1;
        }
      }
    }

  }

  chacaTipo(): number {
    if (this.celula.linha === undefined || this.celula.valor === undefined) {
      return 100;
    } else {
      if (this.celula.impressao === undefined || this.celula.impressao === true) {
        this.impressao = true;
      }
      this.cphtml = this.celula.valor;
    }
    if (this.celula.valor === null || CAMPOSTEXTOS.indexOf(this.celula.field) === -1) {
      return 1;
    }
    const s = this.celula.linha;
    type ObjectKey = keyof typeof s;
    const t = this.celula.field + '_texto' as ObjectKey;
    const u = s[t];
    if (u === undefined || u === null){
      if (this.celula.valor.length >= 100) {
        this.txt = this.celula.valor;
        return 2;
      } else {
        return 1;
      }
    }
    this.txt = u;
    if (u.length < 100 || this.impressao) {
      this.cphtml = u;
      return 1;
    }
    const v = this.celula.field + '_delta' as ObjectKey;
    const d = s[v];
    if (d === undefined || d === null) {
      return 2;
    } else {
      this.cpdelta = d;
      return 2;
    }
  }


  mostraTexto() {
    this.titulo = this.celula.header.toUpperCase();
    this.showCampoTexto = true;
  }

  escondeTexto() {
    this.showCampoTexto = false;
    this.titulo = null;
  }

  exportWord() {

  }


  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.showCampoTexto = false;
    this.titulo = null;
    this.cphtml = null;
    this.cpdelta = null;
    this.txt = null;
  }

}
