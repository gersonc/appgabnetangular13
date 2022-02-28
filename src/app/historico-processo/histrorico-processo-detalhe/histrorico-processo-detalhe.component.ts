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

  constructor(
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
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

  onExluir(ev) {

  }

}
