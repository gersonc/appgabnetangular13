import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Location} from '@angular/common';
import {catchError, take} from 'rxjs/operators';
import {EMPTY, Subscription} from 'rxjs';

import {CEPError, Endereco, CEPErrorCode, NgxViacepService} from '@brunoc/ngx-viacep';
import {MenuItem, Message, MessageService, SelectItem, SelectItemGroup} from 'primeng/api';

import {WindowsService} from '../../_layout/_service';
import {CadastroBuscaService, CadastroService} from '../_services';
import {CadastroDuplicadoBuscaInterface} from '../_models';
import {DropdownnomeidClass, DropdownsonomearrayClass} from '../../_models';
import {MunicipioService} from '../../municipio/_services/municipio.service';
import {AutocompleteService, CepService, DropdownService ,AuthenticationService, CarregadorService, IncluirAuxService} from '../../_services';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-cadastro-alterar',
  templateUrl: './cadastro-alterar.component.html',
  styleUrls: ['./cadastro-alterar.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class CadastroAlterarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('op', { static: true }) public op: any;
  formCadAlterar: FormGroup;
  ddTipoCadastroId: any[] = [];
  ddTratamento: SelectItem[] = [];
  ddGrupo: SelectItem[] = [];
  ddMunicipioId: SelectItem[] = [];
  ddEstadoId: SelectItem[] = [];
  ddRegiaoId: SelectItem[] = [];
  ddEscolaridadeId: SelectItem[] = [];
  ddEstadoCivilId: SelectItem[] = [];
  ddSexo: SelectItem[] = [];
  ddCampo4Id: SelectItem[] = [];
  tipotipo = 0;
  municipioForm = false;
  regiaoForm = false;
  sgt: string[];
  disableSubmit = true;
  btnIncluirMunicipio = false;
  btnIncluirRegiao = false;
  novoMunicipio: any[];
  novoRegiao: any[];
  nomeDuplicado = false;
  nomeBusca: string = null;
  numeroDuplicado = 0;
  msgs: Message[] = [];
  num: any[] = null;
  ptBr: any;
  resp: any[];
  validaTratamento = false;
  validaNome = false;
  validaMunicipio = false;
  validaRegiao = false;
  validaEstado = false;
  public ddNomeIdArray = new DropdownnomeidClass();
  public ddSoNomeArray = new DropdownsonomearrayClass();
  teste: any[];
  public cad: CadastroDuplicadoBuscaInterface[];
  menuItens: MenuItem[];
  activeIndex = 0;
  altura = (WindowsService.altura - 150) + 'px';
  alturaScroll = `{width: 100%, height: ${this.altura}}`;
  block = true;
  sub: Subscription[] = [];
  botaoEnviarVF = false;
  cadastro_id = 0;
  envioSucesso = false;

  possuiArquivos = false;
  ativaValidacao = false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private dd: DropdownService,
    public cs: CadastroService,
    private viacep: NgxViacepService,
    private cepService: CepService,
    private autocompleteservice: AutocompleteService,
    private auxService: IncluirAuxService,
    private municipioService: MunicipioService,
    private location: Location,
    private router: Router,
    private zone: NgZone,
    // private activatedRoute: ActivatedRoute,
    private cbs: CadastroBuscaService,
    private cr: CarregadorService,
    public authenticationService: AuthenticationService,
  ) {
    // this.cs.criaCadastro();
  }

  ngOnInit() {
    this.cadastro_id = this.cs.cadastro.cadastro_id;
    this.criaForm();
    this.carregaDropdownSessionStorage();
    // this.cr.escondeCarregador();
  }

  ngAfterViewInit() {
    // this.cr.escondeCarregador();
    this.ativaValidacao = false;
  }

  carregaDropdownSessionStorage() {
    this.ddTipoCadastroId = JSON.parse(sessionStorage.getItem('dropdown-tipo_cadastro'));
    this.ddTratamento = JSON.parse(sessionStorage.getItem('dropdown-tratamento'));
    this.ddGrupo = JSON.parse(sessionStorage.getItem('dropdown-grupo'));
    this.ddMunicipioId = JSON.parse(sessionStorage.getItem('dropdown-municipio'));
    this.ddEstadoId = JSON.parse(sessionStorage.getItem('dropdown-estado'));
    this.ddRegiaoId = JSON.parse(sessionStorage.getItem('dropdown-regiao'));
    this.ddEscolaridadeId = JSON.parse(sessionStorage.getItem('dropdown-escolaridade'));
    this.ddEstadoCivilId = JSON.parse(sessionStorage.getItem('dropdown-estado_civil'));
    this.ddSexo = JSON.parse(sessionStorage.getItem('dropdown-sexo'));
    this.ddCampo4Id = JSON.parse(sessionStorage.getItem('dropdown-campo4'));
  }

  // ***     FORMULARIO      *************************
  criaForm() {
    this.formCadAlterar = this.formBuilder.group({
      cadastro_id: [this.cs.cadastro.cadastro_id],
      cadastro_tipo_id: [this.cs.cadastro.cadastro_tipo_id, Validators.required],
      cadastro_tratamento_id: [this.cs.cadastro.cadastro_tratamento_id, Validators.required],
      cadastro_nome: [this.cs.cadastro.cadastro_nome, Validators.required],
      cadastro_apelido: [this.cs.cadastro.cadastro_apelido],
      cadastro_sigla: [this.cs.cadastro.cadastro_sigla],
      cadastro_responsavel: [this.cs.cadastro.cadastro_responsavel],
      cadastro_cargo: [this.cs.cadastro.cadastro_cargo],
      cadastro_grupo_id: [this.cs.cadastro.cadastro_grupo_id],
      cadastro_endereco: [this.cs.cadastro.cadastro_endereco],
      cadastro_endereco_numero: [this.cs.cadastro.cadastro_endereco_numero],
      cadastro_endereco_complemento: [this.cs.cadastro.cadastro_endereco_complemento],
      cadastro_bairro: [this.cs.cadastro.cadastro_bairro],
      cadastro_municipio_id: [this.cs.cadastro.cadastro_municipio_id, Validators.required],
      cadastro_cep: [this.cs.cadastro.cadastro_cep],
      cadastro_estado_id: [this.cs.cadastro.cadastro_estado_id, Validators.required],
      cadastro_telefone: [this.cs.cadastro.cadastro_telefone],
      cadastro_telcom: [this.cs.cadastro.cadastro_telcom],
      cadastro_telefone2: [this.cs.cadastro.cadastro_telefone2],
      cadastro_celular: [this.cs.cadastro.cadastro_celular],
      cadastro_celular2: [this.cs.cadastro.cadastro_celular2],
      cadastro_fax: [this.cs.cadastro.cadastro_fax],
      cadastro_email: [this.cs.cadastro.cadastro_email, Validators.email],
      cadastro_email2: [this.cs.cadastro.cadastro_email2, Validators.email],
      cadastro_rede_social: [this.cs.cadastro.cadastro_rede_social],
      cadastro_outras_midias: [this.cs.cadastro.cadastro_outras_midias],
      cadastro_cpfcnpj: [this.cs.cadastro.cadastro_cpfcnpj],
      cadastro_rg: [this.cs.cadastro.cadastro_rg],
      cadastro_estado_civil_id: [this.cs.cadastro.cadastro_estado_civil_id],
      cadastro_data_nascimento: [this.cs.cadastro.cadastro_data_nascimento],
      cadastro_conjuge: [this.cs.cadastro.cadastro_conjuge],
      cadastro_escolaridade_id: [this.cs.cadastro.cadastro_escolaridade_id],
      cadastro_profissao: [this.cs.cadastro.cadastro_profissao],
      cadastro_sexo: [this.cs.cadastro.cadastro_sexo],
      cadastro_zona: [this.cs.cadastro.cadastro_zona],
      cadastro_jornal: [this.cs.cadastro.cadastro_jornal],
      cadastro_mala: [this.cs.cadastro.cadastro_mala],
      cadastro_agenda: [this.cs.cadastro.cadastro_agenda],
      cadastro_sigilo: [this.cs.cadastro.cadastro_sigilo],
      cadastro_campo1: [this.cs.cadastro.cadastro_campo1],
      cadastro_campo2: [this.cs.cadastro.cadastro_campo2],
      cadastro_campo3: [this.cs.cadastro.cadastro_campo3],
      cadastro_campo4_id: [this.cs.cadastro.cadastro_campo4_id],
      cadastro_observacao: [this.cs.cadastro.cadastro_observacao],
      mun_nome: [this.cs.mun_nome, [Validators.min(2), Validators.max(50)]],
      cadastro_regiao_id: [this.cs.cadastro.cadastro_regiao_id],
      reg_nome: [this.cs.reg_nome, [Validators.min(2), Validators.max(50)]]
    });
    setTimeout(() => {
        if (this.ddTipoCadastroId.length >= 1) {
          this.tipotipo = this.achaTipo2(this.ddTipoCadastroId, this.cs.cadastro.cadastro_tipo_id);
        }
        // this.cr.escondeCarregador();
    }, 500);
  }

  onSubmit() {
  }

  consultaCEP(event) {
    if (this.formCadAlterar.get('cadastro_cep').value != null) {
      let cep = this.formCadAlterar.get('cadastro_cep').value;
      cep = cep.replace(/\D/g, '');
      // Verifica se campo cep possui valor informado.
      if (cep !== '') {
        // Expressão regular para validar o CEP.
        const validacep = /^[0-9]{8}$/;
        // Valida o formato do CEP.
        if (validacep.test(cep)) {
          // this.resetaDadosForm();
          this.op.show(event);

          this.sub.push(
            this.viacep
              .buscarPorCep(cep)
              .pipe(
                catchError((error: CEPError) => {
                  // Ocorreu algum erro :/
                  console.log(error.message);
                  if (error.message === 'CEP_NAO_ENCONTRADO') {
                    this.messageService.add({key: 'cepToast', severity: 'warn', summary: 'ATENÇÃO', detail: 'CEP NÃO ENCONTADOR'});
                  }
                  this.op.hide();
                  return EMPTY;
                })
              )
              .subscribe((enderecos: Endereco) => {
                this.populaEnderecoForm(enderecos);
                this.op.hide();
              }));


        }
      }
    } else {
      this.op.hide();
    }
  }

  populaEnderecoForm(endereco: Endereco = null) {
    if (endereco) {
      const st = this.achaValor(this.ddEstadoId, endereco.uf);
      if (st) {
        this.cs.cadastro.cadastro_estado_id = st.value;
        this.formCadAlterar.get('cadastro_estado_id').patchValue(st.value);
      }
      this.cs.cadastro.cadastro_endereco = endereco.logradouro;
      this.formCadAlterar.get('cadastro_endereco').patchValue(endereco.logradouro);
      this.cs.cadastro.cadastro_bairro = endereco.bairro;
      this.formCadAlterar.get('cadastro_bairro').patchValue(endereco.bairro);
      const mun = this.achaValor(this.ddMunicipioId, endereco.localidade.toUpperCase());
      if (mun) {
        this.cs.cadastro.cadastro_municipio_id = mun.value;
        this.formCadAlterar.get('cadastro_municipio_id').patchValue(mun.value);
      } else {
        this.formCadAlterar.get('cadastro_estado_id').disable();
        this.formCadAlterar.get('cadastro_endereco').disable();
        this.formCadAlterar.get('cadastro_bairro').disable();
        this.mostraMunicipioForm(endereco.localidade.toUpperCase());
      }
    }
  }

  achaValor(arr: SelectItem[], valor): SelectItem {
    return arr.find(function(x) {
      return x.label === valor;
    });
  }

  achaTipo(arr: SelectItemGroup[], valor): SelectItem {
    const a: SelectItem[] = arr[0].items.concat(arr[1].items);
    const rsp: any = a.find(function (x) {
      return x.value === valor;
    });
    if (this.disableSubmit === true) {
      this.disableSubmit = false;
    }
    return rsp ? rsp : false;
  }

  achaTipo2(arr: any[], valor: number): number {
    const rsp: any = arr.find(function (x) {
      return x.value === valor;
    });
    if (this.disableSubmit === true) {
      this.disableSubmit = false;
    }
    const rp: number = rsp ? rsp.title : 1;
    return rp;
  }

  mudaTipo (event) {
    this.tipotipo = this.achaTipo2(this.ddTipoCadastroId, event.value);
    this.block = false;
    this.formCadAlterar.enable();
  }

  autoComp(event, campo) {
    let sg: any[];
    const tabela = campo.substring(0, campo.indexOf('_'));
    this.sub.push(this.autocompleteservice.getACSimples(tabela, campo, event.query)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          sg = dados;
        },
        error: err => console.error('FE-cadastro_datatable.postCadastroListarPaginacaoSort-ERRO-->', err),
        complete: () => {
          this.sgt = sg;
        }
      }));
  }

  incluirMunicipio() {
    const cid = this.formCadAlterar.get('mun_nome').value;
    if (cid && cid.length > 2) {
      this.cr.mostraCarregador();
      this.sub.push(this.auxService.incluir('municipio', 'municipio_nome', cid, 50)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.novoMunicipio = dados;
          },
          error: err => {
            this.cr.escondeCarregador();
            console.error('FE-incluirMunicipio-ERRO-->', err);
          },
          complete: () => {
            this.cr.escondeCarregador();
            if (this.novoMunicipio[0]) {
              const nm: SelectItem = {
                label: cid.toUpperCase(),
                value: this.novoMunicipio[1]
              };
              this.messageService.add({key: 'municipioToast', severity: 'success', summary: 'INCLUIR MUNICÍPIO', detail: this.resp[2]});
              this.ddMunicipioId.push(nm);
              this.formCadAlterar.get('cadastro_municipio_id').patchValue(nm.value);
              this.formCadAlterar.get('mun_nome').patchValue(null);
              this.fechaMunicipioForm();
            } else {
              this.messageService.add({key: 'municipioToast', severity: 'warn', summary: 'ATENÇÃO - ', detail: this.novoMunicipio[2]});
              this.mostraBtnIncluirMunicipio();
            }
          }
        }));
    } else {
      this.validaMunicipio = true;
    }
  }

  mostraBtnIncluirMunicipio() {
    const cid = this.formCadAlterar.get('mun_nome').value;
    this.btnIncluirMunicipio = cid && cid.length > 2;
  }

  mostraMunicipioForm(cidade: string = null) {
    this.formCadAlterar.disable();
    this.municipioForm = true;
    if (cidade) {
      this.formCadAlterar.get('mun_nome').patchValue(cidade);
    } else {
      this.formCadAlterar.get('mun_nome').patchValue(null);
    }
    this.formCadAlterar.get('mun_nome').enable();
  }

  fechaMunicipioForm() {
    this.formCadAlterar.enable();
    this.formCadAlterar.get('mun_nome').patchValue(null);
    this.formCadAlterar.get('mun_nome').disable();
    this.btnIncluirMunicipio = false;
    this.municipioForm = false;
    this.validaMunicipio = true;
    this.msgs = [];
  }

  onShowMunicipioForm() {
    this.btnIncluirMunicipio = false;
  }

  incluirRegiao() {
    const cid = this.formCadAlterar.get('reg_nome').value;
    if (cid && cid.length > 2) {
      this.cr.mostraCarregador();
      this.sub.push(this.auxService.incluir('regiao', 'regiao_nome', cid, 50)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.novoRegiao = dados;
          },
          error: err => {
            this.cr.escondeCarregador();
            console.error('FE-incluirRegiao-ERRO-->', err);
          },
          complete: () => {
            this.cr.escondeCarregador();
            if (this.novoRegiao[0]) {
              const nm: SelectItem = {
                label: cid.toUpperCase(),
                value: this.novoRegiao[1]
              };
              this.messageService.add({key: 'regiaoToast', severity: 'success', summary: 'INCLUIR REGIÃO', detail: this.resp[2]});
              this.ddRegiaoId.push(nm);
              this.formCadAlterar.get('cadastro_regiao_id').patchValue(nm.value);
              this.formCadAlterar.get('reg_nome').patchValue(null);
              this.fechaRegiaoForm();
            } else {
              this.messageService.add({severity: 'warn', summary: 'ATENÇÃO - ', detail: this.novoRegiao[2]});
              this.mostraBtnIncluirRegiao();
            }
          }
        }));
    }
  }

  mostraBtnIncluirRegiao() {
    const cid = this.formCadAlterar.get('reg_nome').value;
    this.btnIncluirRegiao = cid && cid.length > 2;
  }

  mostraRegiaoForm(regiao: string = null) {
    this.formCadAlterar.disable();
    this.regiaoForm = true;
    if (regiao) {
      this.formCadAlterar.get('reg_nome').patchValue(regiao);
    }
    this.formCadAlterar.get('reg_nome').enable();
  }

  fechaRegiaoForm() {
    this.formCadAlterar.get('reg_nome').patchValue(null);
    this.formCadAlterar.get('reg_nome').disable();
    this.regiaoForm = false;
    this.formCadAlterar.enable();
    this.msgs = [];
  }

  fechaNomeDuplicado() {
    this.formCadAlterar.enable();
    this.validaNome = true;
    this.nomeDuplicado = false;
  }

  abreNomeDuplicado() {
    this.nomeDuplicado = true;
    this.formCadAlterar.enable();
  }

  verificaDuplicados(event) {
    this.numeroDuplicado = 0;
    const nome = this.formCadAlterar.get('cadastro_nome').value;
    if (nome && nome.length > 3) {
      this.op.show(event);
      this.formCadAlterar.disable();
      this.nomeBusca = nome;
      this.cs.busca_Nome = nome;
      this.sub.push(this.cs.contaNomeDuplicado(nome)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.numeroDuplicado = dados['num'];
          },
          error: (erro) => {
            this.formCadAlterar.enable();
            this.op.hide();
          },
          complete: () => {
            this.op.hide();
            this.validaNome = true;
            if (this.numeroDuplicado > 0) {
              this.carregaDuplicados();
            } else {
              this.formCadAlterar.enable();
            }
            return this.numeroDuplicado;
          }
        }));
    } else {
      this.validaNome = true;
    }
  }

  mudaSituacao(campo: string) {
    switch (campo) {
      case 'cadastro_tratamento_id' : {
        this.validaTratamento = true;
        break;
      }
      case 'cadastro_nome' : {
        this.validaNome = true;
        break;
      }
      case 'cadastro_regiao_id' : {
        this.validaRegiao = true;
        break;
      }
      case 'cadastro_municipio_id' : {
        this.validaMunicipio = true;
        break;
      }
      case 'cadastro_estado_id' : {
        this.validaEstado = true;
        break;
      }
    }
  }

  validaAsync(campo: string, situacao: boolean) {
    return (
      !this.formCadAlterar.get(campo).valid &&
      (this.formCadAlterar.get(campo).touched || this.formCadAlterar.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'has-error': this.validaAsync(campo, situacao),
      'has-feedback': this.validaAsync(campo, situacao)
    };
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

  verificaValidTouched(campo: string) {
    return (
      !this.formCadAlterar.get(campo).valid &&
      (this.formCadAlterar.get(campo).touched || this.formCadAlterar.get(campo).dirty)
    );
  }

  verificaRequired(campo: string) {
    return (
      this.formCadAlterar.get(campo).hasError('required') &&
      (this.formCadAlterar.get(campo).touched || this.formCadAlterar.get(campo).dirty)
    );
  }

  validaEmail(campo) {
    return (
      !this.formCadAlterar.get(campo).valid &&
      this.formCadAlterar.get(campo).touched &&
      this.formCadAlterar.get(campo).dirty
    );
  }

  aplicaCssErroEmail(campo: string) {
    if (this.ativaValidacao) {
      return {
        'has-error': this.validaEmail(campo),
        'has-feedback': this.validaEmail(campo)
      };
    } else {
      return null;
    }
  }

  aplicaCssErro(campo: string) {
    if (this.ativaValidacao) {
      return {
        'has-error': this.verificaValidTouched(campo),
        'has-feedback': this.verificaValidTouched(campo)
      };
    } else {
      return null;
    }
  }

  carregaDuplicados() {
    this.sub.push(this.cs.procurarCadastroDuplicado(this.cs.busca_Nome)
      .pipe(take(1))
      .subscribe(dados => this.cad = dados,
        ( err ) => console.error(err),
        () => {
          this.cs.duplicados = this.cad;
          this.abreNomeDuplicado();
        }));
  }

  criaCadastro() {
    this.cs.cadastro = this.formCadAlterar.getRawValue();
    for (const chave in this.cs.cadastro) {
      if (this.cs.cadastro[chave] === null) {
        delete this.cs.cadastro[chave];
      }
    }
  }

  resetForm() {
    this.validaTratamento = false;
    this.validaNome = false;
    this.validaMunicipio = false;
    this.validaRegiao = false;
    this.validaEstado = false;
    this.formCadAlterar.reset();
    this.formCadAlterar.disable();
    this.formCadAlterar.get('cadastro_tipo_id').enable();
    window.scrollTo(0, 0);
  }

  enviarCadastro() {
    this.botaoEnviarVF = true;
    this.disableSubmit = true;
    this.validaTratamento = true;
    this.validaNome = true;
    this.validaMunicipio = true;
    this.validaRegiao = true;
    this.validaEstado = true;
    if (this.formCadAlterar.valid) {
      this.cr.mostraCarregador();
      this.criaCadastro();
      this.sub.push(this.cs.alterarCadastro(this.cs.cadastro)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => {
            this.cr.escondeCarregador();
            console.error(err.toString());
            this.messageService.add({key: 'cadastroToast', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
            this.botaoEnviarVF = false;
            this.disableSubmit = false;
          },
          complete: () => {
            if (this.resp[0]) {
              this.envioSucesso = true;
              if (sessionStorage.getItem('dropdown-cadastro')) {
                sessionStorage.removeItem('dropdown-cadastro');
              }
              this.messageService.add({key: 'cadastroToast', severity: 'success', summary: 'ALTERAR CADASTRO', detail: this.resp[2]});
              this.cs.resetCadastro();
            } else {
              this.cr.escondeCarregador();
              this.botaoEnviarVF = false;
              this.disableSubmit = false;
              console.error('ERRO - ALTERAR ', this.resp[2]);
              this.messageService.add({key: 'cadastroToast', severity: 'warn', summary: 'ATENÇÃO - ERRO', detail: this.resp[2]});
            }
          }
        }));
    } else {
      this.botaoEnviarVF = false;
      this.disableSubmit = false;
      this.verificaValidacoesForm(this.formCadAlterar);
    }
  }

  voltarListar(ev?: any) {
    // this.router.navigate(['/cadastro/listar/busca']);
    if (this.envioSucesso) {
      this.zone.run(() => {
        this.router.navigate(['/cadastro/listar/busca']);
      });
    } else {
      this.router.navigate(['/cadastro/listar/busca']);
    }
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => {
      s.unsubscribe();
    });
  }
}

