import { SelectItem } from 'primeng/api';

export interface OficioDropdownMenuListarInterface {
  ddOficio_processo_id: SelectItem[];
  ddOficio_codigo: SelectItem[];
  ddOficio_numero: SelectItem[];
  ddOficio_protocolo_numero: SelectItem[];
  ddOficio_convenio: SelectItem[];
  ddOficio_orgao_solicitado_nome: SelectItem[];
  ddOficio_orgao_protocolante_nome: SelectItem[];
  ddOficio_data_emissao1: SelectItem[];
  ddOficio_data_emissao2: SelectItem[];
  ddOficio_data_empenho1: SelectItem[];
  ddOficio_data_empenho2: SelectItem[];
  ddOficio_data_protocolo1: SelectItem[];
  ddOficio_data_protocolo2: SelectItem[];
  ddOficio_data_pagamento1: SelectItem[];
  ddOficio_data_pagamento2: SelectItem[];
  ddOficio_prazo1: SelectItem[];
  ddOficio_prazo2: SelectItem[];
  ddOficio_municipio_id: SelectItem[];
  ddOficio_tipo_solicitante_id: SelectItem[];
  ddOficio_cadastro_id: SelectItem[];
  ddOficio_assunto_id: SelectItem[];
  ddOficio_area_interesse_id: SelectItem[];
  ddOficio_prioridade_id: SelectItem[];
  ddOficio_tipo_andamento_id: SelectItem[];
  ddSolicitacao_reponsavel_analize_id: SelectItem[];
  ddSolicitacao_local_id: SelectItem[];
  ddOficio_status: SelectItem[];
}

export class OficioDropdownMenuListar implements OficioDropdownMenuListarInterface {
  ddOficio_processo_id = null;
  ddOficio_codigo = null;
  ddOficio_numero = null;
  ddOficio_protocolo_numero = null;
  ddOficio_convenio = null;
  ddOficio_orgao_solicitado_nome = null;
  ddOficio_orgao_protocolante_nome = null;
  ddOficio_data_emissao1 = null;
  ddOficio_data_emissao2 = null;
  ddOficio_data_empenho1 = null;
  ddOficio_data_empenho2 = null;
  ddOficio_data_protocolo1 = null;
  ddOficio_data_protocolo2 = null;
  ddOficio_data_pagamento1 = null;
  ddOficio_data_pagamento2 = null;
  ddOficio_prazo1 = null;
  ddOficio_prazo2 = null;
  ddOficio_municipio_id = null;
  ddOficio_tipo_solicitante_id = null;
  ddOficio_cadastro_id = null;
  ddOficio_assunto_id  = null;
  ddOficio_area_interesse_id = null;
  ddOficio_prioridade_id = null;
  ddOficio_tipo_andamento_id = null;
  ddSolicitacao_reponsavel_analize_id = null;
  ddSolicitacao_local_id = null;
  ddOficio_status = null;
}
