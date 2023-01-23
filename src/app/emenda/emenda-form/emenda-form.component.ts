import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmendaForm, EmendaFormI} from "../_models/emenda-form-i";
import {EmendaListarI} from "../_models/emenda-listar-i";
import {SelectItem, SelectItemGroup} from "primeng/api";
import {Subscription} from "rxjs";
import {CpoEditor, InOutCampoTexto} from "../../_models/in-out-campo-texto";
import {DdService} from "../../_services/dd.service";
import {AuthenticationService, AutocompleteService, MenuInternoService} from "../../_services";
import {ActivatedRoute, Router} from "@angular/router";
import {MsgService} from "../../_services/msg.service";
import {VersaoService} from "../../_services/versao.service";
import {EmendaFormService} from "../_services/emenda-form.service";
import {EmendaService} from "../_services/emenda.service";
import {take} from "rxjs/operators";
import { DateTime } from "luxon";
import {SolicListarI} from "../../solic/_models/solic-listar-i";

@Component({
  selector: 'app-emenda-form',
  templateUrl: './emenda-form.component.html',
  styleUrls: ['./emenda-form.component.css']
})
export class EmendaFormComponent implements OnInit, OnDestroy {
  formEmenda: FormGroup;
  emenda: EmendaFormI | null = null;
  emendaListar: EmendaListarI | null = null;
  ddEmenda_cadastro_tipo_id: SelectItemGroup[] = [];
  ddEmenda_assunto_id: SelectItem[] = [];
  ddEmenda_tipo_emenda_id: SelectItem[] = [];
  ddEmenda_situacao_id: SelectItem[] = [];
  ddEmenda_local_id: SelectItem[] = [];
  ddEmenda_ogu_id: SelectItem[] = [];
  ddEmenda_porcentagem: SelectItem[] = [];
  sgt: SelectItem[] = [];
  ptBr: any;
  emptyMessage = 'Nenhum registro encontrado.';
  formatos: any;
  icone = 'pi pi-chevron-down';
  cadastro_incluir = false;
  cadastroDisabled = true;
  novoRegistro: SelectItem | null = null;
  moduloRecebido = '';
  cadastroTipoIdRecebido = 0;
  resp: any[] = [];
  sub: Subscription[] = [];
  // botaoEnviarVF = false;
  mostraForm = true;
  arquivoDesativado = false;
  enviarArquivos = false;
  botaoEnviarVF = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  stl = 'p-col-12 p-sm-12 p-md-6 p-lg-6 p-xl-4';
  titulo = 'EMENDA - INCLUIR';
  readonly = false;
  checked = false;
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

  constructor(
    public formBuilder: FormBuilder,
    private dd: DdService,
    public mi: MenuInternoService,
    private autocompleteservice: AutocompleteService,
    public aut: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ms: MsgService,
    public vs: VersaoService,
    public efs: EmendaFormService,
    public es: EmendaService
  ) {
  }

  ngOnInit(): void {
    this.cadastro_incluir = this.aut.cadastro_incluir;
    if (sessionStorage.getItem('emenda-incluir') || sessionStorage.getItem('emenda-alterar')) {
      if (sessionStorage.getItem('emenda-incluir')) {
        this.efs.acao = 'incluir';
        this.efs.emenda = JSON.parse(sessionStorage.getItem('emenda-incluir'));
        sessionStorage.removeItem('emenda-incluir');
      }
      if (sessionStorage.getItem('emenda-alterar')) {
        this.efs.acao = 'alterar';
        this.efs.emenda = JSON.parse(sessionStorage.getItem('emenda-alterar'));
        sessionStorage.removeItem('emenda-alterar');
      }
    } else {
      if (this.efs.acao === 'incluir') {
        const dt = new Date();
        const hoje = dt.toLocaleString('pt-BR');
        this.efs.emenda.emenda_local_id = (this.vs.versao < 3) ? this.aut.usuario_local_id : 0;
      }
      if (this.efs.acao === 'alterar') {
        this.novoRegistro = {
          label: this.efs.emendaListar.emenda_cadastro_nome,
          value: +this.efs.emendaListar.emenda_cadastro_id
        };
        this.sgt.push(this.novoRegistro);
      }

    }
    this.carregaDropdownSessionStorage();
    this.criaForm();
    if (typeof this.activatedRoute.snapshot.params['modulo'] !== 'undefined') {
      this.moduloRecebido = this.activatedRoute.snapshot.params['modulo'];
      this.cadastroTipoIdRecebido = +this.activatedRoute.snapshot.params['tipo'];
      this.efs.emenda.emenda_cadastro_tipo_id = +this.activatedRoute.snapshot.params['tipo'];
      this.efs.emenda.emenda_cadastro_id = +this.activatedRoute.snapshot.params['value'];
      this.novoRegistro = {
        label: this.activatedRoute.snapshot.params['label'],
        value: +this.activatedRoute.snapshot.params['value']
      };
      this.adicionaDadosIncluidos();
    }
    if (this.efs.acao === 'incluir') {
      this.titulo = 'EMENDA - INCLUIR';
    } else {
      this.titulo = 'EMENDA - ALTERAR';
    }

  }

