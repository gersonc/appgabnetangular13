import {ColunasI} from "../../_models/colunas-i";
import {TotalI} from "../../shared-datatables/models/total-i";
import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";

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
  telefone_tipo_nome?: string;
  telefone_tipo_id?: number;
  telefone_usuario_nome?: string;
  telefone_arquivos?: ArquivoListagem[];
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
  telefone_tipo_nome?: string;
  telefone_tipo_id?: number;
  telefone_usuario_nome?: string;
  telefone_arquivos?: ArquivoListagem[];
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

export const telefonecampostexto: string[] = [
  'telefone_observacao'
];
