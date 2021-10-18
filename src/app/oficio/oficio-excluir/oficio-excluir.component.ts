import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService, CarregadorService } from '../../_services';
import { MessageService } from 'primeng/api';
import { OficioService } from '../_services';
import { OficioInterface } from '../_models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-oficio-excluir',
  templateUrl: './oficio-excluir.component.html',
  styleUrls: ['./oficio-excluir.component.css'],
  providers: [MessageService]
})
export class OficioExcluirComponent implements OnInit, OnDestroy {
  oficio: OficioInterface;
  oficio_id: number;
  acao = '';
  resp: any[];
  display = false;
  sub: Subscription[] = [];
  apagarAtivo = false;
  botoesInativos = false;
  botaoEnviarInativo = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private oficioService: OficioService,
    public authenticationService: AuthenticationService,
    private messageService: MessageService,
    private cs: CarregadorService
  ) {
    this.apagarAtivo = !this.authenticationService.oficio_apagar;
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

  voltarListar() {
    this.router.navigate(['/oficio/listar/busca']);
  }

  showDialog() {
    this.display = true;
  }

  excluirOficio() {
    this.display = false;
    this.apagarAtivo = true;
    if (this.authenticationService.oficio_apagar) {
      this.apagarAtivo = true;
      this.botoesInativos = true;
      this.cs.mostraCarregador();
      this.sub.push(this.oficioService.deleteOficioId(this.oficio_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.apagarAtivo = !this.authenticationService.oficio_apagar;
            this.botoesInativos = false;
            this.cs.escondeCarregador();
            this.messageService.add({key: 'oficioErro', severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
            console.log(err);
          },
          complete: () => {
            if (this.resp[0]) {
              this.messageService.add({
                key: 'oficioToast',
                severity: 'success',
                summary: 'APAGAR OFÍCIO',
                detail: this.resp[2]
              });
              this.voltarListar();
            } else {
              this.apagarAtivo = !this.authenticationService.oficio_apagar;
              this.botoesInativos = false;
              this.cs.escondeCarregador();
              console.error('ERRO - APAGAR ', this.resp[2]);
              this.messageService.add({
                key: 'oficioErro',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
    } else {
      this.botoesInativos = false;
      this.cs.escondeCarregador();
      this.messageService.add({
        key: 'oficioErro',
        severity: 'warn',
        summary: 'ATENÇÃO - ERRO',
        detail: 'PERMISSÃO NEGADA'
      });
    }
  }

  onBlockSubmit(ev) {
    this.botaoEnviarInativo = ev;
  }

}