  carregaDropdownSessionStorage() {
    this.ddEmenda_cadastro_tipo_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_cadastro'));
    this.ddEmenda_assunto_id = JSON.parse(sessionStorage.getItem('dropdown-assunto'));
    this.ddEmenda_tipo_emenda_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_emenda'));
    this.ddEmenda_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-emenda_situacao'));
    this.ddEmenda_ogu_id = JSON.parse(sessionStorage.getItem('dropdown-ogu'));
    if (this.vs.solicitacaoVersao < 3) {
      this.ddEmenda_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
    }
    for (let i = 0; i < 101; i++) {
      this.ddEmenda_porcentagem.push({label: i.toString(), value: i});
    }
  }

  /*adicionaDadosIncluidos() {
    if (this.moduloRecebido === 'cadastro') {
      this.formEmenda.get('emenda_cadastro_tipo_id').patchValue(this.cadastroTipoIdRecebido);
      this.formEmenda.get('emenda_cadastro_id').patchValue(this.novoRegistro);
    }
  }*/

  criaForm() {
    this.formEmenda = this.formBuilder.group({
      emenda_cadastro_tipo_id: [this.efs.emenda.emenda_cadastro_tipo_id, Validators.required],
      // emenda_cadastro_id: [{value: this.efs.emenda.emenda_cadastro_id, disabled: true}, Validators.required],
      emenda_cadastro_id: [{value: this.efs.emenda.emenda_cadastro_id, disabled: true}, Validators.required],
      emenda_autor_nome: [this.efs.emenda.emenda_autor_nome, Validators.required],
      emenda_situacao_id: [this.efs.emenda.emenda_situacao_id, Validators.required],
      emenda_numero: [this.efs.emenda.emenda_numero],
      emenda_funcional_programatica: [this.efs.emenda.emenda_funcional_programatica],
      emenda_orgao_solicitado_nome: [this.efs.emenda.emenda_orgao_solicitado_nome, Validators.required],
      emenda_numero_protocolo: [this.efs.emenda.emenda_numero_protocolo],
      emenda_assunto_id: [this.efs.emenda.emenda_assunto_id, Validators.required],
      emenda_local_id: [this.efs.emenda.emenda_local_id],
      emenda_data_solicitacao: [null],
      emenda_processo: [this.efs.emenda.emenda_processo],
      emenda_contrato: [this.efs.emenda.emenda_contrato],
      emenda_tipo_emenda_id: [this.efs.emenda.emenda_tipo_emenda_id, Validators.required],
      emenda_ogu_id: [this.efs.emenda.emenda_ogu_id],
      emenda_crnr: [this.efs.emenda.emenda_crnr],
      emenda_gmdna: [this.efs.emenda.emenda_gmdna],
      emenda_uggestao: [this.efs.emenda.emenda_uggestao],
      emenda_siconv: [this.efs.emenda.emenda_siconv],
      emenda_valor_solicitado: [this.efs.emenda.emenda_valor_solicitado],
      emenda_valor_empenhado: [this.efs.emenda.emenda_valor_empenhado],
      emenda_data_empenho: [null],
      emenda_numero_empenho: [this.efs.emenda.emenda_numero_empenho],
      emenda_data_pagamento: [null],
      emenda_valor_pago: [this.efs.emenda.emenda_valor_pago],
      emenda_numero_ordem_bancaria: [this.efs.emenda.emenda_numero_ordem_bancaria],
      emenda_observacao_pagamento: [null],
      emenda_porcentagem: [this.efs.emenda.emenda_porcentagem],
      emenda_justificativa: [null],
      historico_andamento: [null]
    });
    this.getValorAlterar();
  }

