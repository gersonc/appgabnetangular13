import {TituloI, TitulosI} from "./titulo-i";
import {ColunasI} from "./colunas-i";
import {CelulaI} from "./celula-i";

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
  titulos?: any[];
  camposTexto?: string[];
  camposCurrency?: string[];
  camposSelecionados?: ColunasI[];
  total?: TotalI;
  cols?: any[];
  selectedColumns?: any[];
  selectedColumnsOld?: any[];
  dadosExpandidos?: any[];
  dadosExpandidosRaw?: any;
  mostraSeletor: boolean;
  celulas?: CelulaI[];
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
