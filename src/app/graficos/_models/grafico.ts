export interface GraficoInterface {
  labels: string[];
  datasets: DatasetInterface | DatasetInterface[];
}

export interface DatasetInterface {
  label?: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  hoverBackgroundColor?: string | string[];
  data: number[];
}


