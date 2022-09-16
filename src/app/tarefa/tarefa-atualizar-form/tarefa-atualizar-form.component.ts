import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TarefaSituacaoService} from "../_services/tarefa-situacao.service";
import {
  TarefaI,
  TarefaUsuarioSituacaoAtualisarFormI,
  TarefaUsuarioSituacaoFormI,
  TarefaUsuarioSituacaoI
} from "../_models/tarefa-i";
import {FormGroup} from "@angular/forms";
import Quill from "quill";
import {TarefaService} from "../_services/tarefa.service";
import {TarefaHistoricoI} from "../_models/tarefa-historico-i";
import {DateTime} from "luxon";
import {AuthenticationService} from "../../_services";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {MsgService} from "../../_services/msg.service";
import {SelectItem} from "primeng/api";

@Component({
  selector: 'app-tarefa-atualizar-form',
  templateUrl: './tarefa-atualizar-form.component.html',
  styleUrls: ['./tarefa-atualizar-form.component.css']
})
export class TarefaAtualizarFormComponent implements OnInit, OnDestroy {
  @Output() fechar = new EventEmitter<boolean>();
  resp: any[] = [];
  sub: Subscription[] = [];
  tus_situacao_id = 0;
  th_historico: string | null = null;
  botaoEnviarVF = false;
  disabled = true;
  kdisabled = false;
  // usuario_id = 61;
  kill: any = null;

  // tus: TarefaUsuarioSituacaoI | null = null;
  // hEnvio: TarefaHistoricoI | null = null;
  // envio: TarefaUsuarioSituacaoAtualisarFormI | null = null;

