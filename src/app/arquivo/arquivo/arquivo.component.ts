import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { ArquivoService } from '../_services';
import { AuthenticationService } from '../../_services';
import { UrlService } from '../../_services';
import { ArquivoInterface, UploadState } from '../_models';
import { Subscription } from 'rxjs';
import {ArquivoSpinnerService} from '../_services/arquivo-spinner.service';



@Component({
  selector: 'app-arquivo',
  templateUrl: './arquivo.component.html',
  styleUrls: ['./arquivo.component.css']
})
export class ArquivoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() uploadDisabled = true; // Botao upload desativado?
  @Input() enviarArquivos = false;
  @Input() modulo: string;
  @Input() arqs: ArquivoInterface[] = [];
  @Input() registro_id = 0;
  @Input() buscaArquivos = true;
  @Input() stiloClass: string = null;
  @Input() modelo: string; // 'incluir', 'alterar', 'exibir',Onde irá aparecer (Formilário, Detalhe etc.
  @Input() clearArquivos = false;
  @Output() arqsChange = new EventEmitter<ArquivoInterface[]>();
  @Output() onBlockSubmit = new EventEmitter<boolean>();
  @Output() onUpload = new EventEmitter<boolean>();
  @Output() onPossuiArquivos = new EventEmitter<boolean>();
  @Output() onProgress = new EventEmitter<number>();
  @Output() onInicioEnvio = new EventEmitter();
  @Output() onArquivosGravados = new EventEmitter<ArquivoInterface[]>()
  @Output() onApagar = new EventEmitter<ArquivoInterface>();

  public listaArquivos = false;
  public showCancelButton = true;
  public showUploadButton = true;
  public uploadAtivo = false;
  // private url;
  public mostraSpinner = false;
  public modeloView = 'detalhe';
  public mostraH6 = false;
  // public fuRegistro_id = 0;
  public fuClearArquivos = false;
  public fuBtnUplDisabled = false;
  public fuEnviarArquivos = false;
  private sub: Subscription[] = [];
  private msg: string = null;
  public mostraView = false;
  public modo: string = null;
  private incluir = false;
  public disabled = true;
  public drag = false;

  constructor(
    private as: ArquivoService,
    private aut: AuthenticationService,
    private ur: UrlService,
    public ass: ArquivoSpinnerService
    ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*if (changes.modulo) {
      this.url = this.ur.arquivo + '/' + changes.modulo.currentValue + '/';
    }*/
    /*if (changes.classe) {
      this.topo = changes.classe.currentValue;
    }*/
    /*if (changes.stiloClass) {
      this.stiloClasse = changes.stiloClass.currentValue;
    }*/
    if (changes.uploadDisabled) {
      if (this.as.arquivosPermissoes.value.config_cota_disponivel > 0) {
        this.disabled = changes.uploadDisabled.currentValue;
      }
    }
    if (changes.modelo) {
      switch (changes.modelo.currentValue) {
        case 'incluir': {
          this.mostraH6 = true;
          this.showUploadButton = false;
          this.listaArquivos = false;
          this.modeloView = changes.modelo.currentValue;
          this.modo = 'advanced';
          this.incluir = true;
          break;
        }
        case 'alterar': {
          this.mostraH6 = true;
          this.listaArquivos = true;
          this.showUploadButton = false; // acho que e false
          this.modo = 'basic';
          this.incluir = true;
          this.uploadAtivo = true;
          this.modeloView = changes.modelo.currentValue;
          break;
        }
        case 'detalhe': {
          this.mostraH6 = false;
          this.listaArquivos = true;
          this.disabled = true;
          this.showUploadButton = false;
          this.incluir = false;
          this.modeloView = changes.modelo.currentValue;
          break;
        }
        case 'analisar': {
          this.mostraH6 = false;
          this.listaArquivos = false;
          this.disabled = false;
          this.showUploadButton = false;
          this.modo = 'basic';
          this.incluir = true;
          this.modeloView = changes.modelo.currentValue;
          break;
        }
        case 'analisarprocesso': {
          this.mostraH6 = false;
          this.listaArquivos = false;
          this.disabled = false;
          this.showUploadButton = false;
          this.modo = 'basic';
          this.incluir = true;
          this.uploadAtivo = true;
          this.modeloView = changes.modelo.currentValue;
          break;
        }
        case 'excluir': {
          this.mostraH6 = false;
          this.listaArquivos = true;
          this.showUploadButton = false;
          this.disabled = true;
          this.incluir = false;
          this.modeloView = changes.modelo.currentValue;
          this.blockSubmit(true);
          break;
        }
        case 'explorer': {
          this.mostraH6 = false;
          this.listaArquivos = false;
          this.showUploadButton = true;
          this.disabled = false;
          this.incluir = true;
          this.modo = 'advanced';
          this.drag = true;
          this.modeloView = changes.modelo.currentValue;
          break;
        }
        case 'solicalterar': {
          this.mostraH6 = false;
          this.listaArquivos = true;
          this.showUploadButton = true;
          this.disabled = false;
          this.incluir = true;
          this.modo = 'basic';
          this.drag = true;
          this.modeloView = changes.modelo.currentValue;
          break;
        }
      }
    }
    /*if (changes.registro_id) {
      this.fuRegistro_id = +changes.registro_id.currentValue;
    }*/
    if (changes.clearArquivos) {
      this.fuClearArquivos = changes.clearArquivos.currentValue;
    }
    if (changes.enviarArquivos) {
      this.fuEnviarArquivos = changes.enviarArquivos.currentValue;
    }
    /*if (changes.stiloClass) {
      this.stiloClasse = changes.stiloClass.currentValue;
    }*/
  }

  ngOnInit() {
    if(this.buscaArquivos) {
      this.ass.getCarregador().subscribe(vf => {
        this.mostraSpinner = vf;
      });
      this.sub.push(this.as.arquivoTotal.subscribe({
        next: value => {
          this.mostraView = value;
          if (this.modeloView === 'excluir' && value === true && !this.aut.arquivos_apagar) {
            this.blockSubmit(true);
          }
          if (this.modeloView === 'excluir' && value === true && this.aut.arquivos_apagar) {
            this.blockSubmit(false);
          }
          if (this.modeloView === 'excluir' && value === false) {
            this.blockSubmit(false);
          }

        }
      }));
    } else {
      this.mostraView = (this.arqs.length > 0);
    }


    if (this.as.arquivosPermissoes.value.config_arquivo_ativo && this.incluir) {
      if (this.aut.arquivos_anexar) {
        this.uploadAtivo = true;
        /// this.uploadAtivo = false;
      }
    }
    /*if (this.listaArquivos && this.registro_id && this.modulo !== 'solicitacao' ) {
      this.as.getArquivos(this.modulo, this.registro_id );
    }*/

    if (this.listaArquivos && this.registro_id && this.buscaArquivos) {
      this.as.getArquivos(this.modulo, this.registro_id );
    }

    /*
    if (this.listaArquivos && this.registro_id ) {
      this.as.getArquivos(this.modulo, this.registro_id );
    }
    this.url = this.ur.arquivo + '/' + this.modulo + '/';
    */
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => {
      s.unsubscribe();
    });
    this.as.reset();
  }

  blockSubmit(ev: boolean) {
    this.ass.setCarregador(ev);
    this.onBlockSubmit.emit(ev);
  }

  OnUpload(ev) {
    this.fuEnviarArquivos = false;
    this.onUpload.emit(ev);
  }
  onAddArquivo(ev) {
    if (ev > 0) {
      this.onPossuiArquivos.emit(true);
    } else {
      this.onPossuiArquivos.emit(false);
    }
  }


  onCompleted(ev: UploadState[]) {

  }

  onProgresso(ev: number) {
    this.onProgress.emit(ev);
  }

  onEnvioInicio(ev: boolean) {
    this.onInicioEnvio.emit();
  }

  onApagarAux(arq: ArquivoInterface) {
    const arqs = this.arqs.filter(val => val.arquivo_id !== arq.arquivo_id);
    this.arqsChange.emit(arqs);
    this.onApagar.emit(arq);
  }

  onGravados(ev: ArquivoInterface[]) {
    const arqs = this.arqs;
    arqs.push(...ev);
    this.arqsChange.emit(arqs);
    this.onArquivosGravados.emit(ev);
  }

}
