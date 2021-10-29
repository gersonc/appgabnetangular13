import { Component, OnInit } from '@angular/core';
import {SolicitacaoService} from "../_services";

@Component({
  selector: 'app-solicitacao-teste',
  templateUrl: './solicitacao-teste.component.html',
  styleUrls: ['./solicitacao-teste.component.css']
})
export class SolicitacaoTesteComponent implements OnInit {

  constructor(
    private solicitacaoService: SolicitacaoService
  ) { }

  ngOnInit(): void {
  }

}
