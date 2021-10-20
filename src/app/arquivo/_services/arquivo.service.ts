import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {UrlService} from '../../_services';
import {ArquivoInterface, ArquivoPermissaoInterface} from '../_models';
import {saveAs} from 'file-saver';
import {take} from 'rxjs/operators';
import {ArquivoSpinnerService} from './arquivo-spinner.service';

@Injectable({
  providedIn: 'root'
})
export class ArquivoService {

  public arquivosPermissoes = new BehaviorSubject<ArquivoPermissaoInterface>({
    arquivo_ativo: false,
    arquivo_cota: 0,
    cota_utilizada: 0,
    cota_disponivel: 0
  });
  public cotaDisponvel = new BehaviorSubject<number>(0);
  public eventoReset = new BehaviorSubject<boolean>(false);
  public arquivoTotal = new BehaviorSubject<boolean>(false);
  public uploadProgress = new Subject<number>();
  public arquivos = new BehaviorSubject<ArquivoInterface[]>([]); // ARQUIVOS JÁ CADASTRADOS
  private icons = {
    image: 'jpg',
    pdf: 'pdf',
    word: 'doc',
    powerpoint: 'pps',
    excel: 'xls',
    visio: 'vsd',
    access: 'mdb',
    one: 'one',
    csv: 'csv',
    pub: 'pub',
    project: 'mpp',
    audio: 'mp3',
    video: 'avi',
    archive: 'zip',
    code: 'php',
    text: 'txt',
    file: 'exe'
  };
  private imagens = {
    gif: this.icons.image,
    jpeg: this.icons.image,
    jpg: this.icons.image,
    png: this.icons.image,
  };
  private extensions = {
    gif: this.icons.image,
    jpeg: this.icons.image,
    jpg: this.icons.image,
    png: this.icons.image,

    vsd: this.icons.visio,
    vdx: this.icons.visio,
    vsdx: this.icons.visio,

    pdf: this.icons.pdf,

    doc: this.icons.word,
    docx: this.icons.word,
    docm: this.icons.word,
    rtf: this.icons.word,

    mpd: this.icons.project,
    mpp: this.icons.project,
    mpt: this.icons.project,

    ppt: this.icons.powerpoint,
    pps: this.icons.powerpoint,
    pptx: this.icons.powerpoint,
    ppsm: this.icons.powerpoint,
    ppsx: this.icons.powerpoint,
    pptm: this.icons.powerpoint,

    mdb: this.icons.access,
    accdb: this.icons.access,
    accde: this.icons.access,
    accdc: this.icons.access,
    accdr: this.icons.access,

    xls: this.icons.excel,
    xlsx: this.icons.excel,
    xlsb: this.icons.excel,
    sldx: this.icons.excel,

    csv: this.icons.csv,

    aac: this.icons.audio,
    mp3: this.icons.audio,
    ogg: this.icons.audio,

    avi: this.icons.video,
    flv: this.icons.video,
    mkv: this.icons.video,
    mp4: this.icons.video,

    gz: this.icons.archive,
    zip: this.icons.archive,
    rar: this.icons.archive,

    css: this.icons.code,
    html: this.icons.code,
    js: this.icons.code,

    txt: this.icons.text
  };
  private mimeTypes = {
    'image/gif': this.icons.image,
    'image/jpeg': this.icons.image,
    'image/png': this.icons.image,

    'application/pdf': this.icons.pdf,

    'application/msword': this.icons.word,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': this.icons.word,

    'application/mspowerpoint': this.icons.powerpoint,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': this.icons.powerpoint,

    'application/msexcel': this.icons.excel,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': this.icons.excel,

    'text/csv': this.icons.csv,

    'audio/aac': this.icons.audio,
    'audio/wav': this.icons.audio,
    'audio/mpeg': this.icons.audio,
    'audio/mp4': this.icons.audio,
    'audio/ogg': this.icons.audio,

    'video/x-msvideo': this.icons.video,
    'video/mpeg': this.icons.video,
    'video/mp4': this.icons.video,
    'video/ogg': this.icons.video,
    'video/quicktime': this.icons.video,
    'video/webm': this.icons.video,

    'application/gzip': this.icons.archive,
    'application/zip': this.icons.archive,

    'text/css': this.icons.code,
    'text/html': this.icons.code,
    'text/javascript': this.icons.code,
    'application/javascript': this.icons.code,

    'text/plain': this.icons.text,
    'text/richtext': this.icons.text,
    'text/rtf': this.icons.text
  };
  arqexc$?: Observable<any[]>;
  private sub: Subscription[] = [];
  private sub2: Subscription[] = [];
  public tf = false;
  public _arquivos: ArquivoInterface[] = [];


