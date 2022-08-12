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
import {TelefoneFormI, TelefoneInterface, TelefoneInterface2} from "../_models";

@Component({
  selector: 'app-telefone-form',
  templateUrl: './telefone-form.component.html',
  styleUrls: ['./telefone-form.component.css']
})
export class TelefoneFormComponent implements OnInit, OnDestroy{
  public formTelefone?: FormGroup;
  sub: Subscription[] = [];
  ptBr: any;
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

  tel: TelefoneFormI = {};
  ct = 0;
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
    this.formTelefone = this.formBuilder.group({
      telefone_assunto: [this.tfs.telefone.telefone_assunto, Validators.required],
      telefone_data: [this.tfs.telefone.telefone_data2, Validators.required],
      telefone_ddd: [this.tfs.telefone.telefone_ddd],
      telefone_de: [this.tfs.telefone.telefone_de, Validators.required],
      telefone_local_id: [this.tfs.telefone.telefone_local_id, Validators.required],
      telefone_observacao: [this.tfs.telefone.telefone_observacao],
      telefone_para: [this.tfs.telefone.telefone_para, Validators.required],
      telefone_resolvido: [this.tfs.telefone.telefone_resolvido, Validators.required],
      telefone_telefone: [this.tfs.telefone.telefone_telefone, Validators.required],
      telefone_tipo: [this.tfs.telefone.telefone_tipo, Validators.required],
      telefone_usuario_nome: [this.tfs.telefone.telefone_usuario_nome, Validators.required]
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

  onSubmit() {
    this.mostraForm = true;
    this.botaoEnviarVF = true;
    if (this.verificaValidacoesForm(this.formTelefone)) {
      if(this.criaEnvio()) {
        if (this.tfs.acao === 'incluir') {
          this.incluir();
        }
        if (this.tfs.acao === 'alterar') {
          this.alterar();
        }
      } else {
        this.mostraForm = false;
        this.botaoEnviarVF = false;
      }
    } else {
      this.mostraForm = false;
      this.botaoEnviarVF = false;
    }
  }

  resetForm() {
    this.tel = {};
    this.formTelefone.reset();
    this.criaForm();
    this.mostraForm = false;
    this.botaoEnviarVF = false;
  }

  voltarListar() {
    this.mostraForm = false;
    this.botaoEnviarVF = false;
    this.ct = 0;
    this.tfs.resetTelefone();
    this.tel = {};
    this.formTelefone.reset();
    this.ts.showForm = false;
  }

  criaEnvio(): boolean {
    this.tel = {};
    let tel: TelefoneFormI = {};
    const t: any = this.formTelefone.getRawValue();
    this.mostraForm = false;
    this.botaoEnviarVF = false;
    if (this.tfs.acao === 'alterar') {
      this.ct = 0;
      tel.telefone_id = this.tfs.telefone.telefone_id;
      if (t.telefone_data !== this.tfs.telefone.telefone_data2) {
        tel.telefone_data = DateTime.fromJSDate(t.telefone_data).setZone('America/Sao_Paulo').toFormat('yyyy-LL-dd HH:mm:ss');
        this.ct++;
      }
      if (t.telefone_ddd.toUpperCase() !== this.tfs.telefone.telefone_ddd) {
        tel.telefone_ddd = t.telefone_ddd.toUpperCase();
        this.ct++;
      }

      if (t.telefone_assunto.toUpperCase() !== this.tfs.telefone.telefone_assunto) {
        tel.telefone_assunto = t.telefone_assunto.toUpperCase();
        this.ct++;
      }

      if (t.telefone_de.toUpperCase() !== this.tfs.telefone.telefone_de) {
        tel.telefone_de = t.telefone_de.toUpperCase();
        this.ct++;
      }

      if (t.telefone_para.toUpperCase() !== this.tfs.telefone.telefone_para) {
        tel.telefone_para = t.telefone_para.toUpperCase();
        this.ct++;
      }

      if (+t.telefone_local_id !== +this.tfs.telefone.telefone_local_id) {
        tel.telefone_local_id = +t.telefone_local_id;
        this.ct++;
      }

      if (+t.telefone_resolvido !== +this.tfs.telefone.telefone_resolvido) {
        tel.telefone_resolvido = +t.telefone_resolvido;
        this.ct++;
      }

      if (+t.telefone_tipo !== +this.tfs.telefone.telefone_tipo) {
        tel.telefone_tipo = +t.telefone_tipo;
        this.ct++;
      }

      if (t.telefone_telefone.toUpperCase() !== this.tfs.telefone.telefone_telefone) {
        tel.telefone_telefone = t.telefone_telefone.toUpperCase();
        this.ct++;
      }

      if (t.telefone_usuario_nome.toUpperCase() !== this.tfs.telefone.telefone_usuario_nome) {
        tel.telefone_usuario_nome = t.telefone_usuario_nome.toUpperCase();
        this.ct++;
      }

      if (t.telefone_observacao !== this.tfs.telefone.telefone_observacao) {
        tel.telefone_observacao = this.formTelefone.get('telefone_observacao').value;
        tel.telefone_observacao_delta = JSON.stringify(this.kill0.getContents());
        tel.telefone_observacao_texto = this.kill0.getText();
        this.ct++;
      }

    }

    if (this.tfs.acao === 'incluir') {
      this.ct = 0;
      if (t.telefone_data !== null) {
        tel.telefone_data = DateTime.fromJSDate(t.telefone_data).setZone('America/Sao_Paulo').toFormat('yyyy-LL-dd HH:mm:ss');
        this.ct++;
      }
      if (t.telefone_ddd !== null) {
        tel.telefone_ddd = t.telefone_ddd.toUpperCase();
        this.ct++;
      }

      if (t.telefone_assunto !== null) {
        tel.telefone_assunto = t.telefone_assunto.toUpperCase();
        this.ct++;
      }

      if (t.telefone_de !== null) {
        tel.telefone_de = t.telefone_de.toUpperCase();
        this.ct++;
      }

      if (t.telefone_para !== null) {
        tel.telefone_para = t.telefone_para.toUpperCase();
        this.ct++;
      }

      if (+t.telefone_local_id !== null) {
        tel.telefone_local_id = +t.telefone_local_id;
        this.ct++;
      }

      if (+t.telefone_resolvido !== null) {
        tel.telefone_resolvido = +t.telefone_resolvido;
        this.ct++;
      }

      if (+t.telefone_tipo !== null) {
        tel.telefone_tipo = +t.telefone_tipo;
        this.ct++;
      }

      if (t.telefone_telefone !== null) {
        tel.telefone_telefone = t.telefone_telefone.toUpperCase();
        this.ct++;
      }

      if (t.telefone_usuario_nome !== null) {
        tel.telefone_usuario_nome = t.telefone_usuario_nome.toUpperCase();
        this.ct++;
      }

      if (t.telefone_observacao !== null) {
        tel.telefone_observacao = this.formTelefone.get('telefone_observacao').value;
        tel.telefone_observacao_delta = JSON.stringify(this.kill0.getContents());
        tel.telefone_observacao_texto = this.kill0.getText();
        this.ct++;
      }

    }

    const vf: boolean = ((this.tfs.acao === 'alterar' && this.ct >= 1) || (this.tfs.acao === 'incluir' && this.ct >= 9));
    if (vf) {
      this.tel = tel;
    }
    return vf;
  }

  incluir() {
    this.sub.push(this.ts.incluirTelefone(this.tel)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = false;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            let t: TelefoneInterface = this.resp[2]
            t.telefone_data3 = new Date(t.telefone_data2.replace(' ', 'T'));
            this.ts.tabela.totalRecords++;
            this.ts.telefones.push(t);
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'INCLUIR TELEFONEMA',
                detail: "Telefonema incluido com sucesso."
              });
              this.voltarListar();

          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = false;
            console.error('ERRO - INCLUIR ', this.resp[2]);
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
  }

  alterar() {
    this.sub.push(this.ts.alterarTelefone(this.tel)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = false;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            let t: TelefoneInterface = this.resp[2]
            t.telefone_data3 = new Date(t.telefone_data2.replace(' ', 'T'));
            this.ts.telefones[this.ts.idx] = t;
            const c = {
              data: this.ts.telefones[this.ts.idx],
              originalEvent: {}
            }
            this.ts.onRowExpand(c);
            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'ALTERAR TELEFONEMA',
              detail: "Telefonema alterado com sucesso."
            });
            this.voltarListar();

          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = false;
            console.error('ERRO - ALTERAR ', this.resp[2]);
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
  }



  onEditorCreated(ev) {
    this.kill0 = ev;
    this.kill0.update('user');
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }



}
