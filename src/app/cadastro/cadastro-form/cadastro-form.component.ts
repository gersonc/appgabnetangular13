import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DdService} from "../../_services/dd.service";
import {AuthenticationService, AutocompleteService, MenuInternoService} from "../../_services";
import {ActivatedRoute, Router} from "@angular/router";
import {MsgService} from "../../_services/msg.service";
import {CadastroFormService} from "../_services/cadastro-form.service";
import {EMPTY, Subscription} from "rxjs";
import {CpoEditor} from "../../_models/in-out-campo-texto";
import Quill from "quill";
import {SelectItem, SelectItemGroup} from "primeng/api";
import {CadastroDuplicadoI} from "../_models/cadastro-duplicado-i";
import {WindowsService} from "../../_layout/_service";
import { take } from "rxjs/operators";

import {CadastroService} from "../_services/cadastro.service";
import {CadastroFormI} from "../_models/cadastro-form-i";
import {DateTime} from "luxon";
import {ArquivoInterface} from "../../arquivo/_models";
import {CadastroI} from "../_models/cadastro-i";
import {CadastroDropdownMenuService} from "../_services/cadastro-dropdown-menu.service";
import { ThemeService } from "../../_services/theme.service";
import { ViacepService } from "../../shared/viacep/viacep.service";
import { Endereco } from "../../shared/viacep/model/endereco";


@Component({
  selector: 'app-cadastro-form',
  templateUrl: './cadastro-form.component.html',
  styleUrls: ['./cadastro-form.component.css']
})
export class CadastroFormComponent implements OnInit, OnDestroy {
  formCadastro: FormGroup;
  municipio: any;
  regiao: any;
  tipotipo = 1;
  resp: any[] = [];
  sub: Subscription[] = [];
  mostraForm = true;
  disableSubmit = false;
  botaoEnviarVF = false;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  lazy = false;
  titulo = 'CADASTRO';

  ddTipoCadastroId: SelectItemGroup[] = [];
  ddTratamentoId: SelectItem[] = [];
  ddGrupoId: SelectItem[] = [];
  ddMunicipioId: SelectItem[] = [];
  ddEstadoId: SelectItem[] = [];
  ddRegiaoId: SelectItem[] = [];
  ddEscolaridadeId: SelectItem[] = [];
  ddEstadoCivilId: SelectItem[] = [];
  ddSexo: SelectItem[] = [];
  ddCampo4Id: SelectItem[] = [];

  cad: CadastroDuplicadoI[] = [];
  altura = (WindowsService.altura - 150) + 'px';
  block = true;

  mostraEnderecos = false;
  ddEnderecos: Endereco[] = [];
  endereco: Endereco | null = null;
  novoValor?: string | null = null;

  nomeDuplicado = false;
  validaTratamento = false;
  validaNome = false;
  validaMunicipio = false;
  validaRegiao = false;
  validaEstado = false;

  abrevO: string[] = [
    "AL ",
    "AL. ",
    "AV ",
    "AV. ",
    "BC ",
    "BC. ",
    "BLV ",
    "BLV. ",
    "CD ",
    "CD. ",
    "COND. ",
    "ED ",
    "ED. ",
    "EDIF. ",
    "EST ",
    "EST. ",
    "GJ ",
    "GJ. ",
    "JD ",
    "JD. ",
    "LG ",
    "LG. ",
    "LOT ",
    "LOT. ",
    "PC ",
    "PC. ",
    "PQ ",
    "PQ. ",
    "QD ",
    "QD. ",
    "R ",
    "R. ",
    "ROD ",
    "ROD. ",
    "SERV ",
    "SERV. ",
    "ST ",
    "ST. ",
    "TV ",
    "TV. ",
    "VL ",
    "VL. "
  ];
  abrevD: string[] = [
    "ALAMEDA ",
    "ALAMEDA ",
    "AVENIDA ",
    "AVENIDA ",
    "BECO ",
    "BECO ",
    'BOULEVARD ',
    'BOULEVARD ',
    "CONDOMÍNIO ",
    "CONDOMÍNIO ",
    "CONDOMÍNIO ",
    "EDIFÍCIO ",
    "EDIFÍCIO ",
    "EDIFÍCIO ",
    "ESTRADA ",
    "ESTRADA ",
    "GRANJA ",
    "GRANJA ",
    "JARDIM ",
    "JARDIM ",
    "LARGO ",
    "LARGO ",
    "LOTEAMENTO ",
    "LOTEAMENTO ",
    "PRAÇA ",
    "PRAÇA ",
    "PARQUE ",
    "PARQUE ",
    "QUADRA ",
    "QUADRA ",
    "RUA ",
    "RUA ",
    "RODOVIA ",
    "RODOVIA ",
    "SERVIDÃO ",
    "SERVIDÃO ",
    "SETOR ",
    "SETOR ",
    "TRAVESSA ",
    "TRAVESSA ",
    "VILA ",
    "VILA "
  ];

  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  format1: 'html' | 'object' | 'text' | 'json' = 'html';
  kill0: Quill;
  kill1: Quill;
  cpoEditor: CpoEditor[] | null = [];
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

