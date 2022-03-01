import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-historico-solocitacao',
  templateUrl: './historico-solocitacao.component.html',
  styleUrls: ['./historico-solocitacao.component.css']
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
    }
    if (changes.classeStylos) {
      this.estilo = changes.classeStylos.currentValue;
    }
    if (changes.dados) {
      console.log('changes.dados1', changes.dados.currentValue);
      this.valores = changes.dados.currentValue;
    }
  }

}
