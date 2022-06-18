import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../_services";
import {take} from "rxjs/operators";
import {HistFormI, HistI} from "../_models/hist-i";
import {HistService} from "../_services/hist.service";
import {HistAuxService} from "../_services/hist-aux.service";
import {CpoEditor, InOutCampoTexto} from "../../_models/in-out-campo-tezto";
import {MsgService} from "../../_services/msg.service";

@Component({
  selector: 'app-hist-form',
  templateUrl: './hist-form.component.html',
  styleUrls: ['./hist-form.component.css']
})
export class HistFormComponent implements OnInit, OnDestroy, OnChanges {
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() display: boolean = false;
  @Output() novoRegistro = new EventEmitter<HistFormI>();
  @Output() dialogExterno = new EventEmitter<boolean>();
  @Input() histFormI?: HistFormI

  cpoEditor: CpoEditor | null = null;
  formHis: FormGroup;
  sub: Subscription[] = [];
  resp: any[] = [false, 'ATENÇÃO - ERRO', null];
  // format: 'html' | 'object' | 'text' | 'json' =  'json';
  format: string =  'json';
  vquill: any = null;
  valor: any = null;
  modulos = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean']                        // link and image, video
    ]
  };
  incluirPerm = false;
  alterarPerm = false;
  apagarPerm = false;

  constructor(
    private fb: FormBuilder,
    public aut: AuthenticationService,
    private hs: HistService,
    public has: HistAuxService,
    private ms: MsgService
  ) {
    this.formHis = this.fb.group({
      historico_data: [null, [Validators.required, Validators.minLength(3)]],
      historico_andamento: [null, Validators.required]
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.histFormI.modulo === 'solicitacao') {
      this.incluirPerm =  (this.aut.historico_solicitacao_incluir || this.aut.solicitacao_incluir || this.aut.solicitacao_analisar || this.aut.solicitacao_alterar || this.aut.solicitacao_apagar || this.aut.usuario_responsavel_sn);
      this.alterarPerm =  (this.aut.historico_solicitacao_alterar || this.aut.solicitacao_incluir || this.aut.solicitacao_analisar || this.aut.solicitacao_alterar || this.aut.solicitacao_apagar || this.aut.usuario_responsavel_sn);
      this.apagarPerm = (this.aut.historico_solicitacao_apagar || this.aut.solicitacao_incluir || this.aut.solicitacao_analisar || this.aut.solicitacao_alterar || this.aut.solicitacao_apagar || this.aut.usuario_responsavel_sn);
    }
    if (this.histFormI.modulo === 'processo') {
      this.incluirPerm =  ((this.aut.solicitacaoVersao === 1) && (this.aut.historico_incluir || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
      this.alterarPerm =  ((this.aut.solicitacaoVersao === 1) && (this.aut.historico_alterar || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
      this.apagarPerm = ((this.aut.solicitacaoVersao === 1) && (this.aut.historico_apagar || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
    }

  }

  ngOnInit(): void {
    this.carregaForm();
  }

  carregaForm() {
    if (this.histFormI.acao === 'alterar') {
      this.formHis.get('historico_data').patchValue(new Date(this.histFormI.hist.historico_data2));
      const cp = InOutCampoTexto(this.histFormI.hist.historico_andamento, this.histFormI.hist.historico_andamento_delta);
      this.format = cp.format;
      if (cp.vf) {
        this.formHis.get('historico_andamento').setValue(cp.valor);
      }
    } else {
      this.format = 'html';
      this.formHis.get('historico_data').patchValue(new Date());
    }
    this.dialogExterno.emit(false);
  }

  escondeFormulario(vf: boolean) {
    this.formHis.reset();
  }

  fechar() {
    this.dialogExterno.emit(true);
    if (this.histFormI.acao === 'incluir') {
      this.formHis.reset();
    }
    this.displayChange.emit(false);
  }

  resetForm() {
    this.formHis.reset();
    if ( this.histFormI.acao === 'alterar' && this.resp[2] === null) {
      this.carregaForm();
    }
    if (this.resp[2] !== null) {
      this.formHis.get('historico_data').patchValue(new Date(this.histFormI.hist.historico_data2));
      const cp = InOutCampoTexto(this.histFormI.hist.historico_andamento, this.histFormI.hist.historico_andamento_delta);
      this.format = cp.format;
      if (cp.vf) {
        this.formHis.get('historico_andamento').setValue(cp.valor);
      }
    }
    window.scrollTo(0, 0);
  }

  onSubmit() {
    if (this.formHis.valid && this.criaEnvio()) {
      if (this.histFormI.acao !== 'alterar') {
        this.incluir();
      }
      if (this.histFormI.acao === 'alterar') {
        this.alterar();
      }
    } else {
      this.verificaValidacoesForm(this.formHis);
    }
  }

  incluir() {
    if (this.formHis.valid) {
      this.sub.push(this.hs.incluir(this.histFormI)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({
              key: 'principal',
              severity: 'warn',
              summary: this.resp[1],
              detail: this.resp[2]
            });
            console.error(err);
            this.resetForm();
          },
          complete: () => {
            if (this.resp[0]) {
              this.ms.add({
                key: 'principal',
                severity: 'success',
                summary: 'ANDAMENTO',
                detail: this.resp[1],
              });
              this.histFormI.hist = this.resp[2];
              this.novoRegistro.emit(this.histFormI);
              this.fechar();
            } else {
              this.ms.add({
                key: 'principal',
                severity: 'warn',
                summary: this.resp[1],
                detail: this.resp[2]
              });
              this.resetForm();
            }

          }
        })
      );
    }
  }

  alterar() {
    if (this.formHis.valid) {
      this.sub.push(this.hs.alterar(this.histFormI)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({
              key: 'principal',
              severity: 'warn',
              summary: this.resp[1],
              detail: this.resp[2]
            });
            console.error(err);
            this.resetForm();
          },
          complete: () => {
            if (this.resp[0]) {
              this.ms.add({
                key: 'principal',
                severity: 'success',
                summary: 'ANDAMENTO',
                detail: 'Andamento incluido com sucesso.'
              });

              delete this.histFormI.hist;
              this.histFormI.hist = this.resp[2];
              this.novoRegistro.emit(this.histFormI);
              this.fechar();
            } else {
              this.ms.add({
                key: 'principal',
                severity: 'warn',
                summary: this.resp[1],
                detail: this.resp[2]
              });
              this.resetForm();
            }

          }
        })
      );
    }
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formHis.get(campo).valid &&
      (this.formHis.get(campo).touched || this.formHis.get(campo).dirty)
    );
  }

  verificaQuillRequired(ev: any) {

  }

  verificaRequired(campo: string) {
    return (
      this.formHis.get(campo).hasError('required') &&
      (this.formHis.get(campo).touched || this.formHis.get(campo).dirty)
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

  criaEnvio(): boolean {
    if (this.cpoEditor === null) {
      return false;
    }
    if (this.histFormI.acao === 'alterar') {
      if (this.histFormI.hist.historico_andamento === this.cpoEditor.html && this.histFormI.hist.historico_andamento_delta === this.cpoEditor.delta) {
        return false;
      }
    }
    this.histFormI.hist.historico_andamento = this.cpoEditor.html;
    this.histFormI.hist.historico_andamento_delta = JSON.stringify(this.cpoEditor.delta);
    this.histFormI.hist.historico_andamento_texto = this.cpoEditor.text;
    this.histFormI.hist.historico_data = this.formHis.get('historico_data').value;
    return true;
  }

  onContentChanged(ev) {
    this.cpoEditor = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
