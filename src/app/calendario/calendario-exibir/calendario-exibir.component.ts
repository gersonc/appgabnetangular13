import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {AuthenticationService} from '../../_services';
import {Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {saveAs} from 'file-saver';

import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {EventoInterface} from "../_models/evento-interface";
import {CalendarioService} from "../_services/calendario.service";
import {Stripslashes} from "../../shared/functions/stripslashes";

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
  @Output() onDetalhe = new EventEmitter<any>();
  @ViewChild('tabcalendario', {static: true}) tabcalendario: ElementRef;

  ev: EventoInterface = null;
  evento: EventoInterface = null;
  eve: any = null;

  scrollPanelStyle = 'detalhefull';
  tituloEstilo: {};
  subTituloStyle: {};
  subTituloStyleLink: {};
  headerStyle = 'var(--primary-color)';
  prioridadeStyle: {};
  calendarioStatusStyle: {};
  localStyle: {};
  //calendarioStatus: string = null;
  tipoStyle: {};
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

  // config: any = null;
  windowObjectReference = null;
  largura: number;
  altura: number;

  description: string | null = null;

  modulo: string = null;
  registro_id: any = null;

  constructor(
    public authenticationService: AuthenticationService,
    public cl: CalendarioService
  ) {
  }

  ngOnInit(): void {
    this.carregaDados();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.dados.currentValue !== 'undefined') {
      if (changes.dados.currentValue.acao === 'exibir') {
        this.carregaDados();
      }
    }
  }

  carregaDados() {
    this.ev = this.dados.data.ev;
    this.startStr = this.dados.data.startStr;
    this.endStr = this.dados.data.endStr;
    this.mostrabts = this.dados.data.mostrabts;
    this.largura = this.dados.data.largura;
    this.altura = this.dados.data.altura;
    this.criaEvento();
  }

  criaEvento() {
    console.log('criaEvento', this.dados);
    this.description = Stripslashes(this.ev.description);
    this.prioridadeStyle = null;
    this.calendarioStatusStyle = null;
    this.tipoStyle = null;
    if (this.ev.backgroundColor === undefined) {
      this.ev.backgroundColor = 'var(--primary-color)';
    }
    if (this.ev.borderColor === undefined) {
      this.ev.borderColor = 'transparent';
    }
    this.tituloEstilo = {
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      borderColor: this.ev.borderColor,
    };
    this.subTituloStyle = {
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      borderColor: this.ev.borderColor,
    };
    this.subTituloStyleLink = {
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      borderColor: this.ev.borderColor,
      cursor: 'pointer'
    };

    if (this.ev.prioridade_color !== undefined) {
      this.prioridadeStyle = {
        backgroundColor: this.ev.prioridade_color,
        color: this.getContrastYIQ(this.ev.prioridade_color)
      };
    } else {
      this.prioridadeStyle = this.subTituloStyle;
    }


    if (this.ev.calendario_status_color !== undefined) {
      this.calendarioStatusStyle = {
        backgroundColor: this.ev.calendario_status_color,
        color: this.getContrastYIQ(this.ev.calendario_status_color)
      };
    } else {
      this.calendarioStatusStyle = this.subTituloStyle;
    }


    if (this.ev.type_color !== undefined) {
      this.tipoStyle = {
        backgroundColor: this.ev.type_color,
        color: this.getContrastYIQ(this.ev.type_color)
      };
    } else {
      this.tipoStyle = this.subTituloStyle;
    }


    if (this.ev.local_color !== undefined) {
      this.localStyle = {
        backgroundColor: this.ev.local_color,
        color: this.getContrastYIQ(this.ev.local_color)
      };
    } else {
      this.tipoStyle = this.subTituloStyle;
    }

    if (this.ev.modulo !== undefined) {
      this.modulo = this.ev.modulo;
      this.registro_id = this.ev.registro_id;
    }


  }

  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  getPdf(imprimir = false) {

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
          const file = new File([ar], nome, {type: 'text/calendar'});
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

  detalhe() {
    console.log('detalhe', this.ev);
    const dt: any = {
      modulo: this.modulo,
      id: this.registro_id
    }
    console.log('detalhe2', dt);
    this.onDetalhe.emit(dt);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
