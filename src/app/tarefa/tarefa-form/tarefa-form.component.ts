import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TarefaFormService} from "../_services/tarefa-form.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectItem} from "primeng/api";
import {Subscription} from "rxjs";
import {AuthenticationService, MenuInternoService} from "../../_services";
import {DdService} from "../../_services/dd.service";
import {MsgService} from "../../_services/msg.service";
import Quill from "quill";
import {CpoEditor} from "../../_models/in-out-campo-texto";
import {TarefaService} from "../_services/tarefa.service";
import {DateTime} from "luxon";
import {TarefaFormI, TarefaI, TarefaUsuarioAlterar, TarefaUsuarioSituacaoAndamentoI} from "../_models/tarefa-i";
import {take} from "rxjs/operators";
// import {ErroService} from "../../_services/erro.service";
import {TarefaDropdownService} from "../_services/tarefa-dropdown.service";

interface frmI {
  tarefa_id?: number;
  tarefa_usuario_autor_id?: number;
  tarefa_usuario_id?: number[];
  tarefa_data3?: Date;
  tarefa_titulo?: string;
  tarefa_tarefa?: string | null;
  th_historico?: string | null;
  email?: boolean;
  agenda?: boolean;
}

@Component({
  selector: 'app-tarefa-form',
  templateUrl: './tarefa-form.component.html',
  styleUrls: ['./tarefa-form.component.css']
})
export class TarefaFormComponent implements OnInit, OnDestroy {
  @Output() fechar = new EventEmitter<boolean>();
  public formTarefa: FormGroup;
  public items: Array<any> = [];
  ptBr: any;
  public sgt: string[];
  sub: Subscription[] = [];
  botaoEnviarVF = false;
  mostraForm = false;
  acao: string | null = null;
  contador = 0;
  tarefa_usuario_autor_id_readonly = true;

  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;

  autAdmin = false;
  lazy = false;
  resp: any[] = [];
  tarefa_situacao_id = 0;
  th_historico: string | null = null;
  // disabled = true;
  // kdisabled = false;
  kill: any = null;
  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  format1: 'html' | 'object' | 'text' | 'json' = 'html';
  kill0: Quill;
  kill1: Quill;
  cpoEditor: CpoEditor[] | null = [];
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

  tarefa_usuario_id: TarefaUsuarioAlterar[] = [];
  ddUsuarioAlterar: TarefaUsuarioAlterar[] = [];
  tarefa_usuario2: TarefaUsuarioAlterar[] = [];
  pickErro = false;

  constructor(
    public tfs: TarefaFormService,
    public ts: TarefaService,
    private formBuilder: FormBuilder,
    public aut: AuthenticationService,
    private mi: MenuInternoService,
    private ms: MsgService
  ) { }

  ngOnInit(): void {
    if (this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn) {
      this.autAdmin = true;
      this.tarefa_usuario_autor_id_readonly = false;

    }
    if (this.tfs.acao == 'incluir') {
      const dt: DateTime = DateTime.now().setZone('America/Sao_Paulo');
      this.tfs.tarefa.tarefa_data3 = dt.toJSDate();
      this.tfs.tarefa.tarefa_usuario_autor_id = this.aut.usuario_id;
    }
    if (this.tfs.acao == 'alterar') {
      if (this.autAdmin) {
        this.ddUsuarioAlterar = this.tfs.montaDDAlterar();
        this.tarefa_usuario2 = this.tfs.tarefa.tarefa_usuario2;
      }
    }
    this.criaForm();
  }

  criaForm() {
    if (this.tfs.acao == 'incluir') {
      this.formTarefa = this.formBuilder.group({
        tarefa_usuario_autor_id: [this.tfs.tarefa.tarefa_usuario_autor_id, Validators.required],
        tarefa_usuario_id: [this.tfs.tarefa.tarefa_usuario_id, Validators.required],
        tarefa_data3: [this.tfs.tarefa.tarefa_data3, Validators.required],
        tarefa_titulo: [this.tfs.tarefa.tarefa_titulo, Validators.required],
        tarefa_tarefa: [this.tfs.tarefa.tarefa_tarefa],
        th_historico: [null],
        email: [false],
        agenda: [false],
      });
    } else {
      this.formTarefa = this.formBuilder.group({
        tarefa_id: [this.tfs.tarefa.tarefa_id],
        tarefa_usuario_autor_id: [this.tfs.tarefa.tarefa_usuario_autor_id, Validators.required],
        tarefa_data3: [this.tfs.tarefa.tarefa_data3, Validators.required],
        tarefa_titulo: [this.tfs.tarefa.tarefa_titulo, Validators.required],
        tarefa_tarefa: [this.tfs.tarefa.tarefa_tarefa],
        th_historico: [null],
      });
    }

  }

  campoAtivo(vf: boolean) {
    if (!vf) {
      this.formTarefa.get('tarefa_tarefa').disable({emitEvent: false, onlySelf: true});
      this.formTarefa.get('th_historico').disable({emitEvent: false, onlySelf: true});
    }
    if (vf) {
      this.formTarefa.get('tarefa_tarefa').enable({emitEvent: false, onlySelf: true});
      this.formTarefa.get('th_historico').enable({emitEvent: false, onlySelf: true});
    }
  }

