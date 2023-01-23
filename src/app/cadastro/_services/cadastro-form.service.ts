import { Injectable } from '@angular/core';
import {CadastroFormI} from "../_models/cadastro-form-i";
import {CadastroI} from "../_models/cadastro-i";

@Injectable({
  providedIn: 'root'
})
export class CadastroFormService {
  origem: 'menu'|'listagem'|'contexto'|'expandido'| null = null;
  url = '';
  cadastroListar: CadastroI | null = null;
  cadastro: CadastroFormI | null = null;
  acao?: string | null = null;
  idx = -1;
  btnEnviar = true;
  i: string[] = [
    'cadastro_tipo_id',
    'cadastro_tratamento_id',
    'cadastro_grupo_id',
    'cadastro_municipio_id',
    'cadastro_estado_id',
    'cadastro_estado_civil_id',
    'cadastro_escolaridade_id',
    'cadastro_campo4_id',
    'cadastro_regiao_id'
  ];
  s: string[] = [
    'cadastro_nome',
    'cadastro_apelido',
    'cadastro_sigla',
    'cadastro_responsavel',
    'cadastro_cargo',
    'cadastro_endereco',
    'cadastro_endereco_numero',
    'cadastro_endereco_complemento',
    'cadastro_bairro',
    'cadastro_cep',
    'cadastro_telefone',
    'cadastro_telcom',
    'cadastro_telefone2',
    'cadastro_celular',
    'cadastro_celular2',
    'cadastro_fax',
    'cadastro_email',
    'cadastro_email2',
    'cadastro_rede_social',
    'cadastro_outras_midias',
    'cadastro_cpfcnpj',
    'cadastro_rg',
    'cadastro_conjuge',
    'cadastro_profissao',
    'cadastro_sexo',
    'cadastro_zona',
    'cadastro_campo1',
    'cadastro_campo2',
    'cadastro_campo3',
  ];
  b: string[] = [
    'cadastro_jornal',
    'cadastro_mala',
    'cadastro_agenda',
    'cadastro_sigilo',
  ];
  t: string[] = [
    'cadastro_id',
    'cadastro_tipo_id',
    'cadastro_tipo_tipo',
    'cadastro_tratamento_id',
    'cadastro_nome',
    'cadastro_apelido',
    'cadastro_sigla',
    'cadastro_responsavel',
    'cadastro_cargo',
    'cadastro_grupo_id',
    'cadastro_endereco',
    'cadastro_endereco_numero',
    'cadastro_endereco_complemento',
    'cadastro_bairro',
    'cadastro_municipio_id',
    'cadastro_cep',
    'cadastro_estado_id',
    'cadastro_telefone',
    'cadastro_telcom',
    'cadastro_telefone2',
    'cadastro_celular',
    'cadastro_celular2',
    'cadastro_fax',
    'cadastro_email',
    'cadastro_email2',
    'cadastro_rede_social',
    'cadastro_outras_midias',
    'cadastro_cpfcnpj',
    'cadastro_rg',
    'cadastro_estado_civil_id',
    'cadastro_conjuge',
    'cadastro_escolaridade_id',
    'cadastro_profissao',
    'cadastro_zona',
    'cadastro_campo1',
    'cadastro_campo2',
    'cadastro_campo3',
    'cadastro_campo4_id',
    'cadastro_observacao',
    'cadastro_observacao_delta',
    'cadastro_observacao_texto',
    'cadastro_regiao_id',
  ];

  constructor() { }

  resetCadastro() {
    this.cadastro = null;
  }

  parceForm(cadastro: CadastroI): CadastroFormI {
    this.cadastro = {};
    this.cadastroListar = {};
    this.cadastroListar = cadastro;
    this.t.forEach((cp) => {
      this.cadastro[cp] = (this.cadastroListar[cp] !== undefined && this.cadastroListar[cp] !== null) ? this.cadastroListar[cp] : null;
    });
    this.b.forEach((cp) => {
      const cp2 = cp + '2';
      this.cadastro[cp] = (this.cadastroListar[cp2] !== undefined && this.cadastroListar[cp2] !== null) ? (this.cadastroListar[cp2] === 1) ? 1 : 0 : 0;
    });
    this.cadastro.cadastro_sexo = (this.cadastroListar.cadastro_sexo2 !== undefined && this.cadastroListar.cadastro_sexo2 !== null) ? this.cadastroListar.cadastro_sexo2 : null;
    this.cadastro.cadastro_data_nascimento = (this.cadastroListar.cadastro_data_nascimento3 !== undefined && this.cadastroListar.cadastro_data_nascimento3 !== null) ? this.cadastroListar.cadastro_data_nascimento3 : null;
    return this.cadastro;
  }


  criaFormIncluir() {
    this.cadastro = {
      cadastro_agenda: false,
      cadastro_apelido: null,
      cadastro_bairro: null,
      cadastro_campo1: null,
      cadastro_campo2: null,
      cadastro_campo3: null,
      cadastro_campo4_id: null,
      cadastro_cargo: null,
      cadastro_celular: null,
      cadastro_celular2: null,
      cadastro_cep: null,
      cadastro_conjuge: null,
      cadastro_cpfcnpj: null,
      cadastro_data_nascimento: null,
      cadastro_email: null,
      cadastro_email2: null,
      cadastro_endereco: null,
      cadastro_endereco_complemento: null,
      cadastro_endereco_numero: null,
      cadastro_escolaridade_id: null,
      cadastro_estado_civil_id: null,
      cadastro_estado_id: null,
      cadastro_fax: null,
      cadastro_grupo_id: null,
      cadastro_id: null,
      cadastro_jornal: false,
      cadastro_mala: false,
      cadastro_municipio_id: null,
      cadastro_nome: null,
      cadastro_observacao: null,
      cadastro_observacao_delta: null,
      cadastro_observacao_texto: null,
      cadastro_outras_midias: null,
      cadastro_profissao: null,
      cadastro_rede_social: null,
      cadastro_regiao_id: null,
      cadastro_responsavel: null,
      cadastro_rg: null,
      cadastro_sexo: null,
      cadastro_sigilo: false,
      cadastro_sigla: null,
      cadastro_telcom: null,
      cadastro_telefone: null,
      cadastro_telefone2: null,
      cadastro_tipo_id: null,
      cadastro_tipo_tipo: null,
      cadastro_tratamento_id: null,
      cadastro_zona: null
    };
  }
}
