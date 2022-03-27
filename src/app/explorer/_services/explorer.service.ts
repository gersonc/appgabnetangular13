import { Injectable } from '@angular/core';
import {AuthenticationService, UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ArquivoListagem, Caminho, Pasta, PastaListagem} from "../_models/arquivo-pasta.interface";
import {Observable, Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {MessageService} from "primeng/api";
import {SpinnerService} from "../../_services/spinner.service";
import {ArquivoInterface} from "../../arquivo/_models";

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {
  private sub: Subscription[] = [];
  pastaListagem: PastaListagem;
  caminhoAtual: PastaListagem[] = [
    {
      arquivo_pasta_id: 0,
      arquivo_pasta_anterior_id: 0,
      arquivo_pasta_nome: 'pastas',
      arquivo_pasta_titulo: 'RAIZ'
    }
  ];
  fVF = true;
  desligaBtnApagar = false;

  constructor(
    private url: UrlService,
    private http: HttpClient,
    public messageService: MessageService,
    public aut: AuthenticationService,
    public sps: SpinnerService
  ) { }

  adicionaBase() {
    if (this.caminhoAtual.length === 0 || this.caminhoAtual[0].arquivo_pasta_id !== 0) {
      this.caminhoAtual.unshift({
        arquivo_pasta_id: 0,
        arquivo_pasta_anterior_id: 0,
        arquivo_pasta_nome: 'pastas',
        arquivo_pasta_titulo: 'RAIZ'
      });
    }
    console.log('adicionaBase', this.caminhoAtual);
    console.log('pastaListagem', this.pastaListagem);
  }

  getBase() {
    if (this.caminhoAtual.length !== 1) {
      this.sub.push(this.gerListagem().pipe(take(1)).subscribe(dados => {
        delete this.caminhoAtual;
        this.caminhoAtual = [
          {
            arquivo_pasta_id: dados.arquivo_pasta_id,
            arquivo_pasta_anterior_id: dados.arquivo_pasta_anterior_id,
            arquivo_pasta_nome: dados.arquivo_pasta_nome,
            arquivo_pasta_titulo: dados.arquivo_pasta_titulo
          }
        ];
        this.pastaListagem = dados;
        console.log('getBase', this.caminhoAtual);
        console.log('pastaListagem', this.pastaListagem);
      }));
    }
  }

  addCaminho(id: number) {
    this.sub.push(this.gerListagem(id).pipe(take(1)).subscribe( dados => {
      this.pastaListagem = dados;

      const caminho: PastaListagem = {
          arquivo_pasta_id: this.pastaListagem.arquivo_pasta_id,
          arquivo_pasta_anterior_id: this.pastaListagem.arquivo_pasta_anterior_id,
          arquivo_pasta_nome: this.pastaListagem.arquivo_pasta_nome,
          arquivo_pasta_titulo: this.pastaListagem.arquivo_pasta_titulo,
        };
      this.caminhoAtual.push(caminho);
      console.log('addCaminho', this.caminhoAtual);
      console.log('pastaListagem', this.pastaListagem);
    }));
  }

  subCaminho() {
    if (this.caminhoAtual.length !== 1) {
      if (this.caminhoAtual.length === 2) {
        this.getBase();
      } else {
        this.caminhoAtual.pop();
        this.ajustaCaminho(this.caminhoAtual[this.caminhoAtual.length - 1].arquivo_pasta_id);
      }
      console.log('subCaminho', this.caminhoAtual);
      console.log('pastaListagem', this.pastaListagem);
    }
  }

  ajustaCaminho(id: number) {
    console.log('ajustaCaminho ATUAL', this.caminhoAtual);
    console.log('pastaListagem ATUAL', this.pastaListagem);
    if (id === 0) {
      this.getBase();
    } else {
      const idx = this.caminhoAtual.findIndex(x => x.arquivo_pasta_id === id);
      if (idx !== this.caminhoAtual.length - 1) {
        this.sub.push(this.gerListagem(id).pipe(take(1)).subscribe( dados => {
          this.pastaListagem = dados;
          this.caminhoAtual.splice(idx + 1, this.caminhoAtual.length - (idx + 1));
        }));
      }
    }
    console.log('ajustaCaminho NOVO', this.caminhoAtual);
    console.log('pastaListagem NOVO', this.pastaListagem);
  }

  getVoltar() {
    if (this.caminhoAtual.length !== 1) {
      if (this.caminhoAtual.length === 2) {
        this.getBase();
      } else {
        const n = this.caminhoAtual[this.caminhoAtual.length - 2];
        this.ajustaCaminho(n.arquivo_pasta_id);
        console.log('getVoltar');
      }
    }
  }

  gerListagem(id = 0) {
    const n = (id > 0) ? '/' + id : '';
    const url = this.url.explorer + '/listar' + n;
    return this.http.get<PastaListagem>(url);
  }

  gerDir() {
    const url = this.url.explorer;
    return this.http.get<Caminho[]>(url);
  }

  getPastaId(): number {
    const idx = this.caminhoAtual.length - 1;
    return this.caminhoAtual[idx].arquivo_pasta_id;
  }

  mostraUpload(): boolean {
    const idx = this.getPastaId();
    return (idx < 1 || idx > 20);
  }

  mostraDelete(): boolean {
    const idx = this.getPastaId();
    return (idx > 20);
  }

  onDestroy(): void {
    console.log('onDestroy');
    delete this.pastaListagem;
    delete this.caminhoAtual;
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }

  incluirPasta(pasta: Pasta) {
    let r: {
      vf: boolean,
      msg: string
    };
    this.sub.push(this.postNovaPasta(pasta).pipe(take(1)).subscribe( dados => {
      r.vf = dados[0];
      this.pastaListagem = dados[1];
      r.msg = dados[2];
      console.log(r);
    }));
  }

  postNovaPasta(pasta: Pasta): Observable<any[]> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.explorer + '/incluir';
    return this.http.post<any[]>(url, pasta, httpOptions);
  }

  getUrl(): string {
    return this.url.uploadlocal + '/explorer/' + this.getPastaId();
  }

  getDownload(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }

  apagarArquivo(id: number) {
    this.sub.push(this.deleteArquivo(id).pipe(take(1)).subscribe( dados => {
      if (dados[0]) {
        this.pastaListagem.arquivo_listagem.splice(this.pastaListagem.arquivo_listagem.findIndex( x => x.arquivo_id === id), 1);
        this.messageService.add({key: 'keyArquivo', severity:'success', summary: 'APAGAR ARQUIVO', detail: dados[2]});
      } else {
        this.messageService.add({key: 'keyArquivo', severity:'error', summary: 'APAGAR ARQUIVO', detail: dados[2]});
      }
    }));
  }

  deleteArquivo(id: number): Observable<any[]> {
    const url = this.url.arquivo + '/' + id;
    return this.http.delete<any[]>(url);
  }

  apagarPasta(id: number) {
    this.desligaBtnApagar = true;
    this.sub.push(this.deletePasta(id).pipe(take(1)).subscribe( dados => {
      if (dados) {
        this.pastaListagem.pastas.splice(this.pastaListagem.pastas.findIndex( x => x.arquivo_pasta_id === id), 1);
        this.messageService.add({key: 'keyFolder', severity:'success', summary: 'APAGAR PASTA', detail: 'Pasta apagada com sucesso.'});
        this.desligaBtnApagar = false;
      } else {
        this.messageService.add({key: 'keyFolder', severity:'error', summary: 'APAGAR PASTA', detail: 'Erro ocorrido.'});
        this.desligaBtnApagar = false;
      }
    }));
  }

  deletePasta(id: number): Observable<any[]> {
    const url = this.url.explorer + '/' + id;
    return this.http.delete<any[]>(url);
  }

  atualisaArquivos(arqs: ArquivoInterface[]) {
    this.pastaListagem.arquivo_listagem.push(...arqs);
  }


}
