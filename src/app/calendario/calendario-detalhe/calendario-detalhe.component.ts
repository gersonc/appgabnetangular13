import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EventoInterface} from "../_models/evento-interface";
import {Evento} from "../_models/calendario";
import {Stripslashes} from "../../shared/functions/stripslashes";

@Component({
  selector: 'app-calendario-detalhe',
  templateUrl: './calendario-detalhe.component.html',
  styleUrls: ['./calendario-detalhe.component.css']
})
export class CalendarioDetalheComponent implements OnInit, OnChanges {

  @Input() evT: Evento | null;
  ev: EventoInterface = null;

  tituloEstilo: {};
  subTituloStyle: {};
  subTituloStyleLink: {};
  prioridadeStyle: {};
  calendarioStatusStyle: {};
  tipoStyle: {};
  localStyle: {};
  description: string | null = null;

  windowObjectReference = null;

  Object = Object;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.evT) {
      if (changes.evT.currentValue !== null) {
        this.ev = new Evento();
        const ev = changes.evT.currentValue;
        this.description = (ev.description !== undefined && ev.description !== null) ? Stripslashes(ev.description) : null;
        this.ev = ev;
        this.criaEvento();
      }
    }
  }

  criaEvento() {
    this.prioridadeStyle = null;
    this.calendarioStatusStyle = null;
    this.tipoStyle = null;
    this.localStyle = null;
    if (this.ev.backgroundColor === 'var(--ativo)') {
      this.ev.backgroundColor = 'var(--primary-color)';
    }


    this.tituloEstilo = {
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
    };
    this.subTituloStyle = {
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
    };
    this.subTituloStyleLink = {
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
    };


    if (this.ev.prioridade_color) {
      this.prioridadeStyle = {
        backgroundColor: this.ev.prioridade_color,
        color: this.getContrastYIQ(this.ev.prioridade_color)
      }
    } else {
      this.prioridadeStyle = this.subTituloStyle;
    }


    if (this.ev.calendario_status_color) {
      this.calendarioStatusStyle = {
        backgroundColor: this.ev.calendario_status_color,
        color: this.getContrastYIQ(this.ev.calendario_status_color)
      };
    } else {
      this.calendarioStatusStyle = this.subTituloStyle;
    }


    if (this.ev.type_color) {
      this.tipoStyle = {
        backgroundColor: this.ev.type_color,
        color: this.getContrastYIQ(this.ev.type_color)
      };
    } else {
      this.tipoStyle = this.subTituloStyle;
    }

    if (this.ev.local_color) {
      this.localStyle = {
        backgroundColor: this.ev.local_color,
        color: this.getContrastYIQ(this.ev.local_color)
      };
    } else {
      this.tipoStyle = this.subTituloStyle;
    }

  }

  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 2), 16);
    const b = parseInt(hexcolor.substring(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'var(--surface-900)' : 'var(--surface-0)';
  }

  openRequestedSinglePopup(url) {
    // tslint:disable-next-line:max-line-length
    const feat = 'height=300px,width=600px,resizable=yes,scrollbars=yes,status=yes,menubar=yes';
    if (this.windowObjectReference == null || this.windowObjectReference.closed) {
      this.windowObjectReference = window.open(url, 'SingleSecondaryWindowName', feat);
      this.windowObjectReference.focus();
    }
  }

  stripslashes(valor: undefined | null | string): string | null {
    return Stripslashes(valor);
  }

}
