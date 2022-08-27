import {Component, OnInit, OnDestroy} from '@angular/core';
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
import {of, Subscription} from "rxjs";
import {MsgService} from "../../_services/msg.service";
import {DateTime} from "luxon";
import {ContaDropdown} from "../_models/conta-dropdown";
import {ArquivoInterface} from "../../arquivo/_models";

@Component({
  selector: 'app-conta-formulario',
  templateUrl: './conta-formulario.component.html',
  styleUrls: ['./conta-formulario.component.css']
})
export class ContaFormularioComponent implements OnInit, OnDestroy {
  public formConta: FormGroup;
  public items: Array<any> = [];
  ptBr: any;
  public sgt: string[];
  public ddConta_local_id: SelectItem[] = [];
  public ddUsuario_id: SelectItem[] = [];
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
  autoCompOnOff = false;
  showPaga = false;
  showIncluir = false;

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
  dtpgtoInvalido = true;

  cedenteFocus = false;
  conta_vencimento = new Date();
  usuario_id: number[] = [];
  agendaVF = true;
  todos_usuarios_sn = true;

  constructor(
    private formBuilder: FormBuilder,
    private mi: MenuInternoService,
    private dd: DdService,
    private ms: MsgService,
    public aut: AuthenticationService,
    private autocompleteservice: AutocompleteService,
    public ct: ContaService,
    public cfs: ContaFormService
  ) {
    this.getUsuarioDD();
  }

  ngOnInit() {
    console.log('aut.arquivos', this.aut.arquivos);
    this.index = this.ct.idx;
    this.acao = this.cfs.acao;
    if (this.acao === 'incluir' || this.acao === 'incluir2') {
      this.cfs.criaFormIncluir();
    } else {
      this.showIncluir = true;
      this.showPaga = true;
    }
    this.carregaDados();
    this.carregaDropDown();
    this.criaForm();
  }

  carregaDados() {
    if (this.aut.solicitacaoVersao === 3) {
      this.nucleo = false;
      this.cfs.conta.conta_local_id = 0;
    }
    this.repetir = +this.cfs.conta.conta_rptdia > 0;
    this.agendaSN = (this.acao === 'incluir' || this.acao === 'incluir2') || (this.acao === 'alterar' && +this.cfs.conta.conta_agenda === 0);
    this.rptd = +this.cfs.conta.conta_rptdia > 0;
    this.ctaPaga = this.cfs.conta.conta_paga;
    this.cfs.conta.conta_local_id = +this.aut.usuario_local_id;
  }

  carregaDropDown() {
    this.ddConta_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
  }

