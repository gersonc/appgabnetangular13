import {Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProcessoHistoricoInterface, ProcessoListagemInterface} from "../../processo/_models";
// import {Editor} from "primeng/editor";
import {AuthenticationService} from "../../_services";
import {QuillEditorComponent, QuillService} from "ngx-quill";

@Component({
  selector: 'app-historico-processo-form',
  templateUrl: './historico-processo-form.component.html',
  styleUrls: ['./historico-processo-form.component.css']
})
export class HistoricoProcessoFormComponent implements OnInit, OnChanges, DoCheck {
  // @ViewChild('editor', { static: true }) editor: QuillService;
  @Input() dados?: ProcessoListagemInterface;
  @Input() classeStylos?: string;
  @Input() acao: string;
  mostraBotao = false;
  his: ProcessoHistoricoInterface;
  estilo = 'formulario-quill';
  ac: string;
  showFormulario = false;
  formHis: FormGroup;
  historico: ProcessoHistoricoInterface;
  deltaquill: any = null;
  mostraForm = true;
  botaoEnviarVF = false;
  acao2 = 'INCLUIR'
  acao3 = 'Incluir Andamento'
  formato: 'object' | 'html' | 'text' | 'json' = 'html';
  editor: any;
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

/*  if (this.formSolicitacaoIncluir.get('solicitacao_descricao').value) {
  const ql: any = this.soldesc.getQuill();
  const txt1 = ql.getContents();
  const txt2 = ql.getText();
  solicitacao.solicitacao_descricao = this.formSolicitacaoIncluir.get('solicitacao_descricao').value;
  solicitacao.solicitacao_descricao_delta = JSON.stringify(ql.getContents());
  solicitacao.solicitacao_descricao_texto = ql.getText();


  if (texto[4]) {
      if (this.edtor.getQuill()) {
        this.edtor.getQuill().deleteText(0, this.edtor.getQuill().getLength());
      }
      this.deltaquill = JSON.parse(texto[4]);
      setTimeout( () => {
        this.edtor.getQuill().updateContents(this.deltaquill, 'api');
      }, 300);
    } else {
      this.campoTexto = texto[1];
    }


}*/


  constructor(
    private fb: FormBuilder,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit');
    if (this.authenticationService.historicoemenda_incluir)  {
      this.mostraBotao = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges');
    if (changes.dados) {
      const d: ProcessoListagemInterface = changes.dados.currentValue;
      this.his = {
        historico_id: d.historico_id,
        historico_data: d.historico_data,
        historico_andamento: d.historico_andamento,
        historico_andamento_delta: d.historico_andamento_delta,
        historico_andamento_texto: d.historico_andamento_texto,
        historico_processo_id: d.processo_id
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
    }
  }

  ngDoCheck() {
    console.log('ngDoCheck');

  }

  formMostra() {
    this.criaForm();
  }

/*  escolheTipo(h: any | null): ProcessoHistoricoInterface {
    if (h) {
      let hi: ProcessoHistoricoInterface = h;
      if (hi.historico_andamento_delta) {
        hi.historico_andamento_texto = null;
        hi.historico_andamento = hi.historico_andamento_delta;
        hi.historico_andamento_delta = null;
        return hi;
      }
      if (hi.historico_andamento) {
        hi.historico_andamento_texto = null;
        hi.historico_andamento_delta = null;
        return hi;
      }
      if (hi.historico_andamento_texto) {
        hi.historico_andamento = hi.historico_andamento_texto;
        hi.historico_andamento_delta = null;
        hi.historico_andamento_texto = null;
        return hi;
      }
      return hi;
    }
    return null;..
  }*/

  fechar() {
    this.his = null;
    // this.estilo = 'formulario-quill';
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
    console.log('onEditorCreated', ev);
    this.editor = ev.Quill;
    if (this.ac === 'alterar') {
      if (this.his.historico_andamento_delta) {
        this.formato = 'object';
        this.editor.deleteText(0, this.editor.getLength());
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
    if (this.formHis.valid) {
      this.botaoEnviarVF = false;
      if (this.ac === 'incluir') {
        this.incluir();
      }
      if (this.ac === 'alterar') {
        this.alterar();
      }
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
    // console.log('onContentChanged', ev);
    this.editor = ev;
  }

  incluir() {
    console.log('incluir0', this.editor);
    this.historico = {
      historico_andamento: this.editor.html,
      historico_andamento_delta: JSON.stringify(this.editor.delta),
      historico_andamento_texto: this.editor.text,
      historico_data: this.formHis.get('historico_data').value,
      historico_id: null,
      historico_processo_id: this.his.historico_processo_id
    };
    console.log('incluir', this.historico);
  }

  alterar() {

  }
}
