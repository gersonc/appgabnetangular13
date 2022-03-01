import {Component, Input, OnInit} from '@angular/core';
import {SolicitacaoHistoricoInterface} from "../../solocitacao/_models";
import {AuthenticationService} from "../../_services";

@Component({
  selector: 'app-histrorico-solocitacao-detalhe',
  templateUrl: './histrorico-solocitacao-detalhe.component.html',
  styleUrls: ['./histrorico-solocitacao-detalhe.component.css']
})
export class HistroricoSolicitacaoDetalheComponent implements OnInit {
  @Input() historicos: SolicitacaoHistoricoInterface[];

  constructor(
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  escolheCampos(h: SolicitacaoHistoricoInterface): number {
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
