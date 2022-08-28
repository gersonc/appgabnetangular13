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
  /*tarefa_hora?: string;
  tarefa_hora2?: string;
  tarefa_hora3?: Date;*/
  tarefa_titulo?: string;
  tarefa_tarefa?: string;
  tarefa_tarefa_delta?: string;
  tarefa_tarefa_texto?: Date;
  tarefa_datahora?: string;
  tarefa_datahora2?: string;
  tarefa_datahora3?: Date;
  tarefa_situacao_id?: number;
  tarefa_situacao_nome?: string;
  tarefa_usuario_situacao?: TarefaUsuarioSituacaoI[]
  tarefa_historico?: TarefaHistoricoI[];
  tarefa_arquivos?: ArquivoListagem[];
}

export interface TarefaUsuarioI {
  tu_id?: number;
  tu_tarefa_id?: number;
  tu_usuario_id?: number;
  tu_usuario_nome?: string;
}

export interface TarefaUsuarioSituacaoI {
  tu_id?: number;
  tu_tarefa_id?: number;
  tu_usuario_id?: number;
  tu_usuario_nome?: string;
  tus_id?: number;
  tus_tarefa_id?: number;
  tus_usuario_id?: number;
  tus_situacao_id?: number;
  tus_situacao_nome?: string;
}

export interface TarefaBuscaI {
  tipo_listagem?: string;
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


export interface TarefaPaginacaoI {
  tarefas: TarefaI[];
  total: TotalI;
}

export const tarefacampostexto: string[] = [
  'tarefa_tarefa',
  'th_historico'
];

