import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArquivoUploadService {

  public uploadProgress = new Subject<number>();

  constructor() {
  }

  static classToFormData(dados: any): FormData {
    const formdata = new FormData();
    for (const chave in dados) {
      if (dados[chave] === null || dados[chave] === []) {
        delete dados[chave];
        continue;
      }
      if (chave === 'arquivos') {
        if (dados['arquivos']['files']) {
          if (dados['arquivos']['files'].length) {
            for (let i = 0; i < dados['arquivos']['files'].length; i++) {
              formdata.append('arquivos[]', dados['arquivos']['files'][i], dados['arquivos']['files'][i].name);
            }
          }
        } else {
          if (dados['arquivos'].length) {
            for (let i = 0; i < dados['arquivos'].length; i++) {
              formdata.append('arquivos[]', dados['arquivos'][i], dados['arquivos'][i].name);
            }
          }
        }
        continue;
      }
      formdata.append(chave, dados[chave]);
    }
    return formdata;
  }

  getEventMessage(num: number) {
    if (num > 0 || num < 100) {
      this.uploadProgress.next(num);
    }
  }

  getProgresso(): Observable<number> {
    return this.uploadProgress.asObservable();
  }
}
