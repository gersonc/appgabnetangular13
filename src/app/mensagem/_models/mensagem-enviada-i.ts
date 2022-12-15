export interface MensagemEnviadaI {
  mensagem_id?: number;
  mensagem_titulo?: string;
  mensagem_texto?: string;
  mensagem_data?: string;
  mensagem_usuario?: string;
  mensagem_usuarios?: MensagemUsuarioI[];
}

export interface MensagemUsuarioI {
  usuario_mensagem_usuario_id?: number;
  usuario_mensagem_usuario_nome?: string;
}




