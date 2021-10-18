import { SelectItem } from 'primeng/api';
import { AndamentoProposicaoListagemInterface } from './andamento-proposicao';

export interface ProposicaoBuscaCampoInterface {
  field: string;
  header: string;
}

export interface ProposicaoSQLInterface {
  sql: string;
}

export interface ProposicaoTotalInterface {
  num: number;
}

export interface ProposicaoListagemInterface {
  proposicao_id?: number;
  proposicao_numero?: string;
  proposicao_tipo_id?: number;
  proposicao_tipo_nome?: string;
  proposicao_relator?: string;
  proposicao_relator_atual?: string;
  proposicao_data_apresentacao?: string;
  proposicao_area_interesse_id?: number;
  proposicao_area_interesse_nome?: string;
  proposicao_ementa?: string;
  proposicao_texto?: string;
  proposicao_situacao_id?: number;
  proposicao_situacao_nome?: string;
  proposicao_parecer?: string;
  proposicao_origem_id?: number;
  proposicao_origem_nome?: string;
  proposicao_orgao_id?: number;
  proposicao_orgao_nome?: string;
  proposicao_emenda_tipo_id?: number;
  proposicao_emenda_tipo_nome?: string;
  proposicao_autor?: string;
  andamento_proposicao_id?: number;
  andamento_proposicao_data?: string;
  andamento_proposicao_texto?: string;
  andamento_proposicao_relator_atual?: string;
  andamento_proposicao_orgao_id?: number;
  andamento_proposicao_orgao_nome?: string;
  andamento_proposicao_situacao_id?: number;
  andamento_proposicao_situacao_nome?: string;
  andamento_proposicao?: AndamentoProposicaoListagemInterface[];
}

export interface ProposicaoPaginacaoInterface {
  proposicao: ProposicaoListagemInterface[];
  total: ProposicaoTotalInterface;
}

export interface ProposicaoDetalheInterface {
  proposicao: ProposicaoListagemInterface;
  proposicao_titulo: any[];
  andamento_proposicao: AndamentoProposicaoListagemInterface[];
  andamento_proposicao_titulo: any[];
}

export class ProposicaoFormulario implements ProposicaoListagemInterface {
  proposicao_id = null;
  proposicao_numero = null;
  proposicao_tipo_id = null;
  proposicao_tipo_nome = null;
  proposicao_relator = null;
  proposicao_relator_atual = null;
  proposicao_data_apresentacao = null;
  proposicao_area_interesse_id = null;
  proposicao_area_interesse_nome = null;
  proposicao_ementa = null;
  proposicao_texto = null;
  proposicao_situacao_id = null;
  proposicao_situacao_nome = null;
  proposicao_parecer = null;
  proposicao_origem_id = null;
  proposicao_origem_nome = null;
  proposicao_orgao_id = null;
  proposicao_orgao_nome = null;
  proposicao_emenda_tipo_id = null;
  proposicao_emenda_tipo_nome = null;
  proposicao_autor = null;
  andamento_proposicao_id = null;
  andamento_proposicao_data = null;
  andamento_proposicao_texto = null;
  andamento_proposicao_relator_atual = null;
  andamento_proposicao_orgao_id = null;
  andamento_proposicao_orgao_nome = null;
  andamento_proposicao_situacao_id = null;
  andamento_proposicao_situacao_nome = null;
  andamento_proposicao = null;
}



export interface ProposicaoGetFormInterface {
  ddPproposicao_parecer: SelectItem[];
  ddProposicao_tipo_id: SelectItem[];
  ddProposicao_area_interesse_id: SelectItem[];
  ddProposicao_situacao_id: SelectItem[];
  ddProposicao_origem_id: SelectItem[];
  ddProposicao_orgao_id: SelectItem[];
  ddProposicao_emenda_tipo_id: SelectItem[];
  proposicao?: ProposicaoListagemInterface;
}
