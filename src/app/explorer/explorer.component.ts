import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArquivoService} from "../arquivo/_services";
import {ExplorerService} from "./_services/explorer.service";
import {Pasta} from "./_models/arquivo-pasta.interface";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";
import {MessageService} from "primeng/api";


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

  // accept = 'image/*,video/*,text/csv,application/msword,application/epub+zip,text/calendar,application/vnd.oasis.opendocument.presentation,application/vnd.oasis.opendocument.spreadshee,application/vnd.oasis.opendocument.text,application/pdf,application/vnd.ms-powerpoint,application/x-rar-compressed,application/rtf,application/vnd.visio,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/pkix-cert,application/x-x509-ca-cer,application/acad,application/zip,.txt,.psd,.ics,.calendar,.ppt,.zip,.accdb,.docx,.eml,.pps,.ppsx,.ppt,.pptx,.pub,.rtf,.vsd,.xls,.xlsx,.xps,.csv';
  // fileLimit = 10;
  // maxFileSize = 10485760;

  clearArquivos = true;
  arquivo_pasta_id = 0;
  arquivo_registro_id: number;
  arquivoDesativado = true;
  enviarArquivos: boolean;


  constructor(
    public exs: ExplorerService,
    private messageService: MessageService
  ) {}

/*
  onCaminhoClick(id: number){
      this.exs.ajustaCaminho(id);
  }

  onValtar() {
    // this.exs.getVoltar();
    this.exs.subCaminho();
  }
*/

  ngOnInit() {

    console.log('this.ex.pastaListagem', this.exs.pastaListagem);
  }

  showBasicDialog() {
    // this.displayBasic = true;
  }

  incluirPasta() {
    if (this.novaPasta.arquivo_pasta_titulo.length > 4) {
      this.painelFechado = !this.painelFechado;
      this.novaPasta.arquivo_pasta_anterior_id = this.exs.getPastaId();
      this.sub.push(this.exs.postNovaPasta(this.novaPasta).pipe(take(1)).subscribe( dados => {
        this.novaPasta = new Pasta();
        if (dados[0]) {
          this.exs.pastaListagem = dados[1];
          this.messageService.add({key: 'Key1', severity:'success', summary: 'INCLUIR PASTA', detail: dados[2]});
        } else {
          this.messageService.add({key: 'Key1', severity:'error', summary: 'INCLUIR PASTA', detail: dados[2]});
        }
        console.log(dados);
      }));
    } else {
      this.novaPasta.arquivo_pasta_titulo = '';
      this.messageService.add({key: 'Key1', severity:'error', summary: 'INCLUIR PASTA', detail: 'Minimo 4 caracteres'});
    }
  }

  onBlockSubmit(ev: any) {
    console.log('onBlockSubmit', ev);
    this.mostraBtns = false;
  }

  onBeforeUpload(ev: any) {
    console.log('onBeforeUpload', ev);
    this.mostraBtns = false;
  }

  onUpload(ev: any) {
    console.log('onUpload', ev);
    this.mostraBtns = true;
    this.clearArquivos = true;
    this.exs.gerListagem()
  }

  onPossuiArquivos(ev: any) {
    console.log('onPossuiArquivos', ev);
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

  onBeforeToggle(ev: any) {
    console.log('onBeforeToggle', ev);
  }

  onAfterToggle(ev: any) {
    console.log('onBeforeToggle', ev);
  }

  onSubmit() {
    console.log(this.novaPasta);
  }


  ngOnDestroy(): void {
    this.sub.forEach(s => {
      s.unsubscribe()
    });
    this.exs.onDestroy();
  }

}
