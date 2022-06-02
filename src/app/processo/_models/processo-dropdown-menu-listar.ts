import { SelectItem } from "primeng/api";

export interface ProcessoDropdownMenuListarInterface {
  ddProcesso_numero?: SelectItem[];
  ddProcesso_status_id?: SelectItem[];
  ddProcesso_cadastro_tipo_id?: SelectItem[];
  ddProcesso_cadastro_id?: SelectItem[];
  ddProcesso_cadastro_municipio_id?: SelectItem[];
  ddProcesso_cadastro_regiao_id?: SelectItem[];
  ddProcesso_solicitacao_local_id?: SelectItem[];
  ddProcesso_solicitacao_reponsavel_analize_id?: SelectItem[];
  ddProcesso_solicitacao_area_interesse_id?: SelectItem[];
  ddProcesso_solicitacao_assunto_id?: SelectItem[];
  ddProcesso_solicitacao_data1?: SelectItem[];
  ddProcesso_solicitacao_data2?: SelectItem[];
}

export class ProcessoDropdownMenuListar {
  ddProcesso_numero = null;
  ddProcesso_status_id = null;
  ddProcesso_cadastro_tipo_id = null;
  ddProcesso_cadastro_id = null;
  ddProcesso_cadastro_municipio_id = null;
  ddProcesso_cadastro_regiao_id = null;
  ddProcesso_solicitacao_local_id = null;
  ddProcesso_solicitacao_reponsavel_analize_id = null;
  ddProcesso_solicitacao_area_interesse_id = null;
  ddProcesso_solicitacao_assunto_id = null;
  ddProcesso_solicitacao_data1 = null;
  ddProcesso_solicitacao_data2 = null;
}
