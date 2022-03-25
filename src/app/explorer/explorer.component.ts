import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArquivoService} from "../arquivo/_services";
import {ExplorerService} from "./_services/explorer.service";
import {Pasta} from "./_models/arquivo-pasta.interface";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent implements OnInit, OnDestroy {
  painelFechado = true;
  painelDestravado = false;
  uploadPasta = false;
  novaPasta: Pasta
  desabilitado = false;
  mostraBtnUpload = true;
  blockSpecial: RegExp = /^[^<>*!\s]+$/;


  arquivo_registro_id: number;
  arquivoDesativado = true;
  enviarArquivos: boolean;
  clearArquivos: boolean;


  constructor(
    public exs: ExplorerService,
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
    this.novaPasta = new Pasta();
    console.log('this.ex.pastaListagem', this.exs.pastaListagem);
  }

  showBasicDialog() {
    // this.displayBasic = true;
  }

  incluirPasta() {
    if (this.novaPasta.arquivo_pasta_titulo.length > 4) {
      console.log(this.novaPasta, 'ok');
    } else {
      console.log(this.novaPasta, 'erro');
    }
  }

  onBlockSubmit(ev: any) {

  }

  onUpload(ev: any) {

  }

  onPossuiArquivos(ev: any) {

  }

  abreUpload() {

    this.painelFechado = !this.painelFechado;
    this.uploadPasta = true;
  }

  abreFormulario() {
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
    this.exs.onDestroy();
  }

}
