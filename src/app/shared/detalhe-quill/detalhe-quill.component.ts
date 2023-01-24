import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DetalheQuillI} from "./detalhe-quill-i";
import {Stripslashes} from "../functions/stripslashes";

@Component({
  selector: 'app-detalhe-quill',
  template:
    `<ng-container *ngIf="txt.length <= 80">
      <div class="white-space-nowrap overflow-hidden white-space-nowrap text-overflow-ellipsis">{{txt}}</div>
    </ng-container>
    <ng-container *ngIf="txt.length > 80">
      <div class="mostratexto  white-space-nowrap overflow-hidden white-space-nowrap text-overflow-ellipsis" (click)="mostraTexto()">{{txt}}</div>
    </ng-container>
    <ng-container *ngIf="showCampoTexto">
      <p-dialog
        [breakpoints]="{'1400px': '80vw', '1300px': '85vw', '1200px': '90vw', '1000px': '95vw', '640px': '100vw'}"
        [(visible)]="showCampoTexto"
        [dismissableMask]="true"
        [modal]="true"
        styleClass="tablistagem"
        [header]="detalhe.titulo"
        (onHide)="escondeTexto()"
      >
        <quill-view [content]="stripslashes(htm)" [format]="'html'" theme="snow"></quill-view>
        <p-footer>
          <button pButton type="button" label="Fechar " icon="pi pi-times" class="campo-extendido p-button-rounded p-button-sm" (click)="escondeTexto()"></button>
        </p-footer>
      </p-dialog>
    </ng-container>`
})
export class DetalheQuillComponent implements OnInit, OnChanges {
  @Input() detalhe?: DetalheQuillI | null;
  titulo?: any;
  txt = '';
  htm = '';
  showCampoTexto = false;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.detalhe.currentValue !== undefined && changes.detalhe.currentValue !== null) {
        if (this.detalhe.htm !== undefined && this.detalhe.htm !== null) {
          this.htm = Stripslashes(this.detalhe.htm);
          if (this.detalhe.txt === undefined && false) {
            this.txt = Stripslashes(this.detalhe.htm).substr(0, 100);
          }
        }
        if (this.detalhe.txt !== undefined && this.detalhe.txt !== null) {
          this.txt = this.detalhe.txt.substr(0, 100);
        }
      }
    }
  }

  mostraTexto() {
    console.log(this.htm, this.detalhe);
    this.showCampoTexto = true;
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  escondeTexto() {
    this.showCampoTexto = false;
  }

}
