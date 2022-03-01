import {Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SolicitacaoHistoricoInterface} from "../../solocitacao/_models";
import {AuthenticationService} from "../../_services";
import {HistoricoSolicitacaoService} from "../_services/historico-solocitacao.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {HistoricoSolicitacaoI} from "../_models/historico-solocitacao";
import {Delta} from "quill";


@Component({
  selector: 'app-historico-solocitacao-form',
  templateUrl: './historico-solocitacao-form.component.html',
  styleUrls: ['./historico-solocitacao-form.component.css'],
})
export class HistoricoSolicitacaoFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() dados?: any;
  @Input() classeStylos?: string;
  @Input() acao: string;
  @Output() novosDados = new EventEmitter<SolicitacaoHistoricoInterface>();
  mostraBotao = false;
  his: HistoricoSolicitacaoI;
  estilo = 'formulario-quill';
  ac: string;
  showFormulario = false;
  formHis: FormGroup;
  historico: SolicitacaoHistoricoInterface;
  deltaquill: any = null;
  mostraForm = true;
  botaoEnviarVF = false;
  enviando = false;
  acao2 = 'INCLUIR'
  acao3 = 'Incluir Andamento'
  formato: 'object' | 'html' | 'text' | 'json' = 'object';
  sub: Subscription[] = [];
  editor: any;
  editorContent: any;
  editorObject: Delta;
  editorJson: Delta;
  editorTxt: string;
  editorHtml: string;
  resp: any[];
  msg: any[] = [0, null];
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

  constructor(
    private fb: FormBuilder,
    public authenticationService: AuthenticationService,
    private historicoSolicitacaoService: HistoricoSolicitacaoService
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.historicoemenda_incluir)  {
      this.mostraBotao = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dados) {
      const d = changes.dados.currentValue;
      if (typeof changes.dados.currentValue === 'number') {
        this.his = {
          historico_id: null,
          historico_data: null,
          historico_andamento: null,
          historico_andamento_delta: null,
          historico_andamento_texto: null,
          historico_solocitacao_id: d
        }
      } else {
        this.his = {
          historico_id: d.historico_id,
          historico_data: d.historico_data,
          historico_andamento: d.historico_andamento,
          historico_andamento_delta: d.historico_andamento_delta,
          historico_andamento_texto: d.historico_andamento_texto,
          historico_solocitacao_id: d.historico_solocitacao_id
        }
      }
    }

    if (changes.classeStylos) {
      this.estilo = changes.classeStylos.currentValue;
    }

    if (changes.acao) {
      this.ac = changes.acao.currentValue;
      if (this.ac === 'incluir') {
        this.acao2 = 'INCLUIR';
        this.acao3 = 'Incluir Andamento';
      }
      if (this.ac === 'altera') {
        this.acao2 = 'ALTERAR';
        this.acao3 = 'Alterar Andamento';
      }
    }
  }

  formMostra() {
    this.criaForm();
  }

  fechar() {
    this.his = null;
    this.ac = null;
    this.showFormulario = false;
    this.formHis = null
    this.historico = null;
    this.deltaquill = null;
    this.mostraForm = true;
    this.botaoEnviarVF = false;
    this.showFormulario = false;
  }

  escondeFormulario() {

  }

  criaForm() {
    this.formHis = this.fb.group({
      historico_data: [null, Validators.required],
      historico_andamento: [null, Validators.required]
    });
    this.showFormulario = true;
  }

  onEditorCreated(ev) {
    this.editor = ev.Quill;
    if (this.ac === 'alterar') {
      this.formHis.get('historico_data').setValue(this.his.historico_data);
      if (this.his.historico_andamento_delta) {
        this.formato = 'object';
        // this.editor.deleteText(0, this.editor.getLength());
        this.formHis.get('historico_andamento').setValue(JSON.parse(this.his.historico_andamento_delta));
      } else {
        if (this.his.historico_andamento) {
          this.formato = 'html';
          this.formHis.get('historico_andamento').setValue(this.his.historico_andamento);
        } else {
          if (this.his.historico_andamento_texto) {
            this.formato = 'text';
            this.formHis.get('historico_andamento').setValue(this.his.historico_andamento_texto);
          }
        }
      }
    }
  }

  onSubmit() {
    console.log('submit1');
    if (this.formHis.valid) {
      this.botaoEnviarVF = true;
      if (this.ac === 'incluir') {
        this.incluir();
        console.log('submit2');
      }
      if (this.ac === 'alterar') {
        this.alterar();
      }
      console.log('submit3');
    } else {
      this.botaoEnviarVF = false;
      this.verificaValidacoesForm(this.formHis);
    }
  }

  resetForm() {
    this.mostraForm = true;
    this.botaoEnviarVF = false;
    this.formHis.reset();
    window.scrollTo(0, 0);
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

  onContentChanged(ev) {
    this.editor = ev;
    this.editorContent = ev.content;
    this.editorJson = ev.content;
    this.editorHtml = ev.html;
    this.editorTxt = ev.text;
  }

  incluir() {
    if (this.formHis.valid) {
      this.enviando = false;
      this.historico = {
        historico_andamento: this.editorHtml,
        historico_andamento_delta: JSON.stringify(this.editorContent),
        historico_andamento_texto: this.editorTxt,
        historico_data: this.formHis.get('historico_data').value,
        historico_id: null,
        historico_solocitacao_id: this.his.historico_solocitacao_id
      };
      this.sub.push(this.historicoSolicitacaoService.incluir(this.historico)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.enviando = true;
            this.msg[2] = err + " - Ocorreu um erro.";
            console.error(err);
            this.resetForm();
          },
          complete: () => {
            if (this.resp[0]) {
              this.historico.historico_id = this.resp[1];
              this.msg[0] = 1;
              this.msg[2] = 'Andamento incluido com sucesso.';
            } else {
              this.enviando = true;
              this.msg[0] = 2;
              this.msg[2] = this.resp[0] + " - Ocorreu um erro.";
              this.resetForm();
            }

          }
        })
      );
    }
  }

  alterar() {

    if (this.formHis.valid) {
      this.enviando = false;
      this.historico = {
        historico_andamento: this.editorHtml,
        historico_andamento_delta: JSON.stringify(this.editorContent),
        historico_andamento_texto: this.editorTxt,
        historico_data: this.formHis.get('historico_data').value,
        historico_id: this.his.historico_id,
        historico_solocitacao_id: this.his.historico_solocitacao_id
      };
      this.sub.push(this.historicoSolicitacaoService.alterar(this.historico)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.enviando = true;
            this.msg[2] = err + " - Ocorreu um erro.";
            console.error(err);
            this.resetForm();
          },
          complete: () => {
            if (this.resp[0]) {
              this.historico.historico_id = this.resp[1];

              this.msg[1] = 'Andamento Alterado com sucesso.';
              this.msg[0] = 1;
              this.novosDados.emit(this.historico);
            } else {
              this.enviando = true;
              this.msg[0] = 2;
              this.msg[1] = this.resp[0] + " - Ocorreu um erro.";
              this.resetForm();
            }

          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
