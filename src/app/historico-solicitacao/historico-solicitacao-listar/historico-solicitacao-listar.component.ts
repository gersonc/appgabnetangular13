import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-historico-solicitacao-listar',
  templateUrl: './historico-solicitacao-listar.component.html',
  styleUrls: ['./historico-solicitacao-listar.component.css']
})
export class HistoricoSolicitacaoListarComponent implements OnInit, OnChanges {

  @Input() dados: any[];


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

}
