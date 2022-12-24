import {Component, OnDestroy, OnInit} from '@angular/core';
import {MensagemI} from "../../../mensagem/_models/mensagem-i";
import {retry, take, tap} from "rxjs/operators";
import {of, Subscription, timer} from "rxjs";
import {MensagemOnoffService} from "../../../_services/mensagem-onoff.service";
import {MensagemPushService} from "../../../mensagem/_services/mensagem-push.service";
import {OnlineService} from "../../../_services/online.service";


@Component({
  selector: 'app-pessoal',
  templateUrl: './pessoal.component.html',
  styleUrls: ['./pessoal.component.css']
})
export class PessoalComponent implements OnInit, OnDestroy {

  num: number = 0;
  nm: string = '0';
  ativo = 1;
  intervalo = 600000;
  total = 0;
  mgs: MensagemI[] = [];
  private sub: Subscription[] = [];

  constructor(
    public mo: MensagemOnoffService,
    private msm: MensagemPushService,
    public ol: OnlineService
  ) { }

  ngOnInit(): void {
    this.inicio();
  }


  pullMenssagems() {
    let mm: MensagemI[] = [];
    if (this.ol.isOnline) {
      this.sub.push(this.msm.getMensagemNLidas()
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            if (dados !== undefined && dados !== null && Array.isArray(dados) && dados.length > 0) {

              if (sessionStorage.getItem('mensagens')) {
                mm.push(...JSON.parse(sessionStorage.getItem('mensagens')));
              }
              mm.push(...dados);
              sessionStorage.setItem('mensagens', JSON.stringify(mm));
            }
          },
          error: (e) => {
            retry({count: 3, delay: 1200000, resetOnSuccess: true});
          },
          complete: () => {
            this.nm = '' + mm.length;
            this.num = mm.length;
          }
        })
      );
    }

  }

  inicio() {
    if (sessionStorage.getItem('mensagens')) {
      const n: any[] = JSON.parse(sessionStorage.getItem('mensagens'));
      this.nm = ''+n.length;
      this.num = n.length;
    }
    this.sub.push(timer(20000,this.intervalo)
      .pipe(
      tap((x)=> {
        if(this.ol.isOnline) {
          this.intervalo = 600000;
          this.pullMenssagems();
        } else {
          this.intervalo = 4100000;
        }
      })
    ).subscribe());
  }

  cancela() {
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }


  onShow() {
    if (sessionStorage.getItem('mensagens')) {
      this.mgs = JSON.parse(sessionStorage.getItem('mensagens'));
      // sessionStorage.removeItem('mensagens');
    }
  }

  onHide() {
    sessionStorage.removeItem('mensagens');
    this.mgs = [];
    this.nm = '0';
    this.num = 0;
  }



  ngOnDestroy() {
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }

}
