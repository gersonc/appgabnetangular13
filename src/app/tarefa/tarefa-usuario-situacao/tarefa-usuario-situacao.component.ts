import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TarefaI, TarefaUsuarioSituacaoI} from "../_models/tarefa-i";
import {TarefaSituacaoService} from "../_services/tarefa-situacao.service";
import {AuthenticationService} from "../../_services";

@Component({
  selector: 'app-tarefa-usuario-situacao',
  templateUrl: './tarefa-usuario-situacao.component.html',
  styleUrls: ['./tarefa-usuario-situacao.component.css']
})
export class TarefaUsuarioSituacaoComponent implements OnInit {
  @Input() tarefa?: TarefaI;
  @Input() tus: TarefaUsuarioSituacaoI[] = [];
  @Input() index?: number;
  @Output() mostraForm = new EventEmitter<boolean>();

  constructor(
    public tss: TarefaSituacaoService,
    public aut: AuthenticationService,
  ) {}

  ngOnInit(): void {}

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

}
