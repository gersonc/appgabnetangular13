import {SelectItem} from "primeng/api";

export interface ProceDropdownMenuListarI {
  ddProcesso_numero?: SelectItem[];
  ddProcesso_solicitacao_orgao?: SelectItem[];
  ddProcesso_solicitacao_situacao?: SelectItem[];
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
