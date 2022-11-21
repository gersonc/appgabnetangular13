export interface ExtendedPropsI {
  start?: Date | null;
  inicio?: string | null;
  duration?: string | null;
  duracao?: string | null;
  tempo?: string | null;
  end?: string | null;
  endHora?: string | null;
  fim?: string | null;
  fimHora?: string | null;
  recorrente?: boolean | null;
  description?: string | null;
  description_delta?: string | null;
  description_texto?: string | null;
  local_id?: number| null;
  local_nome?: string | null;
  local_color?: string | null;
  observacao?: string | null;
  observacao_delta?: string | null;
  observacao_texto?: string | null;
  prioridade_id?: number| null;
  prioridade_nome?: string | null;
  prioridade_color?: string | null;
  calendario_status_id?: number| null;
  calendario_status_nome?: string | null;
  calendario_status_color?: string | null;
  type_id?: number| null;
  type_name?: string | null;
  type_color?: string | null;
  usuario_id?: string | number[]| null;
  modulo?: string | null;
  registro_id?: number| null;
  todos_usuarios_sn?: number| null;
}


export interface EventoInterface {
  id?: string | null;
  groupId?: string | null;
  allDay?: boolean | null;
  duration?: string | null;
  duracao?: string | null;
  tempo?: string | null;
  end?: string | null;
  endHora?: string | null;
  fim?: string | null;
  fimHora?: string | null;
  recorrente?: boolean | null;
  rrule?: string | any;
  exdate?: string | string[]| null;
  start?: Date | null;
  inicio?: string | null;
  backgroundColor?: string | null;
  borderColor?: string | null;
  classNames?: string | null;
  color?: string | null;
  textColor?: string | null;
  url?: string | null;
  description?: string | null;
  description_delta?: string | null;
  description_texto?: string | null;
  local_id?: number| null;
  local_nome?: string | null;
  local_color?: string | null;
  title?: string | null;
  observacao?: string | null;
  observacao_delta?: string | null;
  observacao_texto?: string | null;
  prioridade_id?: number| null;
  prioridade_nome?: string | null;
  prioridade_color?: string | null;
  calendario_status_id?: number| null;
  calendario_status_nome?: string | null;
  calendario_status_color?: string | null;
  type_id?: number| null;
  type_name?: string | null;
  type_color?: string | null;
  usuario_id?: string | number[]| null;
  modulo?: string | null;
  registro_id?: number| null;
  todos_usuarios_sn?: number| null;
  extendedProps?: ExtendedPropsI | null;
}