  // h: TarefaHistoricoI | null = null;
  // mudaTarefaSN: boolean = false;

  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  kill0: Quill;
  modulos = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{'header': 1}, {'header': 2}],               // custom button values
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
      [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
      [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
      [{'color': []}, {'background': []}],          // dropdown with defaults from theme
      [{'font': []}],
      [{'align': []}],
      ['clean']                        // link and image, video
    ]
  };

  constructor(
    public tss: TarefaSituacaoService,
    public ts: TarefaService,
    public aut: AuthenticationService,
    private ms: MsgService,
  ) { }

  ngOnInit(): void {
    // this.usuario_id = this.tss.usuario_id;
    this.tus_situacao_id = this.tss.tus.tus_situacao_id;
  }

  onEditorCreated(ev) {
    this.kill0 = ev;
    this.kill0.update('user');
    this.kdisabled = true;
  }

  reset() {
    this.tus_situacao_id = this.tss.tus.tus_situacao_id;
    this.th_historico = null;
    this.disabled = true;
    this.kdisabled = true;
    this.botaoEnviarVF = false;
  }

  onSubmit() {
    this.botaoEnviarVF = true;
    this.disabled = true;
    this.atualizar();
  }

  voltarListar() {
    this.fechar.emit(true);
  }

  mudaSituacao(ev: number) {
    if (ev !== this.tss.tus.tus_situacao_id)  {
      this.disabled = false;
      this.kdisabled = false;
    } else {
      this.th_historico = null;
      this.disabled = true;
      this.kdisabled = true;
    }
  }


  getSituacaoNome(id: number): string {
    const r: SelectItem = this.tss.ddTarefa_situacao_id.find(d => d.value === id);
    return r.label;
  }

  criaEnvio(): TarefaUsuarioSituacaoAtualisarFormI {
    let mudaTarefaSN = false;
    let envio: TarefaUsuarioSituacaoAtualisarFormI = {};
    const dt: DateTime = DateTime.now().setZone('America/Sao_Paulo');
    let tf: TarefaI = {};
    envio.tarefa_id = this.tss.tus.tarefa_id;
    envio.tarefa_usuario_situacao = {
      tus_id: this.tss.tarefa.tarefa_usuario_situacao.find(tu => tu.tus_usuario_id === this.tss.usuario_id).tus_id,
      tus_usuario_id: this.tss.usuario_id,
      tus_tarefa_id: this.tss.tus.tarefa_id,
      tus_situacao_id: this.tus_situacao_id
    }

    if (this.tss.tarefa.tarefa_situacao_id !== this.tus_situacao_id) {
      if (this.tss.tarefa.tarefa_usuario_situacao.length === 1) {
        mudaTarefaSN = true;
        envio.tarefa_situacao_id = this.tus_situacao_id;
      } else {
        if (this.tss.tarefa.tarefa_situacao_id <= 1 && this.tus_situacao_id > 1) {
          mudaTarefaSN = true;
          if (this.tus_situacao_id > 1) {
            envio.tarefa_situacao_id = 2;
          }
        }

        if (this.tss.tarefa.tarefa_situacao_id === 2) {
          if (this.tus_situacao_id === 1) {
            let v = 0;
            v = this.tss.tarefa.tarefa_usuario_situacao.reduce((a: number, b) => {
              return a + ((b.tus_situacao_id !== 1) ? 1 : 0);
            }, 0);
            if (v === 1) {
              mudaTarefaSN = true;
              envio.tarefa_situacao_id = 1;
            }
          }

          if (this.tus_situacao_id === 3) {
            let v = 0;
            v = this.tss.tarefa.tarefa_usuario_situacao.reduce((a: number, b) => {
              return a + ((b.tus_situacao_id !== 3) ? 1 : 0);
            }, 0);
            if (v === 1) {
              mudaTarefaSN = true;
              envio.tarefa_situacao_id = 3;
            }
          }
        }

        if (this.tss.tarefa.tarefa_situacao_id === 3) {
          mudaTarefaSN = true;
          envio.tarefa_situacao_id = 2;
        }

      }

    }

    let h: TarefaHistoricoI = {
      th_tarefa_id: this.tss.tus.tarefa_id,
      th_data: dt.toFormat('yyyy-LL-dd HH:mm:ss'),
      th_usuario_id: this.tss.tus.tus_usuario_id,
      th_usuario_nome: this.tss.tus.tu_usuario_nome
    }
    if (this.th_historico === null || this.th_historico.length < 3) {
      const tx = 'Situação do demandado passou de ' + this.tss.tus.tus_situacao_nome + ' para ' + this.getSituacaoNome(this.tus_situacao_id) + '.';
      this.kill0.insertText(0, tx, 'api');
    }

    if (mudaTarefaSN) {
      const qn = this.kill0.getLength();
      const tt = 'A situação da tarefa passou de ' + this.tss.tarefa.tarefa_situacao_nome + ' para ' + this.getSituacaoNome(envio.tarefa_situacao_id) + '.';
      this.kill0.insertText(qn, tt, 'api');
    }
    h.th_historico = this.th_historico;
    this.kill0.update('api');
    h.th_historico_delta = JSON.stringify(this.kill.delta);
    h.th_historico_texto = this.kill.text;
    h.th_historico = this.kill.html;
    envio.tarefa_historico = h;
    this.kdisabled = true;
    return envio;
  }

  atualizar() {
    const lazy = this.ts.lazy;
    this.sub.push(this.ts.putTarefaAtualizarUsuarioSituacao(this.criaEnvio())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.disabled = false;
          this.kdisabled = false;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ATUALIZAR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (!this.resp[0]) {
            this.botaoEnviarVF = false;
            this.disabled = false;
            this.kdisabled = false;
            console.error('ERRO - INCLUIR ', this.resp[2]);
            this.ms.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
            this.reset();
          } else {
            if (lazy) {
              this.ts.lazy = false;
            }
            let p: TarefaI = this.resp[3];
            p.tarefa_data3 = new Date(p.tarefa_data2);
            p.tarefa_datahora3 = new Date(p.tarefa_datahora2);
            if (p.tarefa_historico !== undefined && p.tarefa_historico !== null && Array.isArray(p.tarefa_historico) && p.tarefa_historico.length > 0) {
              const tt = p.tarefa_historico;
              p.tarefa_historico = tt.map((h ) => {
                h.th_data3 = new Date(h.th_data2);
                return h;
              });
            }
            this.ts.tarefas[this.tss.index] = p;
            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'ALTERAR SITUAÇÃO DEMANDADO',
              detail: this.resp[2]
            });
            // this.voltarListar();
            if (this.ts.expandidoSN) {
              const ev: any = {
                originalEvent: null,
                data: p
              };
              this.ts.onRowExpand(ev);
            }
            this.ts.lazy = lazy;
            this.voltarListar();
          }
        }
      })
    );
  }

  onEditorChanged(ev) {
    this.kill = ev;
  }

  ngOnDestroy() {
    this.reset();
    this.fechar.emit(true);
    this.tss.reset();
    this.th_historico = null;
    this.disabled = true;
    this.kdisabled = true;
    this.botaoEnviarVF = false;
    this.tus_situacao_id = 0;
  }

}