  criaForm() {
    this.agendaVF = (this.cfs.conta.conta_agenda === 1);
    if (this.acao === 'incluir' || this.acao === 'incluir2') {
      this.formConta = this.formBuilder.group({
        conta_cedente: [this.cfs.conta.conta_cedente, [Validators.required, Validators.minLength(2)]],
        conta_valor: [this.cfs.conta.conta_valor, Validators.required],
        conta_vencimento: [this.cfs.conta.conta_vencimento2, Validators.required],
        conta_paga: [this.cfs.conta.conta_paga, Validators.required],
        conta_pagamento: [this.cfs.conta.conta_pagamento2],
        conta_local_id: [this.cfs.conta.conta_local_id],
        conta_rptdia: [this.cfs.conta.conta_rptdia],
        conta_parcelas: [this.cfs.conta.conta_parcelas],
        conta_paga2: [this.cfs.conta.conta_paga2],
        conta_tipo: [this.cfs.conta.conta_tipo],
        conta_agenda: [(this.cfs.conta.conta_agenda === 1)],
        todos_usuarios_sn: [true],
        usuario_id: [this.usuario_id],
        conta_observacao: [this.cfs.conta.conta_observacao]
      });
      this.dtpgtoInvalido = true;
    }
    if (this.acao === 'alterar') {
      this.formConta = this.formBuilder.group({
        conta_cedente: [this.cfs.conta.conta_cedente, [Validators.required, Validators.minLength(2)]],
        conta_valor: [this.cfs.conta.conta_valor, Validators.required],
        conta_vencimento: [this.cfs.conta.conta_vencimento2, Validators.required],
        conta_local_id: [this.cfs.conta.conta_local_id],
        conta_tipo: [{value: this.cfs.conta.conta_tipo, disabled: true}],
        conta_observacao: [this.cfs.conta.conta_observacao],
        conta_paga: [this.cfs.conta.conta_paga],
        conta_pagamento: [this.cfs.conta.conta_pagamento2],
        conta_rptdia: [{value: this.cfs.conta.conta_rptdia, disabled: true}],
        conta_parcelas: [{value: this.cfs.conta.conta_parcelas, disabled: true}],
        todos_usuarios_sn: [false],
        usuario_id: [this.usuario_id],
        conta_agenda: [{value: (this.cfs.conta.conta_agenda === 1), disabled: !this.agendaSN}]
      });

      if (this.ctaPaga === 2) {
        this.formConta.get('conta_pagamento').setValue(this.cfs.conta.conta_vencimento2);
      }
      if (this.ctaPaga === 1) {
        this.formConta.get('conta_pagamento').setValue(this.cfs.conta.conta_pagamento2);
      }
      if (this.ctaPaga === 0) {
        this.formConta.get('conta_pagamento').setValue(null);
      }
      this.dtpgtoInvalido = true;
    }
  }

  autoComp (event) {
    if (this.autoCompOnOff) {
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
    } else {
      this.sgt = [];
      return of(this.sgt);
    }
  }

  autComp2(ev: any) {
    this.autoCompOnOff = true;
  }

  repetirVencimento(ev) {
    this.rptd = ev.value > 0;
      this.formConta.get('conta_parcelas').setValue(this.rptd ? 2 : null);
      this.formConta.get('conta_tipo').setValue(0);
      this.formConta.get('conta_paga2').setValue(+this.formConta.get('conta_paga').value);
  }

  onCtaPaga(ev) {
    this.ctaPaga = +ev.value;
    if (this.ctaPaga === 2) {
      this.formConta.get('conta_pagamento').addValidators(Validators.required);
      this.formConta.get('conta_pagamento').setValue(this.cfs.conta.conta_pagamento2);
    }
    if (this.ctaPaga === 1) {
      this.formConta.get('conta_pagamento').addValidators(Validators.required);
      this.formConta.get('conta_pagamento').setValue(this.cfs.conta.conta_pagamento2);
    }
    if (this.ctaPaga === 0) {
      this.formConta.get('conta_pagamento').removeValidators(Validators.required);
      this.formConta.get('conta_pagamento').setValue(null);
    }
    this.validaPagamento();
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
      (this.formConta?.get(campo)?.touched || this.formConta?.get(campo)?.dirty) && this.validaPagamento()
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
        if (this.acao === 'incluir' || this.acao === 'incluir2') {
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
    this.formConta.reset();
    this.carregaDados();
    this.rptd = false;
    if (this.acao === 'incluir' || this.acao === 'incluir2') {
      this.showIncluir = false;
    }
    this.criaForm();
    this.mostraForm = false;
    this.botaoEnviarVF = false;
    this.tt = 0;
    this.cta = {};
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

      if (t.conta_vencimento !== this.cfs.conta.conta_vencimento2) {
        if (t.conta_vencimento === null) {
          return false;
        }
        cta.conta_vencimento = DateTime.fromJSDate(t.conta_vencimento).setZone('America/Sao_Paulo').toSQLDate();
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
          if (t.conta_pagamento === null && t.conta_vencimento === null) {
            return false;
          }
          if (t.conta_pagamento === null) {
            t.conta_pagamento = DateTime.fromJSDate(t.conta_vencimento).setZone('America/Sao_Paulo').toSQLDate();
          } else {
            cta.conta_pagamento = DateTime.fromJSDate(t.conta_pagamento).setZone('America/Sao_Paulo').toSQLDate();
          }
          this.tt++;
        }
        this.tt++;
      }

      if (t.conta_pagamento !== this.cfs.conta.conta_pagamento2 && +t.conta_paga === +this.cfs.conta.conta_paga) {
        cta.conta_pagamento = (t.conta_pagamento !== null) ? DateTime.fromJSDate(t.conta_pagamento).setZone('America/Sao_Paulo').toSQLDate() : null;
        this.tt++;
      }

      if (this.agendaSN && +t.conta_agenda === 1) {
        cta.conta_agenda = +t.conta_agenda;
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
      } else {
        return false;
      }

      if (t.conta_cedente.toUpperCase() !== null) {
        cta.conta_cedente = t.conta_cedente.toUpperCase();
        this.tt++;
      } else {
        return false;
      }

      if (t.conta_valor !== null) {
        cta.conta_valor = t.conta_valor;
        this.tt++;
      } else {
        return false;
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
          if (t.conta_pagamento === null) {
            cta.conta_pagamento = DateTime.fromJSDate(t.conta_vencimento).setZone('America/Sao_Paulo').toSQLDate();
            this.tt++;
          } else {
            cta.conta_pagamento = DateTime.fromJSDate(t.conta_pagamento).setZone('America/Sao_Paulo').toSQLDate();
          }
        }
        if (+t.conta_paga === 0) {
          cta.conta_pagamento = null
          this.tt++;
        }
        this.tt++;
      }

