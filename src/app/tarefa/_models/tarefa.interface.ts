
export interface TarefaTotalInterface {
  num: number;
}

export interface TarefaBuscaCampoInterface {
  field: string;
  header: string;
}

export interface TarefaInterface {
  tarefa_id?: number;
  tarefa_usuario_autor_id?: number;
  tarefa_usuario_autor_nome?: string;
  tarefa_data?: string;
  tarefa_hora?: string;
  tarefa_titulo?: string;
  tarefa_tarefa?: string;
  tarefa_datahora?: string;
  tarefa_situacao_id?: number;
  tarefa_situacao_nome?: string;
}

export interface TarefaHistroricoInterface {
  th_id?: number;
  th_tarefa_id?: number;
  th_data?: string;
  th_hora?: string;
  th_usuario_id?: number;
  th_usuario_nome?: string;
  th_historico?: string;
}

export interface TarefaSituacaoInterface {
  tarefa_situacao_id?: number;
  tarefa_situacao_nome?: string;
}

export interface TarefaUsuarioInteface {
  tu_id?: number;
  tu_tarefa_id?: number;
  tu_usuario_id?: number;
  tu_usuario_nome?: string;
}

export interface TarefaUsuarioSituacaoInteface {
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

export interface TarefaListarInterface extends TarefaInterface {
  tarefa_id?: number;
  tarefa_usuario_autor_id?: number;
  tarefa_usuario_autor_nome?: string;
  tarefa_data?: string;
  tarefa_hora?: string;
  tarefa_titulo?: string;
  tarefa_tarefa?: string;
  tarefa_datahora?: string;
  tarefa_situacao_id?: number;
  tarefa_situacao_nome?: string;
  usuario_situacao_num?: number;
  usuario_situacao?: TarefaUsuarioSituacaoInteface[];
  tarefa_historico_num?: number;
  tarefa_historico?: TarefaHistroricoInterface[];
}

export interface TarefaPaginacaoInterface {
  total: TarefaTotalInterface;
  tarefa_listar: TarefaListarInterface[];
}

export interface TarefaBuscaInterface {
  tipo_listagem?: string;
  tarefa_titulo?: string;
  tarefa_usuario_autor_id?: number;
  tarefa_usuario_id?: number;
  tarefa_situacao_id?: number;
  tarefa_datahora1?: string;
  tarefa_datahora2?: string;
  tarefa_data1?: string;
  tarefa_data2?: string;
  numlinhas?: string;
  inicio?: string;
  sortorder?: string;
  sortcampo?: string;
  todos?: boolean;
  campos?: TarefaBuscaCampoInterface[];
  ids?: TarefaBuscaCampoInterface[];
}

export class TarefaBusca implements TarefaBuscaInterface {
  tipo_listagem = null;
  tarefa_titulo = null;
  tarefa_usuario_autor_id = null;
  tarefa_usuario_id = null;
  tarefa_situacao_id = null;
  tarefa_datahora1 = null;
  tarefa_datahora2 = null;
  tarefa_data1 = null;
  tarefa_data2 = null;
  numlinhas = '0';
  inicio = '0';
  sortorder = '0';
  sortcampo = 'tarefa_datahora';
  todos = false;
  campos = [];
  ids = [];
}

export interface TarefaFormInterface {
  tarefa_id?: number;
  tarefa_usuario_autor_id?: number;
  tarefa_usuario_id?: number | number[];
  tarefa_data?: string;
  tarefa_hora?: string;
  tarefa_titulo?: string;
  tarefa_tarefa?: string;
  tarefa_email?: boolean;
  tarefa_sms?: boolean;
  mensagem_sms?: string;
  agenda?: boolean;
  tipo_listagem?: string;
}

export class TarefaForm implements TarefaFormInterface {
  tarefa_id = 0;
  tarefa_usuario_autor_id = null;
  tarefa_usuario_id = null;
  tarefa_data = null;
  tarefa_hora = null;
  tarefa_titulo = null;
  tarefa_tarefa = null;
  tarefa_email = false;
  tarefa_sms = false;
  mensagem_sms = null;
  agenda = false;
  tipo_listagem = null;
}

export interface TarefaAtualizarFormInterface {
  tarefa_id: number;
  th_historico: string;
  autorusuario: number;
  tarefa_situacao_id: number;
  tarefa_sms?: boolean;
  mensagem_sms?: string;
  tipo_listagem?: string;
}

export class TarefaAtualizarForm implements TarefaAtualizarFormInterface {
  tarefa_id = 0;
  th_historico = null;
  autorusuario = 0;
  tarefa_situacao_id = 0;
  tarefa_sms = null;
  mensagem_sms = null;
  tipo_listagem = null;
}


export class TarefaArray {
  public static getArrayTitulo() {
    const tarefaArrayTitulos: any[] = [];
    tarefaArrayTitulos['tarefa_assunto'] = 'ASSUNTO';
    tarefaArrayTitulos['tarefa_data'] = 'DATA';
    tarefaArrayTitulos['tarefa_ddd'] = 'DDD';
    tarefaArrayTitulos['tarefa_de'] = 'DE';
    tarefaArrayTitulos['tarefa_id'] = 'ID';
    tarefaArrayTitulos['tarefa_local_id'] = 'NÚCLEO';
    tarefaArrayTitulos['tarefa_local_nome'] = 'NÚCLEO';
    tarefaArrayTitulos['tarefa_observacao'] = 'OBSERVAÇÃO';
    tarefaArrayTitulos['tarefa_para'] = 'PARA';
    tarefaArrayTitulos['tarefa_resolvido'] = 'SITUAÇÃO';
    tarefaArrayTitulos['tarefa_tarefa'] = 'TAREFA';
    tarefaArrayTitulos['tarefa_tipo'] = 'TIPO';
    tarefaArrayTitulos['tarefa_usuario_nome'] = 'ATENDENTE';
    return tarefaArrayTitulos;
  }
}
