/* tslint:disable:prefer-const */
import { Component, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SelectItem, MenuItem, MessageService } from 'primeng/api';
import { AutocompleteService, DropdownService, MostraMenuService} from '../../_services';
import { DropdownnomeidClass } from '../../_models';
import { AuthenticationService, CarregadorService } from '../../_services';
import { EmendaService } from '../_services';
import { EmendaFormulario, EmendaListarInterface} from '../_models';
import { EmendaFormService } from '../_services/emenda-form.service';


@Component({
  selector: 'app-emenda-alterar',
  templateUrl: './emenda-alterar.component.html',
  styleUrls: ['./emenda-alterar.component.css'],
  providers: [MessageService]
})
export class EmendaAlterarComponent implements OnInit {
  @ViewChild('emdId', { static: true }) public emdId: any;
  formEmendaAlterar: FormGroup;
  ddEmenda_cadastro_tipo_id: SelectItem[] = [];
  ddEmenda_assunto_id: SelectItem[] = [];
  ddEmenda_local_id: SelectItem[] = [];
  ddEmenda_ogu_id: SelectItem[] = [];
  ddEmenda_tipo_emenda_id: SelectItem[] = [];
  ddEmenda_porcentagem: SelectItem[] = [];
  ddEmenda_situacao: SelectItem[] = [];
  sub: Subscription[] = [];
  sgt: SelectItem[];
  ptBr: any;

  cadastroDisabled = true;
  icone = 'pi pi-chevron-down';
  cadastro_incluir = false;
  novoRegistro: SelectItem = null;
  moduloRecebido: string = null;
  cadastroTipoIdRecebido = 0;
  resp: any[];
  emptyMessage = 'Nenhum registro encontrado.';

  modulos: any;
  mostraModulos1 = 'none';
  mostraModulos2 = 'none';

  botaoEnviarVF = false;
  mostraForm = true;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  emenda_id = 0;

  testeEmenda: EmendaFormulario;