  constructor(private url: UrlService, private http: HttpClient, public ass: ArquivoSpinnerService) {
    this.verificaPermissoes();
  }

  private getArquivoPermissoes(): Observable<ArquivoPermissaoInterface> {
    const url = this.url.arquivo + '/permissoes';
    return this.http.get<ArquivoPermissaoInterface>(url);
  }

  public verificaPermissoes() {
    if (!sessionStorage.getItem('arquivo-permissoes')) {
      this.sub.push(this.getArquivoPermissoes()
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            sessionStorage.setItem('arquivo-permissoes', JSON.stringify(dados));
          },
          error: err => {
            console.error('erro->verificaPermissoes', err);
          },
          complete: () => {
            this.arquivosPermissoes.next(JSON.parse(sessionStorage.getItem('arquivo-permissoes')!));
          }
        })
      );
    } else {
      this.arquivosPermissoes.next(JSON.parse(sessionStorage.getItem('arquivo-permissoes')!));
    }
    this.cotaDisponvel.next(this.arquivosPermissoes.value.cota_disponivel);
  }

  private getArquivosModuloListar(modulo: string, id: number): Observable<ArquivoInterface[]> {
    const url = this.url.arquivo + '/lista/' + modulo + '/' + id;
    return this.http.get<ArquivoInterface[]>(url);
  }

  public getArquivos(modulo: string, id: number): void {
    this.ass.mostraCarregador();
    this.sub.push(this.getArquivosModuloListar(modulo, id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this._arquivos = dados;
          this.arquivos.next(dados);
          this.arquivoTotal.next(dados.length > 0);
        },
        error: err => {
          this.ass.escondeCarregador();
          console.error(err);
        },
        complete: () => {
          this.ass.escondeCarregador();
        }
      })
    );
  }

  public getArquivloListagem() {
    return this.arquivos.asObservable();
  }

  public getPreUrlDownload(nomeS3: string): Observable<string>  {
    const dados = {
      'nomeS3': nomeS3
    };
    const url = this.url.arquivo + '/download';
    return this.http.post<string>(url, dados);
    // return this.http.get<string>(url);
  }

  public getDonloadS3(url: string) {
    return this.http.get(url, { responseType: 'blob'});
  }

  public getDownload(nome: string, nomeS3: string) {
    this.ass.mostraCarregador();
    this.sub2.push(this.getPreUrlDownload(nomeS3)
      .pipe(take(1))
      .subscribe(url => {
        this.sub2.push(
          this.getDonloadS3(url)
            .pipe(take(1))
            .subscribe({
              next: (ar) => {
                const file = new File([ar], nome, { type: ar.type });
                saveAs(file);
              },
              error: err => {
                this.ass.escondeCarregador();
              },
              complete: () => {
                this.ass.escondeCarregador();
                this.unsub2();
              }
            })
        );
      })
    );
  }

  public getDownload2(nome: string, url: string) {
    this.ass.mostraCarregador();
          this.getDonloadS3(url)
            .pipe(take(1))
            .subscribe({
              next: (ar) => {
                const file = new File([ar], nome, { type: ar.type });
                saveAs(file);
              },
              error: err => {
                this.ass.escondeCarregador();
              },
              complete: () => {
                this.ass.escondeCarregador();
                this.unsub2();
              }
            });

  }



  public atualisaCotaUpload(valor: number) {
    const dados: ArquivoPermissaoInterface = JSON.parse(sessionStorage.getItem('arquivo-permissoes')!);
    dados.cota_disponivel -= valor;
    dados.cota_utilizada += valor;
    sessionStorage.removeItem('arquivo-permissoes');
    sessionStorage.setItem('arquivo-permissoes', JSON.stringify(dados));
    this.arquivosPermissoes.next(dados);
  }

  private deleteArquivoServer(id: number|string): Observable<boolean> {
    const url = this.url.arquivo + '/' + id;
    return this.http.delete<boolean>(url);
  }

  public deleteArquivo(arquivo: ArquivoInterface): Observable<boolean> {
    const arquivo_id = arquivo.arquivo_id;
    const arquivo_tamanho = arquivo.arquivo_tamanho;
    let vf: boolean;

    return new Observable(subscriber => {
      this.deleteArquivoServer(arquivo_id!)
          .pipe(take(1))
          .subscribe({
            next: value => {
              vf = value;
            },
            error: err => {
              console.error('erro->deleteArquivo', err);
            },
            complete: () => {
              if (vf) {
                this.atualisaCotaDelete(arquivo.arquivo_tamanho!);
                this.arquivoDelete(arquivo_id!);
              }
              subscriber.next(vf);
              subscriber.complete();
            }}
          );
      }
    );
  }

  private arquivoDelete(arquivo_id: number|string) {
    const arq = this.arquivos.value;
    const obj = arq.find(x => x.arquivo_id === arquivo_id);
    const index = arq.indexOf(obj!);
    arq.splice(index, 1);
    this.arquivos.next(arq);
    this.arquivoTotal.next(arq.length > 0);
  }

  public atualisaCotaDelete(valor: number) {
    const dados: ArquivoPermissaoInterface = JSON.parse(sessionStorage.getItem('arquivo-permissoes')!);
    dados.cota_disponivel += valor;
    dados.cota_utilizada -= valor;
    sessionStorage.removeItem('arquivo-permissoes');
    sessionStorage.setItem('arquivo-permissoes', JSON.stringify(dados));
    this.arquivosPermissoes.next(dados);
  }

  private unsub() {
    this.sub.forEach(s => s.unsubscribe());
  }

  public unsub2() {
    this.sub2.forEach(s => {
      s.unsubscribe();
    });
  }

  public getTipoArquivo(tipo: string) {
    tipo = tipo.toLowerCase();
    const imagem = [
      'apng',
      'bmp',
      'gif',
      'ico',
      'cur',
      'jpg',
      'jpeg',
      'jfif',
      'pjpeg',
      'pjp',
      'png',
      'svg',
      'tif',
      'tiff',
      'webp'
    ];
    const video = [
      'webm',
      'mpg',
      'mp2',
      'mpeg',
      'mpe',
      'mpv',
      'ogg',
      'mp4',
      'm4p',
      'm4v',
      'avi',
      'wmv',
      'mov',
      'qt',
      'flv',
      'swf',
      'avchd'
    ];
    const audio = [
      'ogg',
      'mp3',
      'aac',
      'wav',
      'aif',
      'aiff'
    ];
    if (imagem.indexOf(tipo) !== -1) {
      return 'imagem';
    }
    if (video.indexOf(tipo) !== -1) {
      return 'video';
    }
    if (audio.indexOf(tipo) !== -1) {
      return 'audio';
    }
    return 'outros';
  }

  getEventMessage(num: number) {
    if (num > 0 || num < 100) {
      this.uploadProgress.next(num);
    }
  }

  resetArquivos() {
    this.eventoReset.next(true);
  }

  reset() {
    this.arquivos.next([]);
    this.cotaDisponvel.next(0);
    this.arquivoTotal.next(false);
    this.unsub();
    this.unsub2();
  }

  cotaDisponivelSoma(val: number) {
    let valor = this.cotaDisponvel.getValue();
    valor = valor + val;
    this.cotaDisponvel.next(valor);
  }

  cotaDisponivelSubtrai(val: number) {
    let valor = this.cotaDisponvel.getValue();
    valor = valor - val;
    this.cotaDisponvel.next(valor);
  }

  cotaDisponiveReset() {
    this.cotaDisponvel.next(this.arquivosPermissoes.value.cota_disponivel);
  }

  getClassNameForExtension(name: string): string {
    name = name.toLowerCase();
    // @ts-ignore
    const ic = this.extensions[name.slice(name.lastIndexOf('.') + 1)] || this.icons.file;
    return '/assets/img/icones/' + ic.toLowerCase() + '.png';
  }

  upload(dados: ArquivoInterface): Observable<number> {
    let url: string;
    url = this.url.arquivo + '/upload';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<number> (url, dados, httpOptions);
  }

  atualisaArquivosUpload(dados: ArquivoInterface) {
    const a = this.arquivos.value;
    a.push(dados);
    this._arquivos = a;
    this.arquivos.next(a);
    this.arquivoTotal.next(a.length > 0);
    this.atualisaCotaUpload(dados.arquivo_tamanho!);
  }

  // @ts-ignore
  public getPermissoes(): boolean {
    if (!sessionStorage.getItem('arquivo-permissoes')) {
      this.sub.push(this.getArquivoPermissoes()
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            sessionStorage.setItem('arquivo-permissoes', JSON.stringify(dados));
          },
          error: err => {
            return false;
          },
          complete: () => {
            return true;
          }
        })
      );
    } else {
      return true;
    }
  }



}
