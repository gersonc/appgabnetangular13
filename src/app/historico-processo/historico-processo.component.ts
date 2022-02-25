import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-historico-processo',
  templateUrl: './historico-processo.component.html',
  styleUrls: ['./historico-processo.component.css']
})
export class HistoricoProcessoComponent implements OnInit, OnChanges {
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
    if (changes.acao) {
      const a = changes.acao.currentValue;
      if (a === 'incluir') {
        this.ac = 'form'
      }
    }
    if (changes.classeStylos) {
      this.estilo = changes.classeStylos.currentValue;
    }
    if (changes.dados) {
      this.valores = changes.dados.currentValue;
    }
  }

}
