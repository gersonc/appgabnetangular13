import { Injectable } from '@angular/core';
import {CadastroFormI} from "../_models/cadastro-form-i";
import {CadastroI} from "../_models/cadastro-i";

@Injectable({
  providedIn: 'root'
})
export class CadastroFormService {
  url = '';
  cadastroListar: CadastroI | null = null;
  cadastro: CadastroFormI | null = null;
  acao?: string | null = null;
  btnEnviar = true;


  constructor() { }

  resetCadastro() {
    this.cadastro = null;
  }

  parceForm(cadastro: CadastroI): CadastroFormI {
    this.cadastro = null;
    // @ts-ignore
    let r: CadastroFormI = {
      cadastro_agenda: true
    };

    return r;
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
