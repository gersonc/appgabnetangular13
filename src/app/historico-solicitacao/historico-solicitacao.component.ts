import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SolicitacaoHistoricoInterface} from "../solicitacao/_models";

@Component({
  selector: 'app-historico-solocitacao',
  templateUrl: './historico-solicitacao.component.html',
  styleUrls: ['./historico-solicitacao.component.css']
})
export class HistoricoSolicitacaoComponent implements OnInit, OnChanges {
  @Input() acao: string;
  @Input() dados: any[];
  @Input() classeStylos?: string;
  listar = 'listar';
  ac = '';
  valores: any[] = null;
  estilo: string = null;
  constructor() { }

  ngOnInit(): void {
    // this.ac = this.acao;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    if (changes.acao) {
      const a = changes.acao.currentValue;
      if (a === 'incluir') {
        this.ac = 'form'
      }
      if (a === 'detalhe') {
        this.ac = 'detalhe'
      }
      if (a === 'alterar') {
        this.ac = 'alterar'
      }
      if (a === 'excluir') {
        this.ac = 'excluir'
      }
    }
    if (changes.classeStylos) {
      this.estilo = changes.classeStylos.currentValue;
    }
    if (changes.dados) {
      console.log('changes.dados1', changes.dados.currentValue);
      this.valores = changes.dados.currentValue;
    }
  }

  onNovosDados(dados: SolicitacaoHistoricoInterface) {

  }

}
