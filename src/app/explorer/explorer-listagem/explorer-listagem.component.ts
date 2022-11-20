import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ExplorerService} from "../_services/explorer.service";
import {ArquivoListagem, Caminho, PastaListagem} from "../_models/arquivo-pasta.interface";
import {ArquivoService} from "../../arquivo/_services";
import {MenuItem} from "primeng/api";
import {OverlayPanel} from "primeng/overlaypanel";
import {ExplorerDownloadService} from "../_services/explorer-download.service";
import {ArquivoInterface} from "../../arquivo/_models";

@Component({
  selector: 'app-explorer-listagem',
  templateUrl: './explorer-listagem.component.html',
  styleUrls: ['./explorer-listagem.component.css']
})
export class ExplorerListagemComponent implements OnInit, OnChanges {
  @ViewChild('ovlp', { static: true }) public ovlp: OverlayPanel;
  @Input() pasta?: PastaListagem;
  @Input() arquivo?: ArquivoListagem;

  mostraDialog = false;
  mostraMenu = true;
  mostraRenomear = false;
  mostraApagar = true;
  urlbackGround = '/assets/icons/folder.png';
  urlbackGroundButton = '/assets/icons/folder.png';
  arquivoInterno: any = null;
  arquivoDown: ArquivoInterface = null;
  display = false;

  arqTipo = 'outros';
  imgSN = false;
  vidSN = false;
  audSN = false;
  outosSN = false;

  tipo = 'pasta';

  itemsFolder: MenuItem[];
  itemsFile: MenuItem[];

  constructor(
    public exs: ExplorerService,
    public as: ExplorerDownloadService
  ) { }

  ngOnInit(): void {
  }


  onApagarArquivo() {
    this.exs.apagarArquivo(this.arquivo.arquivo_id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.arquivo) {
      this.tipo = 'arquivo';
      this.arquivoInterno = changes.arquivo.currentValue;
      this.testaTipo(this.as.getTipoArquivo(this.arquivo.arquivo_tipo));
      this.urlbackGround = 'url("' + this.as.getClassNameForExtension(this.arquivo.arquivo_tipo) + '")' + ' no-repeat center';
      this.urlbackGroundButton = 'assets/icons/' + this.as.getClassNameForExtension(this.arquivo.arquivo_tipo);
    }
    if (changes.pasta) {
      this.tipo = 'pasta';
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

  testaTipo(tp: string) {
    this.arqTipo = tp;
    this.imgSN = (tp==='imagem');
    this.vidSN = (tp==='video');
    this.audSN = (tp==='audio');
    this.outosSN = (tp==='outros');
  }

  onMostraApagar() {
    this.mostraApagar = true;
    this.mostraMenu = false;
  }

  onRightClickPasta(ev) {
    ev.preventDefault();
    this.mostraApagar = this.pasta.arquivo_pasta_id > 20;
    ev.target.auxclick;
  }

  apagarPasta() {
    this.exs.apagarPasta(this.pasta.arquivo_pasta_id);
  }

  download() {
    this.as.donloadArq(this.arquivo.arquivo_url_s3, this.arquivo.arquivo_nome_original);
  }

  showDialog() {
    this.display = true;
  }




}
