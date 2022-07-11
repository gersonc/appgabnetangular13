import { SelectItem } from 'primeng/api';

export interface OficioIncluirFormInterface {
  solicitacao?: boolean;
  oficio_codigo?: string;
  oficio_processo_id?: number;
  processo_numero?: string;
  solicitacao_cadastro_nome?: string;
  solicitacao_assunto_nome?: string;
  solicitacao_data?: string;
  solicitacao_area_interesse_nome?: string;
  solicitacao_descricao?: string;
  solicitacao_descricao_texto?: string;
  solicitacao_descricao_delta?: string;
  cadastro_municipio_nome?: string;

  processoLabelLenght?: string;
  ddOficio_processo_id?: SelectItem[];
  ddPrioridade_id?: SelectItem[];
  ddAndamento_id?: SelectItem[];
  ddrecebimento_id?: SelectItem[];
}

export class OficioIncluirForm {
  solicitacao = null;
  oficio_codigo = null;
  oficio_processo_id = null;
  processo_numero = null;
  solicitacao_cadastro_nome = null;
  solicitacao_assunto_nome = null;
  solicitacao_data = null;
  solicitacao_area_interesse_nome = null;
  solicitacao_descricao = null;
  solicitacao_descricao_texto = null;
  solicitacao_descricao_delta = null;
  cadastro_municipio_nome = null;

  processoLabelLenght = null;
  ddOficio_processo_id = null;
  ddPrioridade_id = null;
  ddAndamento_id = null;
  ddrecebimento_id = null;
}
