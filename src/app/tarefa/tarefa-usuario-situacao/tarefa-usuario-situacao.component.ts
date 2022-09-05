import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TarefaI, TarefaUsuarioSituacaoI} from "../_models/tarefa-i";
import {ColunasI} from "../../_models/colunas-i";
import {SelectItem} from "primeng/api";
import {TarefaSituacaoService} from "../_services/tarefa-situacao.service";

@Component({
  selector: 'app-tarefa-usuario-situacao',
  templateUrl: './tarefa-usuario-situacao.component.html',
  styleUrls: ['./tarefa-usuario-situacao.component.css']
})
export class TarefaUsuarioSituacaoComponent implements OnInit, OnChanges {
  @Input() tarefa?: TarefaI;
  @Output() tarefaChange = new EventEmitter<TarefaI>();
  @Input() tus: TarefaUsuarioSituacaoI[] = [];
  @Input() exibir: boolean;
  @Output() exibirChange = new EventEmitter<boolean>();
  @Input() usuarioSN: boolean;
  @Input() situacaoSN: boolean;
  @Input() index?: number;
  @Input() usuario_id: number = 0;


  us = false;
  si = false;
  show = false;
  teste = false;

  user_id = 61;

  currentStyles = {
    height: '40px',
    zIndex : 10000,
  };



  mostraSeletor = false;

  cols: ColunasI[] = [];
  selectedColumns: ColunasI[] = [];


  constructor(
    public tss: TarefaSituacaoService,
  ) {}

  ngOnInit(): void {
    this.cols = [
      {field: 'tu_usuario_nome', header: 'USUÁRIO', sortable: 'true', width: '150px'},
      {field: 'tus_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'}
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.usuarioSN) {
      this.showUsuario(this.usuarioSN);
    }
    if(changes.situacaoSN) {
      this.showSituacao(this.situacaoSN);
    }
    if(changes.exibir) {
      this.showTudo(this.exibir);
    }
  }

  showUsuario(vf: boolean) {
    if (vf) {
      this.selectedColumns.push({field: 'tu_usuario_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'})
    } else {
      this.selectedColumns = this.selectedColumns.filter(c => c.field !== 'tu_usuario_nome');
    }
    this.us = vf;
    this.showTabela();
  }

  showSituacao(vf: boolean) {
    if (vf) {
      this.selectedColumns.push({field: 'tus_situacao_nome', header: 'USUÁRIO', sortable: 'true', width: '150px'})
    } else {
      this.selectedColumns = this.selectedColumns.filter(c => c.field !== 'tus_situacao_nome');
    }
    this.si = vf;
    this.showTabela();
  }

  showTabela() {
    if (this.si || this.us) {
      this.show = true;
      this.exibirChange.emit(true);
    }
    if (!this.us && !this.si) {
      this.show = false;
      this.exibirChange.emit(false);
    }
  }

  showTudo(vf: boolean) {

    this.si = true;
    this.us = true;
    this.show = true;
    console.log(this.usuario_id);
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

  alterarClick() {
    if (this.tss.ddTarefa_situacao_id.length === 0) {
      this.tss.ddTarefa_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-tarefa_situacao'));
      console.log(this.tss.ddTarefa_situacao_id);
    }
    this.mostraSeletor = true;
  }

  gravarClick() {
    this.mostraSeletor = false;
  }

  getStyle(userId: number): any {
    return (this.mostraSeletor && this.user_id === userId) ? null : this.currentStyles;
  }


}
