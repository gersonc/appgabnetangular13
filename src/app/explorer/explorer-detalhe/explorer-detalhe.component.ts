import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {OverlayPanel} from "primeng/overlaypanel";
import {ArquivoListagem, PastaListagem} from "../_models/arquivo-pasta.interface";
import {MenuItem} from "primeng/api";
import {ExplorerService} from "../_services/explorer.service";
import {ArquivoService} from "../../arquivo/_services";
import {ArquivoInterface} from "../../arquivo/_models";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-explorer-detalhe',
  templateUrl: './explorer-detalhe.component.html',
  styleUrls: ['./explorer-detalhe.component.css']
})
export class ExplorerDetalheComponent implements OnInit, OnChanges {
  @ViewChild('ovlp', { static: true }) public ovlp: OverlayPanel;
  @Input() arquivo?: ArquivoInterface;
  @Output() onBlockSubmit = new EventEmitter<boolean>();

  mostraMenu = true;
  mostraRenomear = false;
  mostraApagar = true;
  urlbackGround = '/assets/icons/folder.png';
  urlbackGroundButton = '/assets/icons/folder.png';
  arquivoInterno: any = null;

  itemsFolder: MenuItem[];
  itemsFile: MenuItem[];

  constructor(
    public exs: ExplorerService,
    public as: ArquivoService
  ) { }

  ngOnInit(): void {
  }


  onApagarArquivo() {
    this.exs.apagarArquivo(this.arquivo.arquivo_id);
  }

  excluir(arq: ArquivoInterface) {
    this.onBlockSubmit.emit(true);
    this.as.deleteArquivo(arq)
      .pipe(take(1))
      .subscribe( () => {
          this.onBlockSubmit.emit(false);
        }
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.arquivo) {
      this.arquivoInterno = changes.arquivo.currentValue;
      this.urlbackGround = 'url("' + this.as.getClassNameForExtension(this.arquivo.arquivo_tipo) + '")' + ' no-repeat center'
      this.urlbackGroundButton = 'assets/icons/' + this.as.getClassNameForExtension(this.arquivo.arquivo_tipo);
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


  onMostraApagar() {
    this.mostraApagar = true;
    this.mostraMenu = false;
  }




}
