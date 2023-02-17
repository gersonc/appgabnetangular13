import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "./url.service";
import {Observable, of, Subject, Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {SelectItem} from "primeng/api";
import {DdArrayI, DdsI, parceDdArrayToSelectItemArray} from "../_models/dd-array-i";
import {HeaderService} from "./header.service";


@Injectable({
  providedIn: 'root'
})
export class DdService {
  private sub: Subscription[] = [];

  meses: SelectItem[] = [
    { label: 'JANEIRO', value: '01' },
    { label: 'FEVEREIRO', value: '02' },
    { label: 'MARÇO', value: '03' },
    { label: 'ABRIL', value: '04' },
    { label: 'MAIO', value: '05' },
    { label: 'JUNHO', value: '06' },
    { label: 'JULHO', value: '07' },
    { label: 'AGOSTO', value: '08' },
    { label: 'SETEMBRO', value: '09' },
    { label: 'OUTUBRO', value: '10' },
    { label: 'NOVEMBRO', value: '11' },
    { label: 'DEZEMBRO', value: '12' }
  ];
  dias: SelectItem[] = [
    { label: '01', value: '01' },
    { label: '02', value: '02' },
    { label: '03', value: '03' },
    { label: '04', value: '04' },
    { label: '05', value: '05' },
    { label: '06', value: '06' },
    { label: '07', value: '07' },
    { label: '08', value: '08' },
    { label: '09', value: '09' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '29', value: '29' },
    { label: '30', value: '30' },
    { label: '31', value: '31' }
  ];
  quinzena: SelectItem[] = [
    { label: '1' + decodeURI('\xAA'), value: '15' },
    { label: '2' + decodeURI('\xAA'), value: '31' }
  ];
  sexo: SelectItem[] = [
    { label: 'MASCULINO', value: 'M' },
    { label: 'FEMININO', value: 'F' },
    { label: 'OUTROS', value: 'O' },
    { label: 'PJ', value: 'P' }
  ];
  snTodos: SelectItem[] = [
    { label: 'TODOS', value: '0' },
    { label: 'SIM', value: '1' },
    { label: 'NÃO', value: '2' }
  ];


  constructor(
    private http: HttpClient,
    private url: UrlService
  ) {
  }

  getDd(dados: string |string[]) {
    const args = {
      dados: dados
    }
    return this.http.post<any>(this.url.dd, args, HeaderService.tokenHeader);
  }

 /* getDd(dados: string |string[]): Observable<any[]>{
    const subject = new Subject<any[]>();
    const dd: DdsI[] = [];
    let sb = new Subscription();
    sb = this.getDd2(dados)
      .pipe(take(1))
      .subscribe({
          next: (dados) => {
            dd.push(...parceDdArrayToSelectItemArray(dados));
            subject.next(dd);
          },
          error: err => {
            console.error(...err);
          },
          complete: () => {
            subject.complete();
            sb.unsubscribe();
          }
        }
      );
    return subject;
  }*/

  ddSubscriptionArray(dados: string[]) {
    this.sub.push(this.postDd(dados)
      .pipe(take(1))
      .subscribe((dds) => {
          dados.forEach(d => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            sessionStorage.setItem(d, JSON.stringify(dds[d]));
          });

        },
        (err) => console.error(err),
        () => {
          this.onDestroy();
        }
      )
    );
  }

  ddSubscription(dados: string) {
    const d: any = {
      dados: dados
    }
    this.sub.push(this.postDd(d)
      .pipe(take(1))
      .subscribe((dds) => {
          sessionStorage.setItem(dados, JSON.stringify(dds));
        },
        (err) => console.error(err),
        () => {
          this.onDestroy();
        }
      )
    );
  }

  postDd(dados: any) {
    // const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    return this.http.post<any[]>(this.url.dd, dados, HeaderService.tokenHeader);
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }


}

