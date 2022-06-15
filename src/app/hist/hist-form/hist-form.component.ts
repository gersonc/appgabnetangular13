import {
  Component,
  EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../_services";
import {take} from "rxjs/operators";
import {HistFormI} from "../_models/hist-i";
import {HistService} from "../_services/hist.service";
import {Editor} from "primeng/editor";
import {MessageService} from 'primeng-lts/api';
import {HistAuxService} from "../_services/hist-aux.service";
import {CpoEditor, InOutCampoTexto} from "../../_models/in-out-campo-tezto";
import {MsgService} from "../../_services/msg.service";

@Component({
  selector: 'app-hist-form',
  templateUrl: './hist-form.component.html',
  styleUrls: ['./hist-form.component.css']
})
export class HistFormComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('histand', {static: true}) histand: Editor;
  @Input() display?: boolean;
  @Output() novoRegistro = new EventEmitter<HistFormI>();
  @Output() dialogExterno = new EventEmitter<boolean>();

  @Input() classeStylos?: string;
  @Input() id: number;
  @Input() idx: number | null;
  @Input() acao: string;
  @Input() modulo: string;

  mostraForm = false;
  mostraDialog = false;
  btDesabilitado = false;
  delta: any = null;
  histFormI: HistFormI = {
    hist: {}
  };
  cpoEditor: CpoEditor | null = null;
  formHis: FormGroup;
  titulo = 'SOLICITAÇÃO';
  sub: Subscription[] = [];
  cssEsconde = 'p-mr-2';
  indice = 0;
  btnIncluir = '';
  tooltip = '';


  resp: any[] = [false, 'ATENÇÃO - ERRO', null];
  format: 'html' | 'object' | 'text' | 'json' =  'json';
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

  // ct = 0;
  incluirPerm = false;
  alterarPerm = false;
  apagarPerm = false;



  constructor(
    private fb: FormBuilder,
    public aut: AuthenticationService,
    private hs: HistService,
    private msg: MessageService,
    public has: HistAuxService,
    private ms: MsgService
  ) {
    /*if (this.has.histFormI.modulo === 'solicitacao') {
      this.titulo = 'SOLICITAÇÃO';
      this.incluirPerm =  (this.aut.historico_solicitacao_incluir || this.aut.solicitacao_incluir || this.aut.solicitacao_analisar || this.aut.solicitacao_alterar || this.aut.solicitacao_apagar || this.aut.usuario_responsavel_sn);
      this.alterarPerm =  (this.aut.historico_solicitacao_alterar || this.aut.solicitacao_incluir || this.aut.solicitacao_analisar || this.aut.solicitacao_alterar || this.aut.solicitacao_apagar || this.aut.usuario_responsavel_sn);
      this.apagarPerm = (this.aut.historico_solicitacao_apagar || this.aut.solicitacao_incluir || this.aut.solicitacao_analisar || this.aut.solicitacao_alterar || this.aut.solicitacao_apagar || this.aut.usuario_responsavel_sn);
    } else {
      this.titulo = 'PROCESSO';
      this.incluirPerm =  ((this.aut.solicitacaoVersao === 1) && (this.aut.historico_incluir || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
      this.alterarPerm =  ((this.aut.solicitacaoVersao === 1) && (this.aut.historico_alterar || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
      this.apagarPerm = ((this.aut.solicitacaoVersao === 1) && (this.aut.historico_apagar || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
    }*/
    this.formHis = this.fb.group({
      historico_data: [null, [Validators.required, Validators.minLength(3)]],
      historico_andamento: [null, Validators.required]
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    this.histFormI.modulo = this.modulo;
    if (this.modulo === 'solicitacao') {
      this.btnIncluir = 'botaoinferior p-button-rounded p-button-cyan';
      this.tooltip = 'Incluir Andamento da Solicitação';
      this.titulo = 'SOLICITAÇÃO';
      this.incluirPerm =  (this.aut.historico_solicitacao_incluir || this.aut.solicitacao_incluir || this.aut.solicitacao_analisar || this.aut.solicitacao_alterar || this.aut.solicitacao_apagar || this.aut.usuario_responsavel_sn);
      this.alterarPerm =  (this.aut.historico_solicitacao_alterar || this.aut.solicitacao_incluir || this.aut.solicitacao_analisar || this.aut.solicitacao_alterar || this.aut.solicitacao_apagar || this.aut.usuario_responsavel_sn);
      this.apagarPerm = (this.aut.historico_solicitacao_apagar || this.aut.solicitacao_incluir || this.aut.solicitacao_analisar || this.aut.solicitacao_alterar || this.aut.solicitacao_apagar || this.aut.usuario_responsavel_sn);
    }
    if (this.modulo === 'processo') {
      this.btnIncluir = 'botaoinferior p-button-rounded p-button-purple';
      this.tooltip = 'Incluir Andamento do Processo';
      this.titulo = 'PROCESSO';
      this.incluirPerm =  ((this.aut.solicitacaoVersao === 1) && (this.aut.historico_incluir || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
      this.alterarPerm =  ((this.aut.solicitacaoVersao === 1) && (this.aut.historico_alterar || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
      this.apagarPerm = ((this.aut.solicitacaoVersao === 1) && (this.aut.historico_apagar || this.aut.processo_deferir || this.aut.processo_indeferir || this.aut.usuario_responsavel_sn));
    }
    // this.histFormI.idx = this.idx;
    this.histFormI.hist.historico_solicitacao_id = this.has.histFormI.hist.historico_solicitacao_id;
    this.histFormI.hist.historico_processo_id = this.has.histFormI.hist.historico_processo_id;

  }

  ngOnInit(): void {
    this.histFormI.acao =  (this.acao === 'incluir2' || this.acao === 'incluir') ? 'incluir' : this.acao;
    if (this.histFormI.acao === 'alterar') {
      this.histFormI.hist = this.has.histListI.hist[this.idx];
    }
    this.carregaForm();
  }

  mostraBts(vf: boolean) {
  }

  formMostra(acao: string) {
    // this.histFormI.idx = idx;
    this.mostraForm = true;
    this.mostraDialog = true;
    this.dialogExterno.emit(false);
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
  }

  escondeFormulario(vf: boolean) {
    this.formHis.reset();
    this.mostraForm = false;
  }

  fechar() {
    this.mostraDialog = false;
    this.dialogExterno.emit(true);
    if (this.acao === 'incluir2') {
      this.formHis.reset();
      this.btDesabilitado = false;
      this.mostraForm = false;
    }
  }

  getHeader(): string {
    let t = '';
    if (this.acao === 'incluir' || this.acao === 'incluir2') {
      t = 'INCLUIR';
    } else {
      t = 'ALTERAR';
    }
    return this.titulo + ' - ' + t + ' ANDAMENTO';
  }

  resetForm() {
    this.btDesabilitado = false;
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
      this.btDesabilitado = true;
      if (this.acao !== 'alterar') {
        this.incluir();
      }
      if (this.acao === 'alterar') {
        this.alterar();
      }
    } else {
      this.verificaValidacoesForm(this.formHis);
    }
  }

  incluir() {
    if (this.formHis.valid) {
      this.sub.push(this.hs.incluir(this.has.histFormI)
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
            console.log('fim1');
            if (this.resp[0]) {
              this.ms.add({
                key: 'principal',
                severity: 'success',
                summary: 'ANDAMENTO',
                detail: this.resp[1],
              });
              this.histFormI.hist = this.resp[2];
              /*if (this.acao === 'incluir') {
                this.has.histListI.hist.push(this.resp[2])
              }*/
              this.has.histFormI.hist = this.resp[2];
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
      this.sub.push(this.hs.alterar(this.has.histFormI)
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
            console.log('fim2');
            if (this.resp[0]) {
              this.ms.add({
                key: 'principal',
                severity: 'success',
                summary: 'ANDAMENTO',
                detail: 'Andamento incluido com sucesso.'
              });

              this.histFormI.hist = this.resp[2];

              this.has.histListI.hist.splice(this.idx, 1, this.resp[2])
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
      this.has.histFormI.hist.historico_id = this.histFormI.hist.historico_id;
      if (this.histFormI.hist.historico_andamento === this.cpoEditor.html && this.histFormI.hist.historico_andamento_delta === this.cpoEditor.delta) {
        return false;
      }
    }
    this.has.histFormI.acao = this.histFormI.acao;
    this.has.histFormI.modulo = this.histFormI.modulo;
    this.has.histFormI.idx = this.histFormI.idx;
    this.has.histFormI.hist.historico_andamento = this.cpoEditor.html;
    this.has.histFormI.hist.historico_andamento_delta = JSON.stringify(this.cpoEditor.delta);
    this.has.histFormI.hist.historico_andamento_texto = this.cpoEditor.text;
    this.has.histFormI.hist.historico_data = this.formHis.get('historico_data').value;
    console.log('criaEnvio', this.has.histFormI);
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
