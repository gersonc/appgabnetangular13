import {TituloI, ValorI} from "./titulo-i";




/*

export interface TitulosI {
  field: string;
  mtitulo?: string;
  titulo?: string;
}

export interface TituloI {
  [index: string]: number | string;
}

export interface ValorI {
  [index: string | number]: number | number[] | string | string[];
}

*/





export interface PdfRelatorioI {
  tituloRelatorio: string;
  listaTabelas: string[];
  tabelas: PdfTabela[];
}


export interface PdfTabela {
  nome: string;
  tituloTabela: string;
  disposicao: 'v' | 'h';
  titulos: TituloI[];
  valores: ValorI[];
  cpsTxt: string[];
}
