import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ExplorerService} from "../_services/explorer.service";
import {ArquivoListagem, Caminho, PastaListagem} from "../_models/arquivo-pasta.interface";
import {ArquivoService} from "../../arquivo/_services";
import {MenuItem} from "primeng/api";
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";

@Component({
  selector: 'app-explorer-listagem',
  templateUrl: './explorer-listagem.component.html',
  styleUrls: ['./explorer-listagem.component.css']
})
export class ExplorerListagemComponent implements OnInit, OnChanges {
  @Input() pasta?: PastaListagem;
  @Input() arquivo?: ArquivoListagem;


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
    this.itemsFolder = [
      {
        label: 'Renomear',
        command: event => {
          console.log(event);
        }
      },
      {
        label: 'Apagar',
        command: event => {
          this.onApagarFolder();
        }
      }
    ];

    this.itemsFile = [
      {
        label: 'Download',
        command: event => {
          // window.open(this.arquivo.arquivo_url_s3,'_blank', 'noopener');
          FileSaver(this.arquivo.arquivo_url_s3, this.arquivo.arquivo_nome_original)
        }
      },
      {
        label: 'Apagar',
        command: event => {
          this.onDownload();
        }
      }
    ];

  }

  onDownload() {
    // saveAs(this.arquivo.arquivo_url_s3, this.arquivo.arquivo_nome_original);
    // window.open(this.arquivo.arquivo_url_s3,'_blank', 'noopener');
    /*this.exs.getDownload(this.arquivo.arquivo_url_s3)
      .subscribe(blob => saveAs(blob, this.arquivo.arquivo_nome_original));*/

    this.exs.getDownload(this.arquivo.arquivo_url_s3)
      .subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = 'archive.zip';
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
  }

  onApagarFolder() {
    console.log('apagar', this.pasta);
  }

  onApagarArquivo() {
    console.log('apagar', this.arquivo);
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

  onDelete(arquivo: ArquivoListagem){
    console.log(arquivo);
  }

  onClickPasta(id: number) {
      this.exs.addCaminho(id);
  }


}
