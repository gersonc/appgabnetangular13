import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import Quill from "quill";
import {TarefaSituacaoService} from "../_services/tarefa-situacao.service";
import {TarefaService} from "../_services/tarefa.service";
import {AuthenticationService} from "../../_services";
import {MsgService} from "../../_services/msg.service";
import {SelectItem} from "primeng/api";
import {
  TarefaAutorSituacaoFormI,
  TarefaAutorUsuarioSituacaoFormI,
  TarefaI,
  TarefaUsuarioSituacaoAtualisarFormI
} from "../_models/tarefa-i";
import {DateTime} from "luxon";
import {TarefaHistoricoI} from "../_models/tarefa-historico-i";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-tarefa-atualizar-autor-form',
  templateUrl: './tarefa-atualizar-autor-form.component.html',
  styleUrls: ['./tarefa-atualizar-autor-form.component.css']
})
export class TarefaAtualizarAutorFormComponent implements OnInit, OnDestroy {
  @Output() fechar = new EventEmitter<boolean>();
  resp: any[] = [];
  sub: Subscription[] = [];
  tarefa_situacao_id = 0;
  th_historico: string | null = null;
  botaoEnviarVF = false;
  disabled = true;
  kdisabled = false;
  kill: any = null;

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
    this.tarefa_situacao_id = this.tss.tarefa.tarefa_situacao_id;
  }

  onEditorCreated(ev) {
    this.kill0 = ev;
    this.kill0.update('user');
    this.kdisabled = true;
  }

  reset() {
    this.tarefa_situacao_id = this.tss.tarefa.tarefa_situacao_id;
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
    if (ev !== this.tss.tarefa.tarefa_situacao_id)  {
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

  criaEnvio(): TarefaAutorSituacaoFormI {
    let mudaTarefaSN = false;
    let envio: TarefaAutorSituacaoFormI = {};
    const dt: DateTime = DateTime.now().setZone('America/Sao_Paulo');
    let tf: TarefaI = {};
    envio.tarefa_id = this.tss.tarefa.tarefa_id;
    envio.tarefa_usuario_autor_id = this.tss.tarefa_usuario_autor_id;
    envio.tarefa_situacao_id = this.tarefa_situacao_id;
    envio.tarefa_usuario_situacao = [];
    this.tss.tarefa.tarefa_usuario_situacao.forEach(t => {
      if (t.tus_situacao_id !== this.tarefa_situacao_id) {
        let us: TarefaAutorUsuarioSituacaoFormI = {
          tus_id: t.tus_id,
          tus_usuario_id: t.tus_usuario_id
        }
        if (this.tarefa_situacao_id === 1) {
          us.tus_situacao_id = 1;
        }
        if (this.tarefa_situacao_id === 2) {
          if (t.tus_situacao_id === 3) {
            us.tus_situacao_id = 2;
          }
        }
        if (this.tarefa_situacao_id === 3) {
            us.tus_situacao_id = 3;
        }
        envio.tarefa_usuario_situacao.push(us);
      }
    });

    let h: TarefaHistoricoI = {
      th_tarefa_id: this.tss.tarefa.tarefa_id,
      th_data: dt.toFormat('yyyy-LL-dd HH:mm:ss'),
      th_usuario_id: this.tss.tarefa_usuario_autor_id,
      th_usuario_nome: this.tss.tarefa.tarefa_usuario_autor_nome
    }
    if (this.th_historico === null || this.th_historico.length < 3) {
      const tx = 'A situação da tarefa passou de ' + this.tss.tarefa.tarefa_situacao_nome + ' para ' + this.getSituacaoNome(envio.tarefa_situacao_id) + '.';
      this.kill0.insertText(0, tx, 'api');
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
    this.sub.push(this.ts.putTarefaAtualizarAutorSituacao(this.criaEnvio())
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
              summary: 'ALTERAR SITUAÇÃO AUTOR',
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

  ngOnDestroy() {
    this.reset();
    this.fechar.emit(true);
    this.tss.reset();
    this.th_historico = null;
    this.disabled = true;
    this.kdisabled = true;
    this.botaoEnviarVF = false;
    this.tarefa_situacao_id = 0;
  }

}
