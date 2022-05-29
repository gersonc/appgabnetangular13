import {SolicHistoricoSolicitacao} from "./solic-historico-solicitacao";
import {SolicHistoricoProcesso} from "./solic-historico-processo";
import {TotalI} from "../../shared-datatables/models/total-i";
import {SolicOficioI} from "./solic-oficio-i";
import {SolicCadastro} from "./solic-cadastro";
import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";

export interface SolicListarI {
  solicitacao_id?: number;
  solicitacao_posicao?: string;
  solicitacao_data?: string;
  solicitacao_cadastro_tipo_id?: number;
  solicitacao_cadastro_tipo_nome?: string;
  solicitacao_cadastro_id?: number;
  solicitacao_cadastro_nome?: string;
  solicitacao_data2?: string;
  solicitacao_assunto_id?: number;
  solicitacao_assunto_nome?: string;
  solicitacao_indicacao_sn2?: number;
  solicitacao_atendente_cadastro_id?: number;
  solicitacao_atendente_cadastro_nome?: string;
  solicitacao_data_atendimento2?: string;
  solicitacao_cadastrante_cadastro_id?: number;
  solicitacao_cadastrante_cadastro_nome?: string;
  solicitacao_data_atendimento?: string;
  solicitacao_indicacao_sn?: string;
  solicitacao_orgao?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_descricao_delta?: string;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: string;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: string;
  solicitacao_carta_texto?: string;
  solicitacao_local_id?: number;
  solicitacao_local_nome2?: string;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_tipo_recebimento_nome2?: string;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_numero_oficio?: string;
  solicitacao_numero_oficio2?: string;
  solicitacao_area_interesse_id?: number;
  solicitacao_area_interesse_nome?: string;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_reponsavel_analize_nome?: string;
  solicitacao_aceita_sn?: number;
  solicitacao_processo_id?: number;
  solicitacao_arquivos?: ArquivoListagem[];
  // cadastro: SolicCadastro;
  cadastro_id?: number;
  cadastro_nome_limpo?: string;
  cadastro_tratamento_nome?: string;
  cadastro_responsavel?: string;
  cadastro_cargo?: string;
  cadastro_profissao?: string;
  cadastro_endereco?: string;
  cadastro_endereco_numero?: string;
  cadastro_endereco_complemento?: string;
  cadastro_bairro?: string;
  cadastro_regiao_id?: number;
  cadastro_regiao_nome?: string;
  cadastro_municipio_id?: number;
  cadastro_municipio_nome?: string;
  cadastro_cep?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_telefone?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_telcom?: string;
  cadastro_fax?: string;
  cadastro_estado_nome?: string;
  cadastro_grupo_nome?: string;
  cadastro_cpfcnpj?: string;
  cadastro_rede_social?: string;
  cadastro_outras_midias?: string;
  cadastro_arquivos?: ArquivoListagem[];
  oficio?: SolicOficioI[];
  processo_id?: number;
  processo_status2?: number;
  processo_status?: string;
  processo_numero?: string;
  processo_numero2?: string;
  processo_carta?: string;
  processo_carta_texto?: string;
  processo_carta_delta?: string;
  processo_arquivos?: ArquivoListagem[];
  historico_solicitcao?: SolicHistoricoSolicitacao[];
  historico_processo?: SolicHistoricoProcesso[];
}

/*export interface SolicTotalInterface {
  num: number;
}*/

export interface SolicPaginacaoInterface {
  solicitacao: SolicListarI[];
  total: TotalI;
}

export const solicSolicitacaoCamposTexto = [
  'solicitacao_descricao',
  'solicitacao_aceita_recusada',
  'solicitacao_carta'
];
