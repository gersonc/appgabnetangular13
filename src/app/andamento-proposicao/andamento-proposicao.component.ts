import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AndamentoProposicaoI} from "../proposicao/_models/andamento-proposicao-i";
import {AuthenticationService} from "../_services";
import {AndamentoProposicaoService} from "../proposicao/_services/andamento-proposicao.service";

@Component({
  selector: 'app-andamento-proposicao',
  templateUrl: './andamento-proposicao.component.html',
  styleUrls: ['./andamento-proposicao.component.css']
})
export class AndamentoProposicaoComponent implements OnInit {
  @Input() apListar?: AndamentoProposicaoI[];
  @Input() ap?: AndamentoProposicaoI;
  @Input() proposicaoId?: number;
  @Input() idx?: number;
  @Input() acao?: string;
  @Output() apListarChange = new EventEmitter<AndamentoProposicaoI[]>();
  @Output() apChange = new EventEmitter<AndamentoProposicaoI>();

  mostraSeletor = false;
  camposSelecionados: AndamentoProposicaoI[];
  cols: any[];
  selectedColumns: any[] = [];
  andamento_proposicao: AndamentoProposicaoI[]


    constructor(
    public asp: AndamentoProposicaoService,
    public aut: AuthenticationService,

  ) { }

  ngOnInit(): void {
  }

}
