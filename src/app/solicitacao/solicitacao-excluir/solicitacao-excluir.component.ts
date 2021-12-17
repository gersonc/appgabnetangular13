import {Component, OnInit, OnDestroy, ViewEncapsulation, NgZone} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {
  SolicitacaoCadastroInterface,
  SolicitacaoExcluirInterface,
  SolicitacaoInterface,
  SolicitacaoOficioInterface,
  SolicitacaoOficioNumInterface,
  SolicitacaoProcessoInterface,
  SolicitacaoProcessoNumInterface
} from '../_models';
import { AuthenticationService, CarregadorService } from '../../_services';
import { SolicitacaoService } from '../_services';
import { Subscription } from 'rxjs';
import { ArquivoInterface, ArquivoNumInterface } from '../../arquivo/_models';
import { take } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { isArrayLike } from 'rxjs/internal-compatibility';


@Component({
  selector: 'app-solicitacao-excluir',
  templateUrl: './solicitacao-excluir.component.html',
  styleUrls: ['./solicitacao-excluir.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SolicitacaoExcluirComponent implements OnInit, OnDestroy {

  private dados: SolicitacaoExcluirInterface;
  public solicitacao: SolicitacaoInterface;
  public cadastro: SolicitacaoCadastroInterface;
  public processo_num: SolicitacaoProcessoNumInterface;
  public processo: SolicitacaoProcessoInterface;
  public oficio_num: SolicitacaoOficioNumInterface;
  public oficio: SolicitacaoOficioInterface[];
  public erro: any[] = null;
  public vinculos = false;
  private processoSN = true;
  private oficioSN = true;
  public apagarSN = true;
  public msg: string[] = [];
  private resp: any[] = [false, 0, null];

  botaoEnviarVF = false;
  public arquivoBlockSubmit = true;
  public arquivo: ArquivoInterface[];
  public arquivo_num = 0;
  private arquivoSN = true;

  sub: Subscription[] = [];

  modulos = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean']                     // link and image, video
    ]
  };

  constructor(
    private ngZone: NgZone,
    private ss: SolicitacaoService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private cs: CarregadorService
  ) { }

  ngOnInit() {
        this.dados = this.ss.solicitacaoExluirDados;
        this.solicitacao = this.dados.solicitacao;
        this.arquivo_num = + this.dados.arquivo_num;
        if (this.arquivo_num > 0 && !this.authenticationService.arquivos_apagar) {
          this.arquivoSN = false;
        }
        if (this.authenticationService.cadastro_listar) {
          this.cadastro = this.dados.cadastro;
        }
        if (this.authenticationService.processo_listar && this.dados.processo) {
          this.processo = this.dados.processo;
        }
        if (this.dados.processo_num.num || this.dados.oficio_num.num) {
          this.vinculos = true;
          this.processo_num = this.dados.processo_num;
          this.oficio_num = this.dados.oficio_num;
        }
        if (this.authenticationService.oficio_vizualizar && this.dados.oficio.length > 0) {
          this.oficio = this.dados.oficio;
        }
        this.erro = this.dados.erro;
        if ((this.dados.processo || this.dados.processo_num.num)
          && this.authenticationService.processo_apagar === false) {
          this.processoSN = false;
        }
        if ((this.dados.oficio || this.dados.oficio_num.num)
          && this.authenticationService.oficio_apagar === false) {
          this.oficioSN = false;
        }
    // this.cs.escondeCarregador();
    this.montaMsg();
  }

  voltar() {
    this.router.navigate(['/solicitacao/listar/busca']);
  }

  excluirSolicitacao() {
    if (this.authenticationService.solicitacao_apagar) {
      this.botaoEnviarVF = true;
      this.cs.mostraCarregador();
      this.sub.push(this.ss.excluir(this.solicitacao.solicitacao_id)
        .pipe(take(1))
        .subscribe( {
          next: (dados) => this.resp = dados,
          error: err => {
            this.cs.escondeCarregador();
            console.error('err');
            this.messageService.add(
              {
                key: 'solicitacaoExcluirToast',
                severity: 'warn',
                summary: 'ERRO EXCLUI',
                detail: this.resp[2].toString()
              }
            );
          },
          complete: () => {
            this.cs.escondeCarregador();
            if (this.resp[0]) {
              this.ss.excluirColunaExpandida();
              if (isArrayLike(this.resp[2])) {
                const n = this.resp[2].length - 1;
                for (let i = 0; i < n; i++) {
                  this.messageService.add(
                    {
                      key: 'solicitacaoExcluirArrayToast',
                      severity: 'success',
                      summary: 'EXCLUIR SOLICITAÇÃO',
                      detail: this.resp[2][i].toString()
                    }
                  );
                }
                this.messageService.add(
                  {
                    key: 'solicitacaoExcluirToast',
                    severity: 'success',
                    summary: 'EXCLUIR SOLICITAÇÃO',
                    detail: this.resp[2].toString(),
                    life: 4000
                  }
                );
              } else {
                this.messageService.add(
                  {
                    key: 'solicitacaoExcluirToast',
                    severity: 'success',
                    summary: 'EXCLUIR SOLICITAÇÃO',
                    detail: this.resp[2].toString()
                  }
                );
              }
            } else {
              if (isArrayLike(this.resp[2])) {
                const n = this.resp[2].length;
                for (let i = 0; i < n; i++) {
                  this.messageService.add(
                    {
                      key: 'solicitacaoExcluirToast',
                      severity: 'warn',
                      summary: 'ATENÇÃO - EXCLUIR SOLICITAÇÃO - ERRO',
                      detail: this.resp[2][i].toString()
                    }
                   );
                }
              } else {
                this.messageService.add(
                  {
                    key: 'solicitacaoExcluirToast',
                    severity: 'warn',
                    summary: 'ATENÇÃO - EXCLUIR SOLICITAÇÃO - ERRO',
                    detail: this.resp[2].toString()
                  }
                );
              }
            }
          }
        }));
    }
  }

  montaMsg() {
    if (!this.authenticationService.solicitacao_apagar) {
      const msg1 = 'Você não tem permissão para apagar SOLICITAÇõES.';
      this.msg.push(msg1);
    }
    if (!this.processoSN) {
      const msg2 = 'Está solicitação possui processo vinculado, você não tem permissão para apagar PROCESSO(S).';
      this.msg.push(msg2);
    }
    if (!this.oficioSN) {
      const msg3 = 'Está solicitação possui ofício(s) vinculado(s), você não tem permissão para apagar OFÍCIO(S).';
      this.msg.push(msg3);
    }
    if (this.arquivo_num > 0 && !this.authenticationService.arquivos_apagar) {
      const msg4 = 'Está solicitação possui ' + this.arquivo_num + ' arquivo(s) vinculado(s), você não tem permissão para apagar ARQUIVO(S).';
      this.msg.push(msg4);
    }
    if (this.authenticationService.solicitacao_apagar || this.oficioSN || this.processoSN || this.arquivoSN) {
      this.apagarSN = false;
      this.botaoEnviarVF = false;
    }
  }

  voltarListar() {
    this.ngZone.run(() => this.voltar());
    // this.router.navigate(['/solicitacao/listar']);
  }

  onBlockSubmit(ev) {
    this.arquivoBlockSubmit = ev;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
