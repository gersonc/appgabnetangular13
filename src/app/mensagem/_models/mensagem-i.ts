export interface MensagemI {
  id: number;
  mensagem_uuid: string;
  usuario_mensagem_id: number;
  mensagem_id: number;
  mensagem_titulo: string;
  mensagem_texto: string;
  mensagem_data: string;
  registro_id: number;
  modulo: string;
  usuario_origem_id: number;
  usuario_origem_nome: string;
}
