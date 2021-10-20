import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Location} from '@angular/common';
import {catchError, take, takeLast} from 'rxjs/operators';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {CEPError, Endereco, CEPErrorCode, NgxViacepService} from '@brunoc/ngx-viacep';
import {Message, MessageService, SelectItem, SelectItemGroup} from 'primeng/api';

import {WindowsService} from '../../_layout/_service';
import {AutocompleteService, CepService, DropdownService, MostraMenuService} from '../../_services';
import {CadastroService} from '../_services';
import {CadastroDuplicadoBuscaInterface} from '../_models';
import {DropdownnomeidClass, DropdownsonomearrayClass} from '../../_models';
import {MunicipioService} from '../../municipio/_services/municipio.service';
import {AuthenticationService, CarregadorService, IncluirAuxService} from '../../_services';

@Component({
  selector: 'app-cadastro-incluir',
  templateUrl: './cadastro-incluir.component.html',
  styleUrls: ['./cadastro-incluir.component.css'],
  providers: [MessageService]
})

export class CadastroIncluirComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('op', { static: true }) public op: any;
  formCadIncluir: FormGroup;
  ddTipoCadastroId: SelectItemGroup[] = [];
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
  mostraCampo4 = false;
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
  public cad: CadastroDuplicadoBuscaInterface[];
  altura = (WindowsService.altura - 150) + 'px';
  block = true;
  moduloAnterior = '';
  id: number;
  nome: string;
  tipo_id: number;
  sub: Subscription[] = [];
  carregamento = 0;

  botaoEnviarVF = false;
  arquivoDesativado = true;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  // private espera = new Subject<number>();

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public mm: MostraMenuService,
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
    private activatedRoute: ActivatedRoute,
    private cr: CarregadorService,
    public authenticationService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.params['modulo']) {
      this.moduloAnterior = this.activatedRoute.snapshot.params['modulo'];
    }
    // this.carregaDropDown();
    this.carregaDropdownSessionStorage();
    this.criaForm();
    this.configuraCalendario();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cr.escondeCarregador();
      this.mm.mudaMenu(false);
    }, 500);

    /*if (this.carregamento < 3) {
      this.sub.push(this.espera.subscribe((v) => {
        if (v === 3) {
          this.cr.escondeCarregador();
          this.mm.mudaMenu(false);
        }
      }));
    } else {
      setTimeout(() => {
        this.cr.escondeCarregador();
        this.mm.mudaMenu(false);
      }, 500);
    }*/
  }

  // ***     FORMULARIO      *************************
  criaForm() {
    this.formCadIncluir = this.formBuilder.group({
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
    this.formCadIncluir.disable();
    this.formCadIncluir.get('cadastro_tipo_id').enable();
  }

  carregaDropDown() {
      // ***     Tipo Cadastro      *************************
    if (!sessionStorage.getItem('dropdown-tipo_cadastro')) {
      const tpcad: SelectItemGroup[] = [];
      const a = [1, 2];
      let tipo: SelectItemGroup;
      let c = 0;
      for (const b of a) {
        c++;
        this.sub.push(this.dd.getDropdown3campos(
          'cadastro',
          'cadastro_tipo',
          'cadastro_tipo_nome',
          'cadastro_tipo_tipo',
          String(b)
          ).pipe(take(1))
            .subscribe({
              next: (dados) => {
                tipo = {
                  label: dados['label'].toString(),
                  value: null,
                  items: dados['items']
                };
                tpcad.push(tipo);
              },
              error: (err) => {
                console.error(err);
              },
              complete: () => {
                this.ddTipoCadastroId.push(tipo);
                this.carregamento++;
                // this.espera.next(this.carregamento);
                if (c === 2) {
                  sessionStorage.setItem('dropdown-tipo_cadastro', JSON.stringify(tpcad));
                }
              }
            })
        );
      }
    } else {
      this.ddTipoCadastroId = JSON.parse(sessionStorage.getItem('dropdown-tipo_cadastro'));
      this.carregamento++;
      this.carregamento++;
      // this.espera.next(this.carregamento);
    }
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
    this.carregamento++;
    // this.espera.next(this.carregamento);
  }

  onSubmit() {
  }

  consultaCEP(event) {
    if (this.formCadIncluir.get('cadastro_cep').value != null) {
      let cep = this.formCadIncluir.get('cadastro_cep').value;
      cep = cep.replace(/\D/g, '');
      // Verifica se campo cep possui valor informado.
      if (cep !== '') {
        // Expressão regular para validar o CEP.
        const validacep = /^[0-9]{8}$/;
        // Valida o formato do CEP.
        if (validacep.test(cep)) {
          // this.resetaDadosForm();
          this.op.show(event);
          /*this.viacep.buscarPorCep(cep).then((endereco: Endereco) => {
            // Endereço retornado :)
            this.populaEnderecoForm(endereco);
            this.op.hide();
          }).catch((error: ErroCep) => {
            // Alguma coisa deu errado :/
            if (error.message === 'CEP_NAO_ENCONTRADO') {
              this.messageService.add({key: 'cepToast', severity: 'warn', summary: 'ATENÇÃO', detail: 'CEP NÃO ENCONTADOR'});
            }
            this.op.hide();
          });*/
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
        this.formCadIncluir.get('cadastro_estado_id').patchValue(st.value);
      }
      this.cs.cadastro.cadastro_endereco = endereco.logradouro;
      this.formCadIncluir.get('cadastro_endereco').patchValue(endereco.logradouro);
      this.cs.cadastro.cadastro_bairro = endereco.bairro;
      this.formCadIncluir.get('cadastro_bairro').patchValue(endereco.bairro);
      const mun = this.achaValor(this.ddMunicipioId, endereco.localidade.toUpperCase());
      if (mun) {
        this.cs.cadastro.cadastro_municipio_id = mun.value;
        this.formCadIncluir.get('cadastro_municipio_id').patchValue(mun.value);
      } else {
        this.formCadIncluir.get('cadastro_estado_id').disable();
        this.formCadIncluir.get('cadastro_endereco').disable();
        this.formCadIncluir.get('cadastro_bairro').disable();
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

  mudaTipo (event) {
    const a: SelectItem = this.achaTipo(this.ddTipoCadastroId, event.value);
    this.tipotipo = Number(a.title);
    this.block = false;
    this.formCadIncluir.enable();
    this.arquivoDesativado = false;
  }

  autoComp(event, campo) {
    let sg: any[];
    const tabela = campo.substring(0, campo.indexOf('_'));
    this.autocompleteservice.getACSimples(tabela, campo, event.query)
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

  incluirMunicipio() {
    const cid = this.formCadIncluir.get('mun_nome').value;
    if (cid && cid.length > 2) {
      this.cr.mostraCarregador();
      this.sub.push(this.auxService.incluir('municipio', 'municipio_nome', cid, 50)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.novoMunicipio = dados;
          },
          error: err => {
            console.error('FE-incluirMunicipio-ERRO-->', err);
            this.cr.escondeCarregador();
          },
          complete: () => {
            if (this.novoMunicipio[0]) {
              const nm: SelectItem = {
                label: cid.toUpperCase(),
                value: this.novoMunicipio[1]
              };
              this.messageService.add(
                {
                  key: 'municipioToast',
                  severity: 'success',
                  summary: 'INCLUIR MUNICÍPIO',
                  detail: this.novoMunicipio[2]
                });
              this.ddMunicipioId.push(nm);
              this.formCadIncluir.get('cadastro_municipio_id').patchValue(nm.value);
              this.formCadIncluir.get('mun_nome').patchValue(null);
              this.btnIncluirMunicipio = false;
              this.fechaMunicipioForm();
            } else {
              this.messageService.add({key: 'municipioToast', severity: 'warn', summary: 'ATENÇÃO - ', detail: this.novoMunicipio[2]});
              this.mostraBtnIncluirMunicipio();
            }
            this.cr.escondeCarregador();
          }
        }));
    } else {
      this.validaMunicipio = true;
    }
  }

  mostraBtnIncluirMunicipio() {
    const cid = this.formCadIncluir.get('mun_nome').value;
    this.btnIncluirMunicipio = cid && cid.length > 2;
  }

  mostraMunicipioForm(cidade: string = null) {
    this.formCadIncluir.disable();
    this.municipioForm = true;
    if (cidade) {
      this.formCadIncluir.get('mun_nome').patchValue(cidade);
    } else {
      this.formCadIncluir.get('mun_nome').patchValue(null);
    }
    this.formCadIncluir.get('mun_nome').enable();
  }

  fechaMunicipioForm() {
    this.formCadIncluir.enable();
    this.formCadIncluir.get('mun_nome').patchValue(null);
    this.formCadIncluir.get('mun_nome').disable();
    this.btnIncluirMunicipio = false;
    this.municipioForm = false;
    this.validaMunicipio = true;
    this.msgs = [];
  }

  onShowMunicipioForm() {
    this.btnIncluirMunicipio = false;
  }

  incluirRegiao() {
    const cid = this.formCadIncluir.get('reg_nome').value;
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
            if (this.novoRegiao[0]) {
              const nm: SelectItem = {
                label: cid.toUpperCase(),
                value: this.novoRegiao[1]
              };
              this.messageService.add({key: 'regiaoToast', severity: 'success', summary: 'INCLUIR REGIÃO', detail: this.novoRegiao[2]});
              this.ddRegiaoId.push(nm);
              this.formCadIncluir.get('cadastro_regiao_id').patchValue(nm.value);
              this.formCadIncluir.get('reg_nome').patchValue(null);
              this.fechaRegiaoForm();
            } else {
              this.messageService.add({severity: 'warn', summary: 'ATENÇÃO - ', detail: this.novoRegiao[2]});
              this.mostraBtnIncluirRegiao();
            }
            this.cr.escondeCarregador();
          }
        }));
    }
  }

  mostraBtnIncluirRegiao() {
    const cid = this.formCadIncluir.get('reg_nome').value;
    this.btnIncluirRegiao = cid && cid.length > 2;
  }

  mostraRegiaoForm(regiao: string = null) {
    this.formCadIncluir.disable();
    this.regiaoForm = true;
    if (regiao) {
      this.formCadIncluir.get('reg_nome').patchValue(regiao);
    }
    this.formCadIncluir.get('reg_nome').enable();
  }

  fechaRegiaoForm() {
    this.formCadIncluir.get('reg_nome').patchValue(null);
    this.formCadIncluir.get('reg_nome').disable();
    this.regiaoForm = false;
    this.formCadIncluir.enable();
    this.msgs = [];
  }

  verificaDuplicados(event) {
    this.validaNome = false;
    this.numeroDuplicado = 0;
    const nome = this.formCadIncluir.get('cadastro_nome').value;
    if (nome && nome.length > 3) {
      this.op.show(event);
      this.formCadIncluir.disable();
      this.nomeBusca = nome;
      this.cs.busca_Nome = nome;
      this.sub.push(this.cs.contaNomeDuplicado(nome)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.numeroDuplicado = dados['num'];
          },
          error: (erro) => {
            console.error(erro.toString());
            this.formCadIncluir.enable();
            this.op.hide();
          },
          complete: () => {
            if (this.numeroDuplicado > 0) {
              this.carregaDuplicados();
            } else {
              this.op.hide();
              this.formCadIncluir.enable();
              this.validaNome = true;
            }
            return this.numeroDuplicado;
          }
        }));
    } else {
      this.validaNome = true;
    }
  }

  fechaNomeDuplicado() {
    this.nomeDuplicado = false;
    this.formCadIncluir.enable();
    this.validaNome = true;
  }

  abreNomeDuplicado() {
    this.op.hide();
    this.nomeDuplicado = true;
  }

  carregaDuplicados() {
    this.sub.push(this.cs.procurarCadastroDuplicado(this.cs.busca_Nome)
      .pipe(take(1))
      .subscribe(dados => this.cad = dados,
        (error) => console.error(error.toString()),
        () => {
          this.cs.duplicados = this.cad;
          this.abreNomeDuplicado();
        }));
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
      !this.formCadIncluir.get(campo).valid &&
      (this.formCadIncluir.get(campo).touched || this.formCadIncluir.get(campo).dirty) &&
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
      !this.formCadIncluir.get(campo).valid &&
      (this.formCadIncluir.get(campo).touched || this.formCadIncluir.get(campo).dirty)
    );
  }

  verificaRequired(campo: string) {
    return (
      this.formCadIncluir.get(campo).hasError('required') &&
      (this.formCadIncluir.get(campo).touched || this.formCadIncluir.get(campo).dirty)
    );
  }

  validaEmail(campo) {
    return (
      !this.formCadIncluir.get(campo).valid &&
      this.formCadIncluir.get(campo).touched &&
      this.formCadIncluir.get(campo).dirty
    );
  }

  aplicaCssErroEmail(campo: string) {
    return {
      'has-error': this.validaEmail(campo),
      'has-feedback': this.validaEmail(campo)
    };
  }

  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
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

  criaCadastro() {
    this.cs.cadastro = this.formCadIncluir.getRawValue();
    for (const chave in this.cs.cadastro) {
      if (this.cs.cadastro[chave] === null) {
        delete this.cs.cadastro[chave];
      }
    }
  }

  resetForm() {
    this.arquivo_registro_id = 0;
    this.arquivoDesativado = true;
    this.enviarArquivos = false;
    this.validaTratamento = false;
    this.validaNome = false;
    this.validaMunicipio = false;
    this.validaRegiao = false;
    this.validaEstado = false;
    this.clearArquivos = true;
    this.possuiArquivos = false;
    this.formCadIncluir.reset();
    this.formCadIncluir.disable();
    this.formCadIncluir.get('cadastro_tipo_id').enable();
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
    if (this.formCadIncluir.valid) {
      this.arquivoDesativado = true;
      this.criaCadastro();
      this.cr.mostraCarregador();
      this.sub.push(this.cs.incluirCadastro(this.cs.cadastro)
        .pipe(takeLast(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => {
            this.cr.escondeCarregador();
            console.error(err.toString());
            this.messageService.add({key: 'cadastroToast', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
            this.botaoEnviarVF = false;
            this.disableSubmit = false;
          },
          complete: () => {
            if (this.resp[0]) {
              if (sessionStorage.getItem('cadastro-dropdown')) {
                sessionStorage.removeItem('cadastro-dropdown');
              }
              if (this.possuiArquivos) {
                this.arquivo_registro_id = +this.resp[1];
                this.enviarArquivos = true;
              } else {
                this.cr.escondeCarregador();
                this.messageService.add({ key: 'cadastroToast', severity: 'success', summary: 'INCLUIR CADASTRO', detail: this.resp[2] });
                if (this.moduloAnterior !== '') {
                  this.id = +this.resp[1];
                  this.nome = this.cs.cadastro.cadastro_nome;
                  this.tipo_id = this.cs.cadastro.cadastro_tipo_id;
                }
                this.arquivo_registro_id = 0;
                this.cs.resetCadastro();
                this.resetForm();
                this.botaoEnviarVF = false;
                this.disableSubmit = false;
                if (this.moduloAnterior !== '') {
                  this.voltarModulo();
                }
              }
            } else {
              this.cr.escondeCarregador();
              this.botaoEnviarVF = false;
              this.disableSubmit = false;
              console.error('ERRO - INCLUIR ', this.resp[2]);
              this.messageService.add({key: 'cadastroToast', severity: 'warn', summary: 'ATENÇÃO - ERRO', detail: this.resp[2]});
            }
          }
        }));
    } else {
      this.botaoEnviarVF = false;
      this.disableSubmit = false;
      this.verificaValidacoesForm(this.formCadIncluir);
    }
  }

  onUpload(ev) {
    this.arquivo_registro_id = 0;
    this.cr.escondeCarregador();
    this.messageService.add({ key: 'cadastroToast', severity: 'success', summary: 'INCLUIR CADASTRO', detail: this.resp[2] });
    if (this.moduloAnterior !== '') {
      this.id = +this.resp[1];
      this.nome = this.cs.cadastro.cadastro_nome;
      this.tipo_id = this.cs.cadastro.cadastro_tipo_id;
    }
    this.cs.resetCadastro();
    this.resetForm();
    this.botaoEnviarVF = false;
    this.disableSubmit = false;
    if (this.moduloAnterior !== '') {
      this.voltarModulo();
    }
  }

  voltarModulo() {
    this.arquivo_registro_id = 0;
    if (this.moduloAnterior === 'solicitacao') {
      this.router.navigate(['/solicitacao/incluir/cadastro', {tipo: this.tipo_id, value: this.id, label:  this.nome.toUpperCase()}]);
    }
  }

  voltarListar(ev?: any) {
    this.arquivo_registro_id = 0;
    this.router.navigate(['/cadastro/listar/busca']);
  }

  ngOnDestroy(): void {
    this.arquivo_registro_id = 0;
    this.arquivoDesativado = true;
    this.enviarArquivos = false;
    this.clearArquivos = true;
    this.possuiArquivos = false;
    this.sub.forEach(s => s.unsubscribe());
    // this.espera.unsubscribe();
  }

  onBlockSubmit(ev: boolean) {
    this.disableSubmit = ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onInicioEnvio() {
    // this.cr.escondeCarregador();
  }
}

