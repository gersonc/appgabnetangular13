import { Injectable } from '@angular/core';
import { saveAs as FileSaver } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExplorerDownloadService {
  private icons = {
    image: 'jpg',
    pdf: 'pdf',
    word: 'doc',
    powerpoint: 'ppt',
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
    file: 'exe',
    rar: 'rar'
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
    bmp: this.icons.image,

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
    rar: this.icons.rar,

    css: this.icons.code,
    html: this.icons.code,
    js: this.icons.code,

    txt: this.icons.text
  };
  private mimeTypes = {
    'image/gif': this.icons.image,
    'image/jpeg': this.icons.image,
    'image/png': this.icons.image,
    'image/bmp': this.icons.image,

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


  imagem = [
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

  video = [
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

  audio = [
    'ogg',
    'mp3',
    'aac',
    'wav',
    'aif',
    'aiff'
  ];

  constructor() { }

  public getTipoArquivo(tipo: string) {
    tipo = tipo.toLowerCase();
    if (this.imagem.indexOf(tipo) !== -1) {
      return 'imagem';
    }
    if (this.video.indexOf(tipo) !== -1) {
      return 'video';
    }
    if (this.audio.indexOf(tipo) !== -1) {
      return 'audio';
    }
    return 'outros';
  }

  isImage(name: string): boolean {
    name = name.toLowerCase();
    const ic = name.slice(name.lastIndexOf('.') + 1);
    console.log('ic', ic);
    return (this.imagem.indexOf(name.slice(name.lastIndexOf('.') + 1)) !== -1)
  }

  getClassNameForExtension(name: string): string {
    name = name.toLowerCase();
    // @ts-ignore
    const ic = this.extensions[name.slice(name.lastIndexOf('.') + 1)] || this.icons.file;
    return '/assets/img/icones/' + ic.toLowerCase() + '.png';
  }

  donloadArq(url: string, nome: string) {
    FileSaver.saveAs(url, nome);
  }
}
