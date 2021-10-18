export interface LocalInterface {
  local_id: number;
  local_nome: string;
  local_endereco?: string;
  local_telefone?: string;
  local_responsavel_usuario_id?: number;
  local_responsavel_usuario_nome?: string;
  local_color?: string;
}

export class LocalClass implements LocalInterface {
  local_id = 0;
  local_nome = null;
  local_endereco? = null;
  local_telefone? = null;
  local_responsavel_usuario_id? = 0;
  local_responsavel_usuario_nome? = null;
  local_color? = null;
}
