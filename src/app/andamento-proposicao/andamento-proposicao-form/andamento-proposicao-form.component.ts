import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {
  AndamentoProposicaoFormI,
  AndamentoProposicaoI,
  AndPropI
} from "../../proposicao/_models/andamento-proposicao-i";
import {DateTime} from "luxon";
import Quill from "quill";
import {SelectItem} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../_services";
import {MsgService} from "../../_services/msg.service";
import {Subscription} from "rxjs";
import {AndamentoProposicaoService} from "../../proposicao/_services/andamento-proposicao.service";
import {InOutCampoTexto, InOutCampoTextoI} from "../../_models/in-out-campo-texto";
import {PropFormI} from "../../proposicao/_models/prop-form-i";
import {take} from "rxjs/operators";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {ProposicaoListarI} from "../../proposicao/_models/proposicao-listar-i";


@Component({
  selector: 'app-andamento-proposicao-form',
  templateUrl: './andamento-proposicao-form.component.html',
  styleUrls: ['./andamento-proposicao-form.component.css']
})
export class AndamentoProposicaoFormComponent implements OnInit, OnChanges, OnDestroy {
  @Output() dialogExterno = new EventEmitter<boolean>();
  @Output() novoRegistro = new EventEmitter<ProposicaoListarI>();
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() display = false;
  @Input() andamento_proposicao_proposicao_id: number;
  @Input() idx: number;
  @Output() apListarChange = new EventEmitter<AndamentoProposicaoI[]>();
  @Input() listarVF = false;
  @Input() acao: string;
  @Input() andamento?: AndamentoProposicaoI;
  @Input() proposicao: ProposicaoListarI;
  // @Output() andamentoChange = new EventEmitter<AndamentoProposicaoI>();

  andamentoClone: AndamentoProposicaoI | null = null;
  form: AndamentoProposicaoFormI | null = null;
  formAnd: FormGroup;
  sub: Subscription[] = [];
  botaoEnviarVF = false;
  ddProposicao_orgao_id: SelectItem[];
  ddProposicao_situacao_id: SelectItem[];
  // permitirAcao = false;
  permitirAlterar = false;
  permitirIncluir = false;

  btnIdx = '';

  sn_relator_atual = false;
  sn_situacao = false;
  sn_orgao = false;

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

  dt: DateTime = DateTime.now().setZone('America/Sao_Paulo');
  dtjs: Date = this.dt.toJSDate();
  resp: any[] = [];

  constructor(
    private fb: FormBuilder,
    public aut: AuthenticationService,
    private ms: MsgService,
    public aps: AndamentoProposicaoService
  ) {

  }

