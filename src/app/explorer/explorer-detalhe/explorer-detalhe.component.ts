import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {ArquivoService} from "../../arquivo/_services";
import {ArquivoInterface} from "../../arquivo/_models";
import {AuthenticationService} from "../../_services";

@Component({
  selector: 'app-explorer-detalhe',
  templateUrl: './explorer-detalhe.component.html',
  styleUrls: ['./explorer-detalhe.component.css']
})
export class ExplorerDetalheComponent implements OnChanges {
  @Input() arquivo?: ArquivoInterface;
  urlbackGround = '/assets/icons/folder.png';
  arquivoInterno: any = null;

  constructor(
    public alt: AuthenticationService,
    public as: ArquivoService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.arquivo) {
      this.arquivoInterno = changes.arquivo.currentValue;
      this.urlbackGround = 'url("' + this.as.getClassNameForExtension(this.arquivo.arquivo_tipo) + '")' + ' no-repeat center';
    }
  }

  readableBytes(num: number): string {
    const neg = num < 0;
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    if (neg) {
      num = -num;
    }
    if (num < 1) {
      return (neg ? '-' : '') + num + ' B';
    }
    const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1);
    num = Number((num / Math.pow(1000, exponent)).toFixed(2));
    const unit = units[exponent];
    return (neg ? '-' : '') + num + ' ' + unit;
  }

}
