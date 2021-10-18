export interface ContaSQLInterface {
  sql: string;
}

export interface ContaTotalInterface {
  num: number;
}

export interface ContaBuscaCampoInterface {
  field: string;
  header: string;
}
export interface ContaInterface {
  conta_id?: number;
  conta_cedente?: string;
  conta_valor?: string;
  conta_valor2?: number;
  conta_vencimento?: string;
  conta_observacao?: string;
  conta_debito_automatico_id?: boolean | number;
  conta_debito_automatico?: boolean | number;
  conta_local_id?: number;
  conta_local_nome?: string;
  conta_tipo_id?: boolean | number;
  conta_tipo?: boolean | number;
  conta_paga_id?: boolean | number;
  conta_paga?: boolean | number;
  conta_pagamento_id?: string;
  conta_pagamento?: string;
}

export interface ContaFormularioInterface extends ContaInterface {
  conta_id?: number;
  conta_cedente?: string;
  conta_valor?: string;
  conta_valor2?: number;
  conta_vencimento?: string;
  conta_observacao?: string;
  conta_debito_automatico_id?: boolean | number;
  conta_debito_automatico?: boolean | number;
  conta_local_id?: number;
  conta_local_nome?: string;
  conta_tipo_id?: boolean | number;
  conta_tipo?: boolean | number;
  conta_paga_id?: boolean | number;
  conta_paga?: boolean | number;
  conta_pagamento_id?: string;
  conta_pagamento?: string;
  rptdia?: boolean | number;
  parcelas?: number;
  agenda?: boolean | number;
}

export interface ContaBuscaInterface {
  conta_id?: number;
  conta_valor?: string;
  conta_vencimento_1data?: string;
  conta_vencimento_2data?: string;
  conta_observacao?: string;
  conta_debito_automatico_id?: boolean | number;
  conta_debito_automatico?: boolean | number;
  conta_local_id?: number;
  conta_local_nome?: string;
  conta_tipo_id?: boolean | number;
  conta_tipo?: boolean | number;
  conta_paga_id?: boolean | number;
  conta_paga?: boolean | number;
  conta_pagamento_1data?: string;
  conta_pagamento_2data?: string;
  cedente_array?: string | string[];
  numlinhas?: string;
  inicio?: string;
  sortorder?: string;
  sortcampo?: string;
  todos?: boolean | number;
  campos?: ContaBuscaCampoInterface[];
  ids?: ContaBuscaCampoInterface[];
}

export interface ContaPaginacaoInterface {
  conta: ContaInterface[];
  total: ContaTotalInterface;
  sql: ContaSQLInterface;
}

export class ContaFormulario implements ContaFormularioInterface {
  conta_id = null;
  conta_cedente = null;
  conta_valor = null;
  conta_valor2 = null;
  conta_vencimento = null;
  conta_observacao = null;
  conta_debito_automatico_id = null;
  conta_debito_automatico = null;
  conta_local_id = null;
  conta_local_nome = null;
  conta_tipo_id = null;
  conta_tipo = null;
  conta_paga_id = null;
  conta_paga = null;
  conta_pagamento_id = null;
  conta_pagamento = null;
  rptdia = null;
  parcelas = null;
  agenda = null;
}

export class ContaBusca implements ContaBuscaInterface {
  conta_id = null;
  conta_valor = null;
  conta_vencimento_1data = null;
  conta_vencimento_2data = null;
  conta_observacao = null;
  conta_debito_automatico_id = null;
  conta_debito_automatico = null;
  conta_local_id = null;
  conta_local_nome = null;
  conta_tipo_id = null;
  conta_tipo = null;
  conta_paga_id = null;
  conta_paga = null;
  conta_pagamento_1data = null;
  conta_pagamento_2data = null;
  cedente_array = [];
  numlinhas = '0';
  inicio = '0';
  sortorder = '0';
  sortcampo = 'conta_vencimento';
  todos = false;
  campos = [];
  ids = [];
}

export interface ContaDetalheInterface {
  conta: ContaInterface;
  conta_titulo: any[];
}
