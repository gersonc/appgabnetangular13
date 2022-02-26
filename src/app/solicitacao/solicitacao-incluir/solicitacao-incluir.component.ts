import {Component, ViewChild, OnInit, OnDestroy, ViewEncapsulation, AfterViewInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';

import {SelectItem, MenuItem, SelectItemGroup} from 'primeng/api';
import { MessageService } from 'primeng/api';
import {AutocompleteService, DropdownService, MenuInternoService, MostraMenuService} from '../../_services';
import { DropdownnomeidClass } from '../../_models';
import { SolicitacaoFormService } from '../_services';
import {AuthenticationService, CarregadorService} from '../../_services';
import { SolicitacaoFormulario, SolicitacaoFormularioInterface } from '../_models';
import { Subscription} from 'rxjs';
import { SolicitacaoService } from '../_services';
import {Editor} from "primeng/editor";


@Component({
  selector: 'app-solicitacao-incluir',
  templateUrl: './solicitacao-incluir.component.html',
  styleUrls: ['./solicitacao-incluir.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class SolicitacaoIncluirComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('soldesc', { static: true }) soldesc: Editor;
  @ViewChild('solacerecus', { static: true }) solacerecus: Editor;
  @ViewChild('solcar', { static: true }) solcar: Editor;
  formSolicitacaoIncluir: FormGroup;
  solicitacao: SolicitacaoFormulario;
  ddNomeIdArray = new DropdownnomeidClass();
  ddSolicitacao_cadastro_tipo_id: SelectItemGroup[] = [];
  ddSolicitacao_assunto_id: SelectItem[] = [];
  ddSolicitacao_atendente_cadastro_id: SelectItem[] = [];
  ddSolicitacao_cadastrante_cadastro_id: SelectItem[] = [];
  ddSolicitacao_tipo_recebimento_id: SelectItem[] = [];
  ddSolicitacao_local_id: SelectItem[] = [];
  ddSolicitacao_reponsavel_analize_id: SelectItem[] = [];
  ddSolicitacao_area_interesse_id: SelectItem[] = [];
  ddSolicitacao_tipo_analize: SelectItem[] = [];
  sgt: SelectItem[];
  ptBr: any;

  emptyMessage = 'Nenhum registro encontrado.';
  modulos: any;
  formatos: any;
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
  botaoEnviarVF = false;
  mostraForm = true;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;

  fc: any;
  toolbarEditor = [
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
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    public mi: MenuInternoService,
    private autocompleteservice: AutocompleteService,
    private location: Location,
    private sfs: SolicitacaoFormService,
    private solicitacaoService: SolicitacaoService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private cs: CarregadorService,
  ) { }

  ngOnInit() {
    this.cadastro_incluir = this.authenticationService.cadastro_incluir;
    if (sessionStorage.getItem('solicitacao-incluir')) {
      this.sfs.solicitacao = JSON.parse(sessionStorage.getItem('solicitacao-incluir'));
      sessionStorage.removeItem('solicitacao-incluir');
    } else {
      const dt = new Date();
      const hoje = dt.toLocaleString('pt-BR');
      this.sfs.solicitacao.solicitacao_atendente_cadastro_id = this.authenticationService.usuario_id;
      this.sfs.solicitacao.solicitacao_cadastrante_cadastro_id = this.authenticationService.usuario_id;
      // tslint:disable-next-line:max-line-length
      this.sfs.solicitacao.solicitacao_reponsavel_analize_id = this.authenticationService.usuario_responsavel_sn ? this.authenticationService.usuario_id : null;
      this.sfs.solicitacao.solicitacao_tipo_analize = 1;
      this.sfs.solicitacao.solicitacao_local_id = this.authenticationService.usuario_local_id;
      // this.sfs.solicitacao.processo_numero = null;
      this.sfs.solicitacao.solicitacao_data = hoje;
      this.sfs.solicitacao.solicitacao_data_atendimento = hoje;
      this.sfs.solicitacao.solicitacao_indicacao_sn = false;
    }
    this.carregaDropdownSessionStorage();
    this.carregaDropDown();
    this.criaForm();
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
    // this.mm.hideMenu();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cs.escondeCarregador();
      this.mi.hideMenu();
    }, 500);
  }


  adicionaDadosIncluidos() {
    if (this.moduloRecebido === 'cadastro') {
      this.formSolicitacaoIncluir.get('solicitacao_cadastro_tipo_id').patchValue(this.cadastroTipoIdRecebido);
      this.formSolicitacaoIncluir.get('solicitacao_cadastro_id').patchValue(this.novoRegistro);
    }
  }

  carregaDropdownSessionStorage() {
    this.ddSolicitacao_cadastro_tipo_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_cadastro'));
    this.ddSolicitacao_assunto_id = JSON.parse(sessionStorage.getItem('dropdown-assunto'));
    this.ddSolicitacao_atendente_cadastro_id = JSON.parse(sessionStorage.getItem('dropdown-atendente'));
    this.ddSolicitacao_cadastrante_cadastro_id = JSON.parse(sessionStorage.getItem('dropdown-cadastrante'));
    this.ddSolicitacao_tipo_recebimento_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_recebimento'));
    this.ddSolicitacao_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
    this.ddSolicitacao_reponsavel_analize_id = JSON.parse(sessionStorage.getItem('dropdown-reponsavel_analize'));
    this.ddSolicitacao_area_interesse_id = JSON.parse(sessionStorage.getItem('dropdown-area_interesse'));
  }

  // ***     FORMULARIO      *************************
  carregaDropDown() {
    this.ddSolicitacao_tipo_analize = [
      {label: 'Enviar para análise', value: 1},
      {label: 'Solicitar análise por e-mail', value: 3}
    ];
    if (this.authenticationService.usuario_responsavel_sn) {
      this.ddSolicitacao_tipo_analize.push(
        {label: 'Abrir processo sem sequência', value: 2},
        {label: 'Solicitação resolvida', value: 4},
        {label: 'Abrir processo', value: 5}
      );
      if (this.authenticationService.oficio_incluir) {
        this.ddSolicitacao_tipo_analize.push(
          {label: 'Abrir processo e incluir dados', value: 6});
      }
    }
  }

  parseAssunto(assunto: SelectItem[]) {
    assunto.forEach( (a) => {
      const sufix = a.label.length > 55 ? ' ...' : '';
      a.label = a.label.substr(0, 55) + sufix;
    });
    return assunto;
  }

  criaForm() {
    this.formSolicitacaoIncluir = this.formBuilder.group({
      solicitacao_cadastro_tipo_id: [this.sfs.solicitacao.solicitacao_cadastro_tipo_id, Validators.required],
      solicitacao_cadastro_id: [this.sfs.solicitacao.solicitacao_cadastro_id, Validators.required],
      solicitacao_assunto_id: [this.sfs.solicitacao.solicitacao_assunto_id, Validators.required],
      solicitacao_data: [this.sfs.solicitacao.solicitacao_data, Validators.required],
      solicitacao_indicacao_sn: [false],
      solicitacao_indicacao_nome: [this.sfs.solicitacao.solicitacao_indicacao_nome],
      solicitacao_atendente_cadastro_id: [this.sfs.solicitacao.solicitacao_atendente_cadastro_id, Validators.required],
      solicitacao_data_atendimento: [this.sfs.solicitacao.solicitacao_data_atendimento, Validators.required],
      solicitacao_cadastrante_cadastro_id: [this.sfs.solicitacao.solicitacao_cadastrante_cadastro_id, Validators.required],
      solicitacao_tipo_recebimento_id: [this.sfs.solicitacao.solicitacao_tipo_recebimento_id, Validators.required],
      solicitacao_local_id: [this.sfs.solicitacao.solicitacao_local_id, Validators.required],
      solicitacao_reponsavel_analize_id: [this.sfs.solicitacao.solicitacao_reponsavel_analize_id, Validators.required],
      solicitacao_area_interesse_id: [this.sfs.solicitacao.solicitacao_area_interesse_id, Validators.required],
      solicitacao_tipo_analize: [this.sfs.solicitacao.solicitacao_tipo_analize, Validators.required],
      // processo_numero: [this.sfs.solicitacao.processo_numero],
      solicitacao_descricao: [this.sfs.solicitacao.solicitacao_descricao],
      solicitacao_aceita_recusada: [this.sfs.solicitacao.solicitacao_aceita_recusada],
      solicitacao_carta: [this.sfs.solicitacao.solicitacao_carta]
    });
  }

  configuraEditor() {
    this.modulos = {
      toolbar: this.toolbarEditor
    };
  }

  autoComp (event, campo) {
    if (event.query.length >= 2) {
      let tipo = 0;
      const tabela = campo.toString();
      const campo_id = tabela + '_id';
      const campo_nome = tabela + '_nome';
      const campo_nome_limpo = tabela + '_nome_limpo';
      if (this.formSolicitacaoIncluir.get('solicitacao_cadastro_tipo_id').value) {
        tipo = + this.formSolicitacaoIncluir.get('solicitacao_cadastro_tipo_id').value;
      }
      if (tipo > 0) {
        this.sub.push(this.autocompleteservice.getAcIdNomeNomeLimpoTipo(tipo, tabela, campo_id, campo_nome, campo_nome_limpo, event.query)
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
      } else {
        this.sub.push(this.autocompleteservice.getAcIdNomeNomeLimpo(tabela, campo_id, campo_nome, campo_nome_limpo, event.query)
          .pipe(
            take(1)
          )
          .subscribe({
            next: (dados) => {
              this.sgt = dados;
            },
            error: err => console.error('Autocomplete-->'),
            complete: () => {
            }
          }));
      }
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
    if (this.formSolicitacaoIncluir.valid) {
      this.arquivoDesativado = true;
      const sol = this.criaSolicitacao();
      this.cs.mostraCarregador();
      this.sub.push(this.solicitacaoService.incluirSolicitacao(sol)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.messageService.add({key: 'solicitacaoToast', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
            console.error(err);
          },
          complete: () => {
            if (this.resp[0]) {
              if (sessionStorage.getItem('solicitacao-dropdown')) {
                sessionStorage.removeItem('solicitacao-dropdown');
              }
              if (this.possuiArquivos) {
                this.arquivo_registro_id = +this.resp[1];
                this.enviarArquivos = true;
              } else {
                this.cs.escondeCarregador();
                this.messageService.add({
                  key: 'solicitacaoToast',
                  severity: 'success',
                  summary: 'INCLUIR SOLICITAÇÃO',
                  detail: this.resp[2]
                });
                this.sfs.resetSolicitacao();
                this.resetForm();
                if (this.resp[3]) {
                  this.router.navigate(['../oficio/processo', this.resp[3]]);
                }
              }
            } else {
              console.error('ERRO - INCLUIR ', this.resp[2]);
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
    }
  }

  onUpload(ev) {
    if (ev) {
      this.mostraForm = false;
      this.cs.escondeCarregador();
      this.messageService.add({
        key: 'solicitacaoToast',
        severity: 'success',
        summary: 'INCLUIR SOLICITAÇÃO',
        detail: this.resp[2]
      });
      this.sfs.resetSolicitacao();
      this.resetForm();
      this.botaoEnviarVF = false;
      this.mostraForm = true;
      // this.voltarListar();
    }
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = !ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  criaSolicitacao(): SolicitacaoFormularioInterface {
    const solicitacao = new SolicitacaoFormulario();
    solicitacao.solicitacao_cadastro_tipo_id = this.formSolicitacaoIncluir.get('solicitacao_cadastro_tipo_id').value;
    solicitacao.solicitacao_cadastro_id = this.formSolicitacaoIncluir.get('solicitacao_cadastro_id').value.value;
    solicitacao.solicitacao_data = this.formSolicitacaoIncluir.get('solicitacao_data').value;
    solicitacao.solicitacao_assunto_id = this.formSolicitacaoIncluir.get('solicitacao_assunto_id').value;
    solicitacao.solicitacao_indicacao_sn = this.formSolicitacaoIncluir.get('solicitacao_indicacao_sn').value;
    if (this.formSolicitacaoIncluir.get('solicitacao_indicacao_nome').value) {
      solicitacao.solicitacao_indicacao_nome = this.formSolicitacaoIncluir.get('solicitacao_indicacao_nome').value;
    }
    solicitacao.solicitacao_atendente_cadastro_id = this.formSolicitacaoIncluir.get('solicitacao_atendente_cadastro_id').value;
    solicitacao.solicitacao_data_atendimento = this.formSolicitacaoIncluir.get('solicitacao_data_atendimento').value;
    solicitacao.solicitacao_cadastrante_cadastro_id = this.formSolicitacaoIncluir.get('solicitacao_cadastrante_cadastro_id').value;
    solicitacao.solicitacao_local_id = this.formSolicitacaoIncluir.get('solicitacao_local_id').value;
    solicitacao.solicitacao_tipo_recebimento_id = this.formSolicitacaoIncluir.get('solicitacao_tipo_recebimento_id').value;
    solicitacao.solicitacao_area_interesse_id = this.formSolicitacaoIncluir.get('solicitacao_area_interesse_id').value;
    if (this.formSolicitacaoIncluir.get('solicitacao_descricao').value) {
      const ql: any = this.soldesc.getQuill();
      const txt1 = ql.getContents();
      const txt2 = ql.getText();
      solicitacao.solicitacao_descricao = this.formSolicitacaoIncluir.get('solicitacao_descricao').value;
      solicitacao.solicitacao_descricao_delta = JSON.stringify(ql.getContents());
      solicitacao.solicitacao_descricao_texto = ql.getText();
    }
    solicitacao.solicitacao_reponsavel_analize_id = this.formSolicitacaoIncluir.get('solicitacao_reponsavel_analize_id').value;
    if (this.formSolicitacaoIncluir.get('solicitacao_aceita_recusada').value) {
      solicitacao.solicitacao_aceita_recusada = this.formSolicitacaoIncluir.get('solicitacao_aceita_recusada').value;
    }
    if (this.formSolicitacaoIncluir.get('solicitacao_carta').value) {
      solicitacao.solicitacao_carta = this.formSolicitacaoIncluir.get('solicitacao_carta').value;
    }
    solicitacao.solicitacao_tipo_analize = this.formSolicitacaoIncluir.get('solicitacao_tipo_analize').value;

    for (const key in solicitacao) {
      if (solicitacao[key] === null) {
        delete solicitacao[key];
      }
    }
    return solicitacao;
  }

  resetForm() {
    this.mostraForm = true;
    this.formSolicitacaoIncluir.reset();
    if (this.possuiArquivos) {
      this.clearArquivos = true;
    }
    this.arquivoDesativado = true;
    window.scrollTo(0, 0);
  }

  onSubmit() {}

  voltarListar() {
    if (sessionStorage.getItem('solicitacao-busca')) {
      this.router.navigate(['/solicitacao/listar/busca']);
    } else {
      // this.cs.mostraCarregador();
      this.mi.showMenuInterno();
      this.router.navigate(['/solicitacao/listar']);
    }
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formSolicitacaoIncluir.get(campo).valid &&
      (this.formSolicitacaoIncluir.get(campo).touched || this.formSolicitacaoIncluir.get(campo).dirty)
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
      !this.formSolicitacaoIncluir.get(campo).valid &&
      (this.formSolicitacaoIncluir.get(campo).touched || this.formSolicitacaoIncluir.get(campo).dirty) &&
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
      this.cs.mostraCarregador();
      sessionStorage.setItem('solicitacao-incluir', JSON.stringify(this.formSolicitacaoIncluir.getRawValue()));
      this.router.navigate(['/solicitacao/cadastro']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  ngOnDestroy(): void {
    this.sfs.resetSolicitacao();
    this.sub.forEach(s => s.unsubscribe());
  }

  onSolicitacaoAceita(ev) {
    this.formSolicitacaoIncluir.get('solicitacao_aceita_recusada').setValue(ev);
  }
}
