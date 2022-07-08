import {Component, ViewChild, OnInit, OnDestroy, ViewEncapsulation, AfterViewInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';

import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AutocompleteService, DropdownService } from '../../_services';
import { DropdownnomeidClass } from '../../_models';
import { SolicitacaoFormService, SolicitacaoService } from '../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { SolicitacaoAlterarFormulario, SolicitacaoAlterarInterface, SolicitacaoFormulario } from '../_models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-solicitacao-alterar',
  templateUrl: './solicitacao-alterar.component.html',
  styleUrls: ['./solicitacao-alterar.component.css']
})
export class SolicitacaoAlterarComponent implements OnInit, AfterViewInit, OnDestroy {

  solicitacao_id: number;
  formSolicitacaoAlterar: FormGroup;
  solicitacao_cadastro_tipo_nome: string;
  solicitacao_cadastro_nome: string;
  ddNomeIdArray = new DropdownnomeidClass();
  ddSolicitacao_assunto_id: SelectItem[] = [];
  ddSolicitacao_atendente_cadastro_id: SelectItem[] = [];
  ddSolicitacao_cadastrante_cadastro_id: SelectItem[] = [];
  ddSolicitacao_tipo_recebimento_id: SelectItem[] = [];
  ddSolicitacao_local_id: SelectItem[] = [];
  ddSolicitacao_reponsavel_analize_id: SelectItem[] = [];
  ddSolicitacao_area_interesse_id: SelectItem[] = [];
  sgt: SelectItem[];
  ptBr: any;
  mostraForm = true;
  emptyMessage = 'Nenhum registro encontrado.';
  modulos: any;
  mostraModulos1 = 'none';
  mostraModulos2 = 'none';
  mostraModulos3 = 'none';
  icone = 'pi pi-chevron-down';
  cadastro_incluir = false;
  novoRegistro: SelectItem;
  moduloRecebido = '';
  cadastroTipoIdRecebido = 0;
  resp: any[];
  sub: Subscription[] = [];
  arquivo_num = 0;
  arquivos?: any[];

  possuiArquivos = false;

  teste: any[];

  constructor(
    // private http: HttpClient,
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private autocompleteservice: AutocompleteService,
    private location: Location,
    private sfs: SolicitacaoFormService,
    private solicitacaoService: SolicitacaoService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private cr: CarregadorService,
  ) { }

  ngOnInit() {
    this.sub.push(this.activatedRoute.data.subscribe(
      (data: {dados: SolicitacaoAlterarInterface}) => {
        this.sfs.alterar = data.dados;
        this.solicitacao_id = data.dados.solicitacao_id;
        this.solicitacao_cadastro_tipo_nome = data.dados.solicitacao_cadastro_tipo_nome;
        this.solicitacao_cadastro_nome = data.dados.solicitacao_cadastro_nome;
        this.arquivo_num = data.dados.arquivo_num;
        this.arquivos = data.dados.arquivo;
        this.criaForm();
      }
    ));
    this.carregaDropdownSessionStorage();
    // this.criaForm();
    this.configuraCalendario();
    this.configuraEditor();
    this.cadastro_incluir = this.authenticationService.cadastro_incluir;

    if (typeof this.activatedRoute.snapshot.params['modulo'] !== 'undefined') {
      this.moduloRecebido = this.activatedRoute.snapshot.params['modulo'];
      this.cadastroTipoIdRecebido = +this.activatedRoute.snapshot.params['tipo'];
      this.novoRegistro = {
        label: this.activatedRoute.snapshot.params['label'],
        value: +this.activatedRoute.snapshot.params['value']
      };
       this.adicionaDadosIncluidos();
    }
    // this.cr.escondeCarregador();
  }

  ngAfterViewInit() {
    this.cr.escondeCarregador();
  }