  onEditorCreated(ev, campo) {
    if (campo === 'tarefa_tarefa'){
      this.kill0 = ev;
      this.kill0.update('user');
    }
    if (campo === 'th_historico'){
      this.kill1 = ev;
      this.kill1.update('user');
    }
    // this.kdisabled = true;
  }

  reset() {
    this.formTarefa.reset();
    this.criaForm();
    if (this.tfs.acao == 'alterar') {
      this.tarefa_situacao_id = this.tfs.tarefaListar.tarefa_situacao_id;
    }
    if (this.tfs.acao == 'incluir') {
    }

    this.th_historico = null;
    // this.disabled = true;
    // this.kdisabled = true;
    this.botaoEnviarVF = false;
  }

  onSubmit() {
    console.log('onSubmit', this.formTarefa.getRawValue());
    if (this.verificaValidacoesForm(this.formTarefa)) {
      this.botaoEnviarVF = true;
      if (this.tfs.acao === 'incluir') {
        this.incluir();
      }
      if (this.tfs.acao === 'alterar') {
        const tf: TarefaFormI = this.criaEnvio();
        if (tf.alterar) {
          this.alterar(tf);
        }
      }
    }
  }

  criaEnvio(): TarefaFormI {
    const tf: TarefaFormI = {};
    const fm: frmI = this.formTarefa.getRawValue();
    if (this.tfs.acao === 'incluir') {
      const dt1: DateTime = DateTime.fromJSDate(fm.tarefa_data3);
      tf.tarefa_usuario_autor_id = +fm.tarefa_usuario_autor_id;
      tf.tarefa_titulo = fm.tarefa_titulo;
      tf.agenda = fm.agenda ? 1 : 0;
      tf.email = fm.email ? 1 : 0;
      tf.tarefa_data = dt1.toFormat('yyyy-LL-dd HH:mm:ss');
      tf.tarefa_usuario_id = fm.tarefa_usuario_id;
      if (fm.tarefa_tarefa !== null && fm.tarefa_tarefa.length > 1) {
        tf.tarefa_tarefa = fm.tarefa_tarefa;
        tf.tarefa_tarefa_delta = JSON.stringify(this.cpoEditor['tarefa_tarefa'].delta);
        tf.tarefa_tarefa_texto = this.cpoEditor['tarefa_tarefa'].text;
      }
      if (fm.th_historico !== null && fm.th_historico.length > 1) {
        tf.th_historico = fm.th_historico;
        tf.th_historico_delta = JSON.stringify(this.cpoEditor['th_historico'].delta);
        tf.th_historico_texto = this.cpoEditor['th_historico'].text;
        tf.th_data = dt1.toFormat('yyyy-LL-dd HH:mm:ss');
        tf.th_usuario_id = +fm.tarefa_usuario_autor_id;
      }
      console.log(tf);
      return tf;
    }

    if (this.tfs.acao === 'alterar') {
      tf.tarefa_id = +fm.tarefa_id;
      if (fm.tarefa_titulo !== this.tfs.tarefaListar.tarefa_titulo) {
        tf.tarefa_titulo = fm.tarefa_titulo;
        tf.alterar = true;
      }
      if (fm.tarefa_data3 !== this.tfs.tarefaListar.tarefa_data3) {
        const dt1: DateTime = DateTime.fromJSDate(fm.tarefa_data3);
        tf.tarefa_data = dt1.toFormat('yyyy-LL-dd HH:mm:ss');
        tf.alterar = true;
      }
      if (fm.tarefa_tarefa !== this.tfs.tarefaListar.tarefa_tarefa) {
        tf.tarefa_tarefa = fm.tarefa_tarefa;
        tf.tarefa_tarefa_delta = JSON.stringify(this.cpoEditor['tarefa_tarefa'].delta);
        tf.tarefa_tarefa_texto = this.cpoEditor['tarefa_tarefa'].text;
        tf.alterar = true;
      }
      if (fm.th_historico !== null && fm.th_historico.length > 1) {
        tf.th_historico = fm.th_historico;
        tf.th_historico_delta = JSON.stringify(this.cpoEditor['th_historico'].delta);
        tf.th_historico_texto = this.cpoEditor['th_historico'].text;
        const dt2: DateTime = DateTime.now().setZone('America/Sao_Paulo');
        tf.th_data = dt2.toFormat('yyyy-LL-dd HH:mm:ss');
        tf.th_usuario_id = +fm.tarefa_usuario_autor_id;
        tf.alterar = true;
      }
      if (this.autAdmin) {
        if (+fm.tarefa_usuario_autor_id !== +this.tfs.tarefaListar.tarefa_usuario_autor_id) {
          tf.tarefa_usuario_autor_id = +fm.tarefa_usuario_autor_id;
          tf.alterar = true;
        }
          const usI: TarefaUsuarioAlterar[] = this.tarefa_usuario2.filter((obj) => {
            return obj.tus_id === 0;
          });

          const usE: TarefaUsuarioAlterar[] = this.ddUsuarioAlterar.filter((obj) => {
            return obj.tus_id !== 0;
          });
          if (usI.length > 0) {
            tf.tarefa_usuario_id = usI.map(u => {return u.tus_usuario_id;});
            tf.alterar = true;
          }
          if (usE.length > 0) {
            tf.tarefa_usuario_excluir = usE;
            tf.alterar = true;
          }
      }
      console.log(tf);
      return tf;
    }

  }

