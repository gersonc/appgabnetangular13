import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import { WindowsService } from '../../_layout/_service';

@Component({
  selector: 'apmenu-contexto',
  templateUrl: './menu-contexto.component.html',
  styleUrls: ['./menu-contexto.component.css']
})
export class MenuContextoComponent implements  OnInit, OnDestroy {
  @Input() evT: any;
  @Input() largura?: number|undefined;
  @Input() altura?: number|undefined;
  jsEvent: any;
  currentStyles?: {};
  currentEstilo?: {};
  tituloEstilo?: {};
  evento: any = null;

  ngOnInit() {

  }

  @HostListener('click', ['$event'])
    onClick($event: any) {
      this.evento = $event;
      console.log('evento click', this.evento);
    }





  calculaCoordenadas() {
    let diamTelaX: number|undefined;
    let diamTelaY: number|undefined;
    let baseX: number;
    let baseY: number;
    let tamX: any;

    diamTelaX = this.largura;
    diamTelaY = this.altura;

    if (this.largura! <= 300) {
      tamX = this.largura;
    }

    if (this.largura! > 300 && this.largura! <= 576) {
      tamX = this.largura! * 0.9;
    }
    if (this.largura! > 576) {
      tamX = 300;
    }

    baseX = (this.jsEvent.x + ((this.jsEvent.target.offsetWidth / 2) - this.jsEvent.offsetX)) - (tamX / 2);
    if (baseX < 5) {
      baseX = 5;
    }
    if ((baseX + tamX) > (diamTelaX! - 5)) {
      baseX = baseX - ((baseX + tamX) - (diamTelaX! - 5));
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
      // backgroundColor: this.ev.backgroundColor,
      fontSize: 'small'
    };

    this.tituloEstilo = {
      fontSize: 'small',
      padding: '3px',
      // color: this.ev.textColor
    };
  }

  ngOnDestroy(): void {

  }

}
