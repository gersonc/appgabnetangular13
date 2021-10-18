import { Component, Input, OnDestroy, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { SmsService } from '../_services/sms.service';
import { SmsDbInterface } from '../../cadastro/_models';
import { Subscription } from 'rxjs';
import { SmsEnvioInterface } from '../_models/sms.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sms-envio',
  templateUrl: './sms-envio.component.html',
  styleUrls: ['./sms-envio.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SmsEnvioComponent implements OnInit, OnDestroy {
  @Input('celular') public celular: SmsDbInterface[];
  @Input('mensagem') public mensagem: string;
  @Input('secao') public secao: string;
  @Output() onFechaSms = new EventEmitter<boolean>();
  smss: SmsDbInterface[] = [];
  sub: Subscription[] = [];
  restantes = 0;
  contador: number;
  cont = 0;
  constructor( private smsService: SmsService) {

  }

  ngOnInit() {
    this.sub.push(this.smsService.envioRestante$.subscribe(
      value => {
        this.restantes = value;
        this.contador = value;
      }
    ));
  }




  verificaValido(valor: boolean) {
    let cor = 'inherit';
    if (valor) {
      return cor;
    } else {
      cor = '#ffc107';
    }
    return cor;
  }

  enviaSMS() {
    for (const c of this.celular) {
      const sms: SmsEnvioInterface = {
        telefone: c.telefone,
        mensagem: this.mensagem,
        secao: 'cadastro'
      };
      this.smsService.postSms(sms)
        .subscribe({
          next: value => {
            this.smss.push({
              telefone: sms.telefone,
              nome: c.nome,
              municipio: c.municipio,
              resposta: value[0].toString(),
              situacao: value[1]
            });
            this.restantes = +value[2];
          },
          error: err => console.error(err.toString()),
          complete: () => {
            console.log('completo->', c);
            this.soma();
          }
        });
    }
  }

  soma() {
    this.cont++;
    console.log('cont', this.cont);
    if (this.cont === this.contador) {
      console.log('contador--->encerrado');
    }
  }

  /*
  export interface SmsDbInterface {
  id?: number;
  telefone: string;
  nome: string;
  municipio: string;
  resposta?: string;
  situacao?: boolean;
}
   */

  cancelar() {
    this.onFechaSms.emit(true);
  }

  ngOnDestroy() {
    this.sub.forEach(s => s.unsubscribe());
  }



}
