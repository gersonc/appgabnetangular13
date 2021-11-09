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
  selector: 'app-arquivo-view',
  templateUrl: './arquivo-view.component.html',
  styleUrls: ['./arquivo-view.component.css']
})
export class ArquivoViewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() apagar = false; // apagar
  @Input() modulo: string;
  @Input() registro_id = 0;
  @Input() modelo = 'detalhe'; // Onde irá aparecer (Formilário, Detalhe etc.
  @Output() onBlockSubmit = new EventEmitter<boolean>();


  private baixar = false;
  public arquivos: ArquivoInterface[] = [];
  public horizontal = false;
  private modeloExcluir = false;
  public msg: string = null;
  private sub: Subscription[] = [];
  public mostraExcluir = false;

  constructor(
    public as: ArquivoService,
    public authenticationService: AuthenticationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
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
  }

  ngOnInit() {

    this.sub.push(this.as.getArquivloListagem().subscribe({
      next: value => {
        this.arquivos = value;
      }
    }));

    if (this.horizontal && this.modeloExcluir) {
      this.mostraAvisoExcluir();
    }

    // this.as.getArquivos(this.modulo, this.registro_id);
    this.baixar = this.authenticationService.arquivos_baixar;
    if (this.apagar && !this.authenticationService.arquivos_apagar) {
      this.apagar = false;
    }
  }

  /*clickArquivo2(arq: ArquivoInterface) {
    this.as.getDownload(arq.arquivo_id, arq.arquivo_nome_original);
  }*/

  clickArquivo(arq: ArquivoInterface) {
    // this.as.getDownload(arq.arquivo_nome_original, arq.arquivo_nome_s3);
    // this.as.getDownload2(arq.arquivo_nome_original, arq.arquivo_url_s3);

    saveAs(arq.arquivo_url_s3, arq.arquivo_nome_original);
    // this.as.getDonloadS3(arq.arquivo_url_s3);
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

  mostraAvisoExcluir() {
    if (this.as._arquivos.length > 0) {
      if (!this.authenticationService.arquivos_apagar) {
        this.msg = 'ATENÇÃO!!! Este registro possui arquivos vinculados a ele e você não tem permissão de exclui-los.';
        this.onBlockSubmit.emit(true);
      } else {
        this.msg = 'ATENÇÃO!!! Ao excluir este registro, todos os arquivos relacionados a ele serão excluido.';
      }
    }
  }

}