  arquivos: ArquivoInterface[] = [];

  constructor(
    public formBuilder: FormBuilder,
    // private dd: DdService,
    private ddc: CadastroDropdownMenuService,
    public mi: MenuInternoService,
    private autocompleteservice: AutocompleteService,
    public aut: AuthenticationService,
    public cfs: CadastroFormService,
    public cs: CadastroService,
    private router: Router,
    private ms: MsgService,
    private viacep: ViacepService,
    private th: ThemeService
  ) {
  }

  ngOnInit(): void {
    if (this.cfs.acao === 'incluir') {
      this.titulo = 'CADASTRO - INCLUIR';
    } else {
      this.titulo = 'CADASTRO - ALTERAR';
    }
    if (this.cfs.acao === 'alterar') {
      this.tipotipo = +this.cfs.cadastroListar.cadastro_tipo_tipo;
    }
    this.carregaDropdownSessionStorage();
    this.criaForm();
    this.ms.fundoSN(true);
  }

  criaForm() {
    this.formCadastro = this.formBuilder.group({
      cadastro_tipo_id: [this.cfs.cadastro.cadastro_tipo_id, Validators.required],
      cadastro_tratamento_id: [this.cfs.cadastro.cadastro_tratamento_id, Validators.required],
      cadastro_nome: [this.cfs.cadastro.cadastro_nome, [Validators.required, Validators.minLength(2)]],
      cadastro_apelido: [this.cfs.cadastro.cadastro_apelido],
      cadastro_sigla: [this.cfs.cadastro.cadastro_sigla],
      cadastro_responsavel: [this.cfs.cadastro.cadastro_responsavel],
      cadastro_cargo: [this.cfs.cadastro.cadastro_cargo],
      cadastro_grupo_id: [this.cfs.cadastro.cadastro_grupo_id],
      cadastro_endereco: [this.cfs.cadastro.cadastro_endereco],
      cadastro_endereco_numero: [this.cfs.cadastro.cadastro_endereco_numero],
      cadastro_endereco_complemento: [this.cfs.cadastro.cadastro_endereco_complemento],
      cadastro_bairro: [this.cfs.cadastro.cadastro_bairro],
      cadastro_municipio_id: [this.cfs.cadastro.cadastro_municipio_id, Validators.required],
      cadastro_cep: [this.cfs.cadastro.cadastro_cep],
      cadastro_estado_id: [this.cfs.cadastro.cadastro_estado_id, Validators.required],
      cadastro_telefone: [this.cfs.cadastro.cadastro_telefone],
      cadastro_telcom: [this.cfs.cadastro.cadastro_telcom],
      cadastro_telefone2: [this.cfs.cadastro.cadastro_telefone2],
      cadastro_celular: [this.cfs.cadastro.cadastro_celular],
      cadastro_celular2: [this.cfs.cadastro.cadastro_celular2],
      cadastro_fax: [this.cfs.cadastro.cadastro_fax],
      cadastro_email: [this.cfs.cadastro.cadastro_email, Validators.email],
      cadastro_email2: [this.cfs.cadastro.cadastro_email2, Validators.email],
      cadastro_rede_social: [this.cfs.cadastro.cadastro_rede_social],
      cadastro_outras_midias: [this.cfs.cadastro.cadastro_outras_midias],
      cadastro_cpfcnpj: [this.cfs.cadastro.cadastro_cpfcnpj],
      cadastro_rg: [this.cfs.cadastro.cadastro_rg],
      cadastro_estado_civil_id: [this.cfs.cadastro.cadastro_estado_civil_id],
      cadastro_data_nascimento: [this.cfs.cadastro.cadastro_data_nascimento],
      cadastro_conjuge: [this.cfs.cadastro.cadastro_conjuge],
      cadastro_escolaridade_id: [this.cfs.cadastro.cadastro_escolaridade_id],
      cadastro_profissao: [this.cfs.cadastro.cadastro_profissao],
      cadastro_sexo: [this.cfs.cadastro.cadastro_sexo],
      cadastro_zona: [this.cfs.cadastro.cadastro_zona],
      cadastro_jornal: [this.cfs.cadastro.cadastro_jornal],
      cadastro_mala: [this.cfs.cadastro.cadastro_mala],
      cadastro_agenda: [this.cfs.cadastro.cadastro_agenda],
      cadastro_sigilo: [this.cfs.cadastro.cadastro_sigilo],
      cadastro_campo1: [this.cfs.cadastro.cadastro_campo1],
      cadastro_campo2: [this.cfs.cadastro.cadastro_campo2],
      cadastro_campo3: [this.cfs.cadastro.cadastro_campo3],
      cadastro_campo4_id: [this.cfs.cadastro.cadastro_campo4_id],
      cadastro_observacao: [this.cfs.cadastro.cadastro_observacao],
      cadastro_regiao_id: [this.cfs.cadastro.cadastro_regiao_id],
    });
    if (this.cfs.acao === 'incluir') {
      this.formCadastro.disable();
      this.formCadastro.get('cadastro_tipo_id').enable();
    }
  }