      if (+t.conta_agenda !== null) {
        if (t.conta_agenda) {
          cta.conta_agenda = 1;
          if (t.todos_usuarios_sn) {
            cta.todos_usuarios_sn = 1
          } else {
            cta.todos_usuarios_sn = 0;
            cta.usuario_id = t.usuario_id;
          }
        } else {
          cta.conta_agenda = 0;
        }
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

    const vf: boolean = ((this.acao === 'alterar' && this.tt >= 1) || ((this.acao === 'incluir' || this.acao === 'incluir2') && this.tt >= 8));
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
          this.tt = 0;
          this.cta = {};
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
              if (this.acao === 'incluir2') {
                this.ct.contaBusca();
              } else {
                this.mi.showMenuInterno();
              }
              this.voltarListar();
            }
          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = false;
            this.arquivoDesativado = false;
            this.tt = 0;
            this.cta = {};
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
            this.botaoEnviarVF = false;
            this.mostraForm = false;
            this.tt = 0;
            this.cta = {};
          },
          complete: () => {
            if (this.resp[0]) {
              const p: ContaI = this.resp[3];
              if (p.conta_pagamento2 !== undefined && p.conta_pagamento2 !== null) {
                p.conta_pagamento3 = new Date(p.conta_pagamento2);
              } else {
                p.conta_pagamento3 = null;
              }
              this.ct.contas[this.ct.idx] = p;
              const c = {
                data: this.ct.contas[this.ct.idx],
                originalEvent: {}
              }
              this.ct.onRowExpand(c);
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'ALTERAR VENCIMENTO',
                detail: this.resp[2]
              });
              this.voltarListar();
            } else {
              this.botaoEnviarVF = false;
              this.mostraForm = false;;
              this.tt = 0;
              this.cta = {};
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
    this.cfs.resetTudo();
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
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'VENCIMENTO',
        detail: this.resp[2]
      });
      this.resetForm();
      this.botaoEnviarVF = false;
      this.mostraForm = false;
      this.tt = 0;
      this.cta = {};
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

  mudaForm(cp: string) {
    this.autoCompOnOff = false;
    if (this.acao === 'incluir' || this.acao === 'incluir2') {
      if (cp === 'conta_vencimento' && this.formConta.get('conta_vencimento').valid) {
        this.conta_vencimento = this.formConta.get('conta_vencimento').value;
      }
      if (this.formConta.get('conta_cedente').valid && this.formConta.get('conta_vencimento').valid && this.formConta.get('conta_valor').valid) {
        this.conta_vencimento = this.formConta.get('conta_vencimento').value;
        this.formConta.get('conta_pagamento').setValue(null, {onlySelf: true, emitEvent: true, emitModelToViewChange: true});
        this.showIncluir = true;
      }
    }
    if (this.acao === 'alterar') {
      this.validaPagamento();
    }

  }

  validaPagamento(): boolean {
    if (this.ctaPaga === 2) {
      if(this.formConta.get('conta_vencimento').invalid || ((this.formConta.get('conta_pagamento').value === undefined || this.formConta.get('conta_pagamento').value === null) && this.formConta.get('conta_pagamento').dirty)) {
        this.dtpgtoInvalido = true;
        return true;
      }
    }
    if (this.ctaPaga === 1) {
      if((this.formConta.get('conta_pagamento').value === undefined || this.formConta.get('conta_pagamento').value === null) && this.formConta.get('conta_pagamento').dirty)  {
        this.dtpgtoInvalido = true;
        return true;
      }
    }
    if (this.ctaPaga === 0) {
      if(this.formConta.get('conta_pagamento').value !== null) {
        this.dtpgtoInvalido = true;
        return true;
      }
    }
    this.dtpgtoInvalido = false;
    return false;
  }

  getUsuarioDD() {
    if (this.ddUsuario_id.length === 0) {
      if (sessionStorage.getItem('dropdown-usuario')) {
        this.ddUsuario_id = JSON.parse(sessionStorage.getItem('dropdown-usuario'));
        return this.ddUsuario_id;
      } else {
        this.sub.push(this.dd.getDd(['dropdown-usuario'])
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              sessionStorage.setItem('dropdown-usuario', JSON.stringify(dados['dropdown-usuario']));
            },
            error: (err) => {
              console.error(err);
            },
            complete: () => {
              this.ddUsuario_id = JSON.parse(sessionStorage.getItem('dropdown-usuario'));
              return this.ddUsuario_id;
            }
          })
        );
      }
    } else {
      return this.ddUsuario_id;
    }
  }

  agendaOnChange(ev) {
    this.usuario_id = [];
    if (this.formConta.get('usuario_id').hasValidator(Validators.required)) {
      this.formConta.get('usuario_id').removeValidators([Validators.required, Validators.minLength(1)]);
    }
    this.formConta.get('usuario_id').setValue(this.usuario_id);
    this.formConta.get('todos_usuarios_sn').setValue(ev.checked);
    this.todos_usuarios_sn = ev.checked;
    this.agendaVF = ev.checked;
  }

  todosUsuariosOnChange(ev: boolean) {
    if(!ev) {
      this.usuario_id.push(this.aut.usuario_id);
      this.formConta.get('usuario_id').setValue(this.usuario_id);
      this.formConta.get('usuario_id').addValidators([Validators.required, Validators.minLength(1)]);
      this.todos_usuarios_sn = ev;
    } else {
      this.usuario_id = [];
      if (this.formConta.get('usuario_id').hasValidator(Validators.required)) {
        this.formConta.get('usuario_id').removeValidators([Validators.required, Validators.minLength(1)]);
      }
      this.formConta.get('usuario_id').setValue(this.usuario_id);
      this.todos_usuarios_sn = ev;
    }
  }

  onUsuarioIdChange(ev) {
    if (ev.value.length === this.ddUsuario_id.length || ev.value.length === 0) {
      this.usuario_id = [];
      this.formConta.get('usuario_id').setValue(this.usuario_id);
      this.formConta.get('todos_usuarios_sn').setValue(true);
      this.todos_usuarios_sn = true;
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
    this.cfs.resetConta();
    this.formConta.reset();
  }
}
