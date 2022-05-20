import {SelectItem, SelectItemGroup} from 'primeng/api';

export interface SolicitacaoDropdownMenuListarInterface {
  ddSolicitacao_posicao?: SelectItem[];
  ddSolicitacao_cadastro_tipo_id?: SelectItemGroup[];
  ddSolicitacao_cadastro_id?: SelectItem[];
  ddSolicitacao_assunto_id?: SelectItem[];
  ddSolicitacao_atendente_cadastro_id?: SelectItem[];
  ddSolicitacao_cadastrante_cadastro_id?: SelectItem[];
  ddSolicitacao_cadastro_municipio_id?: SelectItem[];
  ddSolicitacao_cadastro_regiao_id?: SelectItem[];
  ddSolicitacao_local_id?: SelectItem[];
  ddSolicitacao_tipo_recebimento_id?: SelectItem[];
  ddSolicitacao_area_interesse_id?: SelectItem[];
  ddSolicitacao_reponsavel_analize_id?: SelectItem[];
  ddSolicitacao_data?: SelectItem[];
  ddSolicitacao_cadastro_bairro?: SelectItem[];
}

export class SolicitacaoDropdownMenuListar {
  ddSolicitacao_posicao = null;
  ddSolicitacao_cadastro_tipo_id = null;
  ddSolicitacao_cadastro_id = null;
  ddSolicitacao_assunto_id = null;
  ddSolicitacao_atendente_cadastro_id = null;
  ddSolicitacao_cadastrante_cadastro_id = null;
  ddSolicitacao_cadastro_municipio_id = null;
  ddSolicitacao_cadastro_regiao_id = null;
  ddSolicitacao_local_id = null;
  ddSolicitacao_tipo_recebimento_id = null;
  ddSolicitacao_area_interesse_id = null;
  ddSolicitacao_reponsavel_analize_id = null;
  ddSolicitacao_data = null;
  ddSolicitacao_cadastro_bairro = null;
}