  carregaDropdownSessionStorage() {
    this.ddSolicitacao_assunto_id = JSON.parse(sessionStorage.getItem('dropdown-assunto'));
    this.ddSolicitacao_atendente_cadastro_id = JSON.parse(sessionStorage.getItem('dropdown-atendente'));
    this.ddSolicitacao_cadastrante_cadastro_id = JSON.parse(sessionStorage.getItem('dropdown-cadastrante'));
    this.ddSolicitacao_tipo_recebimento_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_recebimento'));
    this.ddSolicitacao_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
    this.ddSolicitacao_reponsavel_analize_id = JSON.parse(sessionStorage.getItem('dropdown-reponsavel_analize'));
    this.ddSolicitacao_area_interesse_id = JSON.parse(sessionStorage.getItem('dropdown-area_interesse'));
  }

  adicionaDadosIncluidos() {
    if (this.moduloRecebido === 'cadastro') {
      this.formSolicitacaoAlterar.get('solicitacao_cadastro_tipo_id').patchValue(this.cadastroTipoIdRecebido);
      this.formSolicitacaoAlterar.get('solicitacao_cadastro_id').patchValue(this.novoRegistro);
    }
  }

  parseAssunto(assunto: SelectItem[]) {
    assunto.forEach( (a) => {
      const sufix = a.label.length > 50 ? ' ...' : '';
      a.label = a.label.substr(0, 50) + sufix;
    });
    return assunto;
  }

  criaForm() {
    const sn: boolean = +this.sfs.alterar.solicitacao_indicacao_sn > 0;
    this.formSolicitacaoAlterar = this.formBuilder.group({
      solicitacao_assunto_id: [this.sfs.alterar.solicitacao_assunto_id, Validators.required],
      solicitacao_data: [this.sfs.alterar.solicitacao_data, Validators.required],
      solicitacao_indicacao_sn: [sn],
      solicitacao_indicacao_nome: [this.sfs.alterar.solicitacao_indicacao_nome],
      solicitacao_atendente_cadastro_id: [this.sfs.alterar.solicitacao_atendente_cadastro_id, Validators.required],
      solicitacao_data_atendimento: [this.sfs.alterar.solicitacao_data_atendimento, Validators.required],
      solicitacao_cadastrante_cadastro_id: [this.sfs.alterar.solicitacao_cadastrante_cadastro_id, Validators.required],
      solicitacao_tipo_recebimento_id: [this.sfs.alterar.solicitacao_tipo_recebimento_id, Validators.required],
      solicitacao_local_id: [this.sfs.alterar.solicitacao_local_id, Validators.required],
      solicitacao_reponsavel_analize_id: [this.sfs.alterar.solicitacao_reponsavel_analize_id, Validators.required],
      solicitacao_area_interesse_id: [this.sfs.alterar.solicitacao_area_interesse_id, Validators.required],
      solicitacao_descricao: [this.sfs.alterar.solicitacao_descricao],
      solicitacao_aceita_recusada: [this.sfs.alterar.solicitacao_aceita_recusada],
      solicitacao_carta: [this.sfs.alterar.solicitacao_carta]
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

  configuraEditor() {
    this.modulos = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],                                         // remove formatting button
        ['link']                         // link and image, video
      ]
    };
  }

