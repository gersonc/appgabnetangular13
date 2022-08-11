import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectItem} from "primeng/api";
import {TelefoneService} from "../_services/telefone.service";
import {TelefoneFormService} from "../_services/telefone-form.service";
import {MsgService} from "../../_services/msg.service";
import {DdService} from "../../_services/dd.service";
import {AuthenticationService, AutocompleteService} from "../../_services";
import {take} from "rxjs/operators";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {Subscription} from "rxjs";
import Quill from "quill";
import {DateTime} from "luxon";

@Component({
  selector: 'app-telefone-form',
  templateUrl: './telefone-form.component.html',
  styleUrls: ['./telefone-form.component.css']
})
export class TelefoneFormComponent implements OnInit, OnDestroy{
  public formTelefone?: FormGroup;
  sub: Subscription[] = [];
  ptBr: any;
  public sgt?: string[];
  public ddTelefone_local_id: SelectItem[] = [];
  public ddTelefone_usuario_nome: SelectItem[] = [];
  public ddTelefone_tipo: SelectItem[] = [
    {label: 'FEITO', value: 2},
    {label: 'RECEBIDO', value: 1},
  ];
  public ddTelefone_resolvido: SelectItem[] = [
    {label: 'RESOLVIDO', value: 0},
    {label: 'NÃO RESOLVIDO', value: 1},
  ]
  mostraForm = false;
  botaoEnviarVF = false;

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
    public ts: TelefoneService,
    public tfs: TelefoneFormService,
    private ms: MsgService,
    private dd: DdService,
    private formBuilder: FormBuilder,
    private autocompleteservice: AutocompleteService,
    public aut: AuthenticationService,
  ) { }


  ngOnInit(): void {
    console.log('ngOnInit');
    if (this.tfs.acao === 'incluir') {
      this.tfs.telefone.telefone_data2 = this.dtjs;
      this.tfs.telefone.telefone_usuario_nome = this.aut.usuario_nome;
      this.tfs.telefone.telefone_local_id = this.aut.usuario_local_id;

    }

    this.carregaDropDown();
    this.criaForm();
  }



  carregaDropDown() {
    this.ddTelefone_local_id = JSON.parse(sessionStorage.getItem('dropdown-local')!);
    this.ddTelefone_usuario_nome = JSON.parse(sessionStorage.getItem('dropdown-usuario_nome')!);
  }

  criaForm() {
    console.log(this.tfs.telefone);
    this.formTelefone = this.formBuilder.group({
      telefone_assunto: [this.tfs.telefone.telefone_assunto, Validators.required],
      telefone_data: [this.tfs.telefone.telefone_data2, Validators.required],
      telefone_ddd: [this.tfs.telefone.telefone_ddd],
      telefone_de: [this.tfs.telefone.telefone_de, Validators.required],
      telefone_local_id: [this.tfs.telefone.telefone_local_id, Validators.required],
      telefone_observacao: [this.tfs.telefone.telefone_observacao],
      telefone_para: [this.tfs.telefone.telefone_para, Validators.required],
      telefone_resolvido: [this.tfs.telefone.telefone_tipo, Validators.required],
      telefone_telefone: [this.tfs.telefone.telefone_telefone],
      telefone_tipo: [this.tfs.telefone.telefone_tipo, Validators.required],
      telefone_usuario_nome: [this.tfs.telefone.telefone_usuario_nome, Validators.required]
    });
  }

  autoComp (event: any, campo: string) {
    let sg: any[];
    const tabela = campo.substring(0, campo.indexOf('_'));
    this.autocompleteservice.getACSimples3(tabela, campo, event.query)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          sg = dados;
        },
        error: err => console.error('FE-cadastro_datatable.postCadastroListarPaginacaoSort-ERRO-->', err),
        complete: () => {
          this.sgt = sg;
        }
      });
  }





  verificaRequired(campo: string) {
    return (
      this.formTelefone.get(campo).hasError('required') &&
      (this.formTelefone.get(campo).touched || this.formTelefone.get(campo).dirty)
    );
  }


  verificaValidTouched(campo: string) {
    return (
      !this.formTelefone?.get(campo)?.valid &&
      (this.formTelefone?.get(campo)?.touched || this.formTelefone?.get(campo)?.dirty)
    );
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }


  aplicaCssErro(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }


  enviarTelefone() {

  }

  resetForm() {

  }

  voltarListar() {
    this.ts.showForm = false;
  }

  onEditorCreated(ev) {
    this.kill0 = ev;
    this.kill0.update('user');
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  ngOnDestroy(): void {
    this.formTelefone.reset();
    this.botaoEnviarVF = false;
    this.sub.forEach(s => s.unsubscribe());
  }



}
