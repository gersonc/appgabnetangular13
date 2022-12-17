export interface MansagemBuscaI {
  mensagem_id?: number;
  usuario_mensagem_id?: number;
  usuario_mensagem_usuario_id?: number;
  usuario_id?: number;
  // usuario_mensagem_visto?: number;
  mensagem_titulo?: string[];
  mensagem_data1?: string;
  mensagem_data2?: string;
  tipo_listagem?: number;
  rows?: number;
  first?: number;
  sortOrder?: number;
  sortField?: string;
  todos?: boolean;
  ids?: number[];
}