  getValorAlterar() {
    if (this.vs.solicitacaoVersao > 2 || this.efs.acao === 'incluir') {
      this.formEmenda.get('emenda_local_id').setValue(1);
    }

    if (this.efs.acao === 'alterar') {
      this.novoRegistro = {
        value: +this.efs.emendaListar.emenda_cadastro_id,
        label: this.efs.emendaListar.emenda_cadastro_nome,
        disabled: false
      };
      this.sgt.push(this.novoRegistro);
      this.formEmenda.get('emenda_cadastro_id').patchValue(this.novoRegistro);
      this.formEmenda.get('emenda_cadastro_id').enable();
      if (this.efs.emenda.emenda_data_solicitacao !== undefined && this.efs.emenda.emenda_data_solicitacao !== null) {
        const dt1: DateTime = DateTime.fromSQL(this.efs.emenda.emenda_data_solicitacao);
        this.formEmenda.get('emenda_data_solicitacao').patchValue(dt1.toJSDate());
      }
      if (this.efs.emenda.emenda_data_pagamento !== undefined && this.efs.emenda.emenda_data_pagamento !== null) {
        const dt2: DateTime = DateTime.fromSQL(this.efs.emenda.emenda_data_pagamento);
        this.formEmenda.get('emenda_data_pagamento').patchValue(dt2.toJSDate());
      }
      if (this.efs.emenda.emenda_data_empenho !== undefined && this.efs.emenda.emenda_data_empenho !== null) {
        const dt3: DateTime = DateTime.fromSQL(this.efs.emenda.emenda_data_empenho);
        this.formEmenda.get('emenda_data_empenho').patchValue(dt3.toJSDate());
      }

      const cp0 = InOutCampoTexto(this.efs.emenda.emenda_observacao_pagamento, this.efs.emenda.emenda_observacao_pagamento_delta);
      this.format0 = cp0.format;
      if (cp0.vf) {
        this.formEmenda.get('emenda_observacao_pagamento').setValue(cp0.valor);
      }

      const cp1 = InOutCampoTexto(this.efs.emenda.emenda_justificativa, this.efs.emenda.emenda_justificativa_delta);
      console.log('cp1', cp1);
      this.format1 = cp1.format;
      if (cp1.vf) {
        this.formEmenda.get('emenda_justificativa').setValue(cp1.valor);
      }
    }
    console.log('emendaAlterar2', this.formEmenda.getRawValue());
  }

  ativaCadastroId() {
    if (this.formEmenda.get('emenda_cadastro_tipo_id').value) {
      this.formEmenda.get('emenda_cadastro_id').enable();
      this.cadastroDisabled = false;
    } else {
      this.formEmenda.get('emenda_cadastro_id').disable();
      this.cadastroDisabled = true;
    }
  }

  adicionaDadosIncluidos() {
    if (this.moduloRecebido === 'cadastro') {
      this.formEmenda.get('emenda_cadastro_tipo_id').patchValue(this.cadastroTipoIdRecebido);
      this.cadastroDisabled = false;
      this.formEmenda.get('emenda_cadastro_id').patchValue(this.novoRegistro);
    }
  }

  cadastro_tipo_change() {
    this.sgt = [];
  }

