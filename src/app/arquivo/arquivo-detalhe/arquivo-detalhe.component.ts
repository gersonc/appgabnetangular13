import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArquivoService } from '../_services';
import { AuthenticationService } from '../../_services';
import { UrlService } from '../../_services';
import { Subscription } from 'rxjs';
import { ArquivoInterface } from '../_models';
import { take } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-arquivo-detalhe',
  templateUrl: './arquivo-detalhe.component.html',
  styleUrls: ['./arquivo-detalhe.component.css']
})
export class ArquivoDetalheComponent implements OnInit, OnDestroy {
  @Input() arquivos?: ArquivoInterface[];
  @Output() onBlockSubmit = new EventEmitter<boolean>();


  public msg: string = null;
  private sub: Subscription[] = [];


  constructor(
    public as: ArquivoService,
    public authenticationService: AuthenticationService,
  ) { }

  /*ngOnChanges(changes: SimpleChanges): void {
    if (changes.modelo) {
      switch (changes.modelo.currentValue) {
        case 'detalhe': {
          this.horizontal = true;
          break;
        }
        case 'excluir': {
          this.horizontal = true;
          this.modeloExcluir = true;
          this.mostraExcluir = false;
          break;
        }
        case 'analisar': {
          this.horizontal = true;
          this.mostraExcluir = true;
          break;
        }
        case 'alterar': {
          this.horizontal = true;
          this.mostraExcluir = true;
          break;
        }
        default: {
          this.horizontal = false;
          break;
        }

      }

    }
  }*/

  ngOnInit() {

  }


  clickArquivo(arq: ArquivoInterface) {
    saveAs(arq.arquivo_url_s3, arq.arquivo_nome_original);
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

  excluir(arq: ArquivoInterface) {
    this.onBlockSubmit.emit(true);
    this.as.deleteArquivo(arq)
      .pipe(take(1))
      .subscribe( () => {
          this.onBlockSubmit.emit(false);
        }
      );
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => {
      s.unsubscribe();
    });
  }

  getIcone(nome: string): string {
    return '.' + this.as.getClassNameForExtension(nome);
  }


}
