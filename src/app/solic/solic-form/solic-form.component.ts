import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SelectItem, SelectItemGroup} from "primeng/api";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {
  AuthenticationService,
  AutocompleteService,
  MenuInternoService
} from "../../_services";
// import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs/operators";
import {VersaoService} from "../../_services/versao.service";
import {SolicFormI} from "../_models/solic-form-i";
import {SolicService} from "../_services/solic.service";
import {SolicFormService} from "../_services/solic-form.service";
import {SolicForm} from "../_models/solic-form";
import {DdService} from "../../_services/dd.service";
import {CpoEditor, InOutCampoTexto} from "../../_models/in-out-campo-texto";
import {MsgService} from "../../_services/msg.service";
import {SolicListarI} from "../_models/solic-listar-i";
import {OficioFormService} from "../../oficio/_services/oficio-form.service";

@Component({
  selector: 'app-solic-form',
  templateUrl: './solic-form.component.html',
  styleUrls: ['./solic-form.component.css']
})
export class SolicFormComponent implements OnInit, OnDestroy {
  formSol: FormGroup;
  solicitacao: SolicFormI;
  ddSolicitacao_cadastro_tipo_id: SelectItemGroup[] = [];
  ddSolicitacao_assunto_id: SelectItem[] = [];
  ddSolicitacao_atendente_cadastro_id: SelectItem[] = [];
  ddSolicitacao_tipo_recebimento_id: SelectItem[] = [];
  ddSolicitacao_local_id: SelectItem[] = [];
  ddSolicitacao_reponsavel_analize_id: SelectItem[] = [];
  ddSolicitacao_area_interesse_id: SelectItem[] = [];
  // ddSolicitacao_tipo_analize: SelectItem[] = [];
  sgt: SelectItem[] = [];
  ptBr: any;

  emptyMessage = 'Nenhum registro encontrado.';
  formatos: any;
  icone = 'pi pi-chevron-down';
  cadastro_incluir = false;
  novoRegistro: SelectItem;
  moduloRecebido = '';
  cadastroTipoIdRecebido = 0;
  resp: any[] = [];
  sub: Subscription[] = [];
  // botaoEnviarVF = false;
  mostraForm = true;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  // indicacao_sn = false;
  tpAnalizeTitulo = 'Tipo de análise';
  stl = 'p-col-12 p-sm-12 p-md-6 p-lg-6 p-xl-4';
  titulo = 'SOLICITAÇÃO - INCLUIR';
  readonly = false;
  checked = false;
  solicitacao_tipo_analize = 0;

  fc: any;
  cpoEditor: CpoEditor[] | null = [];
  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  format1: 'html' | 'object' | 'text' | 'json' = 'html';
  format2: 'html' | 'object' | 'text' | 'json' = 'html';
  format3: 'html' | 'object' | 'text' | 'json' = 'html';

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

  mostraCpoNumOfi = true;
  msgSolNumOfi = 'Já existe ofício(s) com esse número.';
  msgSolNumPro = 'Já existe processo com esse número.';
  tituloNumOfi = 'Número do ofício';
  solNumOfi = false;
  solNumPro = false;
  sgstNumPro: string | null = null;

