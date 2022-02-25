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
  estilo = 'tabelacomponent';


  constructor() {
    this.his = this.transformaDados(this.dados);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dados) {
      this.his = [...this.transformaDados(changes.dados.currentValue)];
    }
    if (changes.classeStylos) {
      this.estilo = changes.classeStylos.currentValue;
    }
  }

  escolheTipo(h: any | null): Boolean | ProcessoHistoricoInterface {
    if (h) {
      let hi: ProcessoHistoricoInterface = h;
      if (hi.historico_andamento_delta) {
        hi.historico_andamento_texto = null;
        hi.historico_andamento = hi.historico_andamento_delta;
        hi.historico_andamento_delta = null;
        return hi;
      }
      if (hi.historico_andamento) {
        hi.historico_andamento_texto = null;
        hi.historico_andamento_delta = null;
        return hi;
      }
      if (hi.historico_andamento_texto) {
        hi.historico_andamento = hi.historico_andamento_texto;
        hi.historico_andamento_delta = null;
        hi.historico_andamento_texto = null;
        return hi;
      }
      return hi;
    }
    return false;
  }

  transformaDados(dados: any[]): ProcessoHistoricoInterface[] {
    if (dados) {
      if (dados.length === 0) {
        return null;
      }
      let re: ProcessoHistoricoInterface[] = [];
      dados.forEach(value => {
        if (this.escolheTipo(value)) {
          re.push(<ProcessoHistoricoInterface>this.escolheTipo(value));
        }
      });
      if (re.length > 0) {
        return re;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

}