  onEditorCreated(ev) {
    this.kill0 = ev;
    this.kill0.update('user');
  }

  carregaDropdownSessionStorage() {
    this.ddTipoCadastroId = JSON.parse(sessionStorage.getItem('dropdown-tipo_cadastro'));
    this.ddTratamentoId = JSON.parse(sessionStorage.getItem('dropdown-tratamento'));
    this.ddGrupoId = JSON.parse(sessionStorage.getItem('dropdown-grupo'));
    this.ddMunicipioId = JSON.parse(sessionStorage.getItem('dropdown-municipio'));
    this.ddEstadoId = JSON.parse(sessionStorage.getItem('dropdown-estado'));
    this.ddRegiaoId = JSON.parse(sessionStorage.getItem('dropdown-regiao'));
    this.ddEscolaridadeId = JSON.parse(sessionStorage.getItem('dropdown-escolaridade'));
    this.ddEstadoCivilId = JSON.parse(sessionStorage.getItem('dropdown-estado_civil'));
    this.ddSexo = JSON.parse(sessionStorage.getItem('dropdown-sexo'));
    this.ddCampo4Id = JSON.parse(sessionStorage.getItem('dropdown-campo4'));
    // this.espera.next(this.carregamento);
  }


  consultaCEP(ev) {
    const cep: string = '' + this.testaCep();
    const end: string[] = this.testaEndereco();
    if (cep !== '0') {
      this.buscaCEP(cep);
    } else {
      if (end.length === 3) {
        this.consultaEndereco(end);
      }
    }
  }


  buscaCEP(cep) {
    let e: Endereco = {};
    let erro = false;
    this.sub.push(this.viacep.buscarPorCep(cep).pipe(take(1)).subscribe({
      next: data => {
        e = data;
        if (e.uf === undefined || (e.erro !== undefined && e.erro === true)) {
          erro = true;
          if(e.erromsg === undefined) {
            e.erromsg = 'NENHUM ENDEREÇO ENCONTRADO.';
          }
        }
      },
      error: err => {
        console.log('ERRRO');
      },
      complete: () => {
        if (erro) {
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO CEP', detail: e.erromsg});
        } else {
          this.populaEnderecoForm(e);
        }
      }
    }));
  }

