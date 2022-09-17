import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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

@Component({
  selector: 'app-tarefa-form',
  templateUrl: './tarefa-form.component.html',
  styleUrls: ['./tarefa-form.component.css']
})
export class TarefaFormComponent implements OnInit {
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

  resp: any[] = [];
  tarefa_situacao_id = 0;
  th_historico: string | null = null;
  disabled = true;
  kdisabled = false;
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





  constructor(
    public tfs: TarefaFormService,
    public ts: TarefaService,
    private formBuilder: FormBuilder,
    public aut: AuthenticationService,
    private mi: MenuInternoService,
    private ms: MsgService,
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
        tarefa_email: [this.tfs.tarefa.tarefa_email],
        agenda: [0],
      });
      // this.campoAtivo(false);
    } else {
      this.formTarefa = this.formBuilder.group({
        tarefa_id: [this.tfs.tarefa.tarefa_id],
        tarefa_usuario_autor_id: [this.tfs.tarefa.tarefa_usuario_autor_id, Validators.required],
        // tarefa_usuario_id: [this.tfs.tarefa.tarefa_usuario_id, Validators.required],
        tarefa_data3: [this.tfs.tarefa.tarefa_data3, Validators.required],
        tarefa_titulo: [this.tfs.tarefa.tarefa_titulo, Validators.required],
        tarefa_tarefa: [this.tfs.tarefa.tarefa_tarefa],
        tarefa_email: [this.tfs.tarefa.tarefa_email]
        // tarefa_sms: [this.tfs.tarefa.tarefa_sms, false],
        // mensagem_sms: [this.tfs.tarefa.mensagem_sms, false],
        // agenda: [0]
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
    this.kdisabled = true;
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
    this.disabled = true;
    this.kdisabled = true;
    this.botaoEnviarVF = false;
  }

  onSubmit() {
    this.botaoEnviarVF = true;
    this.disabled = true;
    console.log('onSubmit', this.formTarefa.getRawValue());
  }

  enviarTarefaAlterar() {}

  voltarListar() {
    this.fechar.emit(true);
  }

  mudaSituacao(ev: number) {
    if (ev !== this.tfs.tarefaListar.tarefa_situacao_id)  {
      this.disabled = false;
      this.kdisabled = false;
    } else {
      this.th_historico = null;
      this.disabled = true;
      this.kdisabled = true;
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
    this.mostraForm = ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onUpload(ev) {
    if (ev) {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'VENCIMENTO',
        detail: this.resp[2]
      });
      this.reset();
      this.botaoEnviarVF = false;
      this.mostraForm = false;
      this.voltarListar();
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


  ngOnDestroy() {
    this.reset();
    this.fechar.emit(true);
    this.tfs.resetTudo();
    this.th_historico = null;
    this.disabled = true;
    this.kdisabled = true;
    this.botaoEnviarVF = false;
    this.tarefa_situacao_id = 0;
  }

}
