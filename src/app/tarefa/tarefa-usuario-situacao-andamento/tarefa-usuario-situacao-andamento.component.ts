import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TarefaI, TarefaUsuarioSituacaoAndamentoI} from "../_models/tarefa-i";
import {ColunasI} from "../../_models/colunas-i";
import {TarefaSituacaoService} from "../_services/tarefa-situacao.service";
import {AuthenticationService} from "../../_services";

@Component({
  selector: 'app-tarefa-usuario-situacao-andamento',
  templateUrl: './tarefa-usuario-situacao-andamento.component.html',
  styleUrls: ['./tarefa-usuario-situacao-andamento.component.css']
})
export class TarefaUsuarioSituacaoAndamentoComponent implements OnInit {
  @Input() tus: TarefaUsuarioSituacaoAndamentoI[] = [];
  @Input() exibirtus: boolean;
  @Input() index: number;
  @Input() tarefa?: TarefaI;
  @Output() exibirtusChange = new EventEmitter<boolean>();
  @Output() mostraForm = new EventEmitter<boolean>();

  selectedColumns: ColunasI[] = [];

  constructor(
    public tss: TarefaSituacaoService,
    public aut: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }


  alterarClick(tus) {
    if (this.tss.ddTarefa_situacao_id.length === 0) {
      this.tss.ddTarefa_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-tarefa_situacao'));
    }
    this.tss.tarefa = this.tarefa;
    this.tss.tus = tus;
    this.tss.usuario_id = +this.aut.usuario_id;
    this.tss.index = this.index;
    this.tss.exibir = true;
    this.mostraForm.emit(true);
  }


  rowColor(tus_situacao_id?: number): string | null {
    switch (tus_situacao_id) {
      case 1:
        return 'tstatus-1';
      case 2:
        return 'tstatus-2';
      case 3:
        return 'tstatus-3';
      case 4:
        return 'tstatus-4';
      default:
        return 'tstatus-0';
    }
  }

}
