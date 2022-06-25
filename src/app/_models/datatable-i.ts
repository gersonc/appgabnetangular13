import {TituloI, TitulosI} from "./titulo-i";

export interface BuscaCampoI {
  field: string;
  header: string;
}

export interface TotalI {
  num: number;
}



export interface DatatableI {
  columnWidths?: any[];
  columnOrder?: string[];
  tableWidth?: number[];
  rows?: number;
  first?: number;
  sortOrder?: number;
  sortField?: string;
  todos?: boolean;
  campos?: string[];
  ids?: number[];
  expandedRowKeys?: any;
  selection?: any[];
  totalRecords?: number;
  currentPage?: number;
  pageCount?: number;
  // titulos?: TSMap<string, TSMap<string, string>>;
  titulos?: TitulosI[];
  camposTexto?: string[];
  camposSelecionados?: BuscaCampoI[];
  total?: TotalI;
  cols?: any[];
  selectedColumns?: any[];
  selectedColumnsOld?: any[];
  dadosExpandidos?: any[];
  dadosExpandidosRaw?: any;
  mostraSeletor: boolean;
}

export class Datatable implements DatatableI {
  first = 0;
  sortOrder = 1;
  todos = false;
  rows = 50;
  mostraSeletor = false;
  totalRecords = 0;
  currentPage = 0;
  pageCount = 0;
  titulos = undefined;
}
