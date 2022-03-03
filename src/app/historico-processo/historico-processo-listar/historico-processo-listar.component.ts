import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProcessoHistoricoInterface} from "../../processo/_models";

@Component({
  selector: 'app-historico-processo-listar',
  templateUrl: './historico-processo-listar.component.html',
  styleUrls: ['./historico-processo-listar.component.css']
})
export class HistoricoProcessoListarComponent implements OnInit, OnChanges {
  @Input() dados: any[];
  @Input() classeStylos?: string;
  his: ProcessoHistoricoInterface[];
  estilo = 'tablcomp';
  formato: 'object' | 'html' | 'text' | 'json' = 'object';

  constructor() {}


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dados) {
      this.his = [...changes.dados.currentValue];
    }
    if (changes.classeStylos) {
      this.estilo = changes.classeStylos.currentValue;
    }
  }

  escolheTipo(h: any | null): boolean {
    if (h) {
      let hi: ProcessoHistoricoInterface = h;
      if (hi.historico_andamento_delta) {
        this.formato = "object";
        return true;
      }
      if (hi.historico_andamento) {
        this.formato = 'html'
        return true;
      }
      if (hi.historico_andamento_texto) {
        this.formato = "text";
        return true;
      }
    } else {
      this.formato = 'json';
      return false;
    }
  }

  transforma(str) {
    return JSON.parse(str);
  }


}
