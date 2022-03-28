import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../../_services";
import {SolicitacaoHistoricoInterface} from "../../solicitacao/_models";

@Component({
  selector: 'app-histrorico-solocitacao-detalhe',
  templateUrl: './histrorico-solicitacao-detalhe.component.html',
  styleUrls: ['./histrorico-solicitacao-detalhe.component.css']
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