  consultaEndereco(end: string[]) {
    let e: Endereco[] = [];
    let erro = false;
    this.sub.push(this.viacep.buscarPorEndereco(end[0], end[1], end[2]).pipe(take(1)).subscribe({
      next: (data: Endereco[]) => {
        console.log(data);
        e.push(...data);
        if (e[0].erro !== undefined && e[0].erro === true) {
          erro = true;
          if(e[0].erromsg === undefined) {
            e[0].erromsg = 'NENHUM ENDEREÇO ENCONTRADO.';
          }
        }
      },
      error: err => {
        console.log('ERRRO');
      },
      complete: () => {
        if (erro) {
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ENDEREÇO', detail: e[0].erromsg});
        } else {
          if (e.length > 1) {
            this.escolheEnderecos(e);
          } else {
            this.populaEnderecoForm(e[0]);
          }
        }
      }
    }));
  }

  populaEnderecoForm(endereco: Endereco = null) {
    this.ddEnderecos = null;
    this.mostraEnderecos = false;
    this.endereco = null;
    if (endereco) {
      const st = this.achaValor(this.ddEstadoId, endereco.uf);
      if (st) {
        this.formCadastro.get('cadastro_estado_id').patchValue(st.value);
      }
      this.formCadastro.get('cadastro_endereco').patchValue(endereco.logradouro.toUpperCase());
      this.formCadastro.get('cadastro_bairro').patchValue(endereco.bairro.toUpperCase());
      this.formCadastro.get('cadastro_cep').patchValue(endereco.cep);
      const validacomplemento = /^[0-9]/;
      if (validacomplemento.test(endereco.complemento)) {
        this.formCadastro.get('cadastro_endereco_numero').patchValue(endereco.complemento);
      }
      const mun = this.achaValor(this.ddMunicipioId, endereco.localidade.toUpperCase());
      if (mun) {
        this.formCadastro.get('cadastro_municipio_id').patchValue(mun.value);
      } else {
        this.novoValor = endereco.localidade.toUpperCase();
      }

    }
  }

  escolheEnderecos(enderecos: Endereco[]) {
    this.ddEnderecos = enderecos;
    this.mostraEnderecos = true;
  }

  fechaEnderecos() {
    this.ddEnderecos = null;
    this.mostraEnderecos = false;
    this.endereco = null;
  }

  selecionaEndereco() {
    this.populaEnderecoForm(this.endereco);
  }

  testaCep(): string {
    if (this.formCadastro.get('cadastro_cep').value !== null && this.formCadastro.get('cadastro_cep').value.toString().length === 8) {
      let cep = this.formCadastro.get('cadastro_cep').value;
      cep = cep.replace(/\D/g, '');
      if (cep.toString().length === 8) {
        const validacep = /^[0-9]{8}$/;
        if (validacep.test(cep)) {
          return cep;
        } else {
          return '0';
        }
      } else {
        return '0';
      }
    } else {
      return '0';
    }
  }

  testaEndereco(): string[] {
    let uf = '';
    let cidade = '';
    let logradouro = '';
    if (this.formCadastro.get('cadastro_estado_id').value !== null && +this.formCadastro.get('cadastro_estado_id').value > 0) {
      uf = this.achaLabel(this.ddEstadoId, +this.formCadastro.get('cadastro_estado_id').value);
    }
    if (this.formCadastro.get('cadastro_municipio_id').value !== null && +this.formCadastro.get('cadastro_municipio_id').value > 0) {
      cidade = this.achaLabel(this.ddMunicipioId, +this.formCadastro.get('cadastro_municipio_id').value);
    }
    if (this.formCadastro.get('cadastro_endereco').value !== null && +this.formCadastro.get('cadastro_endereco').value.toString().length >= 3) {
      // let e: string  = this.formCadastro.get('cadastro_endereco').value.toUpperCase();
      const e: string = this.getEndereco();
      logradouro = e.replace(/[^a-zA-Z0–9ÀÁÃÂÉÊÍÓÕÔÚÜÇ _]/g, '');
    }
    if (uf !== '' && cidade !== '' && logradouro !== '') {
      return [uf, cidade, logradouro];
    } else {
      return [];
    }
  }

