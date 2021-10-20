import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AutocompleteService, DropdownService, MostraMenuService } from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { take } from 'rxjs/operators';
import { PassagemBuscaService, PassagemService } from '../_services';
import { PassagemFormulario } from '../_models';

@Component({
  selector: 'app-passagem-formulario',
  templateUrl: './passagem-formulario.component.html',
  styleUrls: ['./passagem-formulario.component.css']
})
export class PassagemFormularioComponent implements OnInit {
  public formPassagem: FormGroup;
  public items: Array<any> = [];
  ptBr: any;
  public sgt: string[];
  public sgt2: string[];
  public ddPassagem_aerolinha_id: SelectItem[] = [];
  public ddPassagem_voado_id: SelectItem[] = [
    { label: 'SIM', value: 1 },
    { label: 'NÃO', value: 0 }
  ];

  botaoEnviarVF = false;
  mostraForm = true;
  acao: string = null;
  contador = 0;
  resp: any[];
  origem: string = null;
  atualisaDatatable = false;


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
    private pbs: PassagemBuscaService,
    private ps: PassagemService
  ) {
  }

  ngOnInit() {
    this.acao = this.config.data.acao;
    this.ddPassagem_aerolinha_id = JSON.parse(sessionStorage.getItem('dropdown-aerolinha'));
    this.ps.criarPassagem();
    this.carregaDados();
    this.configuraCalendario();
    this.criaForm();
    this.cs.escondeCarregador();
  }

  carregaDados() {
    this.acao = this.config.data.acao;
    if (this.config.data.acao === 'alterar') {
      console.log('this.config.data', this.config.data);
      this.ps.pf = this.config.data.passagem;
      this.origem = this.config.data.origem;
    } else {
      this.ps.pf.passagem_id = 0;
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

  criaForm() {
    this.formPassagem = this.formBuilder.group({
      passagem_id: [this.ps.pf.passagem_id],
      passagem_beneficiario: [this.ps.pf.passagem_beneficiario, Validators.required],
      passagem_data: [this.ps.pf.passagem_data, Validators.required],
      passagem_hora: [this.ps.pf.passagem_hora],
      passagem_trecho: [this.ps.pf.passagem_trecho, Validators.required],
      passagem_aerolinha_id: [this.ps.pf.passagem_aerolinha_id, Validators.required],
      passagem_observacao: [this.ps.pf.passagem_observacao],
      passagem_valor: [this.ps.pf.passagem_valor2],
      passagem_voado_id: [this.ps.pf.passagem_voado_id, Validators.required],
      passagem_voo: [this.ps.pf.passagem_voo],
      passagem_localizador: [this.ps.pf.passagem_localizador],
      agenda: [0]
    });
  }

  autoComp(event) {
    let sg: any[];
    this.autocompleteservice.getACSimples3('passagem', 'passagem_beneficiario', event.query)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          sg = dados;
        },
        error: err => console.error(err),
        complete: () => {
          this.sgt = sg;
        }
      });
  }

  autoComp2(event) {
    let sg: any[];
    this.autocompleteservice.getACSimples3('passagem', 'passagem_trecho', event.query)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          sg = dados;
        },
        error: err => console.error(err),
        complete: () => {
          this.sgt2 = sg;
        }
      });
  }

  enviarPassagem() {
    // this.verificaValidacoesForm(this.formPassagem);
    if (this.formPassagem.valid) {
      this.preparaEnvio();
    }
  }

  preparaEnvio() {
    if (this.formPassagem.get('passagem_beneficiario').dirty) {
      this.contador++;
      this.ps.pf.passagem_beneficiario = this.formPassagem.get('passagem_beneficiario').value;
    } else {
      if (this.acao === 'alterar') {
        this.ps.pf.passagem_beneficiario = null;
      }
    }
    if (this.acao === 'alterar' && this.formPassagem.get('passagem_data').pristine) {
      this.ps.pf.passagem_data = null;
    } else {
      this.contador++;
      this.ps.pf.passagem_data = this.formPassagem.get('passagem_data').value;
    }
    if (this.formPassagem.get('passagem_hora').dirty) {
      this.contador++;
      this.ps.pf.passagem_hora = this.formPassagem.get('passagem_hora').value;
    } else {
      if (this.acao === 'alterar') {
        this.ps.pf.passagem_hora = null;
      }
    }
    if (this.formPassagem.get('passagem_trecho').dirty) {
      this.contador++;
      this.ps.pf.passagem_trecho = this.formPassagem.get('passagem_trecho').value;
    } else {
      if (this.acao === 'alterar') {
        this.ps.pf.passagem_trecho = null;
      }
    }
    if (this.formPassagem.get('passagem_aerolinha_id').dirty) {
      this.contador++;
      this.ps.pf.passagem_aerolinha_id = this.formPassagem.get('passagem_aerolinha_id').value;
    } else {
      if (this.acao === 'alterar') {
        this.ps.pf.passagem_aerolinha_id = null;
        this.ps.pf.passagem_aerolinha_nome = null;
      }
    }
    if (this.formPassagem.get('passagem_observacao').dirty) {
      this.contador++;
      this.ps.pf.passagem_observacao = this.formPassagem.get('passagem_observacao').value;
    } else {
      if (this.acao === 'alterar') {
        this.ps.pf.passagem_observacao = null;
      }
    }
    if (this.formPassagem.get('passagem_voo').dirty) {
      this.contador++;
      this.ps.pf.passagem_voo = this.formPassagem.get('passagem_voo').value;
    } else {
      if (this.acao === 'alterar') {
        this.ps.pf.passagem_voo = null;
      }
    }
    if (this.formPassagem.get('passagem_voado_id').dirty) {
      this.contador++;
      this.ps.pf.passagem_voado_id = this.formPassagem.get('passagem_voado_id').value;
      delete this.ps.pf.passagem_voado_sn;
    } else {
      if (this.acao === 'alterar') {
        this.ps.pf.passagem_voado_id = null;
        delete this.ps.pf.passagem_voado_sn;
      }
    }
    if (this.formPassagem.get('passagem_valor').dirty) {
      this.contador++;
      this.ps.pf.passagem_valor = this.formPassagem.get('passagem_valor').value;
      delete this.ps.pf.passagem_valor2;
    } else {
      if (this.acao === 'alterar') {
        this.ps.pf.passagem_valor = null;
      }
      delete this.ps.pf.passagem_valor2;
    }

    if (this.formPassagem.get('agenda').dirty) {
      this.ps.pf.agenda = this.formPassagem.get('agenda').value;
    }
    if (this.acao === 'alterar') {
      delete this.ps.pf.agenda;
    }

    if (this.acao === 'alterar') {
      if (this.contador > 0) {
        this.botaoEnviarVF = true;
        this.mostraForm = false;
        this.cs.mostraCarregador();
        this.enviarAlterar();
      } else {
        this.messageService.add({
          key: 'passagemToast',
          severity: 'warn',
          summary: 'ATENÇÃO',
          detail: 'Nenhuma alteração efetuada!'
        });
      }
    } else {
      this.botaoEnviarVF = true;
      this.mostraForm = false;
      this.cs.mostraCarregador();
      this.enviarIncluir();
    }
  }

  enviarIncluir() {
    this.ps.incluirPassagem(this.ps.filtraPassagem())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = true;
          this.cs.escondeCarregador();
          this.messageService.add({ key: 'passagemToast', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2] });
          console.log(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.corrigeOrigem();
            this.messageService.add({
              key: 'passagemToast',
              severity: 'success',
              summary: 'INCLUIR PASSAGEM',
              detail: this.resp[2]
            });
            // this.resp[3] = null;
            this.atualisaDatatable = true;
            this.resetForm();
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            this.cs.escondeCarregador();
          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            this.cs.escondeCarregador();
            console.error('ERRO - INCLUIR ', this.resp[2]);
            this.messageService.add({
              key: 'passagemToast',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          }
        }
      });
  }

  enviarAlterar() {
    this.ps.putPassagemAlterar(this.ps.pf.passagem_id, this.ps.filtraPassagem())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = true;
          this.cs.escondeCarregador();
          this.messageService.add({ key: 'passagemToast', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2] });
          console.log(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.corrigeOrigem();
            this.messageService.add({
              key: 'passagemToast',
              severity: 'success',
              summary: 'ALTERAR PASSAGEM',
              detail: this.resp[2]
            });
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            this.resetForm();
            this.cs.escondeCarregador();
            this.voltarListar();
          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            this.cs.escondeCarregador();
            console.error('ERRO - ALTERAR ', this.resp[2]);
            this.messageService.add({
              key: 'passagemToast',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          }
        }
      });
  }

  resetForm() {
    this.ps.resetPassagem();
    this.formPassagem.reset();
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
      !this.formPassagem.get(campo).valid &&
      (this.formPassagem.get(campo).touched || this.formPassagem.get(campo).dirty)
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

  corrigeOrigem() {
    const t: PassagemFormulario = this.ps.filtraPassagem();
    let d: string[] = JSON.parse(sessionStorage.getItem('passagem_beneficiario-dropdown'));
    if (t.passagem_beneficiario) {
      const f = d.find(i => i === t.passagem_beneficiario);
      if (f === undefined) {
        d = null;
        sessionStorage.removeItem('passagem_beneficiario-dropdown');
        this.dd.postDropdownSoNome({ tabela: 'passagem', campo_nome: 'passagem_beneficiario' })
          .pipe(take(1))
          .subscribe((dados) => {
              d = dados;
            },
            error1 => {
              console.log('erro');
            },
            () => {
              sessionStorage.setItem('passagem_beneficiario-dropdown', JSON.stringify(d));
              this.pbs.atualisaMenuSubject.next(true);
            });
      }
    }

    let e: string[] = JSON.parse(sessionStorage.getItem('passagem_aerolinha-dropdown'));
    if (t.passagem_aerolinha_id) {
      const f = e.find(i => i === t.passagem_aerolinha_id);
      if (f === undefined) {
        e = null;
        sessionStorage.removeItem('passagem_aerolinha-dropdown');
        this.dd.postDropdownNomeId({ tabela: 'passagem', campo_id: 'passagem_aerolinha_id', campo_nome: 'passagem_aerolinha_nome' })
          .pipe(take(1))
          .subscribe((dados) => {
              e = dados;
            },
            error1 => {
              console.log('erro');
            },
            () => {
              sessionStorage.setItem('passagem_aerolinha-dropdown', JSON.stringify(e));
              this.pbs.atualisaMenuSubject.next(true);
            });
      }
    }


  }
}
