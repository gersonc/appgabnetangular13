export interface UsuarioInterface {
  usuario_id?: number | undefined;
  usuario_local_id?: number|null;
  local_nome?: string|null;
  usuario_nome?: string|null;
  usuario_login?: string|null;
  usuario_senha?: string|null;
  usuario_email?: string|null;
  usuario_cargo?: string|null;
  usuario_responsavel_sn?: number|null;
  usuario_principal_sn?: number|null;
  usuario_acesso?: string|null;
  usuario_acesso2?: string[]|null;
  usuario_celular?: string|null;
}

export class Usuario implements UsuarioInterface {
  usuario_id: number | undefined = 0;
  usuario_local_id? = null;
  local_nome? = null;
  usuario_nome = null;
  usuario_login? = null;
  usuario_senha? = null;
  usuario_email = null;
  usuario_cargo? = null;
  usuario_responsavel_sn? = 0;
  usuario_principal_sn? = 0;
  usuario_acesso? = null;
  usuario_acesso2? = [];
  usuario_celular? = null;
}

