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
import {CampoQuillI} from "../../_models/campo-quill-i";
import Quill from "quill";

@Component({
  selector: 'app-hist-form',
  templateUrl: './hist-form.component.html',
  styleUrls: ['./hist-form.component.css']
})
export class HistFormComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('histand', {static: false}) histand: Editor;
  @Input() display?: boolean;
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() dados?: HistFormI | null = null;
  @Output() dadosChange = new EventEmitter<HistFormI>();
  @Input() classeStylos?: string;
  // @Input() acao: string = 'incluir';
  // @Input() modulo: string = 'solicitacao';

  mostraForm = false;
  mostraBotao = true;
  btDesabilitado = false
  his: HistI;
  acao = '';
  estilo = 'formulario-quill';
  formHis: FormGroup;
  historico: HistFormI;
  titulo = 'SOLICITAÇÃO';
  tituloBtn = 'INCLUIR';
  modulo = 'processo';
  formato: 'object' | 'html' | 'text' | 'json' = 'object';
  sub: Subscription[] = [];

  resp: any[] = [false, 'ATENÇÃO - ERRO', null];
  modulos: any;

    toolbar = [
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
    ];


  constructor(
    private fb: FormBuilder,
    public aut: AuthenticationService,
    private hs: HistService,
    private ms: MessageService
  ) { }

  ngOnInit(): void {
    this.criaForm();
    this.configuraEditor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dados) {
      if (changes.dados.currentValue !== null) {
        this.historico = changes.dados.currentValue;
        this.his = this.historico.hist;
        this.modulo = this.historico.modulo;
        this.acao = this.historico.acao;
        this.formHis.get('historico_data').patchValue(new Date());
        if ( this.acao === 'alterar') {
          this.tituloBtn = 'ALTERAR';
          if (this.his.historico_andamento_delta !== null) {
            this.histand.getQuill().setContents(this.his.historico_andamento_delta);
          } else {
            if (this.his.historico_andamento !== null) {
              this.histand.getQuill().setText(this.his.historico_andamento);
            }
          }
          if (this.his.historico_data2 !== undefined) {
            this.formHis.get('historico_data').patchValue(new Date(this.his.historico_data2));
          }
        } else {
          this.tituloBtn = 'INCLUIR';
        }
        if (this.modulo === 'processo') {
          this.titulo = 'PROCESSO';
        } else {
          this.titulo = 'SOLICITAÇÃO';
        }
        this.mostraForm = true;

        if (changes.classeStylos) {
          this.estilo = changes.classeStylos.currentValue;
        }

      }

    }
  }


  fechar() {
    this.formHis.reset();
    this.his = {};
    this.historico.acao = '';
    // this.formHis = undefined;
    // this.historico = undefined;
    this.dadosChange.emit(this.historico);
    this.displayChange.emit(false);
  }

  criaForm() {
    this.formHis = this.fb.group({
      historico_data: [null, Validators.required],
      historico_andamento: [null, Validators.required]
    });
  }

  configuraEditor() {
    this.modulos = {
      toolbar: this.toolbar
    };
  }

  onSubmit() {
    console.log('submit1');
    if (this.formHis.valid && this.criaEnvio()) {
      this.btDesabilitado = true;
      if (this.historico.acao === 'incluir') {
        this.incluir();
        console.log('submit2');
      }
      if (this.historico.acao === 'alterar') {
        this.alterar();
      }
      console.log('submit3');
    } else {
      this.verificaValidacoesForm(this.formHis);
    }
  }

  resetForm() {
    this.btDesabilitado = false;
    this.formHis.reset();
    if ( this.acao === 'alterar' && this.resp[2] === null) {
      if (this.his.historico_andamento_delta !== null) {
        this.histand.getQuill().setContents(this.his.historico_andamento_delta);
      } else {
        if (this.his.historico_andamento !== null) {
          this.histand.getQuill().setText(this.his.historico_andamento);
        }
      }
      if (this.his.historico_data2 !== null) {
        this.formHis.get('historico_data').patchValue(new Date(this.his.historico_data2));
      }
    }
    if (this.resp[2] !== null) {
      this.histand.getQuill().setContents(this.historico.hist.historico_andamento_delta);
      this.formHis.get('historico_data').patchValue(this.historico.hist.historico_data2);
    }
    window.scrollTo(0, 0);
  }

  incluir() {
    if (this.formHis.valid) {
      this.sub.push(this.hs.incluir(this.historico)
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
              this.historico.hist = this.resp[2];
              this.ms.add({
                key: 'principal',
                severity: 'success',
                summary: 'ANDAMENTO',
                detail: this.resp[1],
              });
              this.dadosChange.emit(this.historico);
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
      this.sub.push(this.hs.alterar(this.historico)
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
              this.historico.hist = this.resp[2];
              this.dadosChange.emit(this.historico);
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
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-invalid2': this.verificaRequired(campo)
    };
  }

  criaEnvio(): boolean {
    const n: number = this.histand.getQuill().getLength();
    if (n < 2) {
      return false;
    }
    const ql: CampoQuillI = {
      campo_html: this.formHis.get('historico_andamento').value,
      campo_delta: this.histand.getQuill().getContents(),
      campo_txt: this.histand.getQuill().getText()
    }
    if (this.historico.acao === 'alterar') {
      if (
        this.historico.hist.historico_andamento === ql.campo_html &&
        this.historico.hist.historico_data === this.formHis.get('historico_data').value
      ) {
        return false;
      }
    }
    this.historico = {
      acao: this.historico.acao,
      modulo: this.historico.modulo,
      hist: {
        historico_data: this.formHis.get('historico_data').value,
        historico_andamento: ql.campo_html,
        historico_andamento_delta: ql.campo_delta,
        historico_andamento_texto: ql.campo_txt
      }
    }
/*    if (this.historico.acao === 'alterar') {
      this.historico.hist.historico_id = this.dados.hist.historico_id;
    }*/
    if (this.dados.modulo === 'solicitacao') {
      this.historico.hist.historico_solocitacao_id = this.dados.hist.historico_solocitacao_id;
    } else {
      this.historico.hist.historico_processo_id = this.dados.hist.historico_processo_id;
    }

    return true;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
