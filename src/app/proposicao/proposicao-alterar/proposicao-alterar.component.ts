import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SelectItem, MessageService } from 'primeng/api';
import { DropdownService, MostraMenuService } from '../../util/_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { ProposicaoFormulario, ProposicaoListagemInterface } from '../_models';
import { ProposicaoFormService, ProposicaoService } from '../_services';

@Component({
  selector: 'app-proposicao-alterar',
  templateUrl: './proposicao-alterar.component.html',
  styleUrls: ['./proposicao-alterar.component.css'],
  providers: [MessageService]
})
export class ProposicaoAlterarComponent implements OnInit, OnDestroy {
  proposicaoIncluir = new ProposicaoFormulario();
  formProp: FormGroup;
  proposicao: ProposicaoFormulario;
  ddProposicao_parecer: SelectItem[];
  ddProposicao_tipo_id: SelectItem[];
  ddProposicao_area_interesse_id: SelectItem[];
  ddProposicao_situacao_id: SelectItem[];
  ddProposicao_origem_id: SelectItem[];
  ddProposicao_orgao_id: SelectItem[];
  ddProposicao_emenda_tipo_id: SelectItem[];
  mostraForm = true;
  mostraAnamento = true;
  mostraModulos1 = 'none';
  mostraModulos2 = 'none';
  mostraModulos3 = 'none';
  ptBr: any;
  sub: Subscription[] = [];
  display = false;
  spinner = false;
  resp: any[];
  numModificacao = 0;

