import {TotalI} from "../../shared-datatables/models/total-i";

export interface MensagemListagemI {
  mensagem_id?: number;
  usuario_mensagem_id?: number;
  mensagem_titulo?: string;
  mensagem_texto?: string;
  mensagem_data?: string;
  mensagem_data2?: string;
  mensagem_data3?: Date;
  mensagem_usuarios?: string;
  usuario_mensagem_usuario_id?: number;
  usuario_mensagem_usuario_nome?: string;
  usuario_id?: number;
  usuario_nome?: string;
  usuario_mensagem_visto?: number;
}


export interface MensagemPaginacaoI {
  mensagens: MensagemListagemI[];
  tipo: number;
  total: TotalI;
}
