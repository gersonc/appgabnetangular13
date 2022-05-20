import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "./url.service";
import {Observable, Subscription} from "rxjs";
import {take} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class DdService {
  private sub: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private url: UrlService
  ) {
  }

  getDd(dados: any) {
    const args = {
      dados: dados
    }
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(this.url.dd, args, httpOptions);
  }

  ddSubscriptionArray(dados: string[]) {
    this.sub.push(this.postDd(dados)
      .pipe(take(1))
      .subscribe((dds) => {
          dados.forEach(d => {
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
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(this.url.dd, dados, httpOptions);
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }


}

