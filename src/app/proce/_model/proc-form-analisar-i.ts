export interface ProcFormAnalisarI {
  processo_id?: number;
  processo_solicitacao_id?: number;
  processo_status_id?: number;
  processo_cadastro_id?: number;
  processo_carta?: string;
  processo_carta_delta?: string;
  processo_carta_texto?: string;
  historico_andamento?: string;
  historico_andamento_delta?: string;
  historico_andamento_texto?: string;
  processo_tipo_analize?: number;
}

export class ProcFormAnalisar implements ProcFormAnalisarI{
  processo_id?: number;
  processo_solicitacao_id?: number;
  processo_status_id?: number;
  processo_cadastro_id?: number;
  processo_carta: string | null = null;
  processo_carta_delta: string | null = null;
  processo_carta_texto: string | null = null;
  historico_andamento: string | null = null;
  historico_andamento_delta: string | null = null;
  historico_andamento_texto: string | null = null;
  processo_tipo_analize?: number;
}

