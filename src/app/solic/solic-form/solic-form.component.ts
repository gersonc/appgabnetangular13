import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MessageService, SelectItem, SelectItemGroup} from "primeng/api";
import {Editor} from "primeng/editor";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {
  AuthenticationService,
  AutocompleteService,
  DropdownService,
  MenuInternoService
} from "../../_services";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs/operators";
import {VersaoService} from "../../_services/versao.service";
import {SolicFormI} from "../_models/solic-form-i";
import {SolicService} from "../_services/solic.service";
import {SolicFormService} from "../_services/solic-form.service";
import {SolicForm} from "../_models/solic-form";

@Component({
  selector: 'app-solic-form',
  templateUrl: './solic-form.component.html',
  styleUrls: ['./solic-form.component.css']
})
export class SolicFormComponent implements OnInit {
  @ViewChild('soldesc', { static: true }) soldesc: Editor;
  @ViewChild('solacerecus', { static: true }) solacerecus: Editor;
  @ViewChild('histand', { static: true }) histand: Editor;
  @ViewChild('solcar', { static: true }) solcar: Editor;
  formSol: FormGroup;
  solicitacao: SolicFormI;
  ddSolicitacao_cadastro_tipo_id: SelectItemGroup[] = [];
  ddSolicitacao_assunto_id: SelectItem[] = [];
  ddSolicitacao_atendente_cadastro_id: SelectItem[] = [];
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
  resp: any[] = [];
  sub: Subscription[] = [];
  botaoEnviarVF = false;
  mostraForm = true;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  indicacao_sn = false;
  tpAnalizeTitulo = 'Tipo de análise';
  stl = 'p-col-12 p-sm-12 p-md-6 p-lg-6 p-xl-4';
  solNumOfi = false;
  msgSolNumOfi = 'Já existe ofício(s) com esse número.';
  tituloNumOfi = 'Número do ofício';
  titulo = 'SOLICITAÇÃO - INCLUIR';

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
    public formBuilder: FormBuilder,
    private dd: DropdownService,
    public mi: MenuInternoService,
    private autocompleteservice: AutocompleteService,
    private location: Location,
    public sfs: SolicFormService,
    private solicitacaoService: SolicService,
    public aut: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    public vs: VersaoService
  ) { }

  ngOnInit() {
    this.cadastro_incluir = this.aut.cadastro_incluir;
    if (sessionStorage.getItem('solicitacao-incluir') || sessionStorage.getItem('solicitacao-alterar')) {
      if (sessionStorage.getItem('solicitacao-incluir')) {
        this.sfs.acao = 'incluir';
        this.sfs.solicitacao = JSON.parse(sessionStorage.getItem('solicitacao-incluir'));
        sessionStorage.removeItem('solicitacao-incluir');
      }
      if (sessionStorage.getItem('solicitacao-alterar')) {
        this.sfs.acao = 'alterar';
        this.sfs.solicitacao = JSON.parse(sessionStorage.getItem('solicitacao-alterar'));
        sessionStorage.removeItem('solicitacao-alterar');
      }

    } else {
      if (this.sfs.acao === 'incluir') {
        const dt = new Date();
        const hoje = dt.toLocaleString('pt-BR');
        this.sfs.solicitacao.solicitacao_atendente_cadastro_id = this.aut.usuario_id;
        this.sfs.solicitacao.solicitacao_reponsavel_analize_id = (this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn) ? this.aut.usuario_id : null;
        this.sfs.solicitacao.solicitacao_local_id = (this.vs.versao < 3) ? this.aut.usuario_local_id : 0;
        this.sfs.solicitacao.solicitacao_data = hoje;
        this.sfs.solicitacao.solicitacao_data_atendimento = hoje;
        this.sfs.solicitacao.solicitacao_indicacao_sn = 0;
      }
    }

    this.carregaDropdownSessionStorage();
    this.carregaDropDown();
    this.criaForm();
    this.configuraEditor();

    if (typeof this.activatedRoute.snapshot.params['modulo'] !== 'undefined') {
      this.moduloRecebido = this.activatedRoute.snapshot.params['modulo'];
      this.cadastroTipoIdRecebido = +this.activatedRoute.snapshot.params['tipo'];
      this.sfs.solicitacao.solicitacao_cadastro_tipo_id = +this.activatedRoute.snapshot.params['tipo'];
      this.sfs.solicitacao.solicitacao_cadastro_id = +this.activatedRoute.snapshot.params['value'];
      this.novoRegistro = {
        label: this.activatedRoute.snapshot.params['label'],
        value: +this.activatedRoute.snapshot.params['value']
      };
      this.adicionaDadosIncluidos();
    }
    if (this.sfs.acao === 'incluir') {
      this.titulo = 'SOLICITAÇÃO - INCLUIR';
    } else {
      this.titulo = 'SOLICITAÇÃO - ALTERAR';
    }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.mi.hideMenu();
    }, 500);
  }

  adicionaDadosIncluidos() {
    if (this.moduloRecebido === 'cadastro') {
      this.formSol.get('solicitacao_cadastro_tipo_id').patchValue(this.cadastroTipoIdRecebido);
      this.formSol.get('solicitacao_cadastro_id').patchValue(this.novoRegistro);
    }
  }

  carregaDropdownSessionStorage() {
    this.ddSolicitacao_cadastro_tipo_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_cadastro-incluir'));
    this.ddSolicitacao_assunto_id = JSON.parse(sessionStorage.getItem('dropdown-assunto'));
    this.ddSolicitacao_atendente_cadastro_id = JSON.parse(sessionStorage.getItem('dropdown-atendente'));
    if (this.vs.versao === 1) {
      this.ddSolicitacao_tipo_recebimento_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_recebimento'));
    }
    if (this.vs.versao < 3) {
      this.ddSolicitacao_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
      this.ddSolicitacao_reponsavel_analize_id = JSON.parse(sessionStorage.getItem('dropdown-reponsavel_analize'));
    }
    this.ddSolicitacao_area_interesse_id = JSON.parse(sessionStorage.getItem('dropdown-area_interesse'));
  }

  // ***     FORMULARIO      *************************
  carregaDropDown() {
    this.ddSolicitacao_tipo_analize = [];
    if (this.vs.versao === 1) {
      this.ddSolicitacao_tipo_analize.push(
        {label: 'Enviar para análise', value: 1},
        {label: 'Solicitar análise por e-mail', value: 3}
      );

      if (this.aut.solicitacao_analisar) {
        this.ddSolicitacao_tipo_analize.push(
          {label: 'Solicitação resolvida', value: 4},
          {label: 'Abrir processo', value: 5}
        );
        if (this.aut.oficio_incluir) {
          this.ddSolicitacao_tipo_analize.push(
            {label: 'Abrir processo e incluir dados', value: 6});
        }
      }
    }
    this.ddSolicitacao_tipo_analize.push(
      {label: 'Em aberto', value: 7},
      {label: 'Deferido', value: 8},
      {label: 'Indeferido', value: 9},
      {label: 'Em andamento', value: 10},
      {label: 'Suspenso', value: 11}
    );

  }

  parseAssunto(assunto: SelectItem[]) {
    assunto.forEach( (a) => {
      const sufix = a.label.length > 55 ? ' ...' : '';
      a.label = a.label.substr(0, 55) + sufix;
    });
    return assunto;
  }

  criaForm() {
    this.sfs.solicitacao.solicitacao_indicacao_sn = 0;
    if (this.vs.solicitacaoVersao === 1) {
      this.tpAnalizeTitulo = 'Tipo de análise';
      this.msgSolNumOfi = 'Já existe processo(s) com esse número.'
      this.tituloNumOfi = 'Número do processo';
      this.formSol = this.formBuilder.group({
        solicitacao_cadastro_tipo_id: [this.sfs.solicitacao.solicitacao_cadastro_tipo_id, Validators.required],
        solicitacao_cadastro_id: [this.sfs.solicitacao.solicitacao_cadastro_id, Validators.required],
        solicitacao_assunto_id: [this.sfs.solicitacao.solicitacao_assunto_id, Validators.required],
        solicitacao_data: [this.sfs.solicitacao.solicitacao_data, Validators.required],
        solicitacao_indicacao_sn: [this.indicacao_sn],
        solicitacao_indicacao_nome: [this.sfs.solicitacao.solicitacao_indicacao_nome],
        solicitacao_numero_oficio: [this.sfs.solicitacao.solicitacao_numero_oficio],
        solicitacao_orgao: [this.sfs.solicitacao.solicitacao_orgao],
        solicitacao_data_atendimento: [this.sfs.solicitacao.solicitacao_data_atendimento, Validators.required],
        solicitacao_atendente_cadastro_id: [this.sfs.solicitacao.solicitacao_atendente_cadastro_id, Validators.required],
        solicitacao_tipo_recebimento_id: [this.sfs.solicitacao.solicitacao_tipo_recebimento_id, Validators.required],
        solicitacao_local_id: [this.sfs.solicitacao.solicitacao_local_id, Validators.required],
        solicitacao_reponsavel_analize_id: [this.sfs.solicitacao.solicitacao_reponsavel_analize_id, Validators.required],
        solicitacao_area_interesse_id: [this.sfs.solicitacao.solicitacao_area_interesse_id, Validators.required],
        solicitacao_tipo_analize: [this.sfs.solicitacao.solicitacao_tipo_analize, Validators.required],
        solicitacao_descricao: [this.sfs.solicitacao.solicitacao_descricao],
        solicitacao_aceita_recusada: [this.sfs.solicitacao.solicitacao_aceita_recusada],
        solicitacao_carta: [this.sfs.solicitacao.solicitacao_carta],
        historico_andamento: [this.sfs.solicitacao.historico_andamento],
      });
    }

    if (this.vs.solicitacaoVersao === 2) {
      this.tpAnalizeTitulo = 'Posição';
      this.formSol = this.formBuilder.group({
        solicitacao_cadastro_tipo_id: [this.sfs.solicitacao.solicitacao_cadastro_tipo_id, Validators.required],
        solicitacao_cadastro_id: [this.sfs.solicitacao.solicitacao_cadastro_id, Validators.required],
        solicitacao_assunto_id: [this.sfs.solicitacao.solicitacao_assunto_id, Validators.required],
        solicitacao_data: [this.sfs.solicitacao.solicitacao_data, Validators.required],
        solicitacao_indicacao_sn: [this.indicacao_sn],
        solicitacao_indicacao_nome: [this.sfs.solicitacao.solicitacao_indicacao_nome],
        solicitacao_numero_oficio: [this.sfs.solicitacao.solicitacao_numero_oficio],
        solicitacao_orgao: [this.sfs.solicitacao.solicitacao_orgao],
        solicitacao_data_atendimento: [this.sfs.solicitacao.solicitacao_data_atendimento, Validators.required],
        solicitacao_atendente_cadastro_id: [this.sfs.solicitacao.solicitacao_atendente_cadastro_id, Validators.required],
        solicitacao_local_id: [this.sfs.solicitacao.solicitacao_local_id, Validators.required],
        solicitacao_reponsavel_analize_id: [this.sfs.solicitacao.solicitacao_reponsavel_analize_id, Validators.required],
        solicitacao_area_interesse_id: [this.sfs.solicitacao.solicitacao_area_interesse_id, Validators.required],
        solicitacao_tipo_analize: [this.sfs.solicitacao.solicitacao_tipo_analize, Validators.required],
        solicitacao_descricao: [this.sfs.solicitacao.solicitacao_descricao],
        solicitacao_aceita_recusada: [this.sfs.solicitacao.solicitacao_aceita_recusada],
        historico_andamento: [this.sfs.solicitacao.historico_andamento],
      });
    }

    if (this.vs.solicitacaoVersao === 3) {
      this.tpAnalizeTitulo = 'Posição';
      this.formSol = this.formBuilder.group({
        solicitacao_cadastro_tipo_id: [this.sfs.solicitacao.solicitacao_cadastro_tipo_id, Validators.required],
        solicitacao_cadastro_id: [this.sfs.solicitacao.solicitacao_cadastro_id, Validators.required],
        solicitacao_assunto_id: [this.sfs.solicitacao.solicitacao_assunto_id, Validators.required],
        solicitacao_data: [this.sfs.solicitacao.solicitacao_data, Validators.required],
        solicitacao_indicacao_sn: [this.indicacao_sn],
        solicitacao_indicacao_nome: [this.sfs.solicitacao.solicitacao_indicacao_nome],
        solicitacao_numero_oficio: [this.sfs.solicitacao.solicitacao_numero_oficio],
        solicitacao_orgao: [this.sfs.solicitacao.solicitacao_orgao],
        solicitacao_data_atendimento: [this.sfs.solicitacao.solicitacao_data_atendimento, Validators.required],
        solicitacao_atendente_cadastro_id: [this.sfs.solicitacao.solicitacao_atendente_cadastro_id, Validators.required],
        solicitacao_reponsavel_analize_id: [this.sfs.solicitacao.solicitacao_reponsavel_analize_id, Validators.required],
        solicitacao_area_interesse_id: [this.sfs.solicitacao.solicitacao_area_interesse_id, Validators.required],
        solicitacao_tipo_analize: [this.sfs.solicitacao.solicitacao_tipo_analize, Validators.required],
        solicitacao_descricao: [this.sfs.solicitacao.solicitacao_descricao],
        solicitacao_aceita_recusada: [this.sfs.solicitacao.solicitacao_aceita_recusada],
        historico_andamento: [this.sfs.solicitacao.historico_andamento],
      });
    }

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
      if (this.formSol.get('solicitacao_cadastro_tipo_id').value) {
        tipo = + this.formSol.get('solicitacao_cadastro_tipo_id').value;
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

  trocaIndicacaoSV(ev) {
    this.sfs.solicitacao.solicitacao_indicacao_sn = ev.checked ? 1 : 0;
    this.stl =  ev.checked ? 'p-col-12 p-sm-12 p-md-2 p-lg-2 p-xl-1' : 'p-col-12 p-sm-12 p-md-6 p-lg-6 p-xl-4';
    // return this.stl
  }

  /*focus1(event) {
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
  }*/

  incluirSolicitacao() {
    if (this.formSol.valid) {
      this.arquivoDesativado = true;
      const sol = this.criaSolicitacao();
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
              this.dd.getDdCadastroMenuTodos();
              if (this.possuiArquivos) {
                this.arquivo_registro_id = +this.resp[1];
                this.enviarArquivos = true;
              } else {
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
    } else {
      this.verificaValidacoesForm(this.formSol);
    }
  }

  alterarSolicitacao() {
    if (this.formSol.valid) {
      this.arquivoDesativado = true;
      const sol = this.criaSolicitacao();
      this.sub.push(this.solicitacaoService.alterarSolicitacao(sol)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.messageService.add({key: 'solicitacaoToast', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
            console.error(err);
          },
          complete: () => {
            if (this.resp[0]) {
              this.dd.getDdCadastroMenuTodos();
                this.messageService.add({
                  key: 'solicitacaoToast',
                  severity: 'success',
                  summary: 'ALTERAR SOLICITAÇÃO',
                  detail: this.resp[2]
                });
                this.sfs.resetSolicitacao();
                this.resetForm();
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
      this.verificaValidacoesForm(this.formSol);
    }
  }

  onUpload(ev) {
    if (ev) {
      this.mostraForm = false;
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
      } else {
        this.resp = [];
        this.botaoEnviarVF = false;
        this.mostraForm = true;
      }
      // this.voltarListar();
    }
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = !ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  criaSolicitacao(): SolicFormI {
    const solicitacao = new SolicForm();
    if (this.vs.solicitacaoVersao < 3) {
      solicitacao.solicitacao_reponsavel_analize_id = this.formSol.get('solicitacao_reponsavel_analize_id').value;
      solicitacao.solicitacao_local_id = this.formSol.get('solicitacao_local_id').value;
    }
    if (this.vs.solicitacaoVersao === 1) {
      solicitacao.solicitacao_tipo_recebimento_id = this.formSol.get('solicitacao_tipo_recebimento_id').value;
      if (this.formSol.get('solicitacao_carta').value) {
        const ql3: any = this.solacerecus.getQuill();
        solicitacao.solicitacao_carta = this.formSol.get('solicitacao_carta').value;
        solicitacao.solicitacao_carta_delta = JSON.stringify(ql3.getContents());
        solicitacao.solicitacao_carta_texto = ql3.getText();
      }
    }
    solicitacao.solicitacao_cadastro_tipo_id = this.formSol.get('solicitacao_cadastro_tipo_id').value;
    solicitacao.solicitacao_cadastro_id = this.formSol.get('solicitacao_cadastro_id').value.value;
    solicitacao.solicitacao_data = this.formSol.get('solicitacao_data').value;
    solicitacao.solicitacao_numero_oficio = this.formSol.get('solicitacao_numero_oficio').value;
    solicitacao.solicitacao_assunto_id = this.formSol.get('solicitacao_assunto_id').value;
    solicitacao.solicitacao_indicacao_sn = this.sfs.solicitacao.solicitacao_indicacao_sn;
    if (this.sfs.solicitacao.solicitacao_indicacao_sn) {
      solicitacao.solicitacao_indicacao_nome = this.formSol.get('solicitacao_indicacao_nome').value;
    }
    solicitacao.solicitacao_atendente_cadastro_id = this.formSol.get('solicitacao_atendente_cadastro_id').value;
    solicitacao.solicitacao_data_atendimento = this.formSol.get('solicitacao_data_atendimento').value;
    solicitacao.solicitacao_area_interesse_id = this.formSol.get('solicitacao_area_interesse_id').value;
    if (this.formSol.get('solicitacao_descricao').value) {
      const ql: any = this.soldesc.getQuill();
      solicitacao.solicitacao_descricao = this.formSol.get('solicitacao_descricao').value;
      solicitacao.solicitacao_descricao_delta = JSON.stringify(ql.getContents());
      solicitacao.solicitacao_descricao_texto = ql.getText();
    }
    if (this.formSol.get('solicitacao_aceita_recusada').value) {
      const ql2: any = this.solacerecus.getQuill();
      solicitacao.solicitacao_aceita_recusada = this.formSol.get('solicitacao_aceita_recusada').value;
      solicitacao.solicitacao_aceita_recusada_delta = JSON.stringify(ql2.getContents());
      solicitacao.solicitacao_aceita_recusada_texto = ql2.getText();
    }

    if (this.formSol.get('historico_andamento').value) {
      const ql3: any = this.histand.getQuill();
      solicitacao.historico_andamento = this.formSol.get('historico_andamento').value;
      solicitacao.historico_andamento_delta = JSON.stringify(ql3.getContents());
      solicitacao.historico_andamento_texto = ql3.getText();
    }
    if (this.vs.solicitacaoVersao === 1) {
      if (this.formSol.get('solicitacao_carta').value) {
        const ql4: any = this.solacerecus.getQuill();
        solicitacao.solicitacao_carta = this.formSol.get('solicitacao_aceita_recusada').value;
        solicitacao.solicitacao_carta_delta = JSON.stringify(ql4.getContents());
        solicitacao.solicitacao_carta_texto = ql4.getText();
      }
    }

    solicitacao.solicitacao_tipo_analize = this.formSol.get('solicitacao_tipo_analize').value;

    for (const key in solicitacao) {
      if (solicitacao[key] === null) {
        delete solicitacao[key];
      }
    }
    return solicitacao;
  }

  resetForm() {
    this.mostraForm = true;
    this.formSol.reset();
    if (this.possuiArquivos) {
      this.clearArquivos = true;
    }
    this.possuiArquivos = false;
    this.arquivoDesativado = true;
    window.scrollTo(0, 0);
  }

  onSubmit() {
    if (this.sfs.acao === 'incluir') {
      this.incluirSolicitacao();
    } else {
      this.alterarSolicitacao();
    }
  }

  voltarListar() {
    this.sfs.solicListar = {};
    this.sfs.resetSolicitacao();
    if (sessionStorage.getItem('solicitacao-busca')) {
      this.router.navigate(['/solic/listar/busca']);
    } else {
      // this.cs.mostraCarregador();
      this.mi.showMenuInterno();
      this.router.navigate(['/solic/listar']);
    }
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formSol.get(campo).valid &&
      (this.formSol.get(campo).touched || this.formSol.get(campo).dirty)
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
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  validaAsync(campo: string, situacao: boolean) {
    return (
      !this.formSol.get(campo).valid &&
      (this.formSol.get(campo).touched || this.formSol.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'has-error': this.validaAsync(campo, situacao),
      'has-feedback': this.validaAsync(campo, situacao)
    };
  }

  verificaNumOficio(ev) {
    console.log(this.formSol.get('solicitacao_numero_oficio').value);
    if (this.formSol.get('solicitacao_numero_oficio').value) {
      let of = this.formSol.get('solicitacao_numero_oficio').value;
      if (of.length > 0) {
        let resp: any[] = [];
        const dados: any = {
          solicitacao_numero_oficio: of
        }
        this.sub.push(this.solicitacaoService.postVerificarNumOficio(dados).pipe(take(1)).subscribe(r => {
          resp = r;
          console.log(resp);
          if (resp[0]) {
            this.solNumOfi = true;
          }
        } ));

      }
    }
  }

  goIncluir() {
    if (this.aut.cadastro_incluir) {
      sessionStorage.setItem('solicitacao-incluir', JSON.stringify(this.formSol.getRawValue()));
      this.router.navigate(['/cadastro/incluir/solic/incluir']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  ngOnDestroy(): void {
    this.sfs.resetSolicitacao();
    this.sub.forEach(s => s.unsubscribe());
  }

  onSolicitacaoAceita(ev) {
    this.formSol.get('solicitacao_aceita_recusada').setValue(ev);
  }
}