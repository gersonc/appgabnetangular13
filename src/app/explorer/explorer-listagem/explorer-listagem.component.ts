import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ExplorerService} from "../_services/explorer.service";
import {ArquivoListagem, Caminho, PastaListagem} from "../_models/arquivo-pasta.interface";
import {ArquivoService} from "../../arquivo/_services";
import {Subject, Subscription} from "rxjs";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-explorer-listagem',
  templateUrl: './explorer-listagem.component.html',
  styleUrls: ['./explorer-listagem.component.css']
})
export class ExplorerListagemComponent implements OnInit, OnChanges {
  @Input() pasta?: PastaListagem;
  @Input() arquivo?: ArquivoListagem;


  urlbackGround = '/assets/icons/folder.png';
  arquivoInterno: any = null;

  constructor(
    public exs: ExplorerService,
    public as: ArquivoService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.arquivo) {
      this.arquivoInterno = changes.arquivo.currentValue;
      this.urlbackGround = 'url("' + this.as.getClassNameForExtension(this.arquivo.arquivo_tipo) + '")' + ' no-repeat center'
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

  onClick(){

  }

  onClickPasta(id: number) {
      this.exs.addCaminho(id);
  }


}
