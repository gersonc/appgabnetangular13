import { SelectItem } from "primeng/api";
import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";
import {TotalI} from "../../shared-datatables/models/total-i";
import {HistI} from "../../hist/_models/hist-i";

export interface ProceDropdownMenuI {
  ddProcesso_numero?: SelectItem[];
  ddProcesso_solicitacao_orgao?: SelectItem[];
  ddProcesso_solicitacao_situacao?: SelectItem[];
  ddProcesso_status_id?: SelectItem[];
  ddProcesso_cadastro_tipo_id?: SelectItem[];
  ddProcesso_cadastro_id?: SelectItem[];
  ddProcesso_cadastro_municipio_id?: SelectItem[];
  ddProcesso_cadastro_regiao_id?: SelectItem[];
  ddProcesso_solicitacao_local_id?: SelectItem[];
  ddProcesso_solicitacao_reponsavel_analize_id?: SelectItem[];
  ddProcesso_solicitacao_area_interesse_id?: SelectItem[];
  ddProcesso_solicitacao_assunto_id?: SelectItem[];
  ddProcesso_solicitacao_data1?: SelectItem[];
  ddProcesso_solicitacao_data2?: SelectItem[];
}

export interface HistoricoSolicitacaoI {
  historico_id?: number;
  historico_data2?: string;
  historico_data?: string;
  historico_andamento?: string;
  historico_andamento_delta?: any;
  historico_andamento_texto?: string;
}

export interface HistoricoProcessoI {
  historico_id?: number;
  historico_data2?: string;
  historico_data?: string;
  historico_andamento?: string;
  historico_andamento_delta?: any;
  historico_andamento_texto?: string;
}

export interface ProceOficioI {
  oficio_processo_id?: number;
  oficio_solicitacao_id?: number;
  oficio_id?: number;
  oficio_numero?: string;
  oficio_codigo?: string;
  oficio_convenio?: string;
  oficio_prioridade_nome?: string;
  oficio_data_emissao?: string;
  oficio_data_recebimento?: string;
  oficio_orgao_solicitado_nome?: string;
  oficio_data_protocolo?: string;
  oficio_protocolo_numero?: string;
  oficio_orgao_protocolante_nome?: string;
  oficio_protocolante_funcionario?: string;
  oficio_prazo?: string;
  oficio_tipo_andamento_nome?: string;
  oficio_tipo_recebimento_nome?: string;
  oficio_status?: string;
  oficio_valor_solicitado?: string;
  oficio_valor_recebido?: string;
  oficio_data_pagamento?: string;
  oficio_data_empenho?: string;
  oficio_descricao_acao?: string;
  oficio_descricao_acao_delta?: any;
  oficio_descricao_acao_texto?: string;
  oficio_arquivos?: ArquivoListagem[];
}

