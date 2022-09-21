import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TarefaI} from "../_models/tarefa-i";
import {Subscription} from "rxjs";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {TarefaService} from "../_services/tarefa.service";
import {MsgService} from "../../_services/msg.service";
import {AuthenticationService} from "../../_services";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-tarefa-excluir',
  templateUrl: './tarefa-excluir.component.html',
  styleUrls: ['./tarefa-excluir.component.css']
})
export class TarefaExcluirComponent implements OnInit {
  @Output() hideExcluir = new EventEmitter<boolean>();

  botaoEnviarVF = false;
  public arquivoBlockSubmit = true;
  tarefa_id: number;
  acao = '';
  resp: any[];
  display = false;
  sub: Subscription[] = [];
  apagarAtivo = false;
  botoesInativos = false;
  botaoEnviarInativo = false;
  msg = 'Deseja excluir permanetemente esta tarefa';
  lazy = false;

  constructor(
    public aut: AuthenticationService,
    public ts: TarefaService,
    private ms: MsgService
  ) { }

  ngOnInit(): void {
    if (+this.ts.tarefaApagar.tarefa_usuario_autor_id !== +this.aut.usuario_id && !this.aut.usuario_principal_sn && !this.aut.usuario_responsavel_sn) {
      this.botoesInativos = true;
      this.ms.add({
        key: 'toastprincipal',
        severity: 'warn',
        summary: 'ATENÇÃO - ERRO',
        detail: 'PERMISSÃO NEGADA'
      });
      this.voltar();
    } else {
      this.tarefa_id = +this.ts.tarefaApagar.tarefa_id;
      if (this.ts.tarefaApagar.tarefa_arquivos.length === 0) {
        this.msg += '?'
      } else {
        if (this.ts.tarefaApagar.tarefa_arquivos.length === 1) {
          this.msg += ' e o arquivo anexado ele?'
        } else {
          this.msg += ' e os '+ this.ts.tarefaApagar.tarefa_arquivos.length +' arquivos anexados ela?'
        }
      }

    }
  }

  rowColor(vl1: number): string {
    switch (vl1) {
      case 1:
        return '#f69ebc';
      case 2:
        return '#fde4a5';
      case 3:
        return '#b2ddb4';
      default:
        return '#ffffff';
    }
  }

  fcor(vl1: number): string | null {
    switch (vl1) {
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

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  voltarListar() {
    this.ts.stateSN = false;
    this.hideExcluir.emit(true);
  }

  voltar() {
    this.ts.stateSN = false;
  }

  fecharDialog() {
    this.display = false;
    this.botaoEnviarInativo = false;
    this.botoesInativos = false;
  }

  showDialog() {
    this.botaoEnviarInativo = true;
    this.botoesInativos = true;
    this.display = true;
  }

  onBlockSubmit(ev) {
    this.botaoEnviarInativo = ev;
  }

  excluirTarefa() {
    this.lazy = this.ts.lazy;
    this.sub.push(this.ts.excluirTarefa(this.tarefa_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.fecharDialog();
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            if (this.lazy) {
              this.ts.lazy = false;
            }
            sessionStorage.removeItem('tarefa-menu-dropdown');
            const idx = this.ts.tarefas.findIndex(o => o.tarefa_id === this.tarefa_id);
            this.ts.tarefas.splice(idx, 1);
            if (sessionStorage.getItem('tarefa-table')) {
              const tmp: any = JSON.parse(sessionStorage.getItem('tarefa-table'));
              if (tmp.expandedRowKeys !== undefined) {
                delete tmp.expandedRowKeys;
                sessionStorage.setItem('tarefa-table', JSON.stringify(tmp));
              }
            }
            if (this.ts.selecionados !== undefined && this.ts.selecionados !== null && this.ts.selecionados.length > 0) {
              const dx = this.ts.selecionados.findIndex(o => o.tarefa_id === this.tarefa_id);
              if(dx !== -1) {
                this.ts.selecionados.splice(dx,1);
              }
            }
            this.ts.tabela.selectedColumns = undefined;
            this.ts.tabela.totalRecords--;
            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'APAGAR TAREFA',
              detail: this.resp[2]
            });
            this.fecharDialog();
            this.ts.lazy = this.lazy;
            this.voltarListar();
          } else {
            this.ts.lazy = this.lazy;
            this.fecharDialog();
            console.error('ERRO - APAGAR ', this.resp[2]);
            this.ms.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          }
        }
      })
    );
  }

}
