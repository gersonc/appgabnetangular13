export interface TelefoneSQLInterface {
  sql: string;
}

export interface TelefoneTotalInterface {
  num: number;
}

export interface TelefoneBuscaCampoInterface {
  field: string;
  header: string;
}
export interface TelefoneInterface {
  telefone_assunto?: string|null;
  telefone_data?: string|null;
  telefone_ddd?: string|null;
  telefone_de?: string|null;
  telefone_id?: number|null;
  telefone_local_id?: number|null;
  telefone_local_nome?: string|null;
  telefone_observacao?: string|null;
  telefone_para?: string|null;
  telefone_resolvido_id?: number|null;
  telefone_resolvido?: string | number|null;
  telefone_telefone?: string|null;
  telefone_tipo?: number | string|null;
  telefone_tipo_id?: number|null;
  telefone_usuario_nome?: string|null;
}

export interface TelefoneBuscaInterface {
  telefone_assunto1?: string|null;
  telefone_assunto2?: string[]|null;
  telefone_data1?: string|null;
  telefone_data2?: string|null;
  telefone_ddd?: string|null;
  telefone_de?: string|null;
  telefone_id?: number|null;
  telefone_local_id?: number|null;
  telefone_para?: string|null;
  telefone_resolvido?: number|null;
  telefone_telefone?: string|null;
  telefone_tipo?: number|null;
  telefone_usuario_nome?: string|null;
  numlinhas?: string|null;
  inicio?: string|null;
  sortorder?: string|null;
  sortcampo?: string|null;
  todos?: boolean|null;
  campos?: TelefoneBuscaCampoInterface[]|null;
  ids?: TelefoneBuscaCampoInterface[]|null;
}

export interface TelefonePaginacaoInterface {
  telefone: TelefoneInterface[];
  total: TelefoneTotalInterface;
  sql: TelefoneSQLInterface;
}

export class TelefoneFormulario implements TelefoneInterface {
  telefone_assunto = null;
  telefone_data = null;
  telefone_ddd = null;
  telefone_de = null;
  telefone_id = null;
  telefone_local_id = null;
  telefone_local_nome = null;
  telefone_observacao = null;
  telefone_para = null;
  telefone_resolvido_id = null;
  telefone_resolvido = null;
  telefone_telefone = null;
  telefone_tipo = null;
  telefone_tipo_id = null;
  telefone_usuario_nome = null;
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
