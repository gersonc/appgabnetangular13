import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArquivoService} from "../arquivo/_services";
import {ExplorerService} from "./_services/explorer.service";
import {Caminho} from "./_models/arquivo-pasta.interface";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent implements OnInit, OnDestroy {

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
    console.log('this.ex.pastaListagem', this.exs.pastaListagem);
  }

  ngOnDestroy(): void {
    this.exs.onDestroy();
  }

}
