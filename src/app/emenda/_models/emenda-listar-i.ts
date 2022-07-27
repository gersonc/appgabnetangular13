import {HistI} from "../../hist/_models/hist-i";
import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";

export interface EmendaListarI {
  emenda_id?: number;
  emenda_cadastro_tipo_id?: number;
  emenda_cadastro_tipo_nome?: string;
  emenda_cadastro_id?: number;
  emenda_cadastro_nome?: string;
  emenda_autor_tipo_id?: number;
  emenda_autor_tipo_nome?: string;
  emenda_autor_nome?: string;
  emenda_situacao_id?: number;
  emenda_situacao_nome?: string;
  emenda_situacao?: string;
  emenda_numero?: string;
  emenda_funcional_programatica?: string;
  emenda_orgao_solicitado_nome?: string;
  emenda_numero_protocolo?: string;
  emenda_assunto_id?: number;
  emenda_assunto_nome?: string;
  emenda_data_solicitacao2?: string;
  emenda_data_solicitacao?: string;
  emenda_processo?: string;
  emenda_tipo_emenda_id?: number;
  emenda_tipo_emenda_nome?: string;
  emenda_ogu_id?: number;
  emenda_ogu_nome?: string;
  emenda_valor_solicitado?: number;
  emenda_valor_empenhado?: number;
  emenda_data_empenho2?: string;
  emenda_data_empenho?: string;
  emenda_numero_empenho?: string;
  emenda_crnr?: string;
  emenda_gmdna?: string;
  emenda_observacao_pagamento?: string;
  emenda_observacao_pagamento_delta?: string;
  emenda_observacao_pagamento_texto?: string;
  emenda_data_pagamento2?: string;
  emenda_data_pagamento?: string;
  emenda_valor_pago?: number;
  emenda_numero_ordem_bancaria?: string;
  emenda_justificativa?: string;
  emenda_justificativa_delta?: string;
  emenda_justificativa_texto?: string;
  emenda_local_id?: number;
  emenda_local_nome?: string;
  emenda_uggestao?: string;
  emenda_siconv?: string;
  emenda_regiao?: string;
  emenda_contrato?: string;
  emenda_porcentagem?: string;
  cadastro_cpfcnpj?: string;
  cadastro_nome_limpo?: string;
  cadastro_municipio_id?: number;
  cadastro_municipio_nome?: string;
  cadastro_regiao_id?: number;
  cadastro_regiao_nome?: string;
  historico_emenda?: HistI[];
  emenda_arquivos?: ArquivoListagem[];
}

export interface EmendaTotalInterface {
  num: number;
}

export interface EmendaPaginacaoInterface {
  emendas: EmendaListarI[];
  total: EmendaTotalInterface;
}

export const emendascampostexto: string[] = [
  'emenda_observacao_pagamento',
  'emenda_justificativa',
  'historico_andamento'
];
