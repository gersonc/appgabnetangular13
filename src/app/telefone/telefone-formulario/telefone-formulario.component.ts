import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AutocompleteService, DropdownService, MostraMenuService } from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { take } from 'rxjs/operators';
import { TelefoneBuscaService, TelefoneService } from '../_services';
import { TelefoneFormulario } from '../_models';

@Component({
  selector: 'app-telefone-formulario',
  templateUrl: './telefone-formulario.component.html',
  styleUrls: ['./telefone-formulario.component.css']
})
export class TelefoneFormularioComponent implements OnInit {
  public formTelefone?: FormGroup;
  public items: Array<any> = [];
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
  ];
  public telefone_usuario_nome: string|null = null;
  telefone_resolvido_id?: number|null = null;
  telefone_tipo: number|null = null;
  botaoEnviarVF = false;
  mostraForm = true;
  acao: string|null = null;
  contador = 0;
  resp: any[] = [];
  origem: string|null = null;
  atualisaSatatable = false;


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
    private tbs: TelefoneBuscaService,
    private ts: TelefoneService
  ) { }

  ngOnInit() {
    this.acao = this.config.data.acao;
    this.ts.criarTelefone();
    this.carregaDados();
    this.configuraCalendario();
    this.carregaDropDown();
    this.criaForm();

  }

  carregaDados() {
    this.acao = this.config.data.acao;
    if (this.config.data.acao === 'alterar') {
      console.log('this.config.data', this.config.data);
      this.ts.tl = this.config.data.telefone;
      this.origem = this.config.data.origem;
      this.telefone_usuario_nome = this.config.data.telefone.telefone_usuario_nome;
      this.telefone_resolvido_id = this.config.data.telefone.telefone_resolvido === 'NÃO RESOLVIDO' ? 1 : 0;
      this.telefone_tipo = +this.config.data.telefone.telefone_tipo_id;
    } else {
      const dt = new Date();
      this.ts.tl.telefone_data = (dt.getDate() +
        '/' + ((dt.getMonth() + 1)) +
        '/' + dt.getFullYear() +
        ' ' + dt.getHours() +
        ':' + dt.getMinutes());
      let tmp = JSON.parse(localStorage.getItem('currentUser')!);
      this.telefone_usuario_nome = tmp.usuario_nome;
      tmp = null;
      this.ts.tl.telefone_id = 0;
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
    this.ddTelefone_local_id = JSON.parse(sessionStorage.getItem('dropdown-local')!);
    this.ddTelefone_usuario_nome = JSON.parse(sessionStorage.getItem('dropdown-usuario_nome')!);
    this.cs.escondeCarregador();
  }

  criaForm() {
    this.formTelefone = this.formBuilder.group({
      telefone_id: [this.ts.tl.telefone_id],
      telefone_assunto: [this.ts.tl.telefone_assunto, Validators.required],
      telefone_data: [this.ts.tl.telefone_data, Validators.required],
      telefone_ddd: [this.ts.tl.telefone_ddd],
      telefone_de: [this.ts.tl.telefone_de, Validators.required],
      telefone_local_id: [this.ts.tl.telefone_local_id, Validators.required],
      telefone_observacao: [this.ts.tl.telefone_observacao],
      telefone_para: [this.ts.tl.telefone_para, Validators.required],
      telefone_resolvido: [this.telefone_resolvido_id, Validators.required],
      telefone_telefone: [this.ts.tl.telefone_telefone],
      telefone_tipo: [this.telefone_tipo, Validators.required],
      telefone_usuario_nome: [this.telefone_usuario_nome, Validators.required]
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

  enviarTelefone() {
    // this.verificaValidacoesForm(this.formTelefone);
    if (this.formTelefone!.valid) {
      this.preparaEnvio();
    }
  }

  preparaEnvio() {
    if (this.formTelefone!.get('telefone_assunto')?.dirty) {
      this.contador++;
      this.ts.tl.telefone_assunto = this.formTelefone!.get('telefone_assunto')?.value;
    } else {
      if (this.acao === 'alterar') {
        this.ts.tl.telefone_assunto = null;
      }
    }
    if (this.acao === 'alterar' && this.formTelefone!.get('telefone_data')?.pristine) {
      this.ts.tl.telefone_data = null;
    } else {
      this.contador++;
      this.ts.tl.telefone_data = this.formTelefone!.get('telefone_data')?.value;
    }
    if (this.formTelefone!.get('telefone_ddd')?.dirty) {
      this.contador++;
      this.ts.tl.telefone_ddd = this.formTelefone!.get('telefone_ddd')?.value;
    } else {
      if (this.acao === 'alterar') {
        this.ts.tl.telefone_ddd = null;
      }
    }
    if (this.formTelefone!.get('telefone_de')?.dirty) {
      this.contador++;
      this.ts.tl.telefone_de = this.formTelefone?.get('telefone_de')?.value;
    } else {
      if (this.acao === 'alterar') {
        this.ts.tl.telefone_de = null;
      }
    }
    if (this.formTelefone!.get('telefone_local_id')?.dirty) {
      this.contador++;
      this.ts.tl.telefone_local_id = this.formTelefone!.get('telefone_local_id')?.value;
    } else {
      if (this.acao === 'alterar') {
        this.ts.tl.telefone_local_id = null;
        this.ts.tl.telefone_local_nome = null;
      }
    }
    if (this.formTelefone!.get('telefone_observacao')?.dirty) {
      this.contador++;
      this.ts.tl.telefone_observacao = this.formTelefone!.get('telefone_observacao')?.value;
    } else {
      if (this.acao === 'alterar') {
        this.ts.tl.telefone_observacao = null;
      }
    }
    if (this.formTelefone?.get('telefone_para')?.dirty) {
      this.contador++;
      this.ts.tl.telefone_para = this.formTelefone?.get('telefone_para')?.value;
    } else {
      if (this.acao === 'alterar') {
        this.ts.tl.telefone_para = null;
      }
    }
    if (this.formTelefone?.get('telefone_resolvido')?.dirty) {
      this.contador++;
      this.ts.tl.telefone_resolvido = this.formTelefone?.get('telefone_resolvido')?.value;
    } else {
      if (this.acao === 'alterar') {
        this.ts.tl.telefone_resolvido = null;
        delete this.ts.tl.telefone_resolvido_id;
      } else {
        delete this.ts.tl.telefone_resolvido_id;
      }
    }
    if (this.formTelefone?.get('telefone_telefone')?.dirty) {
      this.contador++;
      this.ts.tl.telefone_telefone = this.formTelefone?.get('telefone_telefone')?.value;
    } else {
      if (this.acao === 'alterar') {
        this.ts.tl.telefone_telefone = null;
      }
    }
    if (this.formTelefone?.get('telefone_tipo')?.dirty) {
      this.contador++;
      this.ts.tl.telefone_tipo = this.formTelefone?.get('telefone_tipo')?.value;
      delete this.ts.tl.telefone_tipo_id;
    } else {
      if (this.acao === 'alterar') {
        this.ts.tl.telefone_tipo = null;
        delete this.ts.tl.telefone_tipo_id;
      } else {
        delete this.ts.tl.telefone_tipo_id;
      }
    }
    if (this.formTelefone?.get('telefone_usuario_nome')?.dirty) {
      this.contador++;
      this.ts.tl.telefone_usuario_nome = this.formTelefone?.get('telefone_usuario_nome')?.value;
    } else {
      if (this.acao === 'alterar') {
        this.ts.tl.telefone_usuario_nome = null;
      }
    }
    if (this.acao === 'alterar') {
      if (this.contador > 0) {
        this.botaoEnviarVF = true;
        this.mostraForm = true;
        this.cs.mostraCarregador();
        this.enviarAlterar();
      } else {
        this.messageService.add({
          key: 'telefoneToast',
          severity: 'warn',
          summary: 'ATENÇÃO',
          detail: 'Nenhuma alteração efetuada!'
        });
      }
    } else {
      this.botaoEnviarVF = true;
      this.mostraForm = true;
      this.cs.mostraCarregador();
      this.enviarIncluir();
    }
  }

  enviarIncluir() {
    this.ts.incluirTelefone(this.ts.filtraTelefone())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = true;
          this.cs.escondeCarregador();
          this.messageService.add({ key: 'telefoneToast', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2] });
          console.log(err);
        },
        complete: () => {
          if (typeof this.resp !== undefined && typeof this.resp !== null) {
            this.corrigeOrigem();

            this.messageService.add({
              key: 'telefoneToast',
              severity: 'success',
              summary: 'INCLUIR TELEFONEMA',
              detail: this.resp[2]
            });
            // this.resp[3] = null;
            this.atualisaSatatable = true;
            this.resetForm();
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            this.cs.escondeCarregador();
          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            this.cs.escondeCarregador();
            console.error('ERRO - INCLUIR ', this.resp[2].toString());
            this.messageService.add({
              key: 'telefoneToast',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]!
            });
          }
        }
      });
  }

  enviarAlterar() {
    this.ts.putTelefoneAlterar(this.ts?.tl?.telefone_id!, this.ts.filtraTelefone())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = false;
          this.cs.escondeCarregador();
          this.messageService.add({ key: 'telefoneToast', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2] });
          console.log(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.corrigeOrigem();
            this.messageService.add({
              key: 'telefoneToast',
              severity: 'success',
              summary: 'ALTERAR TELEFONEMA',
              detail: this.resp[2]
            });
            this.botaoEnviarVF = false;
            this.mostraForm = false;
            this.resetForm();
            this.cs.escondeCarregador();
            this.voltarListar();
          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            this.cs.escondeCarregador();
            console.error('ERRO - ALTERAR ', this.resp[2]);
            this.messageService.add({
              key: 'telefoneToast',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          }
        }
      });
  }

  resetForm() {
    this.ts.resetTelefone();
    this.formTelefone?.reset();
    this.carregaDados();
    this.mostraForm = false;
  }

  voltarListar() {
    if (this.acao === 'alterar') {
      if (this.resp !== undefined) {
        if (this.resp.length === 4) {
          this.ref.close(this.resp[3]);
        } else {
          this.ref.close();
        }
      } else {
        this.ref.close();
      }
    }
    if (this.acao === 'incluir') {
      this.ref.close(this.atualisaSatatable);
    }
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
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

  corrigeOrigem() {
    const t: TelefoneFormulario = this.ts.filtraTelefone();
    let d: string[]|null = JSON.parse(sessionStorage.getItem('telefone-dropdown')!);
    if (t.telefone_usuario_nome) {
      const f = d?.find(i => i === t.telefone_usuario_nome);
      if (f === undefined) {
        d = null;
        sessionStorage.removeItem('telefone-dropdown');
        this.dd.postDropdownSoNome({ tabela: 'telefone', campo_nome: 'telefone_usuario_nome' })
          .pipe(take(1))
          .subscribe((dados) => {
              d = dados;
            },
            error1 => {
              console.log('erro');
            },
            () => {
              sessionStorage.setItem('telefone-dropdown', JSON.stringify(d));
              this.tbs.atualisaMenuSubject.next(true);
            });
      }
    }
  }
}