  getEndereco(): string {
    return this.abrevO.reduce((acumulador, valorAtual, index) => acumulador.replace(valorAtual, this.abrevD[index]), this.formCadastro.get('cadastro_endereco').value.toUpperCase());
  }

  ativaCep(): boolean {
    return !(((this.formCadastro.get('cadastro_estado_id').value !== null) &&
        (this.formCadastro.get('cadastro_endereco').value !== null && this.formCadastro.get('cadastro_endereco').value.toString().length > 5) &&
        (this.formCadastro.get('cadastro_municipio_id').value !== null)) ||
      (this.formCadastro.get('cadastro_cep').value !== null && this.formCadastro.get('cadastro_cep').value.toString().length === 8));
  }

  achaValor(arr: SelectItem[], valor): SelectItem {
    return arr.find(function (x) {
      return x.label === valor;
    });
  }

  achaLabel(arr: SelectItem[], valor): string {
    const r: SelectItem = arr.find(function (x) {
      return x.value === valor;
    });
    return r.label;
  }

  onSubmit() {
    this.disableSubmit = true;
    this.botaoEnviarVF = true;
    this.arquivoDesativado = true;
    if (this.verificaValidacoesForm(this.formCadastro)) {
      if (this.cfs.acao === 'incluir') {
        this.incluir(this.criarEnvio());
      }
      if (this.cfs.acao === 'alterar') {
        const c: CadastroFormI = this.criarEnvio();
        if (c.cadastro_id > 0) {
          this.alterar(c);
        } else {
          this.disableSubmit = false;
          this.botaoEnviarVF = false;
          this.arquivoDesativado = false;
        }
      }
    } else {
      this.disableSubmit = false;
      this.botaoEnviarVF = false;
      this.arquivoDesativado = false;
    }
  }

  criarEnvio(): CadastroFormI {
    const c: CadastroFormI = {};
    if (this.cfs.acao === 'incluir') {
      this.cfs.i.forEach((cp) => {
        if (this.formCadastro.get(cp).value !== null) {
          c[cp] = +this.formCadastro.get(cp).value;
        }
      });
      if (c.cadastro_tipo_id !== undefined) {
        c['cadastro_tipo_tipo'] = this.tipotipo;
      }
      this.cfs.s.forEach((cp) => {
        const tmp: string = this.formCadastro.get(cp).value;
        if (tmp !== null && tmp.length > 0) {
          c[cp] = tmp.toUpperCase();
        }
      });
      this.cfs.b.forEach((cp) => {
        if (this.formCadastro.get(cp).value !== null) {
          const tmp: boolean = this.formCadastro.get(cp).value;
          c[cp] = (tmp) ? 1 : 0;
        } else {
          c[cp] = 0;
        }
      });
      if (this.formCadastro.get('cadastro_observacao').value !== null) {
        const tmp: string = this.formCadastro.get('cadastro_observacao').value;
        if (tmp.length > 0) {
          c['cadastro_observacao'] = this.formCadastro.get('cadastro_observacao').value;
          c['cadastro_observacao_delta'] = JSON.stringify(this.kill0.getContents());
          c['cadastro_observacao_texto'] = this.kill0.getText();
        }
      }
      if (this.formCadastro.get('cadastro_data_nascimento').value !== null) {
        const dt: DateTime = DateTime.fromJSDate(this.formCadastro.get('cadastro_data_nascimento').value);
        c['cadastro_data_nascimento'] = dt.toSQLDate();
      }
    }

    if (this.cfs.acao === 'alterar') {
      let ct = 0;
      this.cfs.i.forEach((cp) => {
        if (+this.formCadastro.get(cp).value !== +this.cfs.cadastro[cp]) {
          c[cp] = +this.formCadastro.get(cp).value;
          ct++;
        }
      });
      if (this.tipotipo !== +this.cfs.cadastro.cadastro_tipo_tipo) {
        c['cadastro_tipo_tipo'] = this.tipotipo;
        ct++;
      }
      this.cfs.s.forEach((cp) => {
        let tmp: string | null = this.formCadastro.get(cp).value;
        let tmp2: string | null = this.cfs.cadastro[cp];
        tmp = (tmp !== null) ? tmp.toUpperCase() : null;
        tmp2 = (tmp2 !== null) ? tmp2.toUpperCase() : null;
        if (tmp !== tmp2) {
          ct++;
          c[cp] = tmp;
        }
      });
      this.cfs.b.forEach((cp) => {
        if (this.formCadastro.get(cp).value !== +this.cfs.cadastro[cp]) {
          c[cp] = (this.formCadastro.get(cp).value) ? 1 : 2;
          ct++;
        }
      });
      if (this.formCadastro.get('cadastro_observacao').value !== this.cfs.cadastro.cadastro_observacao) {
        ct++;
        c['cadastro_observacao'] = this.formCadastro.get('cadastro_observacao').value;
        c['cadastro_observacao_delta'] = JSON.stringify(this.kill0.getContents());
        c['cadastro_observacao_texto'] = this.kill0.getText();
      }
      if (this.formCadastro.get('cadastro_data_nascimento').value !== this.cfs.cadastro.cadastro_data_nascimento) {
        const dt: DateTime = DateTime.fromJSDate(this.formCadastro.get('cadastro_data_nascimento').value);
        ct++;
        c['cadastro_data_nascimento'] = dt.toSQLDate();
      }
      if (ct > 0) {
        c.cadastro_id = this.cfs.cadastro.cadastro_id;
      } else {
        c.cadastro_id = 0;
      }
    }
    return c;
  }