  incluir() {
    this.lazy = this.ts.lazy;
    this.sub.push(this.ts.incluirTarefa(this.criaEnvio())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          console.log('DADOS', dados);
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
            this.reset();
          } else {
            sessionStorage.removeItem('tarefa_menu-dropdown');
            if (this.possuiArquivos) {
              this.arquivo_registro_id = +this.resp[1];
              this.enviarArquivos = true;
            } else {
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

                this.ts.tarefas.push(p);
              }
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'INCLUIR TAREFA',
                detail: this.resp[2]
              });
              this.ts.lazy = this.lazy;
              this.voltarListar();
            }
          }
        }
      })
    );
  }

  alterar(tf: TarefaFormI) {
    this.lazy = this.ts.lazy;
    this.sub.push(this.ts.alterarTarefa(tf)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          console.log('DADOS', dados);
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          // this.disabled = false;
          // this.kdisabled = false;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ALTERAR TAREFA', detail: this.resp[2]});
          // this.er.mostraErro(err);
          console.error(err);
        },
        complete: () => {
          if (!this.resp[0]) {
            this.botaoEnviarVF = false;
            // this.disabled = false;
            // this.kdisabled = false;
            console.error('ERRO - ALTERAR ', this.resp[2]);
            this.ms.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
            this.reset();
          } else {
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
                this.ts.tarefas[this.tfs.idx] = p;
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
              this.voltarListar();
            }

        }
      })
    );
  }


  enviarTarefaAlterar() {}

  voltarListar() {
    this.fechar.emit((this.tfs.origem === 'menu'));
    // this.ngOnDestroy();
  }

  mudaSituacao(ev: number) {
    if (ev !== this.tfs.tarefaListar.tarefa_situacao_id)  {
      // this.disabled = false;
      // this.kdisabled = false;
    } else {
      this.th_historico = null;
      // this.disabled = true;
      // this.kdisabled = true;
    }
  }

  getAutorNome(id: number): string {
    const r: SelectItem = this.tfs.ddUsuario_id.find(d => d.value === id);
    return r.label;
  }



  verificaRequired(campo: string) {
    return (
      this.formTarefa.get(campo).hasError('required') &&
      (this.formTarefa.get(campo).touched || this.formTarefa.get(campo).dirty)
    );
  }

  verificaValidTouched(campo: string) {
    return (
      (!this.formTarefa?.get(campo)?.valid || this.formTarefa.get(campo).hasError('required')) &&
      (this.formTarefa?.get(campo)?.touched || this.formTarefa?.get(campo)?.dirty)
    );
  }

  verificaValidacoesForm(formGroup: FormGroup): boolean {
    let ct = 0;
    let ct2 = 0;
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
      if (!controle.valid) {
        ct++;
      }
      ct2++;
    });
    return (ct === 0);
  }

  aplicaCssErro(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
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

  onBlockSubmit(ev: boolean) {
    this.botaoEnviarVF = false;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onUpload(ev) {
    if (this.tfs.acao === 'incluir') {
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

        this.ts.tarefas.push(p);

        this.ms.add({
          key: 'toastprincipal',
          severity: 'success',
          summary: 'INCLUIR TAREFA',
          detail: this.resp[2]
        });
        // this.voltarListar();
        this.ts.lazy = this.lazy;
        this.botaoEnviarVF = false;
        this.mostraForm = false;
        this.voltarListar();
      }
    } else {
      this.botaoEnviarVF = false;
    }
  }

  onEditorChanged(ev) {
    console.log('onEditorChanged', ev);
    this.kill = ev;

  }

  onContentChanged(ev, campo: string) {
    this.cpoEditor[campo] = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
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

  onMoveToSource(ev) {
    if (this.tarefa_usuario2.length === 0) {
      this.pickErro = true;
    }
  }

  onMoveToTarget(ev) {
    this.pickErro = false;
  }

  aplicaCssErroPick() {
    return this.pickErro ? 'formulariopick pick-error' : 'formulariopick';
  }

  aplicaCssErroPick2() {
    return this.pickErro ? 'ng-invalid ng-dirty' : null;
  }

  ngOnDestroy() {
    console.log('DESTROI');
    this.sub.forEach(s => {
      s.unsubscribe()
    });
    this.reset();
    this.tfs.resetTudo();
    this.th_historico = null;
    // this.disabled = true;
    // this.kdisabled = true;
    this.botaoEnviarVF = false;
    this.tarefa_situacao_id = 0;
    // this.fechar.emit(true);
  }

}
