import {ArquivoInterface} from "../../arquivo/_models";
import {TotalI} from "../../shared-datatables/models/total-i";
import {Endereco} from "@brunoc/ngx-viacep";

export interface CadastroI {
  cadastro_id?: number;
  cadastro_tipo_id?: number;
  cadastro_tipo_tipo?: number;
  cadastro_tipo?: number;
  cadastro_tipo_nome?: string;
  cadastro_nome?: string;
  cadastro_nome_limpo?: string;
  cadastro_endereco?: string;
  cadastro_endereco_numero?: string;
  cadastro_endereco_complemento?: string;
  cadastro_bairro?: string;
  cadastro_municipio_id?: number;
  cadastro_municipio_nome?: string;
  cadastro_regiao_id?: number;
  cadastro_regiao_nome?: string;
  cadastro_cep?: string;
  cadastro_estado_id?: number;
  cadastro_estado_nome?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_rede_social?: string;
  cadastro_outras_midias?: string;
  cadastro_rg?: string;
  cadastro_anidia?: number;
  cadastro_animes?: number;
  quinzena?: number;
  cadastro_data_nascimento?: string;
  cadastro_data_nascimento2?: string;
  cadastro_data_nascimento3?: Date;
  cadastro_estado_civil_id?: number;
  cadastro_estado_civil_nome?: string;
  cadastro_conjuge?: string;
  cadastro_titulo?: string;
  cadastro_zona?: string;
  cadastro_secao?: string;
  cadastro_sigla?: string;
  cadastro_responsavel?: string;
  cadastro_jornal?: string;
  cadastro_jornal2?: number;
  cadastro_mala?: string;
  cadastro_mala2?: number;
  cadastro_agenda?: string;
  cadastro_agenda2?: number;
  cadastro_sigilo?: string;
  cadastro_sigilo2?: number;
  cadastro_grupo_id?: number;
  cadastro_grupo_nome?: string;
  cadastro_observacao?: string;
  cadastro_observacao_delta?: string;
  cadastro_observacao_texto?: string;
  cadastro_sexo?: string;
  cadastro_sexo2?: string;
  cadastro_data_cadastramento?: string;
  cadastro_data_cadastramento2?: string;
  cadastro_data_cadastramento3?: Date;
  cadastro_tratamento_id?: number;
  cadastro_tratamento_nome?: string;
  cadastro_escolaridade_id?: number;
  cadastro_escolaridade_nome?: string;
  cadastro_profissao?: string;
  cadastro_apelido?: string;
  cadastro_cpfcnpj?: string;
  cadastro_cargo?: string;
  cadastro_campo1?: string;
  cadastro_campo2?: string;
  cadastro_campo3?: string;
  cadastro_campo4_id?: number;
  cadastro_campo4_nome?: string;
  cadastro_arquivos?: ArquivoInterface[];
  vinculos?: number;
  snum?: number;
  pnum?: number;
  onum?: number;
  enum?: number;
  anum?: number;
}

export interface CadastroSolicVinculoI {
  solicitacao_id?: number;
  solicitacao_status_id?: number;
  solicitacao_status_nome?: string;
  solicitacao_data?: string;
  solicitacao_assunto_nome?: string;
  solicitacao_orgao?: string;
}

export interface CadastroProessoVinculoI {
  processo_id?: number;
  processo_numero?: string;
  processo_status_id?: number;
  processo_status_nome?: string;
  solicitacao_assunto_nome?: string;
}

export interface CadastroOficioVinculoI {
  oficio_id?: number;
  oficio_codigo?: string;
  oficio_numero?: string;
  oficio_status_id?: number;
  oficio_status_nome?: string;
  oficio_data_emissao?: string;
  oficio_orgao_solicitado_nome?: string;
}

export interface CadastroEmendaVinculoI {
  emenda_id?: number;
  emenda_situacao_nome?: string;
  emenda_numero?: string;
  emenda_orgao_solicitado_nome?: string;
  emenda_numero_protocolo?: string;
  emenda_assunto_nome?: string;
  emenda_data_solicitacao?: string;
}

export interface CadastroVinculosI extends CadastroI {
  cadastro_solicitacao?: CadastroSolicVinculoI[];
  cadastro_processo?: CadastroProessoVinculoI[];
  cadastro_oficio?: CadastroOficioVinculoI[];
  cadastro_emenda?: CadastroEmendaVinculoI[];
}

export interface CadastroPaginacaoI {
  cadastros: CadastroI[];
  total: TotalI;
}

export const cadastrocampostexto = [
  'cadastro_observacao',
];

export interface EnderecoI extends Endereco {
  siafi: string;
  ddd: string;
}
