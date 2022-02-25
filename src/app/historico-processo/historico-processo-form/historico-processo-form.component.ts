import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProcessoHistoricoInterface, ProcessoListagemInterface} from "../../processo/_models";
import {Editor} from "primeng/editor";
import {AuthenticationService} from "../../_services";

@Component({
  selector: 'app-historico-processo-form',
  templateUrl: './historico-processo-form.component.html',
  styleUrls: ['./historico-processo-form.component.css']
})
export class HistoricoProcessoFormComponent implements OnInit, OnChanges {
  @ViewChild('editor', { static: true }) editor: Editor;
  @Input() dados?: ProcessoListagemInterface;
  @Input() classeStylos?: string;
  @Input() acao: string;
  moostraBotao = false;
  his: ProcessoHistoricoInterface;
  estilo = 'formulario-quill';
  ac: string;
  showDetalhe = false;
  formHis: FormGroup;
  historico: ProcessoHistoricoInterface;
  deltaquill: any = null;
  mostraForm = true;
  botaoEnviarVF = false;
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
      ['clean'],                                         // remove formatting button
      ['link']                         // link and image, video
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
    if (this.authenticationService.historicoemenda_incluir)  {
      this.moostraBotao = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dados) {

      const d: ProcessoListagemInterface = changes.dados.currentValue;
      this.his = {
        historico_id: null,
        historico_data: null,
        historico_andamento: null,
        historico_andamento_delta: null,
        historico_andamento_texto: null,
        historico_processo_id: d.processo_id
      }

    }
    if (changes.classeStylos) {
      this.estilo = changes.classeStylos.currentValue;
    }
    if (changes.acao) {
      this.ac = changes.acao.currentValue;
    }
  }

  formMostra() {
    this.showDetalhe = true;
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
    this.estilo = 'formulario-quill';
    this.ac = null;
    this.showDetalhe = false;
    this.formHis = null
    this.historico = null;
    this.deltaquill = null;
    this.mostraForm = true;
    this.botaoEnviarVF = false;
    this.showDetalhe = false;
  }

  escondeDetalhe() {

  }

  criaForm() {
    // const hd = (this.his.historico_data) ? this.his.historico_data : null;


    this.formHis = this.fb.group({
      historico_data: [null, Validators.required],
      historico_andamento: [null, Validators.required]
    });

    if (this.his.historico_andamento_delta) {
      this.editor.getQuill().deleteText(0, this.editor.getQuill().getLength());
      this.deltaquill = JSON.parse(this.his.historico_andamento_delta);
      setTimeout( () => {
        this.editor.getQuill().updateContents(this.deltaquill, 'api');
      }, 300);
    } else {
      if (this.his.historico_andamento) {
        this.editor.getQuill().deleteText(0, this.editor.getQuill().getLength());
        setTimeout( () => {
        this.editor.getQuill().updateContents(this.his.historico_andamento, 'api');
        this.editor.getQuill().update('user');
        }, 300);
      } else {
        if (this.his.historico_andamento_texto) {
          setTimeout( () => {
          this.formHis.get('historico_andamento').setValue(this.his.historico_andamento_texto);
          }, 300);
        }
      }
    }


  }

  onSubmit() {
    this.verificaValidacoesForm(this.formHis);
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
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

}
