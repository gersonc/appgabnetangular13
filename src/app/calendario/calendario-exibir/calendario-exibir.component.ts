import {Component, ElementRef, OnInit, ViewChild, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AuthenticationService, CarregadorService } from '../../_services';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { saveAs } from 'file-saver';

import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {EventoInterface} from "../_models/evento-interface";
import {CalendarioService} from "../_services/calendario.service";

declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}
@Component({
  selector: 'app-calendario-exibir',
  templateUrl: './calendario-exibir.component.html',
  styleUrls: ['./calendario-exibir.component.css']
})
export class CalendarioExibirComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dados: any = null;
  @Output() onFechar = new EventEmitter<string | null>();
  @ViewChild('tabcalendario', { static: true }) tabcalendario: ElementRef;

  ev: EventoInterface = null ;
  evento: EventoInterface = null ;
  eve: any = null;

  scrollPanelStyle = 'detalhefull';
  tituloEstilo: {};
  subTituloStyle: {};
  subTituloStyleE: {};
  subTituloStyleD: {};
  subTituloStyleDLink: {};
  subTituloStyle2ColunasEsq: {};
  subTituloStyle2ColunasDir: {};
  observacaoStyle: {};
  headerStyle = 'var(--primary-color)';
  prioridadeStyle: {};
  prioridadeStyleE: {};
  prioridadeStyleD: {};
  prioridade: string = null;
  prioridadeBgColor: string = null;
  prioridadeColor: string = null;
  calendarioStatusStyle: {};
  calendarioStatusStyleE: {};
  calendarioStatusStyleD: {};
  calendarioStatus: string = null;
  calendarioStatusBgColor: string = null;
  calendarioStatusColor: string = null;
  tipoStyle: {};
  tipo: string = null;
  tipoBgColor: string = null;
  tipoColor: string = null;
  url: string = null;

  sub: Subscription[] = [];
  resp: any[];
  mostra = false;
  mostrabts = true;
  ddunico: SelectItem[] = [
    {label: 'TODAS', value: 'n'},
    {label: 'ATUAL', value: 's'}
  ];
  unico: string = null;
  startStr: string = null;
  endStr: string = null;

  config: any = null;
  windowObjectReference = null;
  largura: number;
  altura: number;

  constructor(
    public authenticationService: AuthenticationService,
    public cl: CalendarioService

) { }

  ngOnInit(): void {
    this.carregaDados();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.dados.currentValue !== 'undefined') {
      if (changes.dados.currentValue.acao === 'exibir') {
        this.config = changes.dados.currentValue;
        this.carregaDados();
      }
    }
  }

  carregaDados() {
    this.ev = this.config.data.ev;
    this.startStr = this.config.data.startStr;
    this.endStr = this.config.data.endStr;
    this.mostrabts = this.config.data.mostrabts;
    this.largura = this.config.data.largura;
    this.altura = this.config.data.altura;
    this.criaEvento();
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
      padding: '.2em .5em .2em .5em',
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      fontSize: '1.2em',
      fontWeight: 500,
      textAlign: 'left',
      borderWidth: '1px 3px 1px 3px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '10px'
    };
    this.subTituloStyle = {
      padding: '.2em .5em .2em .5em',
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      fontSize: '1.2em',
      opacity: .8,
      fontWeight: 400,
      borderWidth: '1px 3px 1px 3px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '10px'
    };

    this.subTituloStyleE = {
      padding: '.2em .5em .2em .5em',
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      fontSize: '1em',
      opacity: .8,
      fontWeight: 400,
      borderWidth: '1px 3px 1px 3px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '10px',
      marginRight: '3px'
    };

    this.subTituloStyleDLink = {
      padding: '.2em .5em .2em .5em',
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      fontSize: '1em',
      opacity: .8,
      fontWeight: 400,
      borderWidth: '1px 3px 1px 3px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '10px',
      marginRight: '3px',
      cursor: 'pointer'
    };

    this.subTituloStyleD = {
      padding: '.2em .5em .2em .5em',
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      fontSize: '1em',
      opacity: .8,
      fontWeight: 400,
      borderWidth: '1px 3px 1px 3px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '10px'
    };

    if (this.ev.prioridade_id) {
      if (this.ev.prioridade_id > 1) {
        this.prioridade = this.ev.prioridade_nome;
        if (this.ev.prioridade_color) {
          this.prioridadeBgColor = this.ev.prioridade_color;
          this.prioridadeColor = this.getContrastYIQ(this.ev.prioridade_color);
          this.prioridadeStyleE = this.subTituloStyleE;
          this.prioridadeStyleE = {
            padding: '.2em .5em .2em .5em',
            backgroundColor: this.prioridadeBgColor,
            color: this.prioridadeColor,
            fontSize: '1em',
            opacity: .8,
            fontWeight: 400,
            borderWidth: '1px 2px 1px 2px',
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderRadius: '10px',
            marginRight: '3px'
          };
          this.prioridadeStyleD = {
            padding: '.2em .5em .2em .5em',
            backgroundColor: this.prioridadeBgColor,
            color: this.prioridadeColor,
            fontSize: '1em',
            opacity: .8,
            fontWeight: 400,
            borderWidth: '1px 2px 1px 2px',
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderRadius: '10px'
          };
        } else {
          this.prioridadeStyleE = this.subTituloStyleE;
          this.prioridadeStyleD = this.subTituloStyleD;
        }
      }
    }

    if (this.ev.calendario_status_id) {
      if (this.ev.calendario_status_id > 1) {
        this.calendarioStatus = this.ev.calendario_status_nome;
        if (this.ev.calendario_status_color) {
          this.calendarioStatusBgColor = this.ev.calendario_status_color;
          this.calendarioStatusColor = this.getContrastYIQ(this.ev.calendario_status_color);
          this.calendarioStatusStyleE = {
            backgroundColor: this.calendarioStatusBgColor,
            color: this.calendarioStatusColor,
            fontSize: '1em',
            opacity: .8,
            fontWeight: 400,
            borderWidth: '1px 2px 1px 2px',
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderRadius: '10px',
            marginRight: '3px'
          };
          this.calendarioStatusStyleD = {
            backgroundColor: this.calendarioStatusBgColor,
            color: this.calendarioStatusColor,
            fontSize: '1em',
            opacity: .8,
            fontWeight: 400,
            borderWidth: '1px 2px 1px 2px',
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderRadius: '10px'
          };
        } else {
          this.calendarioStatusStyleE = this.subTituloStyleE;
          this.calendarioStatusStyleD = this.subTituloStyleD;
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
            padding: '.2em .5em .2em .5em',
            backgroundColor: this.tipoBgColor,
            color: this.prioridadeColor,
            fontSize: '1em',
            opacity: .8,
            fontWeight: 400,
            borderWidth: '1px 2px 1px 2px',
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderRadius: '10px'
          };
        } else {
          this.tipoStyle = this.subTituloStyle;
        }
      }
    }

    this.observacaoStyle = {
      padding: '.2em .5em .2em .5em',
      backgroundColor: 'var(--claro)',
      borderWidth: '1px 2px 1px 2px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '10px'
    };

  }

  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  getPdf (imprimir = false) {

    const fileName = `calendario_${new Date().getTime()}.pdf`;

    // @ts-ignore
    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );

    doc.setFontSize(15);
    doc.text('CALENDARIO', 15, 15);
    doc.setFontSize(8);
    autoTable(doc, {
      startY: 20,
      html: this.tabcalendario.nativeElement
    });

    setTimeout(() => {
      if (imprimir === false) {
        doc.save(fileName);
      } else {
        doc.autoPrint();
        window.open(doc.output('bloburl'));
      }
    }, 500);


  }

  fechar() {
    this.onFechar.emit(null);
  }

  editar() {
    this.onFechar.emit('alterar');
  }

  excluir() {
    this.onFechar.emit('apagar');
  }

  exportar() {
    if (this.ev.recorrente) {
      this.mostra = true;
    } else {
      this.exportaIcs();
    }
  }

  exportaIcs() {
    let inicio = null;
    let fim = null;
    if (this.unico) {
      inicio = this.startStr ? this.startStr : null;
      fim = this.endStr ? this.endStr : null;
    }

    const nome = 'GabNet_' + this.ev.id + '_' + this.startStr.replace(':', '-').replace('.', '_') + '.ics';

    this.sub.push(this.cl.eventoGetIcs(+this.ev.id, this.unico, inicio, fim)
      .pipe(take(1))
      .subscribe({
        next: (ar) => {
          const file = new File([ar], nome, { type: 'text/calendar' });
          saveAs(file);
        },
        error: err => {
          console.error(err.toString());
          // this.mostraSpinner.next( false);
        },
        complete: () => {
          // this.mostraSpinner.next( false);
          // console.log('fim');
        }
      })
    );
  }

  mudaUnico(evt) {
    this.unico = evt.value;
    this.exportaIcs();
  }

  openRequestedSinglePopup(url) {
    // tslint:disable-next-line:max-line-length
    const feat: string = 'height=' + this.altura / 2 + ',width=' + this.largura / 2 + ',resizable=yes,scrollbars=yes,status=yes,menubar=yes';
    if (this.windowObjectReference == null || this.windowObjectReference.closed) {
      this.windowObjectReference = window.open(url, 'SingleSecondaryWindowName', feat);
      this.windowObjectReference.focus();
    } else {
      if (this.url !== url) {
        this.windowObjectReference = window.open(url, 'SingleSecondaryWindowName', feat);
        this.windowObjectReference.focus();
      } else {
        this.windowObjectReference.focus();
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
