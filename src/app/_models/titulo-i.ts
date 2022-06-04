export interface TitulosI {
  field: string;
  mtitulo?: string;
  titulo?: string;
}

export interface TituloI {
  [index: string]: number | string;
}

export type ValorI = {
  [index in string | number]: number | number[] | string | string[];
};
