import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from '../../_services';
import { CadastroPaginacaoInterface, SmsDbInterface } from '../../cadastro/_models';
import { BROWSER_STORAGE, BrowserStorageService } from '../../_services';
import { SmsEnvioInterface } from '../_models/sms.interface';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class SmsService {
  public sm: Subject<SmsDbInterface> = new Subject<SmsDbInterface>();
  public envioRestante: Subject<number> = new Subject<number>();
  public envioRestante$ = this.envioRestante.asObservable();
  restante$: Observable<any>;
  respostaSms$: Observable<any[]>;


  constructor(
    private url: UrlService,
    private http: HttpClient,
    private db: BrowserStorageService
  ) {  }


  getRestante() {
    let sms: string;
    sms = this.url.sms + '/restante';
    this.restante$ = this.http.get<any[]>(sms);
    return this.restante$;
  }

  postSms(smsEnvio: SmsEnvioInterface): Observable<any[]> {
    let smsUrl: string;
    smsUrl = this.url.sms + '/enviar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    this.respostaSms$ = this.http.post<any[]>(smsUrl, smsEnvio, httpOptions);
    return this.respostaSms$;
  }

}
