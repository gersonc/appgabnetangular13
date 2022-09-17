export interface TarefaFormI2 {
  tarefa_id?: number;
  tarefa_usuario_autor_id?: number;
  tarefa_usuario_id?: number | number[];
  tarefa_data?: string;
  // tarefa_hora?: string;
  tarefa_titulo?: string;
  tarefa_tarefa?: string;
  tarefa_tarefa_delta?: string;
  tarefa_tarefa_texto?: string;
  tarefa_email?: boolean;
  agenda?: boolean;
  todos_usuarios_sn?: number;
  usuario_id?: number[];
  conta_calendario_id?: number;
  tipo_listagem?: string;
}
