import { Injectable } from '@angular/core';
import { UrlService } from '../../_services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import {Cal, CalBusca, CalendarioForm, CalendarioFormularioInterface, CalInterface, EventoInterface} from '../_models';
import { isArray } from 'rxjs/internal-compatibility';
import { saveAs } from 'file-saver';
import { take } from 'rxjs/operators';
import {SelectItem} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  public cf: CalendarioFormularioInterface;
  public cal: CalInterface;
  private sub: Subscription[] = [];

  // BUSCA ***
  calBusca: CalBusca;

  constructor(private url: UrlService, private http: HttpClient) { }

  criaCalendarioForm() {
    this.cf = new CalendarioForm();
  }

  criaCalForm() {
    this.cf = new Cal();
  }

  filtraCalendario(): CalendarioForm {
    const and = new CalendarioForm();
    for (const key in and) {
      if (this.cf[key] === false) {
        and[key] = 0;
        continue;
      }
      if (this.cf[key] === true) {
        and[key] = 1;
        continue;
      }
      if (isArray(this.cf[key])) {
        if (this.cf[key].lenght > 0) {
          and[key] = this.cf[key];
          continue;
        } else {
          delete this.cf[key];
          delete and[key];
          continue;
        }
      }
      if (this.cf[key] === undefined) {
        delete and[key];
        delete this.cf[key];
        continue;
      }
      if (this.cf[key] === null) {
        delete this.cf[key];
        delete and[key];
        continue;
      }
      and[key] = this.cf[key];
    }
    return and;
  }

  calendarioListar(start, end): Observable<EventoInterface[]> {
    const url = this.url.calendario + '/listar/' + start + '/' + end;
    return this.http.get<EventoInterface[]>(url);
  }

  postCalendarioListar(dados: CalBusca, start, end): Observable<EventoInterface[]> {
    const url = this.url.calendario + '/listar/' + start + '/' + end;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<EventoInterface[]> (url, dados, httpOptions);
  }

  postCalendarioBuscar(dados: CalBusca): Observable<EventoInterface[]> {
    const url = this.url.calendario + '/buscar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<EventoInterface[]> (url, dados, httpOptions);
  }

  getEventoId(id: number): Observable<EventoInterface> {
    const url = this.url.calendario + '/id/' + id;
    return this.http.get<EventoInterface>(url);
  }

  eventoApagarId(id: number): Observable<any[]> {
    const url = this.url.calendario + '/apagar/' + id;
    return this.http.delete<any[]>(url);
  }

  eventoApagarData(id: number, exdate: any): Observable<any[]> {
    const cal = {id: id, exdate: exdate};
    const url = this.url.calendario + '/apagar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, cal, httpOptions);
  }

  getEventos(fetchInfo: any[]): Observable<EventoInterface[]> {
    // console.log('fetchInfo->', fetchInfo);
    const url = this.url.calendario + '/listar';
    return this.http.get<EventoInterface[]>(url);
  }

  incluirCalendario(cal: CalInterface): Observable<any[]> {
    const url = this.url.calendario + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, cal, httpOptions);
  }

  alterarCalendario(cal: CalInterface, id: any): Observable<any[]> {
    const url = this.url.calendario + '/' + id;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, cal, httpOptions);
  }

  eventoExcluirId(id: number): Observable<any[]> {
    const url = this.url.calendario + '/' + id;
    return this.http.delete<any[]>(url);
  }

  eventoGetIcs(id: number, unico?: string, start?: string, end?: string): Observable<Blob> {
    let url = this.url.calendario + '/ical/' + id;
    if (unico) {
      url = url + '/' + unico;
    }
    if (start) {
      url = url + '/' + start;
    }
    if (end) {
      url = url + '/' + end;
    }
    return this.http.get(url, { responseType: 'blob'});
  }

  imprimir(start: string, end: string): Observable<any[]> {
    const url = this.url.calendario + '/imprimir/' + start + '/' + end;
    return this.http.get<any[]>(url);
  }

  setColor() {
    const rgbValue: any[] = [];
    rgbValue[0] = Math.round(Math.random() * 255);
    rgbValue[1] = Math.round(Math.random() * 255);
    rgbValue[2] = Math.round(Math.random() * 255);
    // tslint:disable-next-line:radix
    const color = Math.round(((parseInt(rgbValue[0]) * 299) + (parseInt(rgbValue[1]) * 587) + (parseInt(rgbValue[2]) * 114)) / 1000);
    const textColor = (color > 125) ? 'black' : 'white';
    const backColor = 'rgb(' + rgbValue[0] + ', ' + rgbValue[1] + ', ' + rgbValue[2] + ')';
  }

  // BUSCA **********************************************

  limpaFormulario() {
    this.calBusca = new CalBusca();
  }

  mudaAte(ev) {

  }

  onSubmit() {

  }


}
