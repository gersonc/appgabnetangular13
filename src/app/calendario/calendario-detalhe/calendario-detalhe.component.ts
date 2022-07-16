import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {EventoInterface} from "../_models/evento-interface";
import {Evento} from "../_models/calendario";

@Component({
  selector: 'app-calendario-detalhe',
  templateUrl: './calendario-detalhe.component.html',
  styleUrls: ['./calendario-detalhe.component.css']
})
export class CalendarioDetalheComponent implements OnInit, OnChanges {

  @Input() evT: Evento | null;
  ev: EventoInterface = null ;

  scrollPanelStyle = 'detalhefull';
  tituloEstilo: {};
  subTituloStyle: {};
  subTituloStyleLink: {};
  observacaoStyle: {};
  headerStyle = 'var(--primary-color)';
  prioridadeStyle: {};
  prioridade: string = null;
  prioridadeBgColor: string = null;
  prioridadeColor: string = null;
  calendarioStatusStyle: {};
  calendarioStatus: string = null;
  calendarioStatusBgColor: string = null;
  calendarioStatusColor: string = null;
  tipoStyle: {};
  tipo: string = null;
  tipoBgColor: string = null;
  tipoColor: string = null;
  windowObjectReference = null;

  Object = Object;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.evT) {
      if (changes.evT.currentValue !== null) {
        this.ev = new Evento();
        this.ev = changes.evT.currentValue;
        this.criaEvento();
      }
    }
  }

  criaEvento() {
    this.prioridadeStyle = null;
    this.prioridade = null;
    this.prioridadeBgColor = null;
    this.prioridadeColor = null;
    this.calendarioStatusStyle = null;
    this.calendarioStatus = null;
    this.calendarioStatusBgColor = null;
    this.calendarioStatusColor = null;
    this.tipoStyle = null;
    this.tipo = null;
    this.tipoBgColor = null;
    this.tipoColor = null;
    if (this.ev.backgroundColor === 'var(--ativo)') {
      this.ev.backgroundColor = 'var(--primary-color)';
    }



    this.tituloEstilo = {
      padding: '0 5px 0 5px',
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      fontSize: '1.2em',
      fontWeight: 500,
      borderRadius: '5px',
      marginBottom: '5px'
    };
    this.subTituloStyle = {
      padding: '0 5px 0 5px',
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      opacity: .8,
      fontWeight: 400,
      borderRadius: '5px',
      marginBottom: '3px'
    };
    this.subTituloStyleLink = {
      padding: '0 5px 0 5px',
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      opacity: .8,
      fontWeight: 400,
      borderRadius: '5px',
      marginBottom: '3px',
      cursor: 'pointer'
    };

    if (this.ev.prioridade_id) {
      if (this.ev.prioridade_id > 1) {
        this.prioridade = this.ev.prioridade_nome;
        if (this.ev.prioridade_color) {
          this.prioridadeBgColor = this.ev.prioridade_color;
          this.prioridadeColor = this.getContrastYIQ(this.ev.prioridade_color);
          this.prioridadeStyle = {
            padding: '0 5px 0 5px',
            backgroundColor: this.prioridadeBgColor,
            color: this.prioridadeColor,
            opacity: .8,
            fontWeight: 400,
            borderRadius: '5px',
            marginBottom: '3px'
          };
        } else {
          this.prioridadeStyle = this.subTituloStyle;
        }
      }
    }

    if (this.ev.calendario_status_id) {
      if (this.ev.calendario_status_id > 1) {
        this.calendarioStatus = this.ev.calendario_status_nome;
        if (this.ev.calendario_status_color) {
          this.calendarioStatusBgColor = this.ev.calendario_status_color;
          this.calendarioStatusColor = this.getContrastYIQ(this.ev.calendario_status_color);
          this.calendarioStatusStyle = {
            padding: '0 5px 0 5px',
            backgroundColor: this.calendarioStatusBgColor,
            color: this.calendarioStatusColor,
            // opacity: .8,
            fontWeight: 500,
            borderRadius: '5px',
            marginBottom: '3px'
          };
        } else {
          this.calendarioStatusStyle = this.subTituloStyle;
        }
      }
    }

    if (this.ev.type_id) {
      if (this.ev.type_id > 1) {
        this.tipo = this.ev.type_name;
        if (this.ev.type_color) {
          this.tipoBgColor = this.ev.type_color;
          this.tipoColor = this.getContrastYIQ(this.ev.type_color);
          this.tipoStyle = {
            padding: '0 5px 0 5px',
            backgroundColor: this.tipoBgColor,
            color: this.prioridadeColor,
            opacity: .8,
            fontWeight: 500,
            borderRadius: '5px',
            marginBottom: '3px'
          };
        } else {
          this.tipoStyle = this.subTituloStyle;
        }
      }
    }

    this.observacaoStyle = {
      padding: '0 5px 0 5px',
      backgroundColor: 'var(--surface-a)',
      borderRadius: '5px',
      marginBottom: '3px',
      marginTop: '3px'
    };

  }

  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
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

}
