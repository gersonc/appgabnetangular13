import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {TarefaUsuarioSituacaoAndamentoI, TarefaUsuarioSituacaoI} from "../_models/tarefa-i";
import {ColunasI} from "../../_models/colunas-i";

@Component({
  selector: 'app-tarefa-usuario-situacao-andamento',
  templateUrl: './tarefa-usuario-situacao-andamento.component.html',
  styleUrls: ['./tarefa-usuario-situacao-andamento.component.css']
})
export class TarefaUsuarioSituacaoAndamentoComponent implements OnInit {
  @Input() tus: TarefaUsuarioSituacaoAndamentoI[] = [];
  @Input() exibirtus: boolean;
  @Input() index: number;
  @Output() exibirtusChange = new EventEmitter<boolean>();
  @Input() usuarioSN: boolean;
  @Input() situacaoSN: boolean;
  @Input() andamentoSN: boolean;


  us = false;
  si = false;
  show = false;
  teste = false;

  cols: ColunasI[] = [];
  selectedColumns: ColunasI[] = [];

  constructor() { }

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
      this.showTudo(this.exibirtus);
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
      this.exibirtusChange.emit(true);
    }
    if (!this.us && !this.si) {
      this.show = false;
      this.exibirtusChange.emit(false);
    }
  }

  showTudo(vf: boolean) {
    this.si = true;
    this.us = true;
    this.show = true;
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

  rowfundo(): string | null {
    return (this.index % 2 == 0) ? 'fundo-par' : 'fundo-impar';
  }


}
