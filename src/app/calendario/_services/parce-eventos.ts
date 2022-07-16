import {RRule, rrulestr } from 'rrule'
import {EventoInterface} from "../_models/evento-interface";


export function ParceEventos(eventos: EventoInterface[]): EventoInterface[] {
  return eventos.map( ev => {
    if (ev.rrule !== undefined && ev.rrule !== null && ev.rrule !== '') {
      const r = rrulestr(ev.rrule);
      ev.rrule = r.origOptions;
    }
    return ev;
  });

}