  verificaDuplicados(nome?: string) {
    this.validaNome = false;
    if (nome !== undefined && nome !== null && nome.length > 3) {
      this.formCadastro.disable();
      this.sub.push(this.cs.procurarCadastroDuplicado(nome)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.cad = dados;
          },
          error: (erro) => {
            console.error(erro.toString());
            this.validaNome = true;
            this.nomeDuplicado = false;
            this.formCadastro.enable();
          },
          complete: () => {
            if (this.cad.length > 0) {
              this.nomeDuplicado = true;
            } else {
              this.nomeDuplicado = false;
              this.formCadastro.enable();
              this.validaNome = true;
            }
          }
        }));
    } else {
      this.nomeDuplicado = false;
      this.validaNome = true;
    }
  }

  ativarVerificarNome(): boolean {
    return !(this.formCadastro.get('cadastro_nome').value !== undefined && this.formCadastro.get('cadastro_nome').value !== null && this.formCadastro.get('cadastro_nome').value.toString().length > 3);
  }

  fechaNomeDuplicado() {
    this.formCadastro.enable();
    this.nomeDuplicado = false;
    this.cad = [];
  }

  validaAsync(campo: string, situacao: boolean) {
    return (
      (!this.formCadastro.get(campo).valid || this.formCadastro.get(campo).hasError('required')) &&
      (this.formCadastro.get(campo).touched || this.formCadastro.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'ng-invalid': this.validaAsync(campo, situacao),
      'ng-dirty': this.validaAsync(campo, situacao)
    };
  }

  verificaValidTouched(campo: string) {
    return (
      (!this.formCadastro.get(campo).valid || this.formCadastro.get(campo).hasError('required')) &&
      (this.formCadastro.get(campo).touched || this.formCadastro.get(campo).dirty) && this.formCadastro.enabled
    );
  }

  verificaValidTouched2(campo: string) {
    return (
      this.formCadastro.enabled && !this.formCadastro.get(campo).valid &&
      (this.formCadastro.get(campo).touched && this.formCadastro.get(campo).dirty)
    );
  }

  verificaValidacoesForm(formGroup: FormGroup): boolean {
    let ct = 0;
    let ct2 = 0;
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
      if (!controle.valid) {
        ct++;
      }
      ct2++;
    });
    return (ct === 0);
  }

  aplicaCssErro(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  aplicaCssErro2(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched2(campo),
      'ng-dirty': this.verificaValidTouched2(campo)
    };
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

  mudaTipo(event) {
    this.formCadastro.enable();
    const tp: number = +this.tipotipo;
    const a: SelectItem = this.achaTipo(this.ddTipoCadastroId, event.value);
    this.tipotipo = +Number(a.title);
      if (+tp !== +this.tipotipo) {
        if (+this.tipotipo === 1) {
          this.formCadastro.get('cadastro_apelido').setValue(this.cfs.cadastro['cadastro_apelido']);
          this.formCadastro.get('cadastro_rg').setValue(this.cfs.cadastro['cadastro_rg']);
          this.formCadastro.get('cadastro_escolaridade_id').setValue(this.cfs.cadastro['cadastro_escolaridade_id']);
          this.formCadastro.get('cadastro_estado_civil_id').setValue(this.cfs.cadastro['cadastro_estado_civil_id']);
          this.formCadastro.get('cadastro_conjuge').setValue(this.cfs.cadastro['cadastro_conjuge']);
          this.formCadastro.get('cadastro_sexo').setValue(this.cfs.cadastro['cadastro_sexo']);
          this.formCadastro.get('cadastro_sigla').setValue(null);
        }
        if (+this.tipotipo !== 1) {
          this.formCadastro.get('cadastro_apelido').setValue(null);
          this.formCadastro.get('cadastro_rg').setValue(null);
          this.formCadastro.get('cadastro_escolaridade_id').setValue(0);
          this.formCadastro.get('cadastro_estado_civil_id').setValue(0);
          this.formCadastro.get('cadastro_conjuge').setValue(null);
          this.formCadastro.get('cadastro_sexo').setValue('P');
          this.formCadastro.get('cadastro_sigla').setValue(this.cfs.cadastro.cadastro_sigla);
        }
      }
    this.block = false;
    this.arquivoDesativado = false;
  }

  onNovoRegistroAux(ev) {
    this.formCadastro.get(ev.campo).patchValue(ev.valorId);
  }

  incluir(c: CadastroFormI) {
    this.sub.push(this.cs.incluirCadastro(c)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
         console.error(err.error);
        },
        complete: () => {
          if (this.resp[0]) {
            this.ddc.gravaDropDown(c);
            if (this.possuiArquivos) {
              this.arquivo_registro_id = +this.resp[1];
              this.enviarArquivos = true;
            } else {
              this.atualizarCadastro();
            }
          } else {
            this.disableSubmit = false;
            this.botaoEnviarVF = false;
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

  alterar(c: CadastroFormI) {
    this.sub.push(this.cs.alterarCadastro(c)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          console.error(err.error);
        },
        complete: () => {
          if (this.resp[0]) {
            this.ddc.gravaDropDown(c);
            this.atualizarCadastro();
          } else {
            this.disableSubmit = false;
            this.botaoEnviarVF = false;
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

  voltarListar() {
    if (this.cfs.origem === 'menu') {
      this.mi.showMenuInterno();
    }
    if (this.cfs.origem !== 'menu') {
      this.mi.hideMenu();
    }
    this.router.navigate(['/cadastro/listar']);
  }

  resetForm() {
    this.mostraEnderecos = false;
    this.ddEnderecos = [];
    this.endereco = null;
    this.novoValor = null;
    this.nomeDuplicado = false;
    this.validaTratamento = false;
    this.validaNome = false;
    this.disableSubmit = false;
    this.arquivoDesativado = false;
    this.enviarArquivos = false;
    this.clearArquivos = false;
    this.arquivo_registro_id = 0;
    this.botaoEnviarVF  = false;
    this.mostraForm = true;
    this.formCadastro.reset();
    if (this.possuiArquivos) {
      this.clearArquivos = true;
    }
    this.possuiArquivos = false;
    this.arquivoDesativado = true;
    this.criaForm();
    window.scrollTo(0, 0);
  }

  onUpload(ev) {
    if (ev) {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'INCLUIR ARQUIVOS',
        detail: 'Arquivo(s) incluidos com sucesso.'
      });
    }
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = !ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onArquivosGravados(a: ArquivoInterface[]) {
    this.arquivos = a;
    if (this.cfs.acao === 'incluir') {
      this.atualizarCadastro();
    }
  }

  atualizarCadastro() {
    const cad: CadastroI = this.resp[3];
    if (this.arquivos.length > 0) {
      cad.cadastro_arquivos.push(...this.arquivos);
    }
    this.lazy = this.cs.lazy;
    if (this.cfs.acao === 'incluir') {
      this.cs.lazy = false;
      this.cs.cadastros.push(cad);
      this.cs.tabela.totalRecords++;
      this.cs.tabela.rows++;
      this.arquivos = [];
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'INCLUIR CADASTRO',
        detail: this.resp[2]
      });
      this.resp = [];
      this.resetForm();
    }
    if (this.cfs.acao === 'alterar') {
      this.cs.lazy = false;
      this.arquivos = [];
      this.cs.cadastros[this.cfs.idx] = cad;
      if (this.cfs.origem === 'expandido') {
        const c = {
          data: cad,
          originalEvent: {}
        }
        this.cs.expandido = cad;
        this.cs.expandidoSN = true;
        this.cs.tabela.celulas = [];
        this.cs.onRowExpand(c);
      }
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'ALTERAÇÃO DE CADASTRO',
        detail: this.resp[2]
      });

    }
    if (this.possuiArquivos) {
      this.clearArquivos = true;
    }
    this.cs.lazy = this.lazy;
    if (this.cfs.acao === 'alterar') {
      this.voltarListar();
    }
  }

  ngOnDestroy() {
    this.ddEnderecos = null;
    this.mostraEnderecos = false;
    this.endereco = null;
    this.arquivos = [];
    this.cfs.cadastroListar = null;
    this.cfs.cadastro = null;
    this.cfs.acao = null;
    this.cfs.idx = -1;
    this.cfs.origem = null;
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }

  /*teste() {
    const ddEnd: string = JSON.stringify([
      {
        "cep": "11060-900",
        "logradouro": "Avenida Ana Costa",
        "complemento": "549",
        "bairro": "Gonzaga",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-959",
        "logradouro": "Avenida Ana Costa",
        "complemento": "470",
        "bairro": "Gonzaga",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-906",
        "logradouro": "Avenida Ana Costa",
        "complemento": "380",
        "bairro": "Campo Grande",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-002",
        "logradouro": "Avenida Ana Costa",
        "complemento": "de 342 ao fim - lado par",
        "bairro": "Gonzaga",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-911",
        "logradouro": "Avenida Ana Costa",
        "complemento": "493",
        "bairro": "Gonzaga",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-905",
        "logradouro": "Avenida Ana Costa",
        "complemento": "168",
        "bairro": "Vila Belmiro",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-904",
        "logradouro": "Avenida Ana Costa",
        "complemento": "221",
        "bairro": "Encruzilhada",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-003",
        "logradouro": "Avenida Ana Costa",
        "complemento": "de 343 ao fim - lado ímpar",
        "bairro": "Gonzaga",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-909",
        "logradouro": "Avenida Ana Costa",
        "complemento": "530",
        "bairro": "Gonzaga",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-000",
        "logradouro": "Avenida Ana Costa",
        "complemento": "até 340 - lado par",
        "bairro": "Vila Mathias",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-907",
        "logradouro": "Avenida Ana Costa",
        "complemento": "259",
        "bairro": "Encruzilhada",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-970",
        "logradouro": "Avenida Ana Costa",
        "complemento": "470",
        "bairro": "Gonzaga",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-917",
        "logradouro": "Avenida Ana Costa",
        "complemento": "291",
        "bairro": "Gonzaga",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-908",
        "logradouro": "Avenida Ana Costa",
        "complemento": "417",
        "bairro": "Gonzaga",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-903",
        "logradouro": "Avenida Ana Costa",
        "complemento": "78",
        "bairro": "Vila Mathias",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      },
      {
        "cep": "11060-001",
        "logradouro": "Avenida Ana Costa",
        "complemento": "até 341 - lado ímpar",
        "bairro": "Gonzaga",
        "localidade": "Santos",
        "uf": "SP",
        "ibge": "3548500",
        "gia": "6336",
        "ddd": "13",
        "siafi": "7071"
      }
    ]);
    this.ddEnderecos = JSON.parse(ddEnd);
    this.endereco = null;
    this.mostraEnderecos = true;
  }*/

  get editorFormClass(): string {
    return (!this.th.filedVF && !this.th.dark) ? 'formulario' : (this.th.filedVF && !this.th.dark) ? 'formulario p-input-filled' : (!this.th.filedVF && this.th.dark) ?  'formulario formulario-dark' :  'formulario formulario-dark p-input-filled p-inputtext';
  }

}
