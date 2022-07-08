import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProcessoCadastroInterface,
  ProcessoDetalheInterface,
  ProcessoHistoricoInterface,
  ProcessoOficioInterface,
  ProcessoSolicitacaoCadastroInterface, ProcessoSolicitacaoInterface
} from '../_models';
import { Subscription } from 'rxjs';
import { MessageService} from 'primeng/api';
import { AuthenticationService, CarregadorService} from '../../_services';
import { ProcessoService } from '../_services';
import {take} from 'rxjs/operators';
import {OficioInterface} from '../../oficio/_models';

@Component({
  selector: 'app-processo-analisar',
  templateUrl: './processo-analisar.component.html',
  styleUrls: ['./processo-analisar.component.css']
})
export class ProcessoAnalisarComponent implements OnInit, OnDestroy {

  @ViewChild('taboficio', { static: true }) taboficio: ElementRef;
  // dados: ProcessoDetalheInterface;
  processo: ProcessoSolicitacaoInterface;
  processo_titulo: any[];
  cadastro: ProcessoCadastroInterface;
  cadastro_titulo: any[];
  oficios: ProcessoOficioInterface[];
  oficio_titulo: any[];
  oficios_num: any[];
  historicos: ProcessoHistoricoInterface[];
  historico_titulo: any[];
  historicos_num: any[];
  podeAnalisarSN = true;
  botaoAtivo = true;
  resp: any[];
  sub: Subscription[] = [];
  private campos: string[] = [];
  private alturas: number[] = [];
  private larguras: number[] = [];
  public larg: number;
  public altu: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    private processoService: ProcessoService,
    private messageService: MessageService,
    private cs: CarregadorService
  ) { }

  fechar() {
    this.router.navigate(['/processo/listar/busca']);
  }

  teste() {
    console.log('oficio->', this.oficios);
  }

  ngOnInit() {
    this.sub.push(this.activatedRoute.data.subscribe(
      (data: { dados: ProcessoDetalheInterface }) => {
        this.processo = data.dados.processo;
        this.processo_titulo = data.dados.processo_titulo;
        this.cadastro = data.dados.cadastro;
        this.cadastro_titulo = data.dados.cadastro_titulo;

        this.oficio_titulo = data.dados.oficio_titulo;
        this.oficios_num = data.dados.oficios_num;
        this.historicos_num = data.dados.historicos_num;
        this.historicos = data.dados.historicos;
        this.historico_titulo = data.dados.historico_titulo;
        if (data.dados.oficios) {
          for (let i = 0; i < data.dados.oficios.length; i++) {
            if (data.dados.oficios[i].oficio_status.toString() === 'EM ANDAMENTO') {
              this.podeAnalisarSN = false;
            }
          }
          this.oficios = data.dados.oficios;
        } else {
          this.oficios = data.dados.oficios;
        }
        console.log('dados->', data.dados);
        this.cs.escondeCarregador();
      })
    );
  }

  verificaOficioAberto() {
    if (this.oficios) {
      for (let i = 0; i < this.oficios.length; i++) {
        if (this.oficios[i].oficio_status.toString() === 'EM ANDAMENTO') {
          this.podeAnalisarSN = false;
        }
      }
    }
    console.log('this.podeAnalisarSN', this.podeAnalisarSN);
    return this.podeAnalisarSN;
  }

  deferir() {
    if (this.authenticationService.processo_deferir) {
      this.processoAnalise('deferir');
    }
    console.log('DEFERIR');
  }

  indeferir() {
    if (this.authenticationService.processo_indeferir) {
      this.processoAnalise('indeferir');
    }
    console.log('INDEFERIR');
  }

  suspender() {
    if (this.authenticationService.processo_deferir || this.authenticationService.processo_indeferir) {
      this.processoAnalise('suspender');
    }
    console.log('SUSPENDER');
  }

  processoAnalise(acao: string) {
    this.botaoAtivo = false;
    this.cs.mostraCarregador();
    this.sub.push(this.processoService.putProcessoAnalisar(this.processo.processo_id, acao)
      .pipe(take(1))
      .subscribe({
        next: (dado) => {
          this.resp = dado;
        },
        error: (err) => {
          this.botaoAtivo = true;
          this.cs.escondeCarregador();
          this.messageService.add({key: 'processoErro', severity: 'warn', summary: 'ERRO ANALISAR', detail: this.resp[2]});
          console.log(err);
        },
        complete: () => {
          this.cs.escondeCarregador();
          if (this.resp[0]) {
            this.messageService.add({
              key: 'processoToast',
              severity: 'success',
              summary: 'ANALISAR PROCESSO',
              detail: this.resp[2]
            });
          } else {
            console.error('ERRO - ANALISAR ', this.resp[2]);
            this.messageService.add({
              key: 'processoErro',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
            this.botaoAtivo = true;
          }
        }
      })
    );
  }

  voltarListar() {
    this.router.navigate(['/processo/listar/busca']);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  voltarRecarregar() {
    this.router.navigate(['/processo/listar']);
  }

}
