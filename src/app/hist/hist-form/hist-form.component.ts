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
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../_services";
import {take} from "rxjs/operators";
import {HistFormI, HistI} from "../_models/hist-i";
import {HistService} from "../_services/hist.service";
import {Editor} from "primeng/editor";
import {MessageService} from 'primeng-lts/api';
import {CampoQuillI, HandlerQuillI} from "../../_models/campo-quill-i";
import Quill from "quill";
import {HistAuxService} from "../_services/hist-aux.service";
import {invalid} from "@angular/compiler/src/render3/view/util";

@Component({
  selector: 'app-hist-form',
  templateUrl: './hist-form.component.html',
  styleUrls: ['./hist-form.component.css']
})
export class HistFormComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('histand', {static: false}) histand: Editor;
  @Input() display?: boolean;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() novoRegistro = new EventEmitter<HistFormI>();
  // @Input() mostraBtsExterno?: boolean;
  // @Output() mostraBtsExternoChange = new EventEmitter<boolean>();
  @Output() mostraBtsExterno = new EventEmitter<boolean>();

  @Input() classeStylos?: string;
  @Input() id: number;
  @Input() idx: number | null;
  @Input() acao: string;
  // @Input() mostraForm: boolean;

  mostraForm = false;
  mostraDialog = false;
  mostraDialog2 = false
  mostraBotao = true;
  btDesabilitado = false;
  // histI?: HistI;
  histFormI: HistFormI = {
    hist: {}
  };
  formHis: FormGroup;
  titulo = 'SOLICITAÇÃO';
  sub: Subscription[] = [];
  ii: number;
  cssEsconde = 'p-mr-2';
  cssEsconde2 = null;

  resp: any[] = [false, 'ATENÇÃO - ERRO', null];
  // modulos: any;

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

  // displayForm = true;
  ct = 0;
  incluirPerm = false;
  alterarPerm = false;
  apagarPerm = false;



  constructor(
    private fb: FormBuilder,
    public aut: AuthenticationService,
    private hs: HistService,
    private ms: MessageService,
    public has: HistAuxService
  ) {
    this.histFormI.modulo = this.has.histListI.modulo;
    if (this.has.histListI.modulo === 'solicitacao') {
      this.titulo = 'SOLICITAÇÃO';
      this.incluirPerm =  this.aut.historico_solicitacao_incluir;
      this.alterarPerm =  this.aut.historico_solicitacao_alterar;
      this.apagarPerm = this.aut.historico_solicitacao_apagar;
    } else {
      this.titulo = 'PROCESSO';
      this.incluirPerm =  this.aut.historico_incluir;
      this.alterarPerm =  this.aut.historico_alterar;
      this.apagarPerm = this.aut.historico_apagar;
    }


  }

  ngOnInit(): void {
  }

  mostraBts(vf: boolean) {
    this.mostraBtsExterno.emit(vf);
  }

  carregaForm() {
    this.mostraBtsExterno.emit(false);
    if (this.histFormI.acao === 'alterar') {
      this.formHis.get('historico_data').patchValue(new Date(this.histFormI.hist.historico_data2));
      if (this.histFormI.hist.historico_andamento_delta) {
        this.histand.getQuill().setContents(this.histFormI.hist.historico_andamento_delta, 'api');
      } else {
        this.histand.getQuill().setText(this.histFormI.hist.historico_andamento, 'api');
      }
    }
  }

  formMostra(acao: string, id: number, idx: number) {
    this.mostraForm = true;
    this.formHis = this.fb.group({
      historico_data: [null, [Validators.required, Validators.minLength(3)]],
      historico_andamento: [null, Validators.required]
    });
    this.criarForm();
  }

  criarForm() {
    this.histFormI.acao = this.acao;
    if (this.histFormI.acao === 'alterar') {
      this.histFormI.idx = this.idx;
      this.histFormI.hist = this.has.histListI.hist[this.idx];
    } else {
        if (this.histFormI.modulo === 'solicitacao') {
          this.histFormI.hist.historico_solocitacao_id = this.id;
        } else {
          this.histFormI.hist.historico_processo_id = this.id;
        }
    }
    this.mostraDialog = true;
    console.log('this.criarForm',this.histFormI);
  }

  ngOnChanges(changes: SimpleChanges) {
    /*if (changes.mostraBtsExterno) {
      if (changes.mostraBtsExterno.currentValue === true) {
        // this.mostraBts(true);
      }
      if (changes.mostraBtsExterno.currentValue === false) {
        // this.mostraBts(false);
      }
    }*/
    /*this.formHis = this.fb.group({
      historico_data: [null, Validators.required],
      historico_andamento: [null, Validators.required]
    });*/
    /*if (changes.acao) {
      this.acao = changes.acao.currentValue;
      this.histFormI.acao = changes.acao.currentValue;
      // this.criarForm();
    }
    if (changes.idx) {
      if (changes.idx.currentValue !== null) {
        this.histFormI.idx = changes.idx.currentValue;
        this.histI = this.has.histListI.hist[changes.idx.currentValue];
      }
      // this.criarForm();
    }
    if (changes.id) {
      this.histFormI.hist.historico_id = changes.id.currentValue;
      // this.criarForm();
    }*/
  }

  escondeFormulario(vf: boolean) {
    this.formHis.reset();
    this.mostraBts(true);
    this.displayChange.emit(false);
    this.mostraForm = false;
  }

  fechar() {
    this.mostraDialog = false;
  }

  getHeader(): string {
    return this.acao.toUpperCase()+ ' ANDAMENTO ' + this.has.histListI.modulo.toUpperCase();
  }

  resetForm() {
    this.btDesabilitado = false;
    this.formHis.reset();
    if ( this.acao === 'alterar' && this.resp[2] === null) {
      if (this.histFormI.hist.historico_andamento_delta !== null) {
        this.histand.getQuill().setContents(this.histFormI.hist.historico_andamento_delta);
      } else {
        if (this.histFormI.hist.historico_andamento !== null) {
          this.histand.getQuill().setText(this.histFormI.hist.historico_andamento);
        }
      }
      if (this.histFormI.hist.historico_data2 !== null) {
        this.formHis.get('historico_data').patchValue(new Date(this.histFormI.hist.historico_data2));
      }
    }
    if (this.resp[2] !== null) {
      this.histand.getQuill().setContents(this.histFormI.hist.historico_andamento_delta);
      this.formHis.get('historico_data').patchValue(this.histFormI.hist.historico_data2);
    }
    window.scrollTo(0, 0);
  }

  onSubmit() {
    if (this.formHis.valid && this.criaEnvio()) {
      this.btDesabilitado = true;
      if (this.acao === 'incluir') {
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
              this.histFormI.hist = this.resp[2];
              this.novoRegistro.emit(this.histFormI);
              // this.has.histFormI = this.histFormI;
              // this.has.histListI.hist.push(this.resp[2]);
              this.ms.add({
                key: 'principal',
                severity: 'success',
                summary: 'ANDAMENTO',
                detail: this.resp[1],
              });
              // this.dadosChange.emit(this.historico);
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
              this.histFormI.hist = this.resp[2];
              // this.dadosChange.emit(this.historico);
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

    // const z = this.histand.getQuill().minLength(2);

    const ql: HandlerQuillI = ev;
    /*const ql: CampoQuillI = {
      campo_html: this.formHis.get(campo).value,
      campo_delta: JSON.stringify(this.histand.getQuill().getContents()),
      campo_txt: this.histand.getQuill().getText()
    }
    const ql2: any = {
      campo_html: ql.campo_html.length,
      campo_delta: ql.campo_delta.length,
      campo_txt: ql.campo_txt.length
    }*/
    // console.log('verificaQuillRequired', z);
    // console.log('verificaQuillRequired2', ql2);

    /*return (
      !this.formHis.get(campo).valid &&
      (this.formHis.get(campo).touched || this.formHis.get(campo).dirty)
    );*/
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
    const n: number = this.histand.getQuill().getLength();
    if (n < 2) {
      this.histand.getQuill().invalid;
      return false;
    }
    const ql: CampoQuillI = {
      campo_html: this.formHis.get('historico_andamento').value,
      campo_delta: JSON.stringify(this.histand.getQuill().getContents()),
      campo_txt: this.histand.getQuill().getText()
    }
    if (this.histFormI.acao === 'alterar') {
      if (
        this.histFormI.hist.historico_andamento === ql.campo_html &&
        this.histFormI.hist.historico_data === this.formHis.get('historico_data').value
      ) {
        return false;
      }
    }
    this.histFormI.hist.historico_andamento = ql.campo_html;
    this.histFormI.hist.historico_andamento_delta = ql.campo_delta;
    this.histFormI.hist.historico_andamento_texto = ql.campo_txt;
    this.histFormI.hist.historico_data = this.formHis.get('historico_data').value;
    console.log('criaEnvio', this.histFormI);
    return true;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
