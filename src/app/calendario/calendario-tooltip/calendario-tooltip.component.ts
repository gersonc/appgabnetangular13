import {
  Component, Input, OnChanges,
  OnDestroy, SimpleChanges, ViewChild,
  OnInit,  ElementRef
} from '@angular/core';
import { WindowsService } from '../../_layout/_service';
import { Evento } from '../_models';


@Component({
  selector: 'app-calendario-tooltip',
  templateUrl: './calendario-tooltip.component.html',
  styleUrls: ['./calendario-tooltip.component.css']
})
export class CalendarioTooltipComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('ctt', { static: true }) ctt: ElementRef;
  @Input() evT: any;
  @Input() largura: number;
  @Input() altura: number;
  ev: Evento;
  jsEvent: any;
  currentStyles: {};
  currentEstilo: {};
  tituloEstilo: {};
  extendedProps: any;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.evT) {
      if (changes.evT.currentValue) {
        this.jsEvent = changes.evT.currentValue.jsEvent;
        this.ev = changes.evT.currentValue.ev;
        this.calculaCoordenadas();
      }
    }
  }

  calculaCoordenadas() {
    let diamTelaX: number;
    let diamTelaY: number;
    let baseX: number;
    let baseY: number;
    let tamX: any;

    diamTelaX = this.largura;
    diamTelaY = this.altura;

    if (this.largura <= 300) {
      tamX = this.largura;
    }

    if (this.largura > 300 && this.largura <= 576) {
      tamX = this.largura * 0.9;
    }
    if (this.largura > 576) {
      tamX = 300;
    }

    baseX = (this.jsEvent.x + ((this.jsEvent.target.offsetWidth / 2) - this.jsEvent.offsetX)) - (tamX / 2);
    if (baseX < 5) {
      baseX = 5;
    }
    if ((baseX + tamX) > (diamTelaX - 5)) {
      baseX = baseX - ((baseX + tamX) - (diamTelaX - 5));
    }
    baseY = this.jsEvent.y - (this.jsEvent.offsetY);

    this.currentStyles = {
      position: 'fixed',
      top: baseY + 'px',
      left: baseX + 'px',
      zIndex : 10000,

    };

    this.currentEstilo = {
      position: 'absolute',
      bottom: '5px',
      left: 0,
      padding: '3px',
      overflow: 'hidden',
      borderRadius: '5px',
      boxSizing: 'border-box',
      width: tamX + 'px',
      maxHeight: '150px',
      backgroundColor: this.ev.backgroundColor,
      fontSize: 'small'
    };

    this.tituloEstilo = {
      fontSize: 'small',
      padding: '3px',
      color: this.ev.textColor
    };
  }

  ngOnDestroy(): void {

  }

}
