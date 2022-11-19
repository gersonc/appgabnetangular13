import {SelectItem} from "primeng/api";

export interface GraficoI {
  dropdown: SelectItem[],
  total: number;
  linhas: any;
  labels: string[];
  campos: GraficoInterface[];
}

export interface GraficoInterface {
  campo: string;
  labels: string[];
  datasets: DatasetInterface[] | null;
}

export interface DatasetInterface {
  label?: string;
  backgroundColor?: string[];
  borderColor?: string[];
  hoverBackgroundColor?: string[];
  data?: number[];
}
