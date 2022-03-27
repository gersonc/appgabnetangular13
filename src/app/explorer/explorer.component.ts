import { Component, OnDestroy, OnInit} from '@angular/core';
import {ExplorerService} from "./_services/explorer.service";
import {Pasta} from "./_models/arquivo-pasta.interface";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";
import {MessageService} from "primeng/api";
import {ArquivoInterface} from "../arquivo/_models";


@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent implements OnInit, OnDestroy {
  private sub: Subscription[] = [];
  painelFechado = true;
  painelDestravado = false;
  uploadPasta = false;
  novaPasta: Pasta
  desabilitado = false;
  mostraBtns = true;
  blockSpecial: RegExp = /^[^<>*!\s]+$/;

  clearArquivos = true;
  arquivo_pasta_id = 0;
  arquivo_registro_id: number;
  arquivoDesativado = true;
  enviarArquivos: boolean;

  constructor(
    public exs: ExplorerService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.spner();
  }

  spner() {
    setTimeout(() => {
      this.exs.sps.desliga();
    }, 1000);
  }

  incluirPasta() {
    if (this.novaPasta.arquivo_pasta_titulo.length > 4) {
      this.painelFechado = !this.painelFechado;
      this.novaPasta.arquivo_pasta_anterior_id = this.exs.getPastaId();
      this.sub.push(this.exs.postNovaPasta(this.novaPasta).pipe(take(1)).subscribe( dados => {
        this.novaPasta = new Pasta();
        if (dados[0]) {
          this.exs.pastaListagem.pastas.push(dados[1]);
          this.messageService.add({key: 'Key1', severity:'success', summary: 'INCLUIR PASTA', detail: dados[2]});
        } else {
          this.messageService.add({key: 'Key1', severity:'error', summary: 'INCLUIR PASTA', detail: dados[2]});
        }
      }));
    } else {
      this.novaPasta.arquivo_pasta_titulo = '';
      this.messageService.add({key: 'Key1', severity:'error', summary: 'INCLUIR PASTA', detail: 'Minimo 4 caracteres'});
    }
  }

  onBlockSubmit(ev: any) {
    this.mostraBtns = false;
  }

  onUpload(ev: any) {
    this.mostraBtns = true;
    this.clearArquivos = true;
    this.painelFechado = true;
  }

  abreUpload() {
    this.clearArquivos = true;
    this.arquivo_pasta_id = this.exs.getPastaId();
    this.painelFechado = !this.painelFechado;
    this.uploadPasta = true;
  }

  abreFormulario() {
    this.clearArquivos = true;
    this.novaPasta = new Pasta();
    this.painelFechado = !this.painelFechado;
    this.uploadPasta = false;
  }

  onSubmit() {
  }

  atualisaArquivos(ev: ArquivoInterface[]) {
    this.exs.atualisaArquivos(ev);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => {
      s.unsubscribe()
    });
    this.exs.sps.liga();
    this.exs.onDestroy();
  }

}
