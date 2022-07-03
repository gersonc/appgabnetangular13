import {CellInput} from "jspdf-autotable";

export declare type ColumnInput = string | number | {
  header?: CellInput;
  title?: CellInput;
  footer?: CellInput;
  dataKey?: string | number;
  key?: string | number;
};
