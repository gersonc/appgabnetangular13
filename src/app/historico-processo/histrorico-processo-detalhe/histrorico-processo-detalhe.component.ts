import {Component, Input, OnInit} from '@angular/core';
import {ProcessoHistoricoInterface} from "../../processo/_models";
import {AuthenticationService} from "../../_services";

@Component({
  selector: 'app-histrorico-processo-detalhe',
  templateUrl: './histrorico-processo-detalhe.component.html',
  styleUrls: ['./histrorico-processo-detalhe.component.css']
})
export class HistroricoProcessoDetalheComponent implements OnInit {
  @Input() historicos: ProcessoHistoricoInterface[];
  formato: 'object' | 'html' | 'text' | 'json' = 'object';


  constructor(
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
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

  escolheCampos(h: ProcessoHistoricoInterface): number {
    if (h.historico_andamento_delta !== null) {
      return 1
    }
    if (h.historico_andamento !== null) {
      return 2
    }
    if (h.historico_andamento_texto !== null) {
      return 3
    }
    return 0
  }

  transforma(str) {
    return JSON.parse(str);
  }

  onExluir(ev: number) {
    this.historicos.splice(ev, 1);
  }

}
