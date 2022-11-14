import {SelectItem} from "primeng/api";

export type Dataset = { [key: string]: GraficoCampoI | GraficoCampoI[] };

export interface GraficoI {
  dropdown: SelectItem[],
  total: number;
  linhas: any[];
  labels: string[];
  campos: GraficoCampoI[];
}



export interface GraficoCampoI {
  campo: Dataset;
  // datasets: DatasetInterface | DatasetInterface[];
}

export interface DatasetInterface {
  labels?: string[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  hoverBackgroundColor?: string | string[];
  data: number[];
  nlinhas: number;
  nomes: string[];
}