export interface ProceListarI {
  processo_id?: number;
  cadastro_id?: number;
  solicitacao_id?: number;
  processo_cadastro_id?: number;
  oficio_id?: number;
  processo_numero?: string;
  processo_status_id?: number;
  processo_status_nome?: string;
  solicitacao_status_id?: number;
  solicitacao_status_nome?: string;
  cadastro_tipo_id?: number;
  cadastro_tipo_nome?: string;
  cadastro_nome?: string;
  cadastro_endereco?: string;
  cadastro_endereco_numero?: string;
  cadastro_endereco_complemento?: string;
  cadastro_bairro?: string;
  cadastro_municipio_id?: number;
  cadastro_municipio_nome?: string;
  cadastro_municipio_regiao?: string;
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
  cadastro_nascimento_data2?: string;
  cadastro_data_nascimento?: string;
  solicitacao_situacao?: string;
  solicitacao_data2?: string;
  solicitacao_data?: string;
  solicitacao_assunto_id?: number;
  solicitacao_assunto_nome?: string;
  solicitacao_area_interesse_id?: number;
  solicitacao_area_interesse_nome?: string;
  solicitacao_indicacao_sn?: string;
  solicitacao_indicacao_nome?: string;
  solicitacao_orgao?: string;
  solicitacao_local_id?: number;
  solicitacao_local_nome?: string;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_tipo_recebimento_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_descricao_delta?: any;
  solicitacao_descricao_texto?: string;
  solicitacao_aceita_recusada?: string;
  solicitacao_aceita_recusada_delta?: any;
  solicitacao_aceita_recusada_texto?: string;
  solicitacao_carta?: string;
  solicitacao_carta_delta?: any;
  solicitacao_carta_texto?: string;
  solicitacao_reponsavel_analize_id?: number;
  solicitacao_reponsavel_analize_nome?: string;
  oficio_processo_id?: number;
  oficio_codigo?: string;
  oficio_numero?: string;
  oficio_prioridade_nome?: string;
  oficio_convenio?: string;
  oficio_data_emissao2?: string;
  oficio_data_emissao?: string;
  oficio_emissao_data2?: string;
  oficio_data_recebimento2?: string;
  oficio_recebimento_data2?: string;
  oficio_data_recebimento?: string;
  oficio_orgao_solicitado_nome?: string;
  oficio_descricao_acao?: string;
  oficio_descricao_acao_delta?: any;
  oficio_descricao_acao_texto?: string;
  oficio_data_protocolo2?: string;
  oficio_protocolo_data2?: string;
  oficio_data_protocolo?: string;
  oficio_protocolo_numero?: string;
  oficio_orgao_protocolante_nome?: string;
  oficio_protocolante_funcionario?: string;
  oficio_prazo2?: string;
  oficio_prazo_data2?: string;
  oficio_prazo?: string;
  oficio_tipo_andamento_nome?: string;
  oficio_tipo_recebimento_nome?: string;
  oficio_status?: string;
  oficio_valor_solicitado?: string;
  oficio_valor_recebido?: string;
  oficio_data_pagamento2?: string;
  oficio_pagamento_data2?: string;
  oficio_data_pagamento?: string;
  oficio_data_empenho2?: string;
  oficio_empenho_data2?: string;
  oficio_data_empenho?: string;
  oficios?: ProceOficioI[];
  historico_data2?: string;
  historico_data?: string;
  historico_andamento?: string;
  historico_andamento_delta?: any;
  historico_andamento_texto?: string;
  historico_id?: number;
  historico_solicitacao_id?: number;
  historico_solicitacao_data2?: string;
  historico_solicitacao_data?: string;
  historico_solicitacao_andamento?: string;
  historico_solicitacao_andamento_delta?: any;
  historico_solicitacao_andamento_texto?: string;
  //historico_processo?: HistoricoProcessoI[];
   // historico_solicitcao?: HistoricoSolicitacaoI[];
  historico_processo?: HistI[];
  historico_solicitcao?: HistI[];
  processo_arquivos?: ArquivoListagem[];
  cadastro_arquivos?: ArquivoListagem[];
  solicitacao_arquivos?: ArquivoListagem[];
}

export interface ProcePaginacaoInterface {
  processos?: ProceListarI[];
  total: TotalI;
}

export interface ProceBuscaI {
  processo_id?: number;
  cadastro_id?: number;
  solicitacao_id?: number;
  oficio_id?: number;
  processo_status_id?: number;
  solicitacao_status_id?: number;
  cadastro_tipo_id?: number;
  cadastro_municipio_id?: number;
  cadastro_regiao_id?: number;
  cadastro_estado_id?: number;
  solicitacao_assunto_id?: number;
  solicitacao_area_interesse_id?: number;
  solicitacao_local_id?: number;
  solicitacao_tipo_recebimento_id?: number;
  solicitacao_reponsavel_analize_id?: number;
  oficio_status_id?: number;
  processo_numero?: string;
  solicitacao_situacao?: string;
  oficio_orgao_solicitado_nome?: string;
  solicitacao_orgao?: string;
  solicitacao_data1?: string;
  solicitacao_data2?: string;
  oficio_prazo_data1?: string;
  oficio_prazo_data2?: string;
  oficio_pagamento_data1?: string;
  oficio_pagamento_data2?: string;
  oficio_empenho_data1?: string;
  oficio_empenho_data2?: string;
  sortField?: string;
  sortOrder?: number;
  rows?: number;
  first?: number;
  inicio?: number;
  numlinhas?: number;
  sortcampo?: string;
  ids?: number[];
  todos?: boolean;
}

export const proceProcessoCamposTexto = [
  'solicitacao_descricao',
  'solicitacao_aceita_recusada',
  'solicitacao_carta',
  'oficio_descricao_acao'
];
