import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import {AutocompleteService, MenuInternoService} from '../../_services';
import { AuthenticationService } from '../../_services';
import { take } from 'rxjs/operators';

import {DdService} from "../../_services/dd.service";
import {ContaFormService} from "../_services/conta-form.service";
import {ContaService} from "../_services/conta.service";
import {ContaFormI, ContaI} from "../_models/conta-i";
import {CpoEditor} from "../../_models/in-out-campo-texto";
import Quill from "quill";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {Subscription} from "rxjs";
import {MsgService} from "../../_services/msg.service";
import {DateTime} from "luxon";
import {ContaDropdown} from "../_models/conta-dropdown";

@Component({
  selector: 'app-conta-formulario',
  templateUrl: './conta-formulario.component.html',
  styleUrls: ['./conta-formulario.component.css']
})
export class ContaFormularioComponent implements OnInit, OnDestroy {
/*  @Input() index?: number = 0;
  @Input() contaListar?: ContaI;
  @Output() contaListarChange = new EventEmitter<ContaI>();*/
  public formConta: FormGroup;
  public items: Array<any> = [];
  ptBr: any;
  public sgt: string[];
  public ddConta_local_id: SelectItem[] = [];
  sub: Subscription[] = [];
  botaoEnviarVF = false;
  mostraForm = false;
  acao: string | null = null;
  contador = 0;
  resp: any[];
  origem: string = null;
  atualisaDatatable = false;
  rptd = false;
  nucleo = true;
  cta: ContaFormI = {};
  tt = 0;
  dr = new ContaDropdown();
  index = 0;

  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;

  cpoEditor: CpoEditor[] | null = [];
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


  constructor(
    private formBuilder: FormBuilder,
    private dd: DdService,
    private mi: MenuInternoService,
    private ms: MsgService,
    public aut: AuthenticationService,
    private autocompleteservice: AutocompleteService,
    private ct: ContaService,
    public cfs: ContaFormService
  ) { }

  ngOnInit() {
    this.index = this.ct.idx;
      this.acao = this.cfs.acao;

    if (this.acao === 'incluir' || this.acao === 'incluir2') {
      this.cfs.criaFormIncluir();
    }

    // this.cfs.criaConta();
    this.carregaDados();
    // this.configuraCalendario();
    this.carregaDropDown();
    this.criaForm();
  }

  /*ngOnChanges(changes: SimpleChanges) {
    if (changes.index && changes.index.currentValue !== 0) {
      this.cfs.parceContaForm(this.contaListar);
    }

  }*/

  carregaDados() {
    if (this.aut.solicitacaoVersao === 3) {
      this.nucleo = false;
      this.cfs.conta.conta_local_id = 0;
    }
  }

  carregaDropDown() {
    this.ddConta_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
  }

  criaForm() {
    if (this.acao === 'incluir') {
      this.formConta = this.formBuilder.group({
        // conta_id: [this.cfs.conta.conta_id],
        conta_cedente: [this.cfs.conta.conta_cedente, Validators.required],
        conta_valor: [this.cfs.conta.conta_valor, Validators.required],
        conta_vencimento: [this.cfs.conta.conta_vencimento2, Validators.required],
        conta_local_id: [this.cfs.conta.conta_local_id, Validators.required],
        conta_tipo: [this.cfs.conta.conta_tipo, Validators.required],
        conta_debito_automatico: [this.cfs.conta.conta_debito_automatico, Validators.required],
        conta_observacao: [this.cfs.conta.conta_observacao],
        conta_paga: [this.cfs.conta.conta_paga],
        conta_pagamento: [this.cfs.conta.conta_pagamento2],
        conta_rptdia: [this.cfs.conta.conta_rptdia],
        conta_parcelas: [this.cfs.conta.conta_parcelas],
        conta_agenda: [(this.cfs.conta.conta_agenda === 1)],
      });
    }
    if (this.acao === 'alterar') {
      this.formConta = this.formBuilder.group({
        // conta_id: [this.cfs.conta.conta_id],
        conta_cedente: [this.cfs.conta.conta_cedente, Validators.required],
        conta_valor: [this.cfs.conta.conta_valor, Validators.required],
        conta_vencimento: [this.cfs.conta.conta_vencimento2, Validators.required],
        conta_local_id: [this.cfs.conta.conta_local_id, Validators.required],
        conta_tipo: [this.cfs.conta.conta_tipo, Validators.required],
        conta_debito_automatico: [this.cfs.conta.conta_debito_automatico, Validators.required],
        conta_observacao: [this.cfs.conta.conta_observacao],
        conta_paga: [this.cfs.conta.conta_paga],
        conta_pagamento: [this.cfs.conta.conta_pagamento2],
        conta_rptdia: [this.cfs.conta.conta_rptdia],
        conta_parcelas: [this.cfs.conta.conta_parcelas],
        conta_agenda: [(this.cfs.conta.conta_agenda === 1)],
      });
    }
  }

