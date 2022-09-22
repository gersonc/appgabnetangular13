import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TarefaI} from "../_models/tarefa-i";
import {Subscription} from "rxjs";
import {TarefaService} from "../_services/tarefa.service";
import {AuthenticationService} from "../../_services";
import {MsgService} from "../../_services/msg.service";
import Quill from "quill";
import {CpoEditor} from "../../_models/in-out-campo-texto";
import {DateTime} from "luxon";
import {TarefaHistoricoI} from "../_models/tarefa-historico-i";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-tarefa-historico-form',
  templateUrl: './tarefa-historico-form.component.html',
  styleUrls: ['./tarefa-historico-form.component.css']
})
export class TarefaHistoricoFormComponent implements OnInit, OnDestroy {
  @Output() fechar = new EventEmitter<boolean>();
  @Input() tarefa: TarefaI;
  @Input() idx: number;

  sub: Subscription[] = [];
  resp: any[] = [];
  lazy = false;
  botaoEnviarVF = false;

  th_historico: string | null = null;

  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  kill0: Quill;
  cpoEditor: CpoEditor | null = null;
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

  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;


  constructor(
    public ts: TarefaService,
    public aut: AuthenticationService,
    private ms: MsgService
  ) {
  }

  ngOnInit(): void {
  }

  onEditorCreated(ev) {
    this.kill0 = ev;
    this.kill0.update('user');
  }

  onContentChanged(ev) {
    this.cpoEditor = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  onSubmit() {
    this.botaoEnviarVF = true;
    const h = this.criaEnvio();
    if (h !== null) {
      this.incluir(h);
    } else {
      this.botaoEnviarVF = false
    }
  }

  criaEnvio(): TarefaHistoricoI | null {
    if (this.th_historico !== null && this.th_historico.length > 1) {
      const dt: DateTime = DateTime.now().setZone('America/Sao_Paulo');
      return {
        th_data: dt.toFormat('yyyy-LL-dd HH:mm:ss'),
        th_tarefa_id: this.tarefa.tarefa_id,
        th_usuario_id: this.aut.usuario_id,
        th_historico: this.th_historico,
        th_historico_delta: JSON.stringify(this.cpoEditor.delta),
        th_historico_texto: this.cpoEditor.text
      }
    } else {
      return null;
    }
  }

  incluir(h: TarefaHistoricoI) {
    this.lazy = this.ts.lazy;
    this.sub.push(this.ts.incluirAndamento(h)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (!this.resp[0]) {
            this.botaoEnviarVF = false;
            console.error('ERRO - INCLUIR ', this.resp[2]);
            this.ms.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          } else {
            if (this.lazy) {
              this.ts.lazy = false;
            }
            let p: TarefaI = this.resp[3];
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


            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'INCLUIR ANDAMENTO',
              detail: this.resp[2]
            });
            this.ts.lazy = this.lazy;
            this.onFechar();
          }
        }
      })
    );
  }


  onFechar() {
    this.fechar.emit(true);
  }

  onBlockSubmit(ev: boolean) {
    this.botaoEnviarVF = false;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