  autoComp (event, campo) {
    if (event.query.length >= 2) {
      // const sg: any[] = null;
      const tabela = campo.toString();
      const campo_id = tabela + '_id';
      const campo_nome = tabela + '_nome';
      const campo_nome_limpo = tabela + '_nome_limpo';

      this.sub.push(this.autocompleteservice.getAcIdNomeNomeLimpo(tabela, campo_id, campo_nome, campo_nome_limpo, event.query)
        .pipe(
          take(1)
        )
        .subscribe({
          next: (dados) => {
            this.sgt = dados;
          },
          error: err => console.error('Autocomplete-->'),
          complete: () => { }
        }));
    }
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

  enviarSolicitacao() {
    this.mostraForm = true;
    if (this.formSolicitacaoAlterar.valid) {
      this.sub.push(this.solicitacaoService.alterarSolicitacao(this.criaSolicitacao())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.messageService.add({key: 'solicitacaoToast', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
            console.log(err);
          },
          complete: () => {
            if (this.resp[3]) {
              this.solicitacaoService.gravaColunaExpandida(this.resp[3]);
            }
            if (this.resp[0]) {
              if (sessionStorage.getItem('solicitacao-dropdown')) {
                sessionStorage.removeItem('solicitacao-dropdown');
              }
              this.messageService.add({
                key: 'solicitacaoToast',
                severity: 'success',
                summary: 'ALTERAR SOLICITAÇÃO',
                detail: this.resp[2]
              });
              this.sfs.resetSolicitacao();
              // this.resetForm();
              this.voltarListar();
            } else {
              console.error('ERRO - ALTERAR ', this.resp[2]);
              this.messageService.add({
                key: 'solicitacaoToast',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
    } else {
      this.mostraForm = false;
    }
  }

  criaSolicitacao(): SolicitacaoAlterarInterface {
    const solicitacao =  new SolicitacaoAlterarFormulario();

    solicitacao.solicitacao_id = +this.solicitacao_id;
    delete solicitacao.solicitacao_cadastro_nome;
    delete solicitacao.solicitacao_orgao;
    delete solicitacao.solicitacao_cadastro_tipo_id;
    delete solicitacao.solicitacao_cadastro_tipo_nome;

    if (+this.sfs.alterar.solicitacao_assunto_id !== +this.formSolicitacaoAlterar.get('solicitacao_assunto_id').value) {
      solicitacao.solicitacao_assunto_id = this.formSolicitacaoAlterar.get('solicitacao_assunto_id').value;
    } else {
      delete solicitacao.solicitacao_assunto_id;
    }
    if (+this.sfs.alterar.solicitacao_indicacao_sn !== +this.formSolicitacaoAlterar.get('solicitacao_indicacao_sn').value) {
      solicitacao.solicitacao_indicacao_sn = +this.formSolicitacaoAlterar.get('solicitacao_indicacao_sn').value;
    } else {
      delete solicitacao.solicitacao_indicacao_sn;
    }
    if (+this.sfs.alterar.solicitacao_atendente_cadastro_id
      !== +this.formSolicitacaoAlterar.get('solicitacao_atendente_cadastro_id').value) {
      solicitacao.solicitacao_atendente_cadastro_id = +this.formSolicitacaoAlterar.get('solicitacao_atendente_cadastro_id').value;
    } else {
      delete solicitacao.solicitacao_atendente_cadastro_id;
    }
    if (+this.sfs.alterar.solicitacao_cadastrante_cadastro_id
      !== +this.formSolicitacaoAlterar.get('solicitacao_cadastrante_cadastro_id').value) {
      solicitacao.solicitacao_cadastrante_cadastro_id = +this.formSolicitacaoAlterar.get('solicitacao_cadastrante_cadastro_id').value;
    } else {
      delete solicitacao.solicitacao_cadastrante_cadastro_id;
    }
    if (+this.sfs.alterar.solicitacao_local_id !== +this.formSolicitacaoAlterar.get('solicitacao_local_id').value) {
      solicitacao.solicitacao_local_id = +this.formSolicitacaoAlterar.get('solicitacao_local_id').value;
    } else {
      delete solicitacao.solicitacao_local_id;
    }
    if (+this.sfs.alterar.solicitacao_tipo_recebimento_id !== +this.formSolicitacaoAlterar.get('solicitacao_tipo_recebimento_id').value) {
      solicitacao.solicitacao_tipo_recebimento_id = +this.formSolicitacaoAlterar.get('solicitacao_tipo_recebimento_id').value;
    } else {
      delete solicitacao.solicitacao_tipo_recebimento_id;
    }
    if (+this.sfs.alterar.solicitacao_area_interesse_id !== +this.formSolicitacaoAlterar.get('solicitacao_area_interesse_id').value) {
      solicitacao.solicitacao_area_interesse_id = +this.formSolicitacaoAlterar.get('solicitacao_area_interesse_id').value;
    } else {
      delete solicitacao.solicitacao_area_interesse_id;
    }
    if (+this.sfs.alterar.solicitacao_reponsavel_analize_id
      !== +this.formSolicitacaoAlterar.get('solicitacao_reponsavel_analize_id').value) {
      solicitacao.solicitacao_reponsavel_analize_id = +this.formSolicitacaoAlterar.get('solicitacao_reponsavel_analize_id').value;
    } else {
      delete solicitacao.solicitacao_reponsavel_analize_id;
    }
    if (this.sfs.alterar.solicitacao_descricao !== this.formSolicitacaoAlterar.get('solicitacao_descricao').value) {
      solicitacao.solicitacao_descricao = this.formSolicitacaoAlterar.get('solicitacao_descricao').value;
    } else {
      delete solicitacao.solicitacao_descricao;
    }
    if (this.sfs.alterar.solicitacao_aceita_recusada !== this.formSolicitacaoAlterar.get('solicitacao_aceita_recusada').value) {
      solicitacao.solicitacao_aceita_recusada = this.formSolicitacaoAlterar.get('solicitacao_aceita_recusada').value;
    } else {
      delete solicitacao.solicitacao_aceita_recusada;
    }
    if (this.sfs.alterar.solicitacao_carta !== this.formSolicitacaoAlterar.get('solicitacao_carta').value) {
      solicitacao.solicitacao_carta = this.formSolicitacaoAlterar.get('solicitacao_carta').value;
    } else {
      delete solicitacao.solicitacao_carta;
    }
    if (this.sfs.alterar.solicitacao_indicacao_nome !== this.formSolicitacaoAlterar.get('solicitacao_indicacao_nome').value) {
      solicitacao.solicitacao_indicacao_nome = this.formSolicitacaoAlterar.get('solicitacao_indicacao_nome').value;
    } else {
      delete solicitacao.solicitacao_indicacao_nome;
    }
    if (this.sfs.alterar.solicitacao_data !== this.formSolicitacaoAlterar.get('solicitacao_data').value) {
      solicitacao.solicitacao_data = this.formSolicitacaoAlterar.get('solicitacao_data').value;
    } else {
      delete solicitacao.solicitacao_data;
    }
    if (this.sfs.alterar.solicitacao_data_atendimento !== this.formSolicitacaoAlterar.get('solicitacao_data_atendimento').value) {
      solicitacao.solicitacao_data_atendimento = this.formSolicitacaoAlterar.get('solicitacao_data_atendimento').value;
    } else {
      delete solicitacao.solicitacao_data_atendimento;
    }
    return solicitacao;
  }

  resetForm() {
    this.formSolicitacaoAlterar.reset();
    window.scrollTo(0, 0);
  }

  onSubmit() {}

  voltarListar() {
    this.router.navigate(['/solicitacao/listar']);
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formSolicitacaoAlterar.get(campo).valid &&
      (this.formSolicitacaoAlterar.get(campo).touched || this.formSolicitacaoAlterar.get(campo).dirty)
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
      !this.formSolicitacaoAlterar.get(campo).valid &&
      (this.formSolicitacaoAlterar.get(campo).touched || this.formSolicitacaoAlterar.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'has-error': this.validaAsync(campo, situacao),
      'has-feedback': this.validaAsync(campo, situacao)
    };
  }

  goIncluir() {
    if (this.authenticationService.cadastro_incluir) {
      this.criaSolicitacao();
      this.router.navigate(['/cadastro/incluir/solicitacao']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  ngOnDestroy(): void {
    this.sfs.resetAlterar();
    this.sub.forEach(s => s.unsubscribe());
  }

}
