import {ColunasI} from "./colunas-i";

export interface BuscaI {
  rows?: number;
  first?: number;
  sortOrder?: number;
  sortField?: string;
  todos?: boolean;
  campos?: ColunasI[];
  ids?: number[];
  excel?: boolean;
}

export class Busca implements BuscaI {
  campos: ColunasI[] | null  = null;
  excel: boolean = false;
  first: number | null = null;
  ids: number[] | null = null;
  rows: number | null = null;
  sortField: string | null = null;
  sortOrder: number | null = null;
  todos: boolean | null = null;
  constructor() {
  }
}





