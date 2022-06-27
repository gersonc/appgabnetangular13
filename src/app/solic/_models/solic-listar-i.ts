import {SolicHistoricoSolicitacao} from "./solic-historico-solicitacao";
import {SolicHistoricoProcesso} from "./solic-historico-processo";
import {TotalI} from "../../shared-datatables/models/total-i";
import {SolicOficioI} from "./solic-oficio-i";
import {SolicCadastro} from "./solic-cadastro";
import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";
import {HistI} from "../../hist/_models/hist-i";

export interface SolicListarI {
  solicitacao_id?: number;
  solicitacao_situacao?: string;
  solicitacao_status_id?: number;
  solicitacao_status_nome?: string;
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
  processo_status_id?: number;
  processo_status_nome?: string;
  processo_numero?: string;
  processo_numero2?: string;
  processo_carta?: string;
  processo_carta_texto?: string;
  processo_carta_delta?: string;
  processo_arquivos?: ArquivoListagem[];
  // historico_solicitcao?: SolicHistoricoSolicitacao[];
  // historico_processo?: SolicHistoricoProcesso[];

  historico_solicitcao?: HistI[];
  historico_processo?: HistI[];


}

/*export interface SolicTotalInterface {
  num: number;
}*/

export interface SolicPaginacaoInterface {
  solicitacao: SolicListarI[];
  total: TotalI;
}

export const camposSolicitacaListar: string[] = [
  'solicitacao_situacao',
  'solicitacao_status_nome',
  'solicitacao_data',
  'solicitacao_cadastro_tipo_nome',
  'solicitacao_cadastro_nome',
  'solicitacao_assunto_nome',
  'solicitacao_atendente_cadastro_nome',
  'solicitacao_cadastrante_cadastro_nome',
  'solicitacao_data_atendimento',
  'solicitacao_indicacao_sn',
  'solicitacao_orgao',
  'solicitacao_indicacao_nome',
  'solicitacao_descricao',
  'solicitacao_descricao_texto',
  'solicitacao_descricao_delta',
  'solicitacao_aceita_recusada',
  'solicitacao_aceita_recusada_delta',
  'solicitacao_aceita_recusada_texto',
  'solicitacao_carta',
  'solicitacao_carta_delta',
  'solicitacao_carta_texto',
  'solicitacao_local_nome',
  'solicitacao_tipo_recebimento_nome',
  'solicitacao_numero_oficio',
  'solicitacao_area_interesse_nome',
  'solicitacao_reponsavel_analize_nome',
  'solicitacao_aceita_sn?: number',
  'cadastro_nome_limpo',
  'cadastro_tratamento_nome',
  'cadastro_responsavel',
  'cadastro_cargo',
  'cadastro_profissao',
  'cadastro_endereco',
  'cadastro_endereco_numero',
  'cadastro_endereco_complemento',
  'cadastro_bairro',
  'cadastro_regiao_nome',
  'cadastro_municipio_nome',
  'cadastro_cep',
  'cadastro_email',
  'cadastro_email2',
  'cadastro_telefone',
  'cadastro_telefone2',
  'cadastro_celular',
  'cadastro_celular2',
  'cadastro_telcom',
  'cadastro_fax',
  'cadastro_estado_nome',
  'cadastro_grupo_nome',
  'cadastro_cpfcnpj',
  'cadastro_rede_social',
  'cadastro_outras_midias',
  'oficio_numero',
  'oficio_codigo',
  'oficio_convenio',
  'oficio_prioridade_nome',
  'oficio_data_emissao',
  'oficio_data_recebimento',
  'oficio_orgao_solicitado_nome',
  'oficio_data_protocolo',
  'oficio_protocolo_numero',
  'oficio_orgao_protocolante_nome',
  'oficio_protocolante_funcionario',
  'oficio_prazo',
  'oficio_tipo_andamento_nome',
  'oficio_tipo_recebimento_nome',
  'oficio_status',
  'oficio_valor_solicitado',
  'oficio_valor_recebido',
  'oficio_data_pagamento',
  'oficio_data_empenho',
  'oficio_descricao_acao',
  'oficio_descricao_acao_delta',
  'oficio_descricao_acao_texto',
  'processo_status_nome',
  'processo_numero',
  'processo_carta',
  'processo_carta_texto',
  'processo_carta_delta',
  'historico_data',
  'historico_andamento',
  'historico_andamento_delta',
  'historico_andamento_texto'
];

export const solicSolicitacaoCamposTexto = [
  'solicitacao_descricao',
  'solicitacao_aceita_recusada',
  'solicitacao_carta'
];