  botaoEnviarVF = false;
  arquivoDesativado = false;
  enviarArquivos = false;

  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    public pfs: ProposicaoFormService,
    private mm: MostraMenuService,
    private location: Location,
    private messageService: MessageService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private proposicaoService: ProposicaoService,
    private cs: CarregadorService
  ) {  }

  ngOnInit() {
    this.pfs.criaProposicao();
    this.configuraCalendario();
    this.carregaDropdownSessionStorage();
    this.sub.push(this.activatedRoute.data.subscribe(
      (data: {dados: any}) => {
        this.pfs.proposicao = data.dados.proposicao;
        }
    ));
    this.criaForm();
    this.cs.escondeCarregador();
  }

  carregaDropdownSessionStorage() {
    this.ddProposicao_parecer = JSON.parse(sessionStorage.getItem('dropdown-parecer'));
    this.ddProposicao_tipo_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_proposicao'));
    this.ddProposicao_area_interesse_id = JSON.parse(sessionStorage.getItem('dropdown-area_interesse'));
    this.ddProposicao_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-situacao_proposicao'));
    this.ddProposicao_origem_id = JSON.parse(sessionStorage.getItem('dropdown-origem_proposicao'));
    this.ddProposicao_orgao_id = JSON.parse(sessionStorage.getItem('dropdown-orgao_proposicao'));
    this.ddProposicao_emenda_tipo_id = JSON.parse(sessionStorage.getItem('dropdown-emenda_proposicao'));
  }

  // ***     FORMULARIO      *************************
  criaForm() {
    this.mostraForm = true;
    this.botaoEnviarVF = false;
    this.formProp = this.formBuilder.group({
      proposicao_tipo_id: [this.pfs.proposicao.proposicao_tipo_id],
      proposicao_numero: [this.pfs.proposicao.proposicao_numero],
      proposicao_autor: [this.pfs.proposicao.proposicao_autor],
      proposicao_relator: [this.pfs.proposicao.proposicao_relator],
      proposicao_data_apresentacao: [this.pfs.proposicao.proposicao_data_apresentacao, Validators.required],
      proposicao_area_interesse_id: [this.pfs.proposicao.proposicao_area_interesse_id, Validators.required],
      proposicao_parecer: [this.pfs.proposicao.proposicao_parecer, Validators.required],
      proposicao_origem_id: [this.pfs.proposicao.proposicao_origem_id, Validators.required],
      proposicao_emenda_tipo_id: [this.pfs.proposicao.proposicao_emenda_tipo_id, Validators.required],
      proposicao_situacao_id: [this.pfs.proposicao.proposicao_situacao_id, Validators.required],
      proposicao_ementa: [this.pfs.proposicao.proposicao_ementa],
      proposicao_texto: [this.pfs.proposicao.proposicao_texto],
      proposicao_relator_atual: [this.pfs.proposicao.proposicao_relator_atual],
      proposicao_orgao_id: [this.pfs.proposicao.proposicao_orgao_id],
      andamento_proposicao_data: [this.pfs.proposicao.andamento_proposicao_data],
      andamento_proposicao_texto: [this.pfs.proposicao.andamento_proposicao_texto]
    });
    this.formProp.valueChanges
      .pipe(take(1))
      .subscribe(ev => {
      this.mostraForm = false;
    });
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

  resetForm() {
    // this.formProp.reset();
    // this.pfs.resetProposicao();
    this.criaForm();
    this.arquivoDesativado = false;
    this.mostraForm = false;
    this.botaoEnviarVF = false;
    window.scrollTo(0, 0);
    this.cs.escondeCarregador();
  }

  focus1(event) {
    this.mostraModulos1 = 'inline-block';
    this.mostraModulos2 = 'none';
    this.mostraModulos3 = 'none';
  }

  focus2(event) {
    this.mostraModulos1 = 'none';
    this.mostraModulos2 = 'inline-block';
    this.mostraModulos3 = 'none';
  }

  focus3(event) {
    this.mostraModulos1 = 'none';
    this.mostraModulos2 = 'none';
    this.mostraModulos3 = 'inline-block';
  }

  onSubmit() {}

  mudaData() {}

  mostrarAndamento() {
    this.mostraAnamento = !this.mostraAnamento;
  }

  showDialog() {
    this.display = true;
  }

  fechar() {
    this.display = false;
  }

  voltarListar() {
    this.cs.escondeCarregador();
    if (!sessionStorage.getItem('proposicao-busca')) {
      this.mm.showMenu();
    }
    this.router.navigate(['/proposicao']);
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formProp.get(campo).valid &&
      (this.formProp.get(campo).touched || this.formProp.get(campo).dirty)
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

  validaAsync(campo: string, situacao: boolean) {
    return (
      !this.formProp.get(campo).valid &&
      (this.formProp.get(campo).touched || this.formProp.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'has-error': this.validaAsync(campo, situacao),
      'has-feedback': this.validaAsync(campo, situacao)
    };
  }

  enviarProposicao() {
    if (this.formProp.valid) {
      this.criaProposicao();
      if (this.numModificacao > 0) {
        this.cs.mostraCarregador();
        this.arquivoDesativado = true;
        this.mostraForm = true;
        this.botaoEnviarVF = true;
        this.sub.push(this.proposicaoService.putProposicaoAlterar(this.pfs.proposicao.proposicao_id, this.pfs.filtraProposicao())
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              this.resp = dados;
            },
            error: (err) => {
              this.mostraForm = true;
              this.botaoEnviarVF = false;
              this.cs.escondeCarregador();
              this.messageService.add({ key: 'proposicaoToast', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2] });
              console.log(err);
            },
            complete: () => {
              if (this.resp[0]) {
                if (sessionStorage.getItem('proposicao-dropdown')) {
                  sessionStorage.removeItem('proposicao-dropdown');
                }
                  this.messageService.add({
                    key: 'proposicaoToastOk',
                    severity: 'success',
                    summary: 'ALTERAR PROPOSIÇÃO',
                    detail: this.resp[2]
                  });
              } else {
                this.mostraForm = false;
                this.botaoEnviarVF = false;
                this.cs.escondeCarregador();
                console.error('ERRO - ALTERAR ', this.resp[2]);
                this.messageService.add({
                  key: 'proposicaoToast',
                  severity: 'warn',
                  summary: 'ATENÇÃO - ERRO',
                  detail: this.resp[2]
                });
              }
            }
          })
        );
      }
    }
  }

  criaProposicao() {
    if (this.formProp.get('proposicao_numero').dirty) {
      this.pfs.proposicao.proposicao_numero = this.formProp.get('proposicao_numero').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_numero = null;
    }
    if (this.formProp.get('proposicao_tipo_id').dirty) {
      this.pfs.proposicao.proposicao_tipo_id = this.formProp.get('proposicao_tipo_id').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_tipo_id = null;
    }
    if (this.formProp.get('proposicao_relator').dirty) {
      this.pfs.proposicao.proposicao_relator = this.formProp.get('proposicao_relator').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_relator = null;
    }
    if (this.formProp.get('proposicao_relator_atual').dirty) {
      this.pfs.proposicao.proposicao_relator_atual = this.formProp.get('proposicao_relator_atual').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_relator_atual = null;
    }
    if (this.formProp.get('proposicao_data_apresentacao').dirty) {
      this.pfs.proposicao.proposicao_data_apresentacao = this.formProp.get('proposicao_data_apresentacao').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_data_apresentacao = null;
    }
    if (this.formProp.get('proposicao_area_interesse_id').dirty) {
      this.pfs.proposicao.proposicao_area_interesse_id = this.formProp.get('proposicao_area_interesse_id').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_area_interesse_id = null;
    }
    if (this.formProp.get('proposicao_texto').dirty) {
      this.pfs.proposicao.proposicao_texto = this.formProp.get('proposicao_texto').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_texto = null;
    }
    if (this.formProp.get('proposicao_ementa').dirty) {
      this.pfs.proposicao.proposicao_ementa = this.formProp.get('proposicao_ementa').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_ementa = null;
    }
    if (this.formProp.get('proposicao_situacao_id').dirty) {
      this.pfs.proposicao.proposicao_situacao_id = this.formProp.get('proposicao_situacao_id').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_situacao_id = null;
    }
    if (this.formProp.get('proposicao_parecer').dirty) {
      this.pfs.proposicao.proposicao_parecer = this.formProp.get('proposicao_parecer').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_parecer = null;
    }
    if (this.formProp.get('proposicao_origem_id').dirty) {
      this.pfs.proposicao.proposicao_origem_id = this.formProp.get('proposicao_origem_id').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_origem_id = null;
    }
    if (this.formProp.get('proposicao_orgao_id').dirty) {
      this.pfs.proposicao.proposicao_orgao_id = this.formProp.get('proposicao_orgao_id').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_orgao_id = null;
    }
    if (this.formProp.get('proposicao_emenda_tipo_id').dirty) {
      this.pfs.proposicao.proposicao_emenda_tipo_id = this.formProp.get('proposicao_emenda_tipo_id').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_emenda_tipo_id = null;
    }
    if (this.formProp.get('proposicao_autor').dirty) {
      this.pfs.proposicao.proposicao_autor = this.formProp.get('proposicao_autor').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.proposicao_autor = null;
    }
    if (this.formProp.get('andamento_proposicao_data').dirty) {
      this.pfs.proposicao.andamento_proposicao_data = this.formProp.get('andamento_proposicao_data').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.andamento_proposicao_data = null;
    }
    if (this.formProp.get('andamento_proposicao_texto').dirty) {
      this.pfs.proposicao.andamento_proposicao_texto = this.formProp.get('andamento_proposicao_texto').value;
      this.numModificacao++;
    } else {
      this.pfs.proposicao.andamento_proposicao_texto = null;
    }
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = ev;
    this.botaoEnviarVF = ev;
  }

  onNovoRegistroAux(ev) {
    this.ddProposicao_tipo_id = ev.dropdown;
    this.formProp.get(ev.campo).patchValue(ev.valorId);
  }

  ngOnDestroy(): void {
    this.cs.escondeCarregador();
    this.pfs.resetProposicao();
    this.botaoEnviarVF = false;
    this.sub.forEach(s => s.unsubscribe());
  }

}
