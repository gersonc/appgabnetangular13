import {Component, OnDestroy, OnInit} from '@angular/core';
import {MensagemService} from "../../../mensagem/_services/mensagem.service";
import {MensagemI} from "../../../mensagem/_models/mensagem-i";
import {retry, take, tap} from "rxjs/operators";
import {Subscription, timer} from "rxjs";

@Component({
  selector: 'app-pessoal',
  templateUrl: './pessoal.component.html',
  styleUrls: ['./pessoal.component.css']
})
export class PessoalComponent implements OnInit, OnDestroy {

  num: any = null;
  ativo = 1;
  intervalo = 600000;
  total = 0;
  mgs: MensagemI[] = [];
  private sub: Subscription[] = [];

  constructor(
    private msm: MensagemService
  ) { }

  ngOnInit(): void {
    this.inicio();
  }


  pullMenssagems() {
    let mg: MensagemI[] = [];
    this.sub.push(this.msm.getMensagemNLidas()
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          if (dados !== undefined && dados !== null && Array.isArray(dados) && dados.length > 0) {
            let mm: MensagemI[] = [];
            if (sessionStorage.getItem('mensagems')) {
              mm.push(...JSON.parse(sessionStorage.getItem('mensagems')));
            }
            mm.push(...dados);
            sessionStorage.setItem('mensagems', JSON.stringify(mm));
          }
        },
        error: (e) => {
          retry({count:3, delay: 1200000, resetOnSuccess: true});
        },
        complete: () => {
          this.num =  mg.length;
        }
      })
    );

  }

  inicio() {
    this.sub.push(timer(20000,this.intervalo)
      .pipe(
      tap((x)=> {
        if(this.ativo === 1) {
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
    if (sessionStorage.getItem('mensagems')) {
      this.mgs = JSON.parse(sessionStorage.getItem('mensagems'));
      sessionStorage.removeItem('mensagems');
    }
    this.num = null;
  }

  onHide() {
    this.mgs = [];
    this.num = null;
  }



  ngOnDestroy() {
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }

}
