import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Stripslashes} from "../functions/stripslashes";
import {CpoEditor, InOutCampoTexto, InOutCampoTextoI} from "../../_models/in-out-campo-texto";
import {CampoQuillI} from "../../_models/campo-quill-i";

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

/*

  campo_html?: string;
  campo_delta?: any;
  campo_txt?: string;

*/

  readOnly = true;
  valor: string | null = null;
  valorKill: InOutCampoTextoI = null;
  format: 'html' | 'object' | 'text' | 'json' = 'html';

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.kill) {
        if (changes.kill.currentValue !== undefined) {
          this.kill.html = Stripslashes(this.kill.html);
          this.valorKill = InOutCampoTexto(this.kill.html, this.kill.delta);
          this.format = this.valorKill.format;
          this.valor = this.valorKill.valor;
        }
      }
  }

  ngOnInit(): void {
    console.log(this.kill, this.valorKill, this.format, this.valor);
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

}
