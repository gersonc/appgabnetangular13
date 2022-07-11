import {SelectItem} from "primeng/api";

export interface DdOficioProcessoIdI {
  processo_id?: number | null;
  solicitacao_id?: number | null;
  processo_numero?: string | null;
  solicitacao_cadastro_nome?: string;
  solicitacao_data?: string | null;
  solicitacao_assunto_nome?: string | null;
  solicitacao_orgao?: string | null;
  solicitacao_area_interesse_nome?: string;
  solicitacao_descricao?: string | null;
  solicitacao_descricao_texto?: string | null;
  solicitacao_descricao_delta?: string | null;
  cadastro_bairro?: string | null;
  cadastro_municipio_nome?: string | null;
  oficio_codigo?: string | null;
}

export interface DdForm {
  ddPrioridade_id?: SelectItem[];
  ddAndamento_id?: SelectItem[];
  ddrecebimento_id?: SelectItem[];
  DdOficioProcessoIdI?: DdOficioProcessoIdI[];
}
