import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SolicitacaoHistoricoInterface} from "../../solicitacao/_models";


@Component({
  selector: 'app-historico-solocitacao-listar',
  templateUrl: './historico-solocitacao-listar.component.html',
  styleUrls: ['./historico-solocitacao-listar.component.css']
})
export class HistoricoSolicitacaoListarComponent implements OnInit, OnChanges {
  @Input() dados: any[];
  @Input() classeStylos?: string;
  his: SolicitacaoHistoricoInterface[];
  estilo = 'tablcomp';


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

  escolheTipo(h: any | null): Boolean | SolicitacaoHistoricoInterface {
    if (h) {
      let hi: SolicitacaoHistoricoInterface = h;
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

  transformaDados(dados: any[]): SolicitacaoHistoricoInterface[] {
    if (dados) {
      if (dados.length === 0) {
        return null;
      }
      let re: SolicitacaoHistoricoInterface[] = [];
      dados.forEach(value => {
        if (this.escolheTipo(value)) {
          re.push(<SolicitacaoHistoricoInterface>this.escolheTipo(value));
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
