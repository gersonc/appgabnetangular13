import {ColunasI} from "../../_models/colunas-i";
import {TotalI} from "../../shared-datatables/models/total-i";

export interface TelefoneInterface {
  telefone_assunto?: string;
  telefone_data?: string;
  telefone_data2?: string;
  telefone_data3?: Date;
  telefone_ddd?: string;
  telefone_de?: string;
  telefone_id?: number;
  telefone_local_id?: number;
  telefone_local_nome?: string;
  telefone_observacao?: string;
  telefone_observacao_delta?: string;
  telefone_observacao_texto?: string;
  telefone_para?: string;
  telefone_resolvido_id?: number;
  telefone_resolvido?: string | number;
  telefone_telefone?: string;
  telefone_tipo?: number | string;
  telefone_tipo_id?: number;
  telefone_usuario_nome?: string;
}

export interface TelefoneInterface2 {
  telefone_assunto?: string;
  telefone_data?: string;
  telefone_data2?: string;
  telefone_ddd?: string;
  telefone_de?: string;
  telefone_id?: number;
  telefone_local_id?: number;
  telefone_local_nome?: string;
  telefone_observacao?: string;
  telefone_observacao_delta?: string;
  telefone_observacao_texto?: string;
  telefone_para?: string;
  telefone_resolvido_id?: number;
  telefone_resolvido?: string | number;
  telefone_telefone?: string;
  telefone_tipo?: number | string;
  telefone_tipo_id?: number;
  telefone_usuario_nome?: string;
}

export interface TelefoneBuscaInterface {
  telefone_assunto1?: string;
  telefone_assunto2?: string[];
  telefone_data1?: string;
  telefone_data2?: string;
  telefone_ddd?: string;
  telefone_de?: string;
  telefone_id?: number;
  telefone_local_id?: number;
  telefone_para?: string;
  telefone_resolvido_id?: number;
  telefone_telefone?: string;
  telefone_tipo?: number;
  telefone_usuario_nome?: string;
  rows?: number;
  first?: number;
  sortOrder?: number;
  sortField?: string;
  todos?: boolean;
  campos?: ColunasI[];
  ids?: number[];
  excel?: boolean;
}

export interface TelefonePaginacaoInterface {
  telefones: TelefoneInterface2[];
  total: TotalI;
}

export interface TelefoneFormI {
  telefone_id?: number;
  telefone_tipo?: number;
  telefone_data?: string;
  telefone_data2?: Date;
  telefone_de?: string;
  telefone_para?: string;
  telefone_ddd?: string;
  telefone_telefone?: string;
  telefone_assunto?: string;
  telefone_local_id?: number;
  telefone_local_nome?: string;
  telefone_observacao?: string;
  telefone_observacao_delta?: string;
  telefone_observacao_texto?: string;
  telefone_resolvido?: number;
  telefone_usuario_nome?: string;
}

export class TelefoneFormulario implements TelefoneInterface {
  telefone_assunto?: string;
  telefone_data?: string;
  telefone_data2?: string;
  telefone_ddd?: string;
  telefone_de?: string;
  telefone_id?: number;
  telefone_local_id?: number;
  telefone_local_nome?: string;
  telefone_observacao?: string;
  telefone_observacao_delta?: string;
  telefone_observacao_texto?: string;
  telefone_para?: string;
  telefone_resolvido_id?: number;
  telefone_resolvido?: string | number;
  telefone_telefone?: string;
  telefone_tipo?: number | string;
  telefone_tipo_id?: number;
  telefone_usuario_nome?: string;
}

export class TelefoneBusca implements TelefoneBuscaInterface {
  telefone_assunto1 = null;
  telefone_assunto2 = [];
  telefone_data1 = null;
  telefone_data2 = null;
  telefone_ddd = null;
  telefone_de = null;
  telefone_id = 0;
  telefone_local_id = 0;
  telefone_para = null;
  telefone_resolvido = 999;
  telefone_telefone = null;
  telefone_tipo = 0;
  telefone_usuario_nome = null;
  numlinhas = '0';
  inicio = '0';
  sortorder = '0';
  sortcampo = 'telefone_data';
  todos = false;
  campos = [];
  ids = [];
}

export interface TelefoneDetalheInterface {
  telefone: TelefoneInterface;
  telefone_titulo: any[];
}

export const telefonecampostexto: string[] = [
  'telefone_observacao'
];
