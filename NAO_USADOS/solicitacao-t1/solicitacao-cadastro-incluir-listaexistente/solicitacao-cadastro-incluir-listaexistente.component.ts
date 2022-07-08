import {Component, OnInit, Input} from '@angular/core';
import { CadastroDuplicadoBuscaInterface } from '../../cadastro/_models';




@Component({
  selector: 'app-solicitacao-cadastro-incluir-listaexistente',
  templateUrl: './solicitacao-cadastro-incluir-listaexistente.component.html',
  styleUrls: ['./solicitaca-cadastro-incluir-listaexistente.component.css']
})
export class SolicitacaoCadastroIncluirListaexistenteComponent implements OnInit {

  @Input() cad: CadastroDuplicadoBuscaInterface[];

  loading = false;

  constructor() {}

  ngOnInit() {
  }

}