  ngOnInit(): void {
    // this.permitirAcao = (this.aut.andamentoproposicao_alterar || this.aut.andamentoproposicao_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.permitirAlterar = (this.aut.andamentoproposicao_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.permitirIncluir = (this.aut.andamentoproposicao_incluir || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.carregaDropdownSessionStorage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.acao.currentValue === 'alterar') {
      this.form = this.criaEditar(this.andamento);
      this.criaForm(this.form);
    }
    if (changes.acao.currentValue === 'incluir') {
      this.form = this.criaIncluir(this.andamento_proposicao_proposicao_id);
      this.criaForm(this.form);
    }
  }

  carregaDropdownSessionStorage() {
    this.ddProposicao_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-situacao_proposicao'));
    this.ddProposicao_orgao_id = JSON.parse(sessionStorage.getItem('dropdown-orgao_proposicao'));
  }

  criaEditar(a: AndamentoProposicaoI): AndamentoProposicaoFormI {
    if (a.andamento_proposicao_data2 !== null) {
      this.dt = DateTime.fromSQL(a.andamento_proposicao_data2);
      this.dtjs = this.dt.toJSDate();
    }
    this.andamentoClone = a;
    const form: AndamentoProposicaoFormI = {};
    form.andamento_proposicao_id = a.andamento_proposicao_id;
    form.andamento_proposicao_proposicao_id = a.andamento_proposicao_proposicao_id;
    form.andamento_proposicao_data2 = a.andamento_proposicao_data2;
    form.andamento_proposicao_data = a.andamento_proposicao_data
    form.andamento_proposicao_situacao_id = +a.andamento_proposicao_situacao_id;
    form.andamento_proposicao_relator_atual = a.andamento_proposicao_relator_atual;
    form.andamento_proposicao_texto = this.stripslashes(a.andamento_proposicao_texto);
    form.andamento_proposicao_texto_delta = a.andamento_proposicao_texto_delta;
    form.andamento_proposicao_texto_texto = a.andamento_proposicao_texto_texto;
    form.andamento_proposicao_orgao_id = a.andamento_proposicao_orgao_id;
    form.sn_relator_atual = 0;
    form.sn_orgao = 0;
    form.sn_situacao = 0;
    // this.cp = InOutCampoTexto(a.andamento_proposicao_texto, a.andamento_proposicao_texto_delta);
    return form;
  }

  criaIncluir(id: number): AndamentoProposicaoFormI {
    this.dt = DateTime.now().setZone('America/Sao_Paulo');
    this.dtjs = this.dt.toJSDate();
    const form: AndamentoProposicaoFormI = {};
    form.andamento_proposicao_proposicao_id = id;
    form.andamento_proposicao_data2 = null;
    form.andamento_proposicao_data = null;
    form.andamento_proposicao_situacao_id = null;
    form.andamento_proposicao_relator_atual = null;
    form.andamento_proposicao_texto = null;
    form.andamento_proposicao_texto_delta = null;
    form.andamento_proposicao_texto_texto = null;
    form.andamento_proposicao_orgao_id = null;
    form.sn_relator_atual = 0;
    form.sn_orgao = 0;
    form.sn_situacao = 0;
    // this.cp = InOutCampoTexto(null, null);
    return form;
  }

  criaForm(a: AndamentoProposicaoFormI) {
    this.formAnd = this.fb.group({
      andamento_proposicao_data: [this.dtjs, Validators.required],
      andamento_proposicao_relator_atual: [a.andamento_proposicao_relator_atual],
      sn_relator_atual: [false],
      andamento_proposicao_orgao_id: [a.andamento_proposicao_orgao_id],
      sn_orgao: [false],
      andamento_proposicao_situacao_id: [a.andamento_proposicao_situacao_id],
      sn_situacao: [false],
      andamento_proposicao_texto: [this.stripslashes(a.andamento_proposicao_texto)]
    });
    this.sn_relator_atual = false;
    this.sn_situacao = false;
    this.sn_orgao = false;
  }

  onSubmit() {
    this.verificaValidacoesForm(this.formAnd);
    if(this.formAnd.valid) {
      this.botaoEnviarVF = true;
      if (this.acao === 'incluir') {
        this.incluir();
      }
      if (this.acao === 'alterar') {
        this.alterar();
      }
    } else {
      this.verificaValidacoesForm(this.formAnd);
    }
  }

  criaEnvio(): AndamentoProposicaoFormI {
    const e: AndamentoProposicaoFormI = {};
    const tmp0: DateTime = DateTime.fromJSDate(this.formAnd.get('andamento_proposicao_data').value);
    e.andamento_proposicao_proposicao_id = this.form.andamento_proposicao_proposicao_id;
    if (this.acao === 'alterar') {
      e.andamento_proposicao_id = this.form.andamento_proposicao_id;
      if (this.form.andamento_proposicao_data2 !== tmp0.toSQLDate()) {
        e.andamento_proposicao_data = tmp0.toSQLDate();
      }
      if (this.sn_relator_atual) {
        let tmp1: string | null = this.formAnd.get('andamento_proposicao_relator_atual').value;
        if (tmp1 !== null) {
          tmp1 = tmp1.toUpperCase();
        }
        if (this.form.andamento_proposicao_relator_atual !== tmp1) {
          e.andamento_proposicao_relator_atual = tmp1;
          e.sn_relator_atual = 1;
        } else {
          e.sn_relator_atual = 0;
        }
      } else {
        e.sn_relator_atual = 0;
      }
      if (this.sn_orgao && +this.form.andamento_proposicao_orgao_id !== +this.formAnd.get('andamento_proposicao_orgao_id').value) {
        e.andamento_proposicao_orgao_id = +this.formAnd.get('andamento_proposicao_orgao_id').value;
        e.sn_orgao = 1;
      } else {
        e.sn_orgao = 0;
      }
      if (this.sn_situacao && +this.form.andamento_proposicao_situacao_id !== +this.formAnd.get('andamento_proposicao_situacao_id').value) {
        e.andamento_proposicao_situacao_id = +this.formAnd.get('andamento_proposicao_situacao_id').value;
        e.sn_situacao = 1;
      } else {
        e.sn_situacao = 0;
      }
      if(this.form.andamento_proposicao_texto !== this.formAnd.get('andamento_proposicao_texto').value) {
        e.andamento_proposicao_texto = this.formAnd.get('andamento_proposicao_texto').value;
        e.andamento_proposicao_texto_delta = JSON.stringify(this.kill0.getContents());
        e.andamento_proposicao_texto_texto = this.kill0.getText();
      }
    }

    if(this.acao === 'incluir') {
      e.andamento_proposicao_data = tmp0.toSQLDate();
      e.sn_relator_atual = (this.sn_relator_atual) ? 1 : 0;
      if (this.sn_relator_atual) {
        e.andamento_proposicao_relator_atual = this.formAnd.get('andamento_proposicao_relator_atual').value;
      }
      e.sn_orgao = (this.sn_orgao) ? 1 : 0;
      if (this.sn_orgao) {
        e.andamento_proposicao_orgao_id = +this.formAnd.get('andamento_proposicao_orgao_id').value;
      }
      e.sn_situacao = (this.sn_situacao) ? 1 : 0;
      if (this.sn_situacao) {
        e.andamento_proposicao_situacao_id = +this.formAnd.get('andamento_proposicao_situacao_id').value;
      }
      e.andamento_proposicao_texto = this.formAnd.get('andamento_proposicao_texto').value;
      e.andamento_proposicao_texto_delta = JSON.stringify(this.kill0.getContents());
      e.andamento_proposicao_texto_texto = this.kill0.getText();
    }
    return e;
  }

  incluir() {
    const p: AndamentoProposicaoFormI = this.criaEnvio();
    this.sub.push(this.aps.incluir(p)
      .pipe(take(1))
      .subscribe({
        next: (dados: any[]) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'INCLUIR ANDAMENTO',
              detail: 'Andamento incluido com sucesso.'
            });
            const a: AndamentoProposicaoI = this.resp[2];
            const i: number = this.proposicao.andamento_proposicao.findIndex(ix => ix.andamento_proposicao_id === a.andamento_proposicao_id);
            if (this.sn_relator_atual) {
              this.proposicao.andamento_proposicao_relator_atual = a.andamento_proposicao_relator_atual;
            }
            if (this.sn_orgao) {
              this.proposicao.proposicao_orgao_id = a.andamento_proposicao_orgao_id;
              this.proposicao.proposicao_orgao_nome = a.andamento_proposicao_orgao_nome;
            }
            if (this.sn_situacao) {
              this.proposicao.proposicao_situacao_id = a.andamento_proposicao_situacao_id;
              this.proposicao.proposicao_situacao_nome = a.andamento_proposicao_situacao_nome;
            }
            this.proposicao.andamento_proposicao_texto = a.andamento_proposicao_texto;
            this.proposicao.andamento_proposicao_texto_delta = a.andamento_proposicao_texto_delta;
            this.proposicao.andamento_proposicao_texto_texto = a.andamento_proposicao_texto_texto;
            this.proposicao.andamento_proposicao_data = a.andamento_proposicao_data;
            this.proposicao.andamento_proposicao_id = +a.andamento_proposicao_id;
            this.proposicao.andamento_proposicao.push(a);
            this.novoRegistro.emit(this.proposicao);
            if (this.listarVF) {
              this.apListarChange.emit(this.proposicao.andamento_proposicao);
            }
            this.displayChange.emit(false);
          } else {
            this.botaoEnviarVF = false;
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
    this.botaoEnviarVF = false;
  }

  alterar() {
    const p: AndamentoProposicaoFormI = this.criaEnvio();
    this.sub.push(this.aps.alterar(p)
      .pipe(take(1))
      .subscribe({
        next: (dados: any[]) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'ALTERAR ANDAMENTO',
              detail: 'Andamento alterado com sucesso.'
            });
            const a: AndamentoProposicaoI = this.resp[2];
            const i: number = this.proposicao.andamento_proposicao.findIndex(ix => ix.andamento_proposicao_id === a.andamento_proposicao_id);
            if (this.sn_relator_atual) {
              this.proposicao.andamento_proposicao_relator_atual = a.andamento_proposicao_relator_atual;
            }
            if (this.sn_orgao) {
              this.proposicao.proposicao_orgao_id = a.andamento_proposicao_orgao_id;
              this.proposicao.proposicao_orgao_nome = a.andamento_proposicao_orgao_nome;
            }
            if (this.sn_situacao) {
              this.proposicao.proposicao_situacao_id = a.andamento_proposicao_situacao_id;
              this.proposicao.proposicao_situacao_nome = a.andamento_proposicao_situacao_nome;
            }
            this.proposicao.andamento_proposicao_texto = a.andamento_proposicao_texto;
            this.proposicao.andamento_proposicao_texto_delta = a.andamento_proposicao_texto_delta;
            this.proposicao.andamento_proposicao_texto_texto = a.andamento_proposicao_texto_texto;
            this.proposicao.andamento_proposicao_data = a.andamento_proposicao_data;
            this.proposicao.andamento_proposicao_id = +a.andamento_proposicao_id;
            this.proposicao.andamento_proposicao[i] = a;
            this.novoRegistro.emit(this.proposicao);
            this.apListarChange.emit(this.proposicao.andamento_proposicao);
            this.displayChange.emit(false);
          } else {
            this.botaoEnviarVF = false;
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
    this.botaoEnviarVF = false;
  }



  onNovoRegistroAux(ev) {
    if (ev.campo === 'proposicao_situacao_id') {
      this.ddProposicao_situacao_id = ev.dropdown;
    }
    if (ev.campo === 'proposicao_orgao_id') {
      this.ddProposicao_orgao_id = ev.dropdown;
    }
    // this.formProp.get(ev.campo).patchValue(ev.valorId);
  }

  onBlockSubmit($event) {

  }

  verificaValidTouched(campo: string) {
    return (
      !this.formAnd.get(campo).valid &&
      (this.formAnd.get(campo).touched || this.formAnd.get(campo).dirty)
    );
  }

  verificaQuillRequired(ev: any) {

  }

  verificaRequired(campo: string) {
    return (
      this.formAnd.get(campo).hasError('required') &&
      (this.formAnd.get(campo).touched || this.formAnd.get(campo).dirty)
    );
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      controle.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  aplicaCssErro(campo: string) {
    return {
      'ng-invalid': (this.verificaValidTouched(campo) || this.verificaRequired(campo))
    };
  }

  onEditorCreated(ev) {
    this.kill0 = ev;
    this.kill0.update('user');
  }

  onChange0(ev) {
    if (!ev.checked) {
      this.formAnd.get('andamento_proposicao_relator_atual').setValue(this.form.andamento_proposicao_relator_atual);
    }
    this.sn_relator_atual = ev.checked;
  }

  onChange1(ev) {
    if (!ev.checked) {
      this.formAnd.get('andamento_proposicao_orgao_id').setValue(this.form.andamento_proposicao_orgao_id);
    }
    this.sn_orgao = ev.checked;
  }

  onChange2(ev) {
    if (!ev.checked) {
      this.formAnd.get('andamento_proposicao_situacao_id').setValue(this.form.andamento_proposicao_situacao_id);
    }
    this.sn_situacao = ev.checked;
  }

  ngOnDestroy(): void {
    this.formAnd.reset();
    this.botaoEnviarVF = false;
    this.sub.forEach(s => s.unsubscribe());
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  resetForm() {
    this.formAnd.reset();
    this.criaForm(this.form);
    this.criaEnvio();
  }

  fechar() {
    this.displayChange.emit(false);
  }

}
