import {Frequency, Options} from 'rrule';
import {EventoInterface} from "./evento-interface";

export interface EventoSQLInterface {
  sql: string;
}

export interface EventoTotalInterface {
  num: number;
}

export interface EventoBuscaCampoInterface {
  field: string;
  header: string;
}

export interface EventoUsarioId {
  label: string;
  value: number;
}

export class Evento implements EventoInterface {
  id = null;
  groupId = null;
  allDay = null;
  duration = null;
  duracao = null;
  tempo = null;
  end = null;
  endHora = null;
  fim = null;
  fimHora = null;
  recorrente = null;
  rrule = null;
  start = null;
  inicio = null;
  backgroundColor = null;
  borderColor = null;
  classNames = null;
  color = null;
  textColor = null;
  url = null;
  description = null;
  description_delta = null;
  description_texto = null;
  local_id = null;
  local_nome = null;
  local_color = null;
  title = null;
  observacao = null;
  prioridade_id = null;
  prioridade_nome = null;
  prioridade_color = null;
  calendario_status_id = null;
  calendario_status_nome = null;
  calendario_status_color = null;
  type_id = null;
  type_name = null;
  type_color = null;
  usuario_id = null;
  modulo = null;
  registro_id = null;
  todos_usuarios_sn = null;
  extendedProps = null;
}

export interface CalendarioFormularioInterface extends EventoInterface {
  id?: string | null;
  groupId?: string | null;
  allDay?: boolean | null;
  duration?: string | null;
  end?: string | null;
  fim?: string | null;
  recorrente?: boolean | null;
  rrule?: string | any;
  start?: Date | null;
  backgroundColor?: string | null;
  classNames?: string | null;
  color?: string | null;
  textColor?: string | null;
  url?: string | null;
  description?: string | null;
  description_delta?: string | null;
  description_texto?: string | null;
  local_id?: number | null;
  local_nome?: string | null;
  observacao?: string | null;
  title?: string | null;
  todos_usuarios_sn?: number | null;
  usuario_id?: string | number[] | null;
  registro_id?: number | null;
  modulo?: string | null;
  // usuario_id?: string | EventoUsarioId[];
}

export class CalendarioForm implements CalendarioFormularioInterface {
  id = null;
  groupId = null;
  allDay = null;
  duration = null;
  end = null;
  fim = null;
  recorrente = null;
  rrule = null;
  start = null;
  backgroundColor = null;
  classNames = null;
  color = null;
  textColor = null;
  url = null;
  description = null;
  local_id = null;
  local_nome = null;
  observacao = null;
  title = null;
  todos_usuarios_sn = null;
  usuario_id = null;
  registro_id = null;
  modulo = null;
}

export class Opcoes implements Options {
  freq: Frequency = Frequency.DAILY;
  dtstart: Date = null;
  interval = 1;
  wkst = null;
  count = null;
  until: Date = null;
  tzid = 'America/Sao_Paulo';
  bysetpos = null;
  bymonth = null;
  bymonthday = null;
  bynmonthday = null;
  byyearday = null;
  byweekno = null;
  byweekday = null;
  bynweekday = null;
  byhour = null;
  byminute = null;
  bysecond = null;
  byeaster = null;
}

// CAL ******************************************
// INTERFACE

export interface CalDataInterface {
  allDay?: number | boolean | null;
  duration?: string | null;
  end?: string | null;
  fim?: string | null;
  rrule?: string | any;
  exdate?: string | string[] | null;
  start?: string | null;
  recorrente?: boolean | null;
}

export interface CalEstruturaInterface {
  backgroundColor?: string | null;
  textColor?: string | null;
  url?: string | null;
}

export interface CalDadosInterface {
  title?: string | null;
  local_id?: number | null;
  local_nome?: string | null;
  observacao?: string | null;
  description?: string | null;
  description_delta?: string | null;
  description_texto?: string | null;
  usuario_id?: number[] | null;
  todos_usuarios_sn?: number | null;
  type_id?: number | null;
  prioridade_id?: number | null;
  calendario_status_id?: number | null;
  modulo?: string | null;
  registro_id?: number | null;
}

export interface CalInterface {
  id?: string | null;
  groupId?: string | null;
  calData?: CalDataInterface;
  calExtrutura?: CalEstruturaInterface;
  calDados?: CalDadosInterface;
}

// CLASSE

export class CalData implements CalDataInterface {
  allDay = null;
  duration = null;
  end = null;
  fim = null;
  recorrente = null;
  rrule = null;
  exdate = null;
  start = null;
}

export class CalExtrutura implements CalEstruturaInterface {
  backgroundColor = null;
  textColor = null;
  url = null;
}

export class CalDados implements CalDadosInterface {
  description = null;
  description_delta = null;
  description_texto = null;
  local_id = null;
  local_nome = null;
  observacao = null;
  title = null;
  usuario_id = null;
  todos_usuarios_sn = null;
  type_id = null;
  prioridade_id = null;
  calendario_status_id = null;
  modulo = null;
  registro_id = null;
}

export class Cal implements CalInterface {
  id = null;
  groupId = null;
  calDados = null;
  calExtrutura = null;
  calData = null;
}

export interface CalBuscaInterface {
  bsStart?: Date | string | null;
  bsFim?: Date | string | null;
  bsTituloIni?: string | null;
  bsTitulo?: string | null;
  bsObsIni?: string | null;
  bsObs?: string | null;
  bsType_id?: number | null;
  bsPrioridade_id?: number | null;
  bsLocal_id?: number | null;
  bsStatus_id?: number | null;
  bsAtivo?: boolean | null;
}

export class CalBusca implements CalBuscaInterface {
  bsStart = null;
  bsFim = null;
  bsTituloIni = null;
  bsTitulo = null;
  bsObsIni = null;
  bsObs = null;
  bsType_id = null;
  bsPrioridade_id = null;
  bsLocal_id = null;
  bsStatus_id = null;
  bsAtivo = false;
}

