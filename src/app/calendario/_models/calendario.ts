import {Frequency, Options} from 'rrule';
import {EventoInterface} from "./eventoInterface";

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
  classNames = null;
  color = null;
  textColor = null;
  url = null;
  description = null;
  local_id = null;
  local_nome = null;
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
  todos_usuarios_sn = null;
}

export interface CalendarioFormularioInterface extends EventoInterface {
  id?: string;
  groupId?: string;
  allDay?: boolean;
  duration?: string;
  end?: string;
  fim?: string;
  recorrente?: boolean;
  rrule?: string | any;
  start?: Date;
  backgroundColor?: string;
  classNames?: string;
  color?: string;
  textColor?: string;
  url?: string;
  description?: string;
  local_id?: number;
  local_nome?: string;
  observacao?: string;
  title?: string;
  todos_usuarios_sn?: number;
  usuario_id?: string | number[];
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
  allDay?: number | boolean;
  duration?: string;
  end?: string;
  fim?: string;
  rrule?: string | any;
  exdate?: string | string[];
  start?: string;
  recorrente?: boolean;
}

export interface CalEstruturaInterface {
  backgroundColor?: string;
  textColor?: string;
  url?: string;
}

export interface CalDadosInterface {
  title?: string;
  local_id?: number;
  local_nome?: string;
  observacao?: string;
  description?: string;
  usuario_id?: number[];
  todos_usuarios_sn?: number;
  type_id?: number;
  prioridade_id?: number;
  calendario_status_id?: number;
}

export interface CalInterface {
  id?: string;
  groupId?: string;
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
  local_id = null;
  local_nome = null;
  observacao = null;
  title = null;
  usuario_id = null;
  todos_usuarios_sn = null;
  type_id = null;
  prioridade_id = null;
  calendario_status_id = null;
}

export class Cal implements CalInterface {
  id = null;
  groupId = null;
  calDados = null;
  calExtrutura = null;
  calData = null;
}

export interface CalBuscaInterface {
  bsStart?: Date | string;
  bsFim?: Date | string;
  bsTituloIni?: string;
  bsTitulo?: string;
  bsObsIni?: string;
  bsObs?: string;
  bsType_id?: number;
  bsPrioridade_id?: number;
  bsLocal_id?: number;
  bsStatus_id?: number;
  bsAtivo?: boolean;
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

