import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient} from "@angular/common/http";
import {ArquivoListagem, Caminho, PastaListagem} from "../_models/arquivo-pasta.interface";
import {Observable, Subscription} from "rxjs";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {
  private sub: Subscription[] = [];
  pastaListagem: PastaListagem;
  caminhoAtual: PastaListagem[] = [
    {
      arquivo_pasta_id: 0,
      arquivo_pasta_nome: 'RAIZ',
      arquivo_pasta_titulo: 'RAIZ'
    }
  ];
  fVF = true;

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  adicionaBase() {
    if (this.caminhoAtual.length === 0 || this.caminhoAtual[0].arquivo_pasta_id !== 0) {
      this.caminhoAtual.unshift({
        arquivo_pasta_id: 0,
        arquivo_pasta_nome: 'RAIZ',
        arquivo_pasta_titulo: 'pastas'
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

  onDestroy(): void {
    console.log('onDestroy');
    delete this.pastaListagem;
    delete this.caminhoAtual;
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }
}
