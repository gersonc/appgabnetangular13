import { SelectItem } from "primeng/api";

export interface ProcessoDropdownMenuListarInterface {
  processo_numero?: SelectItem[];
  processo_status_nome?: SelectItem[];
  cadastro_tipo_id?: SelectItem[];
  processo_cadastro_id?: SelectItem[];
  cadastro_municipio_id?: SelectItem[];
  cadastro_regiao_id?: SelectItem[];
  solicitacao_local_id?: SelectItem[];
  solicitacao_reponsavel_analize_id?: SelectItem[];
  solicitacao_area_interesse_id?: SelectItem[];
  solicitacao_assunto_id?: SelectItem[];
  solicitacao_data1?: SelectItem[];
  solicitacao_data2?: SelectItem[];
}

export class ProcessoDropdownMenuListar {
  processo_numero = null;
  processo_status_nome = null;
  cadastro_tipo_id = null;
  processo_cadastro_id = null;
  cadastro_municipio_id = null;
  cadastro_regiao_id = null;
  solicitacao_local_id = null;
  solicitacao_reponsavel_analize_id = null;
  solicitacao_area_interesse_id = null;
  solicitacao_assunto_id = null;
  solicitacao_data1 = null;
  solicitacao_data2 = null;
}
