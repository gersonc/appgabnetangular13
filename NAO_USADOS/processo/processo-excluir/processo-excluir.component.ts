import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ProcessoCadastroInterface,
  ProcessoDetalheInterface,
  ProcessoHistoricoInterface,
  ProcessoOficioInterface,
  ProcessoSolicitacaoInterface
} from '../_models';
import {Subscription} from 'rxjs';
import {MessageService} from 'primeng/api';
import {AuthenticationService, CarregadorService} from '../../_services';
import {ProcessoService} from '../_services';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-processo-excluir',
  templateUrl: './processo-excluir.component.html',
  styleUrls: ['./processo-excluir.component.css']
})
export class ProcessoExcluirComponent implements OnInit, OnDestroy {

  @ViewChild('taboficio', {static: true}) taboficio: ElementRef;
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
  podeExcluirSN = true;
  botaoAtivo = true;
  resp: any[];
  erroPermissao: any[];
  perProcesso = true;
  perSolicitacao = true;
  perOficio = true;
  perHistorico = true;
  // perArquivo = true;
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
        this.oficios = data.dados.oficios;
        this.verificaPerisoes();
        this.cs.escondeCarregador();
        console.log('dados->', data.dados);
      })
    );
  }

  verificaPerisoes() {
    let a = 0;
    if (!this.authenticationService.processo_apagar) {
      this.perProcesso = false;
      this.erroPermissao['processo'] = 'Você não tem permissão para excluir esse processo.';
      a++;
    }
    if (!this.authenticationService.solicitacao_apagar) {
      this.perSolicitacao = false;
      this.erroPermissao['solicitacao'] = 'Você não tem permissão para excluir essa solicitação.';
      a++;
    }
    if (this.oficios && !this.authenticationService.oficio_apagar) {
      this.perOficio = false;
      this.erroPermissao['oficio'] = 'Você não tem permissão para excluir esse(s) ofício(s).';
      a++;
    }
    if (this.historicos && !this.authenticationService.historico_apagar) {
      this.perHistorico = false;
      this.erroPermissao['historico'] = 'Você não tem permissão para excluir esse(s) andamento(s).';
      a++;
    }
    /*
    if (!this.authenticationService.arquivos_apagar) {
      this.perArquivo = 1;
      this.permissao['arquivo'] = 1;
      this.erroPermissao['arquivo'] = 'Você não tem permissão para excluir esse(s) arquivo(s).';
      a++;
    }
    */
    if (a > 0) {
      this.podeExcluirSN = false;
    }
  }

  excluir() {
    if (this.podeExcluirSN) {
      this.processoExcluir();
    }
    console.log('excluir');
  }

  processoExcluir() {
    this.botaoAtivo = false;
    this.cs.mostraCarregador();
    this.sub.push(this.processoService.deleteProcesso(this.processo.processo_id)
      .pipe(take(1))
      .subscribe({
        next: (dado) => {
          this.resp = dado;
        },
        error: (err) => {
          this.botaoAtivo = true;
          this.cs.escondeCarregador();
          this.messageService.add({key: 'processoErro', severity: 'warn', summary: 'ERRO EXCLUIR', detail: this.resp[2]});
          console.log(err);
        },
        complete: () => {
          this.cs.escondeCarregador();
          if (this.resp[0]) {
            if (Array.isArray(this.resp[2])) {
              const msgAray = [];
              for (const msgem of this.resp[2]) {
                msgAray.push({
                  key: 'processoToast',
                  severity: 'success',
                  summary: 'EXCLUIR PROCESSO',
                  detail: msgem
                });
              }
              this.messageService.addAll(msgAray);
            } else {
              this.messageService.add({
                key: 'processoToast',
                severity: 'success',
                summary: 'EXCLUIR PROCESSO',
                detail: this.resp[2]
              });
            }
          } else {
            console.error('ERRO - EXCLUIR ', this.resp[2]);
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