  autoComp (event, campo) {
    if (event.query.length > 2) {
      let tipo = 0;
      const tabela = campo.toString();
      const campo_id = tabela + '_id';
      const campo_nome = tabela + '_nome';
      const campo_nome_limpo = tabela + '_nome_limpo';
      if (this.formEmenda.get('emenda_cadastro_tipo_id').value) {
        tipo = + this.formEmenda.get('emenda_cadastro_tipo_id').value;
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
            error: err => console.error('Autocomplete-->', err),
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
            error: err => console.error('Autocomplete-->', err),
            complete: () => {
            }
          }));
      }
    }
  }

  onNovoRegistroAux(ev) {
    if (ev.campo === 'emenda_assunto_id') {
      this.ddEmenda_assunto_id = ev.dropdown;
    }
    this.formEmenda.get(ev.campo).patchValue(ev.valorId);
  }

  goIncluir() {
    if (this.aut.cadastro_incluir) {
      sessionStorage.setItem('emenda-incluir', JSON.stringify(this.formEmenda.getRawValue()));
      // this.router.navigate(['/solicitacao/cadastro']);
      this.router.navigate(['/incluir/cadastro/emenda']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onSubmit() {
    this.mostraForm = false;
    this.botaoEnviarVF = true;
    this.arquivoDesativado = true;
    this.verificaValidacoesForm(this.formEmenda);
    if (this.formEmenda.valid) {
      const r = this.formEmenda.getRawValue();
      console.log('onSubmit', r);
      if (this.efs.acao === 'incluir') {
        this.incluirEmenda();
      }
      if (this.efs.acao === 'alterar') {
        this.alterarEmenda();
      }
    } else {
      this.arquivoDesativado = false;
      this.mostraForm = true;
      this.botaoEnviarVF = false;
    }

  }

  incluirEmenda() {
    // this.botaoEnviarVF = false;
    // this.mostraForm = true;
    const e: EmendaFormI = this.criaEnvio();
    this.sub.push(this.es.incluirEmenda(e)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = true;
          this.arquivoDesativado = false;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            if (sessionStorage.getItem('emenda-menu-dropdown')) {
              sessionStorage.removeItem('emenda-menu-dropdown');
            }
            if (this.possuiArquivos) {
              this.arquivo_registro_id = +this.resp[1];
              this.enviarArquivos = true;
            } else {
              this.efs.resetEmenda();
              this.resetForm();
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'INCLUIR EMENDA',
                detail: this.resp[2]
              });
              this.voltarListar();
            }
          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = true;
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

  alterarEmenda() {
    if (this.formEmenda.valid) {
      this.arquivoDesativado = true;
      const e = this.criaEnvio();
      this.ms.fundoSN(false);
      this.sub.push(this.es.alterarEmenda(e)
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
              sessionStorage.removeItem('emenda-menu-dropdown');
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'ALTERAR EMENDA',
                detail: this.resp[2]
              });
              this.resetForm();
              this.dd.ddSubscription('emenda-menu-dropdown');
              if (sessionStorage.getItem('emenda-busca') && this.es.emendas.length > 0) {
                const el: EmendaListarI = this.resp[3];
                const id: number = +this.efs.emenda.emenda_id;
                const idx: number = this.es.emendas.findIndex(s => s.emenda_id = id);
                if (idx !== -1) {
                  this.es.emendas[idx] = el;
                  const c = {
                    data: this.es.emendas[idx],
                    originalEvent: {}
                  }
                  this.es.onRowExpand(c);
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
      this.verificaValidacoesForm(this.formEmenda);
    }
  }

  criaEnvio(): EmendaFormI {
    const e = new EmendaForm();
    if (this.efs.acao === 'alterar') {
      e.emenda_id = this.efs.emenda.emenda_id;
    }
    e.emenda_cadastro_tipo_id = +this.formEmenda.get('emenda_cadastro_tipo_id').value;
    const tmp1: SelectItem = this.formEmenda.get('emenda_cadastro_id').value;
    e.emenda_cadastro_id = +tmp1.value;
    e.emenda_autor_nome = this.formEmenda.get('emenda_autor_nome').value;
    e.emenda_situacao_id = +this.formEmenda.get('emenda_situacao_id').value;
    e.emenda_numero = this.formEmenda.get('emenda_numero').value;
    e.emenda_funcional_programatica = this.formEmenda.get('emenda_funcional_programatica').value;
    e.emenda_orgao_solicitado_nome = this.formEmenda.get('emenda_orgao_solicitado_nome').value;
    e.emenda_numero_protocolo = this.formEmenda.get('emenda_numero_protocolo').value;
    e.emenda_assunto_id = +this.formEmenda.get('emenda_assunto_id').value;
    if (this.formEmenda.get('emenda_data_solicitacao').value !== null) {
      const tmp2: Date = this.formEmenda.get('emenda_data_solicitacao').value;
      e.emenda_data_solicitacao = tmp2.toISOString().slice(0,10);
    }
    e.emenda_processo = this.formEmenda.get('emenda_processo').value;
    e.emenda_tipo_emenda_id = +this.formEmenda.get('emenda_tipo_emenda_id').value;
    e.emenda_ogu_id = (this.formEmenda.get('emenda_ogu_id').value !== null) ? +this.formEmenda.get('emenda_ogu_id').value : null;
    if (this.formEmenda.get('emenda_valor_solicitado').value !== null) {
      e.emenda_valor_solicitado = +this.formEmenda.get('emenda_valor_solicitado').value;
    }
    if (this.formEmenda.get('emenda_valor_empenhado').value !== null) {
      e.emenda_valor_empenhado = +this.formEmenda.get('emenda_valor_empenhado').value;
    }
    if (this.formEmenda.get('emenda_data_empenho').value !== null) {
      const tmp3: Date = this.formEmenda.get('emenda_data_empenho').value;
      e.emenda_data_empenho = tmp3.toISOString().slice(0,10);
    }
    e.emenda_numero_empenho = this.formEmenda.get('emenda_numero_empenho').value;
    e.emenda_crnr = this.formEmenda.get('emenda_crnr').value;
    e.emenda_gmdna = this.formEmenda.get('emenda_gmdna').value;

    if (this.formEmenda.get('emenda_data_pagamento').value !== null) {
      const tmp4: Date = this.formEmenda.get('emenda_data_pagamento').value;
      e.emenda_data_pagamento = tmp4.toISOString().slice(0,10);
    }
    if (this.formEmenda.get('emenda_valor_pago').value !== null) {
      e.emenda_valor_pago = +this.formEmenda.get('emenda_valor_pago').value;
    }
    e.emenda_numero_ordem_bancaria = this.formEmenda.get('emenda_numero_ordem_bancaria').value;
    if (this.formEmenda.get('emenda_local_id').value !== null) {
      e.emenda_local_id = +this.formEmenda.get('emenda_local_id').value;
    }
    e.emenda_uggestao = this.formEmenda.get('emenda_uggestao').value;
    e.emenda_siconv = this.formEmenda.get('emenda_siconv').value;
    e.emenda_contrato = this.formEmenda.get('emenda_contrato').value;
    if (this.formEmenda.get('emenda_porcentagem').value !== null) {
      e.emenda_porcentagem = +this.formEmenda.get('emenda_porcentagem').value;
    }
    if (this.cpoEditor['emenda_justificativa'] !== undefined && this.cpoEditor['emenda_justificativa'] !== null) {
      e.emenda_justificativa = this.cpoEditor['emenda_justificativa'].html;
      e.emenda_justificativa_delta = JSON.stringify(this.cpoEditor['emenda_justificativa'].delta);
      e.emenda_justificativa_texto = this.cpoEditor['emenda_justificativa'].text;
    }
    if (this.cpoEditor['emenda_observacao_pagamento'] !== undefined && this.cpoEditor['emenda_observacao_pagamento'] !== null) {
      e.emenda_observacao_pagamento = this.cpoEditor['emenda_observacao_pagamento'].html;
      e.emenda_observacao_pagamento_delta = JSON.stringify(this.cpoEditor['emenda_observacao_pagamento'].delta);
      e.emenda_observacao_pagamento_texto = this.cpoEditor['emenda_observacao_pagamento'].text;
    }
    if (this.cpoEditor['historico_andamento'] !== undefined && this.cpoEditor['historico_andamento'] !== null) {
      e.historico_andamento = this.cpoEditor['historico_andamento'].html;
      e.historico_andamento_delta = JSON.stringify(this.cpoEditor['historico_andamento'].delta);
      e.historico_andamento_texto = this.cpoEditor['historico_andamento'].text;
    }

    if (this.efs.acao === 'incluir') {
      for (const key in e) {
        if (e[key] === null) {
          delete e[key];
        }
      }
    }
   return e;
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = !ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onUpload(ev) {
    if (ev) {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'INCLUIR EMENDA',
        detail: this.resp[2]
      });
      this.dd.ddSubscription('emenda-menu-dropdown');
      this.efs.resetEmenda();
      this.resetForm();
      this.resp = [];
      this.voltarListar();
    }
  }

  voltarListar() {
    this.efs.emendaListar = undefined;
    this.efs.acao = null;
    if (sessionStorage.getItem('emenda-busca')) {
      this.router.navigate(['/emenda/listar']);
    } else {
      this.router.navigate(['/emenda/listar2']);
    }
  }

  voltar() {
    this.efs.resetEmenda();
    this.efs.emendaListar = undefined;
    this.efs.acao = null;
    this.es.stateSN = false;
    sessionStorage.removeItem('emenda-busca');
    this.router.navigate(['/emenda/listar2']);
  }

  resetForm() {
    this.mostraForm = true;
    if (this.efs.acao === 'incluir') {
      this.formEmenda.reset();
    } else {
      this.criaForm();
      this.adicionaDadosIncluidos();
    }

    if (this.possuiArquivos) {
      this.clearArquivos = true;
    }
    this.possuiArquivos = false;
    this.arquivoDesativado = true;
    window.scrollTo(0, 0);
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formEmenda.get(campo).valid &&
      (this.formEmenda.get(campo).touched || this.formEmenda.get(campo).dirty)
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
      ((!this.formEmenda.get(campo).valid || situacao) && (this.formEmenda.get(campo).touched || this.formEmenda.get(campo).dirty))
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'ng-invalid': this.validaAsync(campo, situacao),
      'ng-dirty': this.validaAsync(campo,situacao)
    };
  }



  onContentChanged(ev, campo: string) {
    this.cpoEditor[campo] = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  ngOnDestroy(): void {
    this.efs.resetEmenda();
    this.sub.forEach(s => s.unsubscribe());
  }

}
