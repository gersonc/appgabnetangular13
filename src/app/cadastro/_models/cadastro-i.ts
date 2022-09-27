import {ArquivoInterface} from "../../arquivo/_models";
import {SolicI} from "../../solic/_models/solic-i";
import {ProceOficioI} from "../../proce/_model/proc-i";
import {OficioListarI} from "../../oficio/_models/oficio-listar-i";
import {EmendaListarI} from "../../emenda/_models/emenda-listar-i";
import {TotalI} from "../../shared-datatables/models/total-i";

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
}

export interface CadastroCompletoI extends CadastroI {
  cadastro_solicitacao?: SolicI[];
  cadastro_processo?: ProceOficioI[];
  cadastro_oficio?: OficioListarI[];
  cadastro_emenda?: EmendaListarI[];
}

export interface CadastroPaginacaoI {
  cadastros: CadastroI[];
  total: TotalI;
}

export const cadastrocampostexto = [
  'cadastro_observacao',
];