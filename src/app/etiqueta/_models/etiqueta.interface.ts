export interface EtiquetaInterface {
  etq_id?: number;
  etq_marca?: string;
  etq_modelo?: string;
  etq_margem_superior?: number;
  etq_margem_lateral?: number;
  etq_distancia_vertical?: number;
  etq_distancia_horizontal?: number;
  etq_altura?: number;
  etq_largura?: number;
  etq_linhas?: number;
  etq_colunas?: number;
  etq_folha_horz?: number;
  etq_folha_vert?: number;
}

export interface PaginaInterface {
  etq_id: number;
  etq_margem_superior: number;
  etq_margem_lateral: number;
  etq_folha_horz: number;
  etq_folha_vert: number;
}

export class EtiquetaClass implements EtiquetaInterface {
  etq_id = null;
  etq_marca = null;
  etq_modelo = null;
  etq_margem_superior = 0;
  etq_margem_lateral = 0;
  etq_distancia_vertical = 0;
  etq_distancia_horizontal = 0;
  etq_altura = 0;
  etq_largura = 0;
  etq_linhas = 0;
  etq_colunas = 0;
  etq_folha_horz = 0;
  etq_folha_vert = 0;
}
