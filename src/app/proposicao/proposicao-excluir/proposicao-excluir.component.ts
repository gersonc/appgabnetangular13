import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, CarregadorService } from '../../_services';
import { MessageService } from 'primeng/api';
import { ProposicaoListagemInterface, AndamentoProposicaoListagemInterface } from '../_models';
import { ProposicaoService } from '../_services';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-proposicao-excluir',
  templateUrl: './proposicao-excluir.component.html',
  styleUrls: ['./proposicao-excluir.component.css']
})
export class ProposicaoExcluirComponent implements OnInit, OnDestroy {
  proposicao: ProposicaoListagemInterface;
  andamento_proposicao: AndamentoProposicaoListagemInterface[];
  display = false;
  apagarAtivo = false;
  botaoEnviarInativo = false;
  botoesInativos = false;
  resp: any[];

  constructor(
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private proposicaoService: ProposicaoService,
    private cs: CarregadorService
  ) { }

  ngOnInit() {
    this.activatedRoute.data.pipe(take(1)).subscribe(
      (data: {dados: any}) => {
        this.proposicao = data.dados.proposicao;
        this.andamento_proposicao = data.dados.andamento_proposicao;
      },
      error1 => {
        console.log('erro');
      },
      () => {
        this.cs.escondeCarregador();
      }
    );
  }

  onBlockSubmit(ev) {
    this.botaoEnviarInativo = ev;
    this.botoesInativos = ev;
  }

  voltarListar() {
    this.router.navigate(['/proposicao/listar']);
  }

  showDialog() {
    this.display = true;
  }

  excluirProposicao() {
    this.display = false;
    this.apagarAtivo = true;
    if (this.authenticationService.proposicao_apagar) {
      this.apagarAtivo = true;
      this.botoesInativos = true;
      this.cs.mostraCarregador();
      this.proposicaoService.deleteProposicaoId(this.proposicao.proposicao_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.botoesInativos = false;
            this.cs.escondeCarregador();
            this.messageService.add({key: 'proposicaoErro', severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
            console.log(err);
          },
          complete: () => {
            if (this.resp[0]) {
              this.messageService.add({
                key: 'proposicaoToast',
                severity: 'success',
                summary: 'APAGAR PROPOSIÇÃO',
                detail: this.resp[2]
              });
              this.voltarListar();
            } else {
              this.botoesInativos = false;
              this.cs.escondeCarregador();
              console.error('ERRO - APAGAR ', this.resp[2]);
              this.messageService.add({
                key: 'proposicaoErro',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        });
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

  ngOnDestroy(): void {
  }

}
