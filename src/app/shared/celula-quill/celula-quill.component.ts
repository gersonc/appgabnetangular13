import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {CelulaQuillI} from "../../_models/celula-quill-i";
import {CAMPOSTEXTOS} from "../campo-extendido/constantes";
import {striptags} from "striptags";

@Component({
  selector: 'app-celula-quill',
  template:
    `<ng-container *ngIf="tipo === 1">
      {{cphtml}}
    </ng-container>

    <ng-container *ngIf="tipo === 2">
      <div class="p-text-nowrap p-text-truncate"><span class="celula-quill" (click)="mostraTexto()">{{txt}}</span></div>

      <ng-container *ngIf="showCampoTexto">
        <p-dialog
          [breakpoints]="{'1400px': '80vw', '1300px': '85vw', '1200px': '90vw', '1000px': '95vw', '640px': '100vw'}"
          [(visible)]="showCampoTexto"
          [dismissableMask]="true"
          [modal]="true"
          styleClass="tablistagem"
          [header]="titulo"
          (onHide)="escondeTexto()"
        >
          <app-quill-view [cpdelta]="cpdelta" [cphtml]="cphtml" class="detalhe"></app-quill-view>

          <p-footer>
            <button pButton type="button" label="Fechar " icon="pi pi-times"
                    class="campo-extendido p-button-rounded p-button-sm" (click)="escondeTexto()"></button>
            &nbsp;
            <button
              *ngIf="cpdelta"
              pButton
              type="button"
              class="campo-extendido p-button-rounded p-button-sm"
              icon="pi pi-book"
              (click)="exportWord()"
              label="Word"
            ></button>
          </p-footer>
        </p-dialog>
      </ng-container>
    </ng-container>`
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
        if (this.celula.linha !== undefined || this.celula.valor !== undefined) {

          if (this.celula.valor === null || CAMPOSTEXTOS.indexOf(this.celula.field) === -1 || this.getImpressao()) {
            if (this.celula.valor !== null && typeof this.celula.valor === 'string') {
              this.cphtml = striptags(this.celula.valor.substr(0, 200));
            } else {
              this.cphtml = this.celula.valor;
            }
            this.tipo = 1;
          } else {
            this.cphtml = this.celula.valor;
            this.tipo = this.chacaTipo();
          }
        }
      }
    }

  }

  getImpressao(): boolean {
    return (this.celula.impressao !== undefined && this.celula.impressao === true);
  }

  chacaTipo(): number {
    const s = this.celula.linha;
    type ObjectKey = keyof typeof s;
    const t = this.celula.field + '_texto' as ObjectKey;
    const u = s[t];
    if (u === undefined || u === null){
      if (this.celula.valor.length >= 100 && !this.getImpressao()) {
        this.txt = striptags(this.celula.valor.substr(0, 200));
        return 2;
      } else {
        this.cphtml = striptags(this.celula.valor.substr(0, 200));
        return 1;
      }
    }
    this.txt = u;
    if (u.length < 100 || this.getImpressao()) {
      this.cphtml = u;
      return 1;
    }

    if (!this.getImpressao()) {
      const v = this.celula.field + '_delta' as ObjectKey;
      const d = s[v];
      if (d === undefined || d === null) {
        return 2;
      } else {
        this.cpdelta = d;
        return 2;
      }
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
