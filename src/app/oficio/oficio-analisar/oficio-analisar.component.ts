import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService, CarregadorService } from '../../_services';
import { MessageService } from 'primeng/api';
import { OficioService } from '../_services';
import { OficioInterface } from '../_models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-oficio-analisar',
  templateUrl: './oficio-analisar.component.html',
  styleUrls: ['./oficio-analisar.component.css'],
  providers: [MessageService]
})
export class OficioAnalisarComponent implements OnInit, OnDestroy {
  oficio: OficioInterface;
  oficio_id: number;
  acao = '';
  resp: any[];
  sub: Subscription[] = [];
  def: boolean;
  indef: boolean;
  botoesDesativados = false;
  botaoEnviarInativo = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private oficioService: OficioService,
    public authenticationService: AuthenticationService,
    private messageService: MessageService,
    private cs: CarregadorService
  ) {
    this.def = !this.authenticationService.oficio_deferir;
    this.indef = !this.authenticationService.oficio_indeferir;
  }

  ngOnInit() {
    this.sub.push(this.activatedRoute.data.subscribe(
      (data: {dados: OficioInterface}) => {
        this.oficio = data.dados;
        this.oficio_id = +data.dados.oficio_id;
        this.cs.escondeCarregador();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  deferirOficio() {
    if (!this.authenticationService.oficio_deferir) {
      console.log('DEFERIR');
    } else {
      this.def = true;
      this.indef = true;
      const dados = {oficio_id: this.oficio_id, analise: 1};
      this.analisarOficio(dados);
    }
  }

  indeferirOficio() {
    if (!this.authenticationService.oficio_indeferir) {
      console.log('INDEFERIR');
    } else {
      this.def = true;
      this.indef = true;
      const dados = {oficio_id: this.oficio_id, analise: 2};
      this.analisarOficio(dados);
    }
  }

  voltarListar() {
    this.router.navigate(['/oficio/listar/busca']);
  }

  botoesAtivos(vf: boolean) {
    if (vf) {
      this.def = !this.authenticationService.oficio_deferir;
      this.indef = !this.authenticationService.oficio_deferir;
    } else {
      this.def = true;
      this.indef = true;
    }
    this.botoesDesativados = !vf;
  }

  analisarOficio(dados: any) {
    this.cs.mostraCarregador();
    this.botoesAtivos(false);
    this.sub.push(this.oficioService.putOficioAnalisar(this.oficio_id, dados)
      .pipe(take(1))
      .subscribe({
        next: (dado) => {
          this.resp = dado;
        },
        error: (err) => {
          this.botoesAtivos(true);
          this.cs.escondeCarregador();
          this.messageService.add({key: 'oficioErro', severity: 'warn', summary: 'ERRO ANALISAR', detail: this.resp[2]});
          console.log(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.messageService.add({
              key: 'oficioToast',
              severity: 'success',
              summary: 'ANALISAR OFÍCIO',
              detail: this.resp[2]
            });
            this.voltarListar();
          } else {
            console.error('ERRO - ANALISAR ', this.resp[2]);
            this.messageService.add({
              key: 'oficioErro',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
            this.botoesAtivos(true);
            this.cs.escondeCarregador();
          }
        }
      })
    );
  }

  onBlockSubmit(ev) {
    this.botaoEnviarInativo = ev;
  }

}
