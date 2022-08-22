import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
import {OverlayPanel} from "primeng/overlaypanel/overlaypanel";

@Component({
  selector: 'app-conta-formulario',
  templateUrl: './conta-formulario.component.html',
  styleUrls: ['./conta-formulario.component.css']
})
export class ContaFormularioComponent implements OnInit, OnDestroy {
  @ViewChild('op', {static: true}) public op: OverlayPanel;
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
  ctaPaga = 0;
  repetir = false;

  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  agendaSN = true;

  classes1 = "p-field p-col-12 p-sm-12 p-md-12 p-lg-6 p-xl-6 ";
  classes2 = "p-field p-col-12 p-sm-12 p-md-8 p-lg-3 p-xl-3 ";
  cedenteClass = this.classes1;
  cedenteSN = 0;
  showCedente = false;

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
  texto = '';
  infoVf = false;

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
    this.repetir = +this.cfs.conta.conta_rptdia > 0;
    this.agendaSN = this.acao === 'incluir' || (this.acao === 'alterar' && +this.cfs.conta.conta_agenda === 0);
    this.rptd = +this.cfs.conta.conta_rptdia > 0;
    this.ctaPaga = this.cfs.conta.conta_paga;
    this.cfs.conta.conta_local_id = +this.aut.usuario_local_id;
  }

  carregaDropDown() {
    this.ddConta_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
  }

  criaForm() {
    if (this.acao === 'incluir') {
      this.formConta = this.formBuilder.group({
        conta_cedente: [this.cfs.conta.conta_cedente, Validators.required],
        conta_valor: [{value: this.cfs.conta.conta_valor, disabled: true}, Validators.required],
        conta_vencimento: [{value: this.cfs.conta.conta_vencimento2, disabled: true}, Validators.required],
        conta_paga: [{value: this.cfs.conta.conta_paga, disabled: true}],
        conta_pagamento: [{value: this.cfs.conta.conta_pagamento2, disabled: true}, Validators.required],
        conta_local_id: [{value: this.cfs.conta.conta_local_id, disabled: true}, Validators.required],
        conta_rptdia: [{value: this.cfs.conta.conta_rptdia, disabled: true}, Validators.required],
        conta_parcelas: [{value: this.cfs.conta.conta_parcelas, disabled: true}],
        conta_paga2: [{value: this.cfs.conta.conta_paga2, disabled: true}],
        conta_tipo: [{value: this.cfs.conta.conta_tipo, disabled: true}, Validators.required],
        conta_agenda: [{value: (this.cfs.conta.conta_agenda === 1), disabled: true}],
        conta_observacao: [{value: this.cfs.conta.conta_observacao, disabled: true}],
      });
    }
    if (this.acao === 'alterar') {
      console.log(!this.agendaSN);
      this.formConta = this.formBuilder.group({
        conta_cedente: [this.cfs.conta.conta_cedente, Validators.required],
        conta_valor: [this.cfs.conta.conta_valor, Validators.required],
        conta_vencimento: [this.cfs.conta.conta_vencimento2, Validators.required],
        conta_local_id: [this.cfs.conta.conta_local_id],
        conta_tipo: [{value: this.cfs.conta.conta_tipo, disabled: true}],
        conta_observacao: [this.cfs.conta.conta_observacao],
        conta_paga: [this.cfs.conta.conta_paga],
        conta_pagamento: [this.cfs.conta.conta_pagamento2, Validators.required],
        conta_rptdia: [{value: this.cfs.conta.conta_rptdia, disabled: true}],
        conta_parcelas: [{value: this.cfs.conta.conta_parcelas, disabled: true}],
        conta_agenda: [{value: (this.cfs.conta.conta_agenda === 1), disabled: !this.agendaSN}]
      });
    }
    if (this.ctaPaga === 2) {
      this.formConta.get('conta_pagamento').setValue(this.cfs.conta.conta_vencimento2);
      this.formConta.get('conta_pagamento').disable({onlySelf: true, emitEvent: true});
    }
    if (this.ctaPaga === 1) {
      this.formConta.get('conta_pagamento').setValue(this.cfs.conta.conta_pagamento2);
      if (this.formConta.get('conta_pagamento').disabled) {
        this.formConta.get('conta_pagamento').enable({onlySelf: true, emitEvent: true});
      }
    }
    if (this.ctaPaga === 0) {
      this.formConta.get('conta_pagamento').setValue(null);
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
    this.formConta.get('conta_parcelas').setValue(this.rptd ? this.cfs.conta.conta_parcelas : 0);
  }

  onCtaPaga(ev) {
    this.ctaPaga = +ev.value;
    console.log('onCtaPaga',ev);
    if (this.ctaPaga === 2) {
      if (this.formConta.get('conta_pagamento').dirty && this.formConta.get('conta_pagamento').value !== null) {
        this.formConta.get('conta_pagamento').setValue(this.formConta.get('conta_pagamento').value);
      } else {
        if (this.cfs.conta.conta_vencimento2 !== null) {
          this.formConta.get('conta_pagamento').setValue(this.cfs.conta.conta_vencimento2);
        }
      }

      this.formConta.get('conta_pagamento').disable({onlySelf: true, emitEvent: true});
    }
    if (this.ctaPaga === 1) {
      this.formConta.get('conta_pagamento').setValue(this.cfs.conta.conta_pagamento2);
      if (this.formConta.get('conta_pagamento').disabled) {
        this.formConta.get('conta_pagamento').enable({onlySelf: true, emitEvent: true});
      }
    }
    if (this.ctaPaga === 0) {
      this.formConta.get('conta_pagamento').setValue(null);
    }

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
      if (this.cfs.conta.conta_uuid !== undefined && this.cfs.conta.conta_uuid !== null && this.cfs.conta.conta_uuid.length > 10) {
        cta.conta_uuid = this.cfs.conta.conta_uuid;
      }
      // cta.conta_calendario_id = this.cfs.conta.conta_calendario_id;


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

      /*if (+t.conta_tipo !== +this.cfs.conta.conta_tipo) {
        cta.conta_tipo = +t.conta_tipo;
        this.tt++;
      }*/

      if (t.conta_vencimento !== this.cfs.conta.conta_vencimento2) {
        if (t.conta_vencimento === null && +t.conta_paga > 0) {
          return false;
        }
          cta.conta_vencimento = (t.conta_vencimento !== null) ? DateTime.fromJSDate(t.conta_vencimento).setZone('America/Sao_Paulo').toSQLDate() : null;
        this.tt++;
      }

      if (+t.conta_paga !== +this.cfs.conta.conta_paga) {
        cta.conta_paga = +t.conta_paga;
        if (+t.conta_paga === 0) {
          cta.conta_pagamento = null;
          this.tt++;
        }
        if (+t.conta_paga === 1) {
          if (t.conta_pagamento === null) {
            return false;
          }
          cta.conta_pagamento = (t.conta_pagamento !== +this.cfs.conta.conta_pagamento2) ? DateTime.fromJSDate(t.conta_pagamento).setZone('America/Sao_Paulo').toSQLDate() : null;
          this.tt++;
        }
        if (+t.conta_paga === 2) {
          if (t.conta_pagamento === null || t.conta_vencimento === null) {
            return false;
          }
          cta.conta_pagamento = DateTime.fromJSDate(t.conta_vencimento).setZone('America/Sao_Paulo').toSQLDate();
          this.tt++;
        }
        this.tt++;
      }

      if (t.conta_pagamento !== this.cfs.conta.conta_pagamento2) {
        cta.conta_pagamento = (t.conta_pagamento !== null) ? DateTime.fromJSDate(t.conta_pagamento).setZone('America/Sao_Paulo').toSQLDate() : null;
        this.tt++;
      }



      /*if (+t.conta_debito_automatico !== +this.cfs.conta.conta_debito_automatico) {
        cta.conta_debito_automatico = +t.conta_debito_automatico;
        this.tt++;
      }*/

      if (this.agendaSN && +t.conta_agenda === 1) {
        cta.conta_agenda = +t.conta_agenda;
        this.tt++;
      }

      /*if (+t.conta_parcelas !== +this.cfs.conta.conta_parcelas) {
        cta.conta_parcelas = +t.conta_parcelas;
        this.tt++;
      }*/

      /*if (+t.conta_rptdia !== +this.cfs.conta.conta_rptdia) {
        cta.conta_rptdia = +t.conta_rptdia;
        this.tt++;
      }*/

      /*if (!this.rptd && +t.conta_agenda !== null) {
        cta.conta_agenda = +t.conta_agenda;
        this.tt++;
      }*/

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
      } else {
        cta.conta_tipo = 0;
      }

      if (+t.conta_paga !== null) {
        cta.conta_paga = +t.conta_paga;
        if (+t.conta_paga === 1) {
          if (t.conta_pagamento !== null) {
            cta.conta_pagamento = DateTime.fromJSDate(t.conta_pagamento).setZone('America/Sao_Paulo').toSQLDate();
            this.tt++;
          } else {
            return false;
          }
        }
        if (+t.conta_paga === 2) {
          if (t.conta_vencimento !== null) {
            cta.conta_pagamento = t.conta_vencimento;
            this.tt++;
          }
        }
        if (+t.conta_paga === 0) {
          cta.conta_pagamento = null
          this.tt++;
        }
        this.tt++;
      }

      /*if (+t.conta_debito_automatico !== null) {
        cta.conta_debito_automatico = +t.conta_debito_automatico;
        this.tt++;
      }*/

      if (+t.conta_agenda !== null) {
        cta.conta_agenda = +t.conta_agenda;
        this.tt++;
      }

      if (+t.conta_rptdia !== null) {
        cta.conta_rptdia = +t.conta_rptdia;
        if ( +t.conta_rptdia > 0) {
          if (+t.conta_parcelas !== null) {
            cta.conta_parcelas = +t.conta_parcelas;
            this.tt++;
          }
          if (+t.conta_paga2 !== null) {
            cta.conta_paga2 = +t.conta_paga2;
            this.tt++;
          }
        }
        if ( +t.conta_rptdia == 0) {
          cta.conta_parcelas = 1;
          this.tt++;
        }

        this.tt++;
      }

      if (t.conta_observacao !== null) {
        cta.conta_observacao = this.formConta.get('conta_observacao').value;
        cta.conta_observacao_delta = JSON.stringify(this.kill0.getContents());
        cta.conta_observacao_texto = this.kill0.getText();
        this.tt++;
      }

    }

    const vf: boolean = ((this.acao === 'alterar' && this.tt >= 1) || (this.acao === 'incluir' && this.tt >= 8));
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
          console.log(dados);
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
    this.resetForm();
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

  mostraInfo(ev: string) {
      this.infoVf = true;
      this.texto = ev;
  }

  cedenteChange(){
    this.cedenteSN = +this.formConta.get('cedenteSN').value;
    console.log('cedenteChange', this.formConta.get('cedenteSN').value, this.cedenteSN);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
    this.cfs.resetConta();
    this.formConta.reset();
  }

}