  autoComp (event) {
    let sg: any[];
    this.autocompleteservice.getACSimples3('contas', 'conta_cedente', event.query)
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

  repetirVencimento(ev) {
    this.rptd = ev.value > 0;
  }

  verificaRequired(campo: string) {
    return (
      this.formConta.get(campo).hasError('required') &&
      (this.formConta.get(campo).touched || this.formConta.get(campo).dirty)
    );
  }

  verificaValidTouched(campo: string) {
    return (
      (!this.formConta?.get(campo)?.valid || this.formConta.get(campo).hasError('required')) &&
      (this.formConta?.get(campo)?.touched || this.formConta?.get(campo)?.dirty)
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
    if (this.verificaValidacoesForm(this.formConta)) {
      if(this.criaEnvio()) {
        if (this.acao === 'incluir') {
          this.incluir();
        }
        if (this.acao === 'alterar') {
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
    // this.tel = {};
    this.formConta.reset();
    this.criaForm();
    this.mostraForm = false;
    this.botaoEnviarVF = false;
  }

  criaEnvio() {
    this.cta = {};
    let cta: ContaFormI = {}
    const t: any = this.formConta.getRawValue();
    this.mostraForm = false;
    this.botaoEnviarVF = false;

    if (this.cfs.acao === 'alterar') {
      this.tt = 0;
      cta.conta_id = this.cfs.conta.conta_id;
      cta.conta_calendario_id = this.cfs.conta.conta_calendario_id;
      if (t.conta_vencimento !== this.cfs.conta.conta_vencimento2) {
        cta.conta_vencimento = DateTime.fromJSDate(t.conta_vencimento).setZone('America/Sao_Paulo').toSQLDate();
        this.tt++;
      }
      if (t.conta_pagamento !== this.cfs.conta.conta_pagamento2) {
        cta.conta_pagamento = DateTime.fromJSDate(t.conta_pagamento).setZone('America/Sao_Paulo').toSQLDate();
        this.tt++;
      }
      if (t.conta_cedente.toUpperCase() !== this.cfs.conta.conta_cedente) {
        cta.conta_cedente = t.conta_cedente.toUpperCase();
        this.tt++;
      }

      if (t.conta_valor !== this.cfs.conta.conta_valor) {
        cta.conta_valor = t.conta_valor;
        this.tt++;
      }

      if (+t.conta_local_id !== +this.cfs.conta.conta_local_id) {
        cta.conta_local_id = +t.conta_local_id;
        this.tt++;
      }

      if (+t.conta_tipo !== +this.cfs.conta.conta_tipo) {
        cta.conta_tipo = +t.conta_tipo;
        this.tt++;
      }

      if (+t.conta_paga !== +this.cfs.conta.conta_paga) {
        cta.conta_paga = +t.conta_paga;
        this.tt++;
      }

      if (+t.conta_debito_automatico !== +this.cfs.conta.conta_debito_automatico) {
        cta.conta_debito_automatico = +t.conta_debito_automatico;
        this.tt++;
      }

      if (+t.conta_agenda !== +this.cfs.conta.conta_agenda) {
        cta.conta_agenda = +t.conta_agenda;
        this.tt++;
      }

      if (+t.conta_parcelas !== +this.cfs.conta.conta_parcelas) {
        cta.conta_parcelas = +t.conta_parcelas;
        this.tt++;
      }

      if (+t.conta_rptdia !== +this.cfs.conta.conta_rptdia) {
        cta.conta_rptdia = +t.conta_rptdia;
        this.tt++;
      }

      if (t.conta_observacao !== this.cfs.conta.conta_observacao) {
        cta.conta_observacao = this.formConta.get('conta_observacao').value;
        cta.conta_observacao_delta = JSON.stringify(this.kill0.getContents());
        cta.conta_observacao_texto = this.kill0.getText();
        this.tt++;
      }

    }

    if (this.cfs.acao === 'incluir') {
      this.tt = 0;
      if (t.conta_vencimento !== null) {
        cta.conta_vencimento = DateTime.fromJSDate(t.conta_vencimento).setZone('America/Sao_Paulo').toSQLDate();
        this.tt++;
      }
      if (t.conta_pagamento  !== null) {
        cta.conta_pagamento = DateTime.fromJSDate(t.conta_pagamento).setZone('America/Sao_Paulo').toSQLDate();
        this.tt++;
      }
      if (t.conta_cedente.toUpperCase() !== null) {
        cta.conta_cedente = t.conta_cedente.toUpperCase();
        this.tt++;
      }

      if (t.conta_valor !== null) {
        cta.conta_valor = t.conta_valor;
        this.tt++;
      }

      if (+t.conta_local_id !== null) {
        cta.conta_local_id = +t.conta_local_id;
        this.tt++;
      }

      if (+t.conta_tipo !== null) {
        cta.conta_tipo = +t.conta_tipo;
        this.tt++;
      }

      if (+t.conta_paga !== null) {
        cta.conta_paga = +t.conta_paga;
        this.tt++;
      }

      if (+t.conta_debito_automatico !== null) {
        cta.conta_debito_automatico = +t.conta_debito_automatico;
        this.tt++;
      }

      if (+t.conta_agenda !== null) {
        cta.conta_agenda = +t.conta_agenda;
        this.tt++;
      }

      if (+t.conta_parcelas !== null) {
        cta.conta_parcelas = +t.conta_parcelas;
        this.tt++;
      }

      if (+t.conta_rptdia !== null) {
        cta.conta_rptdia = +t.conta_rptdia;
        this.tt++;
      }

      if (t.conta_observacao !== null) {
        cta.conta_observacao = this.formConta.get('conta_observacao').value;
        cta.conta_observacao_delta = JSON.stringify(this.kill0.getContents());
        cta.conta_observacao_texto = this.kill0.getText();
        this.tt++;
      }

    }

    const vf: boolean = ((this.acao === 'alterar' && this.tt >= 1) || (this.acao === 'incluir' && this.tt >= 10));
    if (vf) {
      this.cta = cta;
    }
    return vf;
  }


  incluir() {
    this.sub.push(this.ct.incluirConta(this.cta)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = false;
          this.arquivoDesativado = false;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            if (this.possuiArquivos) {
              this.arquivo_registro_id = +this.resp[1];
              this.enviarArquivos = true;
            } else {
              this.cfs.resetConta();
              this.resetForm();
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'INCLUIR VENCIMENTO',
                detail: this.resp[2]
              });
              this.voltarListar();
            }
          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = false;
            this.arquivoDesativado = false;
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
      this.sub.push(this.ct.alterarConta(this.cta)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
            console.error(err);
            this.mostraForm = false;
          },
          complete: () => {
            if (this.resp[0]) {
              this.cfs.resetConta();
              this.resetForm();
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'INCLUIR VENCIMENTO',
                detail: this.resp[2]
              });
              this.voltarListar();
            } else {
              this.mostraForm = false;
              console.error('ERRO - ALTERAR ', this.resp[2]);
              this.ms.add({key: 'toastprincipal',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
  }

  voltarListar() {
    this.mostraForm = false;
    this.botaoEnviarVF = false;
    this.tt = 0;
    this.cfs.resetConta();
    this.formConta.reset();
    this.cta = {};


    // this.contaListarChange.emit(this.cfs.contaListar);
    this.ct.showForm = false;
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onUpload(ev) {
    if (ev) {
      // this.mostraForm = false;
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'VENCIMENTO',
        detail: this.resp[2]
      });
      this.resetForm();
      // this.botaoEnviarVF = false;
      this.voltarListar();
    }
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
    this.cfs.resetConta();
    this.formConta.reset();
  }

}
