import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TarefaService} from "../_services/tarefa.service";
import {AuthenticationService} from "../../_services";
import {MsgService} from "../../_services/msg.service";
import {TarefaI} from "../_models/tarefa-i";
import {Subscription} from "rxjs";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {HistFormI} from "../../hist/_models/hist-i";
import {take} from "rxjs/operators";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-tarefa-historico-listar',
  templateUrl: './tarefa-historico-listar.component.html',
  styleUrls: ['./tarefa-historico-listar.component.css'],
  providers: [ConfirmationService]
})
export class TarefaHistoricoListarComponent implements OnInit, OnDestroy {
  @Output() fechar = new EventEmitter<boolean>();
  @Input() tarefa: TarefaI;
  @Input() idx: number;

  sub: Subscription[] = [];
  resp: any[] = [];
  lazy = false;



  constructor(
    private cf: ConfirmationService,
    public ts: TarefaService,
    public aut: AuthenticationService,
    private ms: MsgService
  ) { }

  ngOnInit(): void {
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  permissaoSN(usuario_id: number): boolean {
    return (this.aut.usuario_principal_sn ||
      this.aut.usuario_responsavel_sn ||
      this.aut.usuario_id === usuario_id ||
      this.aut.usuario_id === this.tarefa.tarefa_usuario_autor_id);
  }



  confirm(event: Event, excluir_id: number, idx: number) {
    this.cf.confirm({
      target: event.target,
      message: 'Deseja excluir este andamento?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('confirm',excluir_id, idx, this.tarefa.tarefa_historico[idx]);
        this.onExluir(excluir_id, idx);
      }
    });
  }

  onExluir(excluir_id: number, idx: number) {
    this.sub.push(this.ts.excluirHistorico(excluir_id)
      .pipe(take(1))
      .subscribe({
        next: (dados: [boolean, string, string]) => {
          this.resp = dados;
        },
        error: (err) => {
          this.ms[2] = err + " - Ocorreu um erro.";
          this.ms.add({
            key: 'toastprincipal',
            severity: 'warn',
            summary: this.resp[1],
            detail: this.resp[2]
          });
          // this.ms.add({severity:'error', summary:'Erro', detail:this.msg[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            if (this.ts.tarefas.length > 0) {
              if (this.lazy) {
                this.ts.lazy = false;
              }
              const p: TarefaI = this.resp[3];
              p.tarefa_data3 = new Date(p.tarefa_data2);
              p.tarefa_datahora3 = new Date(p.tarefa_datahora2);
              if (p.tarefa_historico !== undefined && p.tarefa_historico !== null && Array.isArray(p.tarefa_historico) && p.tarefa_historico.length > 0) {
                const tt = p.tarefa_historico;
                p.tarefa_historico = tt.map((h) => {
                  h.th_data3 = new Date(h.th_data2);
                  return h;
                });
              }
              this.ts.tarefas[this.idx] = p;
              if (this.ts.expandidoSN) {
                const ev: any = {
                  originalEvent: null,
                  data: p
                };
                this.ts.onRowExpand(ev);
              }
            }
            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'INCLUIR TAREFA',
              detail: this.resp[2]
            });
            this.ts.lazy = this.lazy;
            this.onFechar();

          } else {
            this.ms.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: this.resp[1],
              detail: this.resp[2]
            });
            // this.ms.add({severity:'error', summary:'Erro', detail:this.msg[2]});
          }

        }
      })
    );
  }

  onFechar() {
    this.fechar.emit(true);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
