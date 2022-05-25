import {TotalI} from "./total-i";

export interface BuscaGeneric {
  rows?: number;
  first?: number;
  sortField?: string;
  columnWidths: any[];
  columnOrder: string[];
  tableWidth?: string;
  sortOrder?: number;
  expandedRowKeys?: any;
  selection?: any[];
  totalRecords?: number;
  currentPage?: number;
  pageCount?: number;
  total?: TotalI;
  todos?: boolean;
  ids?: number[];
}

export class BuscaGenerica implements BuscaGeneric {
  rows = 50;
  first = 1;
  sortField = '';
  columnWidths: any[] = [];
  columnOrder: string[] = [];
  tableWidth = '';
  sortOrder = 1;
  expandedRowKeys = undefined;
  selection: any[] = [];
  totalRecords = 0;
  currentPage = 0;
  pageCount = 0;
  total = undefined;
  todos = false;
  ids = [];
}