  verificaValidacoes = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private autocompleteservice: AutocompleteService,
    private mm: MostraMenuService,
    private location: Location,
    private messageService: MessageService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cs: CarregadorService,
    private es: EmendaService,
    public efs: EmendaFormService
  ) { }

  ngOnInit(): void {
    this.efs.criaEmenda();
    this.carregaDropdownSessionStorage();
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
    } else {
      this.carregaDados(this.activatedRoute.snapshot.params);
    }
    this.cs.escondeCarregador();
    // this.carregaRota();
  }

  carregaDropdownSessionStorage() {
    this.ddEmenda_cadastro_tipo_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_cadastro'));
    this.ddEmenda_situacao = JSON.parse(sessionStorage.getItem('dropdown-emenda_situacao'));
    this.ddEmenda_assunto_id = JSON.parse(sessionStorage.getItem('dropdown-assunto'));
    this.ddEmenda_local_id = JSON.parse(sessionStorage.getItem('dropdown-local'));
    this.ddEmenda_ogu_id = JSON.parse(sessionStorage.getItem('dropdown-ogu'));
    this.ddEmenda_tipo_emenda_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_emenda'));
    for (let i = 0; i < 101; i++) {
      this.ddEmenda_porcentagem.push({label: i.toString(), value: i});
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

  // ***     FORMULARIO      *************************
  criaForm() {
    this.formEmendaAlterar = this.formBuilder.group({
      emenda_cadastro_tipo_id: [this.efs.eF.emenda_cadastro_tipo_id, Validators.required],
      emenda_cadastro_id: [this.efs.eF.emenda_cadastro_id, Validators.required],
      emenda_autor_nome: [this.efs.eF.emenda_autor_nome, Validators.required],
      emenda_situacao: [this.efs.eF.emenda_situacao, Validators.required],
      emenda_numero: [this.efs.eF.emenda_numero],
      emenda_funcional_programatica: [this.efs.eF.emenda_funcional_programatica],
      emenda_orgao_solicitado_nome: [this.efs.eF.emenda_orgao_solicitado_nome, Validators.required],
      emenda_numero_protocolo: [this.efs.eF.emenda_numero_protocolo],
      emenda_assunto_id: [this.efs.eF.emenda_assunto_id, Validators.required],
      emenda_local_id: [this.authenticationService.usuario_local_id],
      emenda_data_solicitacao: [this.efs.eF.emenda_data_solicitacao],
      emenda_processo: [this.efs.eF.emenda_processo],
      emenda_contrato: [this.efs.eF.emenda_contrato],
      emenda_tipo_emenda_id: [this.efs.eF.emenda_tipo_emenda_id, Validators.required],
      emenda_ogu_id: [this.efs.eF.emenda_ogu_id],
      emenda_crnr: [this.efs.eF.emenda_crnr],
      emenda_gmdna: [this.efs.eF.emenda_gmdna],
      emenda_uggestao: [this.efs.eF.emenda_uggestao],
      emenda_siconv: [this.efs.eF.emenda_siconv],
      emenda_valor_solicitadado: [this.efs.eF.emenda_valor_solicitadado],
      emenda_valor_empenhado: [this.efs.eF.emenda_valor_empenhado],
      emenda_data_empenho: [this.efs.eF.emenda_data_empenho],
      emenda_numero_empenho: [this.efs.eF.emenda_numero_empenho],
      emenda_data_pagamento: [this.efs.eF.emenda_data_pagamento],
      emenda_valor_pago: [this.efs.eF.emenda_valor_pago],
      emenda_numero_ordem_bancaria: [this.efs.eF.emenda_numero_ordem_bancaria],
      emenda_observacao_pagamento: [this.efs.eF.emenda_observacao_pagamento],
      emenda_porcentagem: [this.efs.eF.emenda_porcentagem],
      emenda_justificativa: [this.efs.eF.emenda_justificativa],
      his_texto: [null],
      emenda_id: [this.efs.eF.emenda_id]
    });
    this.adicionaDadosIncluidos();
  }

  ativaCadastroId() {
    if (this.formEmendaAlterar.get('emenda_cadastro_tipo_id').value) {
      this.formEmendaAlterar.get('emenda_cadastro_id').enable();
      this.cadastroDisabled = false;
    } else {
      this.formEmendaAlterar.get('emenda_cadastro_id').disable();
      this.cadastroDisabled = true;
    }
  }

  adicionaDadosIncluidos() {
    if (this.moduloRecebido) {
      if (this.moduloRecebido === 'cadastro') {
        this.formEmendaAlterar.get('emenda_cadastro_tipo_id').patchValue(this.cadastroTipoIdRecebido);
      }
    }
    this.formEmendaAlterar.get('emenda_cadastro_id').patchValue(this.novoRegistro);
    this.cadastroDisabled = false;
  }

  autoComp (event, campo) {
    if (event.query.length > 2) {
      let tipo = 0;
      const tabela = campo.toString();
      const campo_id = tabela + '_id';
      const campo_nome = tabela + '_nome';
      const campo_nome_limpo = tabela + '_nome_limpo';
      if (this.formEmendaAlterar.get('emenda_cadastro_tipo_id').value) {
        tipo = + this.formEmendaAlterar.get('emenda_cadastro_tipo_id').value;
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

  onUpload(ev) {
    if (ev) {
      this.mostraForm = false;
      this.cs.escondeCarregador();
      this.messageService.add({
        key: 'emendaToast',
        severity: 'success',
        summary: 'ALTERAR EMENDA',
        detail: this.resp[2]
      });
      this.efs.destriEmenda();
      this.resetForm();
      this.botaoEnviarVF = false;
      this.mostraForm = true;
      // this.voltarListar();
    }
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  resetForm() {
    this.resp = [];
    this.formEmendaAlterar.reset();
    window.scrollTo(0, 0);
  }

  focus1(event) {
    this.mostraModulos1 = 'inline-block';
    this.mostraModulos2 = 'none';
  }
  focus2(event) {
    this.mostraModulos1 = 'none';
    this.mostraModulos2 = 'inline-block';
  }

  voltarListar() {
    if (!sessionStorage.getItem('emenda-listagem')) {
      this.mm.showMenu();
    }
    this.router.navigate(['/emenda']);
  }

  onNovoRegistroAux(ev) {
    if (ev.campo === 'emenda_assunto_id') {
      this.ddEmenda_assunto_id = ev.dropdown;
    }
    this.formEmendaAlterar.get(ev.campo).patchValue(ev.valorId);
  }

  goAlterar() {
    if (this.authenticationService.cadastro_alterar) {
      this.cs.mostraCarregador();
      sessionStorage.setItem('emenda-alterar', JSON.stringify(this.formEmendaAlterar.getRawValue()));
      this.router.navigate(['/solicitacao/cadastro']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onSubmit() {

  }

  enviarEmenda() {
    let envio: EmendaFormulario = this.criaEnvio();
    if (envio) {
      this.botaoEnviarVF = false;
      this.mostraForm = true;
      this.arquivoDesativado = false;
      this.cs.mostraCarregador();
      this.sub.push(this.es.putEmendaAlterar(this.emenda_id, this.criaEnvio())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            this.cs.escondeCarregador();
            this.messageService.add({
              key: 'emendaToast',
              severity: 'warn',
              summary: 'ERRO ALTERAR',
              detail: this.resp[2]
            });
            console.log(err);
          },
          complete: () => {
            if (this.resp[0]) {
              if (sessionStorage.getItem('emenda-dropdown-menu')) {
                sessionStorage.removeItem('emenda-dropdown-menu');
              }
              this.efs.resetEmenda();
              this.resetForm();
              this.cs.escondeCarregador();
              this.messageService.add({
                key: 'emendaToast',
                severity: 'success',
                summary: 'ALTERAR EMENDA',
                detail: this.resp[2]
              });

              this.voltarListar();

            } else {
              this.botaoEnviarVF = false;
              this.mostraForm = true;
              this.cs.escondeCarregador();
              console.error('ERRO - ALTERAR ', this.resp[2]);
              this.messageService.add({
                key: 'emendaToast',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
    } else {
      this.messageService.add({
        key: 'emendaToast',
        severity: 'warn',
        summary: 'ATENÇÃO - SEM ALTERAÇÃO',
        detail: 'Nenhum campo foi alterado.'
      });
    }
  }

  criaEnvio(): EmendaFormulario {
    let emendaFormulario: EmendaFormulario;
    let ct = 0;
    emendaFormulario = this.formEmendaAlterar.getRawValue();
    for (const chave in emendaFormulario) {
      if (this.formEmendaAlterar.get(chave).dirty) {
        emendaFormulario[chave] = this.formEmendaAlterar.get(chave).value;
        ct++;
      } else {
        delete emendaFormulario[chave];
      }
    }
    if (emendaFormulario['emenda_id']) {
       emendaFormulario['emenda_id'] = this.emenda_id;
    }
    if (ct === 0) {
      return null;
    } else {
      return emendaFormulario;
    }
  }

  carregaDados(em: any): void {
    let emendaFormulario = new EmendaFormulario();
    for (const chave in emendaFormulario) {
      if (em[chave]) {
        if (chave.substr(-2, 2) === 'id') {
          if (chave === 'emenda_cadastro_id') {
            this.novoRegistro = {
              label: em['emenda_cadastro_nome'],
              value: +em['emenda_cadastro_id']
            };
          }
          emendaFormulario[chave] = +em[chave];
        } else {
          emendaFormulario[chave] = em[chave];
        }
      }
      if (emendaFormulario[chave] instanceof Object) {
        emendaFormulario[chave] = emendaFormulario[chave].value;
      }
      if (emendaFormulario[chave] === null || emendaFormulario[chave] == '') {
        delete emendaFormulario[chave];
      }
    }
    if (emendaFormulario['emenda_id']) {
      this.emenda_id = + emendaFormulario['emenda_id'];
    }
    if (em) {
      this.efs.eF = emendaFormulario;
      this.criaForm();
    }
  }

  verificaValidacoesForm() {
    let a = 0;
    Object.keys(this.formEmendaAlterar.controls).forEach(campo => {
      const controle = this.formEmendaAlterar.get(campo);
      controle.markAsDirty();
      controle.markAsTouched();
      if (controle instanceof FormControl) {
        if (controle.invalid) {
          console.log('invalid', campo, controle.status);
          a++;
        }
      }
    });
    if (a > 0) {
      this.messageService.add({
        key: 'emendaToast',
        severity: 'warn',
        summary: 'ATENÇÃO - ERRO',
        detail: 'DADOS INVÁLIDOS'
      });
    } else {
      this.enviarEmenda();
    }
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formEmendaAlterar.get(campo).valid &&
      (this.formEmendaAlterar.get(campo).touched || this.formEmendaAlterar.get(campo).dirty)
    );
  }

  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

  validaAsync(campo: string, situacao: boolean) {
    return (
      !this.formEmendaAlterar.get(campo).valid &&
      (this.formEmendaAlterar.get(campo).touched || this.formEmendaAlterar.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'has-error': this.validaAsync(campo, situacao),
      'has-feedback': this.validaAsync(campo, situacao)
    };
  }

}
