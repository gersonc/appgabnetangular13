import { Component, OnInit } from '@angular/core';
import {ArquivoService} from "../arquivo/_services";
import {ExplorerService} from "./_services/explorer.service";


@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent implements OnInit {


  constructor(
    public ex: ExplorerService,
  ) {}



  ngOnInit() {
    console.log('this.ex.pastaListagem', this.ex.pastaListagem);
  }


}
