import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AutocompleteService, DropdownService, MostraMenuService } from '../../util/_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { take } from 'rxjs/operators';
import { ContaBuscaService, ContaService } from '../_services';
import { ContaFormulario, ContaDropdown } from '../_models';

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
  botaoEnviarVF = false;
  mostraForm = false;
  acao: string = null;
  contador = 0;
  resp: any[];
  origem: string = null;
  atualisaDatatable = false;
  rptd = false;

  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;


  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private mm: MostraMenuService,
    private messageService: MessageService,
    public authenticationService: AuthenticationService,
    private autocompleteservice: AutocompleteService,
    private cs: CarregadorService,
    private tbs: ContaBuscaService,
    private contaService: ContaService,
    public cd: ContaDropdown,
  ) { }

  ngOnInit() {
    this.acao = this.config.data.acao;
    this.contaService.criarConta();
    this.carregaDados();
    this.configuraCalendario();
    this.carregaDropDown();
    this.criaForm();
  }

  carregaDados() {
    this.acao = this.config.data.acao;
    if (this.config.data.acao === 'alterar') {
      this.contaService.ct = this.config.data.conta;
      this.origem = this.config.data.origem;
    } else {
      this.contaService.ct.conta_id = 0;
    }
  }

  configuraCalendario() {
    this.ptBr = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'septembro',
        'outubro', 'novembro', 'dezembro'],
      monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy'
    };
  }

  carregaDropDown() {
    this.ddConta_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
    this.cs.escondeCarregador();
  }

  criaForm() {
    this.formConta = this.formBuilder.group({
      conta_id: [this.contaService.ct.conta_id],
      conta_cedente: [this.contaService.ct.conta_cedente, Validators.required],
      conta_valor: [this.contaService.ct.conta_valor2, Validators.required],
      conta_vencimento: [this.contaService.ct.conta_vencimento, Validators.required],
      conta_local_id: [this.contaService.ct.conta_local_id, Validators.required],
      conta_tipo: [this.contaService.ct.conta_tipo_id, Validators.required],
      conta_debito_automatico: [this.contaService.ct.conta_debito_automatico_id, Validators.required],
      conta_observacao: [this.contaService.ct.conta_observacao],
      conta_paga: [this.contaService.ct.conta_paga_id, Validators.required],
      conta_pagamento: [this.contaService.ct.conta_pagamento],
      rptdia: [this.contaService.ct.rptdia],
      parcelas: [this.contaService.ct.parcelas],
      agenda: [this.contaService.ct.agenda],
    });
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

  enviarConta() {
    if (this.formConta.valid) {
      this.preparaEnvio();
    } else {
      this.verificaValidacoesForm(this.formConta);
    }
  }

  preparaEnvio() {
    const d = new ContaFormulario();
    d.conta_id = this.contaService.ct.conta_id;
    if (this.formConta.get('conta_cedente').dirty) {
      this.contador++;
      d.conta_cedente = this.formConta.get('conta_cedente').value;
    }
    if (this.formConta.get('conta_vencimento').dirty) {
      this.contador++;
      d.conta_vencimento = this.formConta.get('conta_vencimento').value;
    }
    if (this.formConta.get('conta_pagamento').dirty) {
      this.contador++;
      d.conta_pagamento = this.formConta.get('conta_pagamento').value;
    }
    if (this.formConta.get('conta_valor').dirty) {
      this.contador++;
      d.conta_valor = this.formConta.get('conta_valor').value;
    }
    if (this.formConta.get('conta_debito_automatico').dirty) {
      this.contador++;
      d.conta_debito_automatico = this.formConta.get('conta_debito_automatico').value;
    }
    if (this.formConta.get('conta_local_id').dirty) {
      this.contador++;
      d.conta_local_id = this.formConta.get('conta_local_id').value;
    }
    if (this.formConta.get('conta_observacao').dirty) {
      this.contador++;
      d.conta_observacao = this.formConta.get('conta_observacao').value;
    }
    if (this.formConta.get('conta_paga').dirty) {
      this.contador++;
      d.conta_paga = this.formConta.get('conta_paga').value;
    }
    if (this.formConta.get('conta_tipo').dirty) {
      this.contador++;
      d.conta_tipo = this.formConta.get('conta_tipo').value;
    }
    if (this.acao !== 'alterar') {
      d.rptdia = this.formConta.get('rptdia').value ? this.formConta.get('rptdia').value : 0;
    }
    if (this.formConta.get('parcelas').dirty && this.acao !== 'alterar' && d.rptdia > 0) {
      d.parcelas = this.formConta.get('parcelas').value;
    }
    if (this.acao !== 'alterar') {
      d.agenda = !!this.formConta.get('agenda').value;
    }
    if (this.acao === 'alterar') {
      if (this.contador > 0) {
        this.botaoEnviarVF = true;
        this.mostraForm = true;
        this.cs.mostraCarregador();
        this.enviarAlterar(d);
      } else {
        this.messageService.add({
          key: 'contaToast',
          severity: 'warn',
          summary: 'ATENÇÃO',
          detail: 'Nenhuma alteração efetuada!'
        });
        this.botaoEnviarVF = false;
        this.mostraForm = false;
      }
    } else {
      this.botaoEnviarVF = true;
      this.mostraForm = true;
      this.cs.mostraCarregador();
      this.enviarIncluir(d);
    }
  }

  enviarIncluir(d) {
    this.contaService.incluirConta(this.contaService.filtraConta(d))
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = false;
          this.cs.escondeCarregador();
          this.messageService.add({ key: 'contaToast', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2] });
          console.log(err);
        },
        complete: () => {
          if (this.resp[0]) {
            if (this.possuiArquivos) {
              this.arquivo_registro_id = +this.resp[1];
              this.enviarArquivos = true;
            } else {
              this.messageService.add({
                key: 'contaToast',
                severity: 'success',
                summary: 'INCLUIR VENCIMENTO',
                detail: this.resp[2]
              });
              this.atualisaDatatable = true;
              this.resetForm();
              this.botaoEnviarVF = false;
              this.mostraForm = false;
              this.cs.escondeCarregador();
            }
          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = false;
            this.cs.escondeCarregador();
            console.error('ERRO - INCLUIR ', this.resp[2]);
            this.messageService.add({
              key: 'contaToast',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          }
        }
      });
  }

  enviarAlterar(d: ContaFormulario) {
    this.contaService.putContaAlterar(d.conta_id, this.contaService.filtraConta(d))
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = false;
          this.cs.escondeCarregador();
          this.messageService.add({ key: 'contaToast', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2] });
          console.log(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.messageService.add({
              key: 'contaToast',
              severity: 'success',
              summary: 'ALTERAR LANÇAMENTO',
              detail: this.resp[2]
            });
            this.botaoEnviarVF = true;
            this.mostraForm = false;
            // this.resetForm();
            // this.cs.escondeCarregador();
            this.voltarListar();
          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = false;
            this.cs.escondeCarregador();
            console.error('ERRO - ALTERAR ', this.resp[2]);
            this.messageService.add({
              key: 'contaToast',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          }
        }
      });
  }

  resetForm() {
    this.contaService.resetConta();
    this.formConta.reset();
    this.carregaDados();
    this.mostraForm = false;
  }

  voltarListar() {
    if (this.acao === 'alterar') {
      if (this.resp !== undefined) {
        if (this.resp.length === 4) {
          this.ref.close(this.resp[3]);
        }
      } else {
        this.ref.close();
      }
    }
    if (this.acao === 'incluir') {
      this.ref.close(this.atualisaDatatable);
    }
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formConta.get(campo).valid &&
      (this.formConta.get(campo).touched || this.formConta.get(campo).dirty)
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

  onBlockSubmit(ev: boolean) {
    this.mostraForm = ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onUpload(ev) {
    if (ev) {
      this.mostraForm = false;
      this.cs.escondeCarregador();
      this.messageService.add({
        key: 'contaToast',
        severity: 'success',
        summary: 'VENCIMENTO',
        detail: this.resp[2]
      });
      this.resetForm();
      this.botaoEnviarVF = false;
      // this.voltarListar();
    }
  }

  ngOnDestroy(): void {
    this.contaService.resetConta();
    this.formConta.reset();
  }

}
