import {CellInput} from "jspdf-autotable";

export interface ColunasI {
  field?: string,
  header?: string,
  sortable?: string,
  width?: string
}
export declare type ColumnInput = string | number | {
  header?: CellInput;
  title?: CellInput;
  footer?: CellInput;
  dataKey?: string | number;
  key?: string | number;
};
