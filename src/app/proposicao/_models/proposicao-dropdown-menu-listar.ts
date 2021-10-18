import { SelectItem } from 'primeng/api';

export interface ProposicaoDropdownMenuListarInterface {
  ddProposicao_tipo_id: SelectItem[];
  ddProposicao_numero: SelectItem[];
  ddProposicao_autor: SelectItem[];
  ddProposicao_relator: SelectItem[];
  ddProposicao_area_interesse_id: SelectItem[];
  ddProposicao_parecer: SelectItem[];
  ddProposicao_origem_id: SelectItem[];
  ddProposicao_emenda_tipo_id: SelectItem[];
  ddProposicao_situacao_id: SelectItem[];
  ddProposicao_relator_atual: SelectItem[];
  ddProposicao_orgao_id: SelectItem[];
  ddProposicao_data1: SelectItem[];
  ddProposicao_data2: SelectItem[];
}

export class ProposicaoDropdownMenuListar implements ProposicaoDropdownMenuListarInterface {
  ddProposicao_tipo_id = null;
  ddProposicao_numero = null;
  ddProposicao_autor = null;
  ddProposicao_relator = null;
  ddProposicao_area_interesse_id = null;
  ddProposicao_parecer = null;
  ddProposicao_origem_id = null;
  ddProposicao_emenda_tipo_id = null;
  ddProposicao_situacao_id = null;
  ddProposicao_relator_atual = null;
  ddProposicao_orgao_id = null;
  ddProposicao_data1 = null;
  ddProposicao_data2 = null;
}
