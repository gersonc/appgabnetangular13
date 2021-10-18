import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UrlService } from "../../util/_services";
import { LocalClass, LocalInterface } from "../_models/nucleo";

@Injectable({
  providedIn: 'root'
})
export class NucleoService {
  nuForm = new LocalClass();
  nuAcao: string;
  nuExecutado = false;
  nuMostraBt = true;
  formDisplay = false;

  constructor(
    private url: UrlService,
    private http: HttpClient,
  ) { }

  listar(): Observable<LocalInterface[]> {
    const url = this.url.nucleo + '/listar';
    return this.http.get<LocalInterface[]>(url);
  }

  incluir(et: LocalClass): Observable<any[]> {
    const url = this.url.nucleo + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, et, httpOptions);
  }

  alterar(nu: LocalClass): Observable<any[]> {
    const url = this.url.nucleo;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]> (url, nu, httpOptions);
  }

  excluir(local_id: number): Observable<any[]> {
    const url = this.url.nucleo + '/' + local_id;
    return this.http.delete<any[]>(url)
  }
}
