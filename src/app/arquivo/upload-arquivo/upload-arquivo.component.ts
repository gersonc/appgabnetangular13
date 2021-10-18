import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ArquivoInterface, ArquivoPermissaoInterface} from '../_models';
import {Message, MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';
import {UrlService} from '../../util/_services';
import {ArquivoService} from '../_services';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FileUpload} from 'primeng/fileupload';
import {TemplateBinding} from '@angular/compiler';
import {ArquivoSpinnerService} from '../_services/arquivo-spinner.service';

@Component({
  selector: 'app-upload-arquivo',
  templateUrl: './upload-arquivo.component.html',
  styleUrls: ['./upload-arquivo.component.css']
})
export class UploadArquivoComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('fileUpload', { static: true }) public fileUpload: FileUpload;
  @Input() modulo: string;
  @Input() registro_id = 0;
  @Input() disabled = true;
  @Input() style: any = null;
  @Input() class: string = null;
  @Input() mode = 'advanced';
  @Input() enviarArquivos = false;
  @Input() clearArquivos = false;
  @Input() showUploadButton = false;
  @Input() showCancelButton = true;
  @Output() onBlockSubmit = new EventEmitter<boolean>();
  @Output() onUpload = new EventEmitter<boolean>();
  @Output() onAddArquivo = new EventEmitter<number>();
  @Output() onProgresso = new EventEmitter<number>();
  @Output() onEnvioInicio = new EventEmitter<boolean>();

  multiple = true;

  name = 'arquivos[]';
  previewWidth = 50;
  previewWidthGrid: string = this.previewWidth + 20 + 'px';

  invalidFileSizeMessageSummary = '{0}: Tamanho de arquivo inválido, ';
  invalidFileSizeMessageDetail = 'tamanho máximo permitido {0}.';

  chooseLabel = 'Escolher';
  uploadLabel = 'Upload';
  cancelLabel = 'Limpar';
  mostraBtnUpload = false;
  mostraCancelButton = false;
  maxFileSize = 10485760;

  // files: File[] = [];
  msgs: Message[] = [];

  focus: boolean;
  uploading: boolean;
  sub: Subscription[] = [];
  sub2: Subscription[] = [];

  stiloClasse: string = null;
  // arqs: ArquivoInterface[] = [];

  accept = 'image/*,video/*,text/csv,application/msword,application/epub+zip,text/calendar,application/vnd.oasis.opendocument.presentation,application/vnd.oasis.opendocument.spreadshee,application/vnd.oasis.opendocument.text,application/pdf,application/vnd.ms-powerpoint,application/x-rar-compressed,application/rtf,application/vnd.visio,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/pkix-cert,application/x-x509-ca-cer,application/acad,application/zip,.txt,.psd,.ics,.calendar,.ppt,.zip,.accdb,.docx,.eml,.pps,.ppsx,.ppt,.pptx,.pub,.rtf,.vsd,.xls,.xlsx,.xps,.csv';
  fileLimit = 10;
  arquivosPermissoes: ArquivoPermissaoInterface = null;
  modo = 'advanced';

  icones: string[] = [];
  highlight = false;
  cancelled: boolean;
  mostraProgresso = false;
  progresso = 0;
  id = 0;
  a: any;
  ur = '';

  auto = false;

  constructor(
    private messageService: MessageService,
    public url: UrlService,
    public as: ArquivoService,
    private http: HttpClient,
    public ass: ArquivoSpinnerService
  ) { }

  ngOnInit(): void {
    this.sub.push(this.as.arquivosPermissoes.subscribe(value => {
      this.arquivosPermissoes = value;
    }));
    this.stiloClasse = this.class;
    this.as.verificaPermissoes();


    // this.ur = this.url.uploadlocal + '/' + this.modulo + '/' + this.id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled) {
      this.disabled = changes.disabled.currentValue;
    }
    if (changes.classe) {
      this.stiloClasse = changes.classe.currentValue;
    }
    if (changes.mode) {
      this.modo = changes.mode.currentValue;
      if (changes.mode.currentValue === 'basic') {
        this.auto = true;
      }
    }
    if (changes.showUploadButton) {
      this.mostraBtnUpload = changes.showUploadButton.currentValue;
    }
    if (changes.showCancelButton) {
      this.mostraCancelButton = changes.showCancelButton.currentValue;
    }
    if (changes.registro_id) {
      this.id = changes.registro_id.currentValue;
      this.fileUpload.url = this.url.uploadlocal + '/' + this.modulo + '/' + this.id;
    }
    if (changes.enviarArquivos) {
      if (changes.enviarArquivos.currentValue === true) {
        if (this.id === 0) {
          setTimeout(() => {
            this.fileUpload.upload();
          }, 500);
        } else {
          this.fileUpload.url = this.url.uploadlocal + '/' + this.modulo + '/' + this.id;
          this.fileUpload.upload();
        }
      }
    }
    if (changes.clearArquivos) {
      this.onClear();
    }

  }

  onSelect(ev) {
    this.onFileSelect(ev.files);
  }

  onClear() {
    this.id = 0;
    this.onAddArquivo.emit(0);
  }

  onRemove(ev) {
    this.onAddArquivo.emit(this.fileUpload._files.length);
  }

  meuRemove(ev, f: File) {
    const i = this.fileUpload._files.findIndex( x =>  x.name === f.name);
    this.fileUpload.remove(ev, i);
  }

  onFileSelect(files: FileList): void {
    const num = files.length;
    for (let i = 0; i < num; i++) {
      if (!this.verificaCota(files[i])) {
        this.fileUpload._files.pop();
      } else {
        this.onAddArquivo.emit(this.fileUpload._files.length);
        /*if (i === (num - 1) && !this.auto) {
          this.fileUpload.upload();
        }*/
      }
    }
  }

  onEnviado(ev) {
    console.log('onEnviado', ev);
    if (ev.originalEvent.body.length > 0) {
      ev.originalEvent.body.forEach( (x: ArquivoInterface) => {
        this.as.atualisaArquivosUpload(x);
      });
    }
    this.progresso = 0;
    this.id = 0;
    this.ass.escondeCarregador();
    this.onUpload.emit(true);
  }


  onBeforeUpload(ev) {
    this.ass.mostraCarregador();
    this.onEnvioInicio.emit(true);
  }

  verificaCota(file: File) {
    let soma = 0;
    this.fileUpload._files.forEach( (x: File) => {
      soma += x.size;
    });
    if (this.as.cotaDisponvel.getValue() - soma <= 0) {
      this.msgs.push({
        severity: 'error',
        summary: this.invalidFileSizeMessageSummary.replace('{0}', file.name),
        detail: this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxFileSize))
      });
      return false;
    } else {
      return true;
    }
  }

  onProgress(ev) {
    this.mostraProgresso = true;
    this.progresso = ev.progress;
  }


  formatSize(bytes: any): string {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  ngOnDestroy(): void {
    this.icones = [];
    this.onClear();
    this.id = 0;
    this.sub.forEach(s => s.unsubscribe());
    this.sub2.forEach(s => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.a = this.fileUpload.advancedFileInput.nativeElement;
  }

  getIcone(nome: string) {
    return this.as.getClassNameForExtension(nome);
  }


  teste(ev) {
    this.fileUpload.upload();
  }

}