  constructor(
    public formBuilder: FormBuilder,
    private dd: DdService,
    public mi: MenuInternoService,
    private autocompleteservice: AutocompleteService,
    // private location: Location,
    public sfs: SolicFormService,
    private ss: SolicService,
    public aut: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ms: MsgService,
    public vs: VersaoService,
    private ofs: OficioFormService
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
        this.sfs.solicitacao.solicitacao_local_id = (this.vs.solicitacaoVersao < 3) ? this.aut.usuario_local_id : 0;
        this.sfs.solicitacao.solicitacao_data = hoje;
        this.sfs.solicitacao.solicitacao_data_atendimento = hoje;
        this.sfs.solicitacao.solicitacao_indicacao_sn = 0;
      }
      if (this.sfs.acao === 'alterar') {
        this.novoRegistro = {
          label: this.sfs.solicListar.solicitacao_cadastro_nome,
          value: +this.sfs.solicListar.solicitacao_cadastro_id
        };
        this.stl = this.sfs.solicitacao.solicitacao_indicacao_sn === 1 ? 'p-col-12 p-sm-12 p-md-2 p-lg-2 p-xl-1' : 'p-col-12 p-sm-12 p-md-6 p-lg-6 p-xl-4';
        this.sgt.push(this.novoRegistro);
      }
    }

    this.carregaDropdownSessionStorage();
    this.criaForm();

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

 /* ngAfterViewInit() {
  }*/

  adicionaDadosIncluidos() {
    if (this.moduloRecebido === 'cadastro') {
      this.formSol.get('solicitacao_cadastro_tipo_id').patchValue(this.cadastroTipoIdRecebido);
      this.formSol.get('solicitacao_cadastro_id').patchValue(this.novoRegistro);
    }
  }

  carregaDropdownSessionStorage() {
    this.ddSolicitacao_cadastro_tipo_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_cadastro'));
    this.ddSolicitacao_assunto_id = JSON.parse(sessionStorage.getItem('dropdown-assunto'));
    this.ddSolicitacao_atendente_cadastro_id = JSON.parse(sessionStorage.getItem('dropdown-atendente'));
    if (this.vs.solicitacaoVersao === 1) {
      this.ddSolicitacao_tipo_recebimento_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_recebimento'));
    }
    if (this.vs.solicitacaoVersao < 3) {
      this.ddSolicitacao_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
      this.ddSolicitacao_reponsavel_analize_id = JSON.parse(sessionStorage.getItem('dropdown-reponsavel_analize'));
    }
    this.ddSolicitacao_area_interesse_id = JSON.parse(sessionStorage.getItem('dropdown-area_interesse'));
  }

  // ***     FORMULARIO      *************************


  criaForm() {

    if (this.vs.solicitacaoVersao === 1) {
      this.tpAnalizeTitulo = 'Tipo de análise';
      this.formSol = this.formBuilder.group({
        solicitacao_cadastro_tipo_id: [this.sfs.solicitacao.solicitacao_cadastro_tipo_id, Validators.required],
        solicitacao_cadastro_id: [this.sfs.solicitacao.solicitacao_cadastro_id, Validators.required],
        solicitacao_assunto_id: [this.sfs.solicitacao.solicitacao_assunto_id, Validators.required],
        solicitacao_data: [this.sfs.solicitacao.solicitacao_data, Validators.required],
        solicitacao_indicacao_sn: [this.sfs.solicitacao.solicitacao_indicacao_sn === 1],
        solicitacao_indicacao_nome: [this.sfs.solicitacao.solicitacao_indicacao_nome],
        solicitacao_numero_oficio: [this.sfs.solicitacao.solicitacao_numero_oficio],
        solicitacao_orgao: [this.sfs.solicitacao.solicitacao_orgao],
        solicitacao_data_atendimento: [this.sfs.solicitacao.solicitacao_data_atendimento, Validators.required],
        solicitacao_atendente_cadastro_id: [this.sfs.solicitacao.solicitacao_atendente_cadastro_id, Validators.required],
        solicitacao_tipo_recebimento_id: [this.sfs.solicitacao.solicitacao_tipo_recebimento_id, Validators.required],
        solicitacao_local_id: [this.sfs.solicitacao.solicitacao_local_id, Validators.required],
        solicitacao_reponsavel_analize_id: [this.sfs.solicitacao.solicitacao_reponsavel_analize_id, Validators.required],
        solicitacao_area_interesse_id: [this.sfs.solicitacao.solicitacao_area_interesse_id, Validators.required],
        solicitacao_descricao: [null],
        solicitacao_aceita_recusada: [null],
        solicitacao_carta: [null],
        historico_andamento: [null],
        processo_numero: [null],
        solicitacao_tipo_analize: (this.sfs.acao === 'incluir') ? [this.sfs.solicitacao.solicitacao_tipo_analize, Validators.required] : [null],
      });
      this.getValorAlterar();
    }

    if (this.vs.solicitacaoVersao === 2) {
      this.tpAnalizeTitulo = 'Situação';
      this.formSol = this.formBuilder.group({
        solicitacao_cadastro_tipo_id: [this.sfs.solicitacao.solicitacao_cadastro_tipo_id, Validators.required],
        solicitacao_cadastro_id: [this.sfs.solicitacao.solicitacao_cadastro_id, Validators.required],
        solicitacao_assunto_id: [this.sfs.solicitacao.solicitacao_assunto_id, Validators.required],
        solicitacao_data: [this.sfs.solicitacao.solicitacao_data, Validators.required],
        solicitacao_indicacao_sn: [this.sfs.solicitacao.solicitacao_indicacao_sn === 1],
        solicitacao_indicacao_nome: [this.sfs.solicitacao.solicitacao_indicacao_nome],
        solicitacao_numero_oficio: [this.sfs.solicitacao.solicitacao_numero_oficio],
        solicitacao_orgao: [this.sfs.solicitacao.solicitacao_orgao],
        solicitacao_data_atendimento: [this.sfs.solicitacao.solicitacao_data_atendimento, Validators.required],
        solicitacao_atendente_cadastro_id: [this.sfs.solicitacao.solicitacao_atendente_cadastro_id, Validators.required],
        solicitacao_local_id: [this.sfs.solicitacao.solicitacao_local_id, Validators.required],
        solicitacao_reponsavel_analize_id: [this.sfs.solicitacao.solicitacao_reponsavel_analize_id, Validators.required],
        solicitacao_area_interesse_id: [this.sfs.solicitacao.solicitacao_area_interesse_id, Validators.required],
        solicitacao_aceita_recusada: [null],
        solicitacao_descricao: [null],
        historico_andamento: [null],
        solicitacao_tipo_analize:  (this.sfs.acao === 'incluir') ? [this.sfs.solicitacao.solicitacao_tipo_analize, Validators.required] : [null],
      });
      this.getValorAlterar();
    }

    if (this.vs.solicitacaoVersao === 3) {
      this.tpAnalizeTitulo = 'Situação';
      this.formSol = this.formBuilder.group({
        solicitacao_cadastro_tipo_id: [this.sfs.solicitacao.solicitacao_cadastro_tipo_id, Validators.required],
        solicitacao_cadastro_id: [this.sfs.solicitacao.solicitacao_cadastro_id, Validators.required],
        solicitacao_assunto_id: [this.sfs.solicitacao.solicitacao_assunto_id, Validators.required],
        solicitacao_data: [this.sfs.solicitacao.solicitacao_data, Validators.required],
        solicitacao_indicacao_sn: [this.sfs.solicitacao.solicitacao_indicacao_sn === 1],
        solicitacao_indicacao_nome: [this.sfs.solicitacao.solicitacao_indicacao_nome],
        solicitacao_numero_oficio: [this.sfs.solicitacao.solicitacao_numero_oficio],
        solicitacao_orgao: [this.sfs.solicitacao.solicitacao_orgao],
        solicitacao_data_atendimento: [this.sfs.solicitacao.solicitacao_data_atendimento, Validators.required],
        solicitacao_atendente_cadastro_id: [this.sfs.solicitacao.solicitacao_atendente_cadastro_id, Validators.required],
        solicitacao_reponsavel_analize_id: [this.sfs.solicitacao.solicitacao_reponsavel_analize_id, Validators.required],
        solicitacao_area_interesse_id: [this.sfs.solicitacao.solicitacao_area_interesse_id, Validators.required],
        solicitacao_aceita_recusada: [null],
        solicitacao_descricao: [null],
        historico_andamento: [null],
        solicitacao_tipo_analize:  (this.sfs.acao === 'incluir') ? [this.sfs.solicitacao.solicitacao_tipo_analize, Validators.required] : [null],
      });
      this.getValorAlterar();
    }
  }

  getValorAlterar() {
    if (this.aut.solicitacaoVersao === 1 && this.sfs.acao === 'incluir') {
      this.sub.push(this.ss.getSgstNumProcesso().pipe(take(1)).subscribe(dados => {
        this.sgstNumPro = dados[0];
        this.formSol.get('processo_numero').setValue(dados[0]);
      }));
    }
    if (this.sfs.acao === 'alterar') {
      if (this.sfs.solicitacao.solicitacao_indicacao_nome) {
        this.formSol.get('solicitacao_indicacao_sn').patchValue(true);
        this.formSol.get('solicitacao_indicacao_nome').patchValue(this.sfs.solicitacao.solicitacao_indicacao_nome);
      }
      this.sgt.push(this.novoRegistro);
      this.formSol.get('solicitacao_cadastro_id').patchValue(this.novoRegistro);
      if (this.vs.solicitacaoVersao === 1) {
        if (this.sfs.solicListar.processo_id > 0 && this.sfs.solicListar.processo_numero2 !== undefined) {
          this.formSol.get('solicitacao_numero_oficio').patchValue(this.sfs.solicListar.processo_numero2);
          this.readonly = true;
        }
      }

      const cp3 = InOutCampoTexto(this.sfs.solicitacao.solicitacao_descricao, this.sfs.solicitacao.solicitacao_descricao_delta);
      this.format3 = cp3.format;
      if (cp3.vf) {
        this.formSol.get('solicitacao_descricao').setValue(cp3.valor);
      }

      const cp0 = InOutCampoTexto(this.sfs.solicitacao.solicitacao_aceita_recusada!, this.sfs.solicitacao.solicitacao_aceita_recusada_delta);
      this.format0 = cp0.format;
      if (cp0.vf) {
        this.formSol.get('solicitacao_aceita_recusada').setValue(cp0.valor);
      }

      if (this.vs.solicitacaoVersao === 1) {
        if ((typeof this.sfs.solicitacao.solicitacao_numero_oficio !== 'undefined' &&
          this.sfs.solicitacao.solicitacao_numero_oficio !== null &&
          this.sfs.solicitacao.solicitacao_numero_oficio.length > 0) ||
          this.sfs.solicitacao.solicitacao_processo_id === 0
        )
        {
          this.mostraCpoNumOfi = true;
          this.tituloNumOfi = 'Número do ofício';
        }

        const cp1 = InOutCampoTexto(this.sfs.solicitacao.solicitacao_carta, this.sfs.solicitacao.solicitacao_carta_delta);
        this.format1 = cp1.format;
        if (cp1.vf) {
          this.formSol.get('solicitacao_carta').setValue(cp1.valor);
        }

      }

    }
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
        this.ms.fundoSN(false);
        this.sub.push(this.autocompleteservice.getAcIdNomeNomeLimpoTipo(tipo, tabela, campo_id, campo_nome, campo_nome_limpo, event.query)
          .pipe(
            take(1)
          )
          .subscribe({
            next: (dados) => {
              this.sgt = dados;
            },
            error: err => {
              this.ms.fundoSN(true);
              console.error('Autocomplete-->');
            },
            complete: () => {
              this.ms.fundoSN(true);
            }
          }));
      } else {
        this.ms.fundoSN(false);
        this.sub.push(this.autocompleteservice.getAcIdNomeNomeLimpo(tabela, campo_id, campo_nome, campo_nome_limpo, event.query)
          .pipe(
            take(1)
          )
          .subscribe({
            next: (dados) => {
              this.sgt = dados;
            },
            error: err => {
              this.ms.fundoSN(true);
              console.error('Autocomplete-->');
            },
            complete: () => {
              this.ms.fundoSN(true);
            }
          }));
      }
    }
  }

  trocaIndicacaoSV(ev) {
    this.sfs.solicitacao.solicitacao_indicacao_sn = ev.checked ? 1 : 0;
    this.stl =  ev.checked ? 'p-col-12 p-sm-12 p-md-2 p-lg-2 p-xl-1' : 'p-col-12 p-sm-12 p-md-6 p-lg-6 p-xl-4';
  }

  cadastro_tipo_change() {
    this.sgt = [];
  }

  incluirSolicitacao() {
    if (this.formSol.valid) {
      this.arquivoDesativado = true;
      const sol = this.criaSolicitacao();
      this.ms.fundoSN(false);
      this.sub.push(this.ss.incluirSolicitacao(sol)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.mostraForm = true;
            this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
            console.error(err);
          },
          complete: () => {
            if (this.resp[0]) {
              sessionStorage.removeItem('solic-menu-dropdown');
              if (this.solicitacao_tipo_analize === 6 && this.resp[4] > 0) {
                this.ofs.solicitacao_id = +this.resp[1];
                this.ofs.processo_id = +this.resp[4];
                this.ofs.parceDdOficioProcessoId(this.resp[3]);
                this.ofs.url = '../solic/listar';
              }

              if (this.possuiArquivos) {
                this.arquivo_registro_id = +this.resp[1];
                this.enviarArquivos = true;
              } else {
                this.ms.add({
                  key: 'toastprincipal',
                  severity: 'success',
                  summary: 'INCLUIR SOLICITAÇÃO',
                  detail: this.resp[2]
                });
                this.sfs.resetSolicitacao();
                this.resetForm();
                if (this.solicitacao_tipo_analize === 6 && this.resp[4] > 0) {
                  this.router.navigate(['../oficio/solicitacao']);
                } else {
                  this.voltarListar();
                }
              }
            } else {
              this.mostraForm = true;
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
    } else {
      this.verificaValidacoesForm(this.formSol);
    }
  }

  alterarSolicitacao() {
    if (this.formSol.valid) {
      this.arquivoDesativado = true;
      const sol = this.criaSolicitacao();
      this.ms.fundoSN(false);
      this.sub.push(this.ss.alterarSolicitacao(sol)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
            console.error(err);
            this.mostraForm = true;
          },
          complete: () => {
            if (this.resp[0]) {
              sessionStorage.removeItem('solic-menu-dropdown');
              this.ms.add({
                  key: 'toastprincipal',
                  severity: 'success',
                  summary: 'ALTERAR SOLICITAÇÃO',
                  detail: this.resp[2]
                });
              this.resetForm();
              this.dd.ddSubscription('solic-menu-dropdown');
              if (sessionStorage.getItem('solic-busca') && this.ss.solicitacoes.length > 0) {
                const sl: SolicListarI = this.resp[3];
                const id: number = +this.sfs.solicitacao.solicitacao_id;
                const idx: number = this.ss.solicitacoes.findIndex(s => s.solicitacao_id = id);
                if (idx !== -1) {
                  this.ss.solicitacoes[idx] = sl;
                  const c = {
                    data: this.ss.solicitacoes[idx],
                    originalEvent: {}
                  }
                  this.ss.onRowExpand(c);
                  this.voltar();
                } else {
                  this.voltarListar();
                }
              } else {
                this.voltarListar();
              }
            } else {
              this.mostraForm = true;
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
    } else {
      this.verificaValidacoesForm(this.formSol);
    }
  }

  onUpload(ev) {
    if (ev) {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'INCLUIR SOLICITAÇÃO',
        detail: this.resp[2]
      });
      this.sfs.resetSolicitacao();
      this.resetForm();
      if (this.solicitacao_tipo_analize === 6 && this.resp[4] > 0) {
        this.sfs.solicListar = undefined;
        this.sfs.solA = undefined;
        this.sfs.acao = null;
        this.sfs.tipo_analize = 0;
        this.router.navigate(['../oficio/solicitacao']);
      } else {
        this.resp = [];
        this.voltarListar();
      }
    }
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = !ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  criaSolicitacao(): SolicFormI {
    this.mostraForm = false;
    const solicitacao = new SolicForm();
    if (this.sfs.acao === 'alterar') {
      solicitacao.solicitacao_id = +this.sfs.solicitacao.solicitacao_id;
    }
    if (this.vs.solicitacaoVersao < 3) {
      solicitacao.solicitacao_reponsavel_analize_id = this.formSol.get('solicitacao_reponsavel_analize_id').value;
      solicitacao.solicitacao_local_id = this.formSol.get('solicitacao_local_id').value;
    }
    if (this.vs.solicitacaoVersao === 1) {
      solicitacao.solicitacao_tipo_recebimento_id = this.formSol.get('solicitacao_tipo_recebimento_id').value;

      if (this.cpoEditor['solicitacao_aceita_recusada'] !== undefined && this.cpoEditor['solicitacao_aceita_recusada'] !== null) {
        if (this.cpoEditor['solicitacao_aceita_recusada'].html !== this.sfs.solicitacao.solicitacao_aceita_recusada) {
          solicitacao.solicitacao_aceita_recusada = this.cpoEditor['solicitacao_aceita_recusada'].html;
          solicitacao.solicitacao_aceita_recusada_delta = JSON.stringify(this.cpoEditor['solicitacao_aceita_recusada'].delta);
          solicitacao.solicitacao_aceita_recusada_texto = this.cpoEditor['solicitacao_aceita_recusada'].text;
        }
      }

      if (this.cpoEditor['solicitacao_carta'] !== undefined && this.cpoEditor['solicitacao_carta'] !== null) {
        if (this.cpoEditor['solicitacao_carta'].html !== this.sfs.solicitacao.solicitacao_carta) {
          solicitacao.solicitacao_carta = this.cpoEditor['solicitacao_carta'].html;
          solicitacao.solicitacao_carta_delta = JSON.stringify(this.cpoEditor['solicitacao_carta'].delta);
          solicitacao.solicitacao_carta_texto = this.cpoEditor['solicitacao_carta'].text;
        }
      }

    }
    solicitacao.solicitacao_cadastro_tipo_id = this.formSol.get('solicitacao_cadastro_tipo_id').value;
    solicitacao.solicitacao_cadastro_id = this.formSol.get('solicitacao_cadastro_id').value.value;
    solicitacao.solicitacao_data = this.formSol.get('solicitacao_data').value;
    solicitacao.solicitacao_numero_oficio = this.formSol.get('solicitacao_numero_oficio').value;
    solicitacao.solicitacao_orgao = this.formSol.get('solicitacao_orgao').value;
    solicitacao.solicitacao_assunto_id = this.formSol.get('solicitacao_assunto_id').value;
    solicitacao.solicitacao_indicacao_sn = this.sfs.solicitacao.solicitacao_indicacao_sn;
    if (this.sfs.solicitacao.solicitacao_indicacao_sn) {
      solicitacao.solicitacao_indicacao_nome = this.formSol.get('solicitacao_indicacao_nome').value;
    }
    solicitacao.solicitacao_atendente_cadastro_id = this.formSol.get('solicitacao_atendente_cadastro_id').value;
    solicitacao.solicitacao_data_atendimento = this.formSol.get('solicitacao_data_atendimento').value;
    solicitacao.solicitacao_area_interesse_id = this.formSol.get('solicitacao_area_interesse_id').value;

    if (this.cpoEditor['solicitacao_descricao'] !== undefined && this.cpoEditor['solicitacao_descricao'] !== null) {
      if (this.cpoEditor['solicitacao_descricao'].html !== this.sfs.solicitacao.solicitacao_descricao) {
        solicitacao.solicitacao_descricao = this.cpoEditor['solicitacao_descricao'].html;
        solicitacao.solicitacao_descricao_delta = JSON.stringify(this.cpoEditor['solicitacao_descricao'].delta);
        solicitacao.solicitacao_descricao_texto = this.cpoEditor['solicitacao_descricao'].text;
      }
    }

    if (this.cpoEditor['historico_andamento'] !== undefined && this.cpoEditor['historico_andamento'] !== null) {
      solicitacao.historico_andamento = this.cpoEditor['historico_andamento'].html;
      solicitacao.historico_andamento_delta = JSON.stringify(this.cpoEditor['historico_andamento'].delta);
      solicitacao.historico_andamento_texto = this.cpoEditor['historico_andamento'].text;
    }

    if (this.sfs.acao==='incluir') {
      solicitacao.solicitacao_tipo_analize = this.formSol.get('solicitacao_tipo_analize').value;
      this.solicitacao_tipo_analize = +solicitacao.solicitacao_tipo_analize;
    } else {
      delete solicitacao.solicitacao_tipo_analize;
    }

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
    this.mostraForm = false;
    if (this.sfs.acao === 'incluir') {
      this.incluirSolicitacao();
    } else {
      this.alterarSolicitacao();
    }
  }

  voltarListar() {
    this.sfs.solicListar = undefined;
    this.sfs.solA = undefined;
    this.sfs.acao = null;
    this.sfs.tipo_analize = 0;
    if (sessionStorage.getItem('solic-busca')) {
      this.router.navigate(['/solic/listar/busca']);
    } else {
      this.router.navigate(['/solic/listar']);
    }
  }

  voltar() {
    this.sfs.solicListar = undefined;
    this.sfs.solA = undefined;
    this.sfs.acao = null;
    this.sfs.tipo_analize = 0;
    this.ss.stateSN = false;
    sessionStorage.removeItem('solic-busca');
    this.router.navigate(['/solic/listar2']);
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
      ((!this.formSol.get(campo).valid || situacao) && (this.formSol.get(campo).touched || this.formSol.get(campo).dirty))
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'ng-invalid': this.validaAsync(campo, situacao),
      'ng-dirty': this.validaAsync(campo,situacao)
    };
  }

  verificaNumOficio(ev) {
    if (this.sfs.solicitacao.solicitacao_numero_oficio !== this.formSol.get('solicitacao_numero_oficio').value) {
      const of = this.formSol.get('solicitacao_numero_oficio').value;
      if (of.length > 0) {
        let resp: any[] = [];
        const dados: any = {
          solicitacao_numero_oficio: of
        }
        this.sub.push(this.ss.postVerificarNumOficio(dados).pipe(take(1)).subscribe(r => {
          resp = r;
          if (resp[0]) {
            this.solNumOfi = true;
          }
        }));
      }
    }
  }

  verificaNumProcesso(ev) {
    const np = this.formSol.get('processo_numero').value;
    let nPro = '';
    if (typeof this.sfs.solicitacao.processo_numero !== 'undefined' &&
      this.sfs.solicitacao.processo_numero !== null &&
      this.sfs.solicitacao.processo_numero.length > 0) {
      nPro = this.sfs.solicitacao.processo_numero;
    }
    if (nPro !== np && np !== this.sgstNumPro) {
      const dado = {'processo_numero': np};
      this.sub.push(this.ss.postVerificarNumProesso(dado).pipe(take(1)).subscribe(r => {
        const resp: boolean = r[0];
        this.solNumPro = !resp;
        this.aplicaCssErroAsync('processo_numero', !resp);
      }));
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

  onContentChanged(ev, campo: string) {
    this.cpoEditor[campo] = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  ngOnDestroy(): void {
    this.sfs.resetSolicitacao();
    this.sub.forEach(s => s.unsubscribe());
  }

}
