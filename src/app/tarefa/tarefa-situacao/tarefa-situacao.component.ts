import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TarefaI} from "../_models/tarefa-i";
import {TarefaSituacaoService} from "../_services/tarefa-situacao.service";
import {AuthenticationService} from "../../_services";

@Component({
  selector: 'app-tarefa-situacao',
  templateUrl: './tarefa-situacao.component.html',
  styleUrls: ['./tarefa-situacao.component.css']
})
export class TarefaSituacaoComponent implements OnInit {
  @Input() tarefa?: TarefaI;
  @Input() index?: number;
  @Input() tarefa_usuario_autor_id?: number;
  @Input() tarefa_situacao_nome?: string;
  @Output() mostraFormAutor = new EventEmitter<boolean>();

  constructor(
    public tss: TarefaSituacaoService,
    public aut: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  alterarClick() {
    if (this.tss.ddTarefa_situacao_id.length === 0) {
      this.tss.ddTarefa_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-tarefa_situacao'));
    }
    this.tss.tarefa = this.tarefa;
    this.tss.tarefa_usuario_autor_id = +this.aut.usuario_id;
    this.tss.index = this.index;
    this.tss.exibir = true;
    this.mostraFormAutor.emit(true);
  }

  rowColor(): string | null {
    switch (this.tarefa.tarefa_situacao_id) {
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
