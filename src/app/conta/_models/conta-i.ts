import {ColunasI} from "../../_models/colunas-i";
import {TotalI} from "../../shared-datatables/models/total-i";
import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";

export interface ContaI {
  conta_id?: number;
  conta_uuid?: string;
  conta_tipo_id?: number;
  conta_tipo?: string;
  conta_paga_id?: number;
  conta_paga?: string;
  // conta_debito_automatico_id?: number;
  // conta_debito_automatico?: string;
  conta_cedente?: string;
  conta_valor2?: number;
  conta_valor?: string;
  conta_vencimento2?: string;
  conta_vencimento?: string;
  conta_vencimento3?: Date;
  conta_pagamento2?: string;
  conta_pagamento?: string;
  conta_pagamento3?: Date;
  conta_observacao?: string;
  conta_observacao_delta?: string;
  conta_observacao_texto?: string;
  conta_local_id?: number;
  conta_local_nome?: string;
  conta_rptdia?: number;
  conta_parcelas?: number;
  conta_agenda?: number;
  conta_calendario_id?: number;
  conta_arquivos?: ArquivoListagem[];
}

export interface ContaFormI {
  conta_id?: number;
  conta_uuid?: string;
  conta_cedente?: string;
  conta_valor?: number;
  // conta_valor2?: number;
  conta_vencimento?: string;
  conta_vencimento2?: Date;
  conta_observacao?: string;
  conta_observacao_delta?: string;
  conta_observacao_texto?: string;
  // conta_debito_automatico?: number;
  conta_local_id?: number;
  conta_tipo?: number;
  conta_paga?: number;
  conta_pagamento?: string;
  conta_pagamento2?: Date;
  conta_rptdia?: number;
  conta_parcelas?: number;
  conta_agenda?: number;
  conta_calendario_id?: number;
}


export interface ContaBuscaI {
  conta_id?: number;
  conta_vencimento_1data?: string;
  conta_vencimento_2data?: string;
  // conta_debito_automatico_id?: number;
  conta_local_id?: number;
  conta_tipo_id?: number;
  conta_paga_id?: number;
  conta_pagamento_1data?: string;
  conta_pagamento_2data?: string;
  cedente_array?: string[];
  rows?: number;
  first?: number;
  sortOrder?: number;
  sortField?: string;
  todos?: boolean;
  campos?: ColunasI[];
  ids?: number[];
  excel?: boolean;
}

export interface ContaPaginacaoInterface {
  contas: ContaI[];
  total: TotalI;
}

export const contacampostexto: string[] = [
  'conta_observacao'
];
