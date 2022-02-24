import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-historico-solicitacao',
  templateUrl: './historico-solicitacao.component.html',
  styleUrls: ['./historico-solicitacao.component.css']
})
export class HistoricoSolicitacaoComponent implements OnInit, OnChanges {
  @Input()  acao: string;
  @Input()  dados: any[];


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {}

}
