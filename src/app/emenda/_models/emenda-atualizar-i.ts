export interface EmendaAtualizarI {
  emenda_id?: number;
  emenda_situacao_id?: number;
  emenda_valor_empenhado?: number;
  emenda_data_empenho?: string;
  emenda_numero_empenho?: string;
  emenda_observacao_pagamento?: string;
  emenda_observacao_pagamento_delta?: string;
  emenda_observacao_pagamento_texto?: string;
  emenda_data_pagamento?: string;
  emenda_valor_pago?: number;
  emenda_numero_ordem_bancaria?: string;
  emenda_contrato?: string;
  emenda_porcentagem?: number;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
}

export class EmendaAtualizar implements EmendaAtualizarI {
  emenda_id?: number;
  emenda_situacao_id?: number;
  emenda_valor_empenhado?: number;
  emenda_data_empenho?: string;
  emenda_numero_empenho?: string;
  emenda_observacao_pagamento?: string;
  emenda_observacao_pagamento_delta?: string;
  emenda_observacao_pagamento_texto?: string;
  emenda_data_pagamento?: string;
  emenda_valor_pago?: number;
  emenda_numero_ordem_bancaria?: string;
  emenda_contrato?: string;
  emenda_porcentagem?: number;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
}
