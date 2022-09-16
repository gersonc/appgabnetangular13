import {ColunasI} from "../../_models/colunas-i";
import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";
import {TarefaHistoricoI} from "./tarefa-historico-i";
import {TotalI} from "../../shared-datatables/models/total-i";

export interface TarefaI {
  tarefa_id?: number;
  tarefa_usuario_autor_id?: number;
  tarefa_usuario_autor_nome?: string;
  tarefa_data?: string;
  tarefa_data2?: string;
  tarefa_data3?: Date;
  tarefa_titulo?: string;
  tarefa_tarefa?: string;
  tarefa_tarefa_delta?: string;
  tarefa_tarefa_texto?: string;
  tarefa_datahora?: string;
  tarefa_datahora2?: string;
  tarefa_datahora3?: Date;
  tarefa_situacao_id?: number;
  tarefa_situacao_nome?: string;
  tarefa_usuario?: TarefaUsuarioI[];
  tarefa_usuario_situacao?: TarefaUsuarioSituacaoI[];
  tarefa_historico?: TarefaHistoricoI[];
  tarefa_usuario_situacao_andamento?: TarefaUsuarioSituacaoAndamentoI[];
  tarefa_arquivos?: ArquivoListagem[];
}

export interface TarefaUsuarioI {
  tu_id?: number;
  tu_tarefa_id?: number;
  tu_usuario_id?: number;
  tu_usuario_nome?: string;
}

export interface TarefaUsuarioSituacaoI {
  tarefa_id?: number;
  tarefa_situacao_id?: number;
  tu_usuario_nome?: string;
  tus_id?: number;
  tus_usuario_id?: number;
  tus_situacao_id?: number;
  tus_situacao_nome?: string;
  tus_tu_id?: number;
}

export interface TarefaUsuarioSituacaoAndamentoI {
  tarefa_id?: number;
  tarefa_situacao_id?: number;
  tu_usuario_nome?: string;
  tus_id?: number;
  tus_usuario_id?: number;
  tus_situacao_id?: number;
  tus_situacao_nome?: string;
  tus_tu_id?: number;
  tarefa_historico?: TarefaHistoricoI[];
}



export interface TarefaBuscaI {
  tarefa_id?: number;
  tipo_listagem?: number;
  tarefa_titulo?: string;
  tarefa_usuario_autor_id?: number;
  tarefa_usuario_id?: number;
  tarefa_situacao_id?: number;
  tarefa_datahora1?: string;
  tarefa_datahora2?: string;
  tarefa_data1?: string;
  tarefa_data2?: string;
  tarefa_titulo_array?: string[];
  rows?: number;
  first?: number;
  sortOrder?: number;
  sortField?: string;
  todos?: boolean;
  campos?: ColunasI[];
  ids?: number[];
  excel?: boolean;
}

export interface TarefaFormI {
  tarefa_id?: number;
  tarefa_usuario_autor_id?: number;
  tarefa_usuario_id?: number[];
  tarefa_data?: string;
  tarefa_data2?: string;
  tarefa_data3?: Date;
  tarefa_titulo?: string;
  tarefa_tarefa?: string;
  tarefa_tarefa_delta?: string;
  tarefa_tarefa_texto?: string;
  tarefa_usuario?: TarefaUsuarioFormI[];
  tarefa_historico?: TarefaHistoricoI;
  tarefa_email?: number;
  agenda?: number;
  tipo_listagem?: number;
}

export interface TarefaUsuarioFormI extends TarefaUsuarioI {
  tu_acao?: string;
}

export interface TarefaAtualizarI {
  tarefa_id: number;
  th_historico: string;
  autorusuario: number;
  tarefa_situacao_id: number;
  tipo_listagem?: number;
}


export interface TarefaPaginacaoI {
  tarefas: TarefaI[];
  total: TotalI;
}

export const tarefacampostexto: string[] = [
  'tarefa_tarefa',
  'th_historico'
];

export interface TarefaAutorSituacaoFormI {
  tarefa_id?: number;
  tarefa_usuario_autor_id?: number;
  tarefa_situacao_id?: number;
  tarefa_usuario_situacao?: TarefaAutorUsuarioSituacaoFormI[];
  tarefa_historico?: TarefaHistoricoI
}

export interface TarefaAutorUsuarioSituacaoFormI {
  tus_id?: number;
  tus_usuario_id?: number;
  tus_situacao_id?: number;
}

export interface TarefaUsuarioSituacaoFormI {
  tus_id?: number;
  tus_tarefa_id?: number;
  tus_usuario_id?: number;
  tus_situacao_id?: number;
}

export interface TarefaUsuarioSituacaoAtualisarFormI {
  tarefa_id?: number;
  tarefa_situacao_id?: number;
  tarefa_usuario_situacao?: TarefaUsuarioSituacaoFormI;
  tarefa_historico?: TarefaHistoricoI

}



export class TarefaTitulo {
 tarefa_titulo = '';
 tarefa_tarefa = '';
 tarefa_situacao_nome = '';
 tarefa_data = '';
 tarefa_usuario_autor_nome = '';
 tarefa_datahora = '';
 tarefa_usuario_situacao = '';
 tarefa_usuario_situacao_andamento = '';
}

