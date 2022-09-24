import {Component, OnInit, Input} from '@angular/core';
import {CadastroDuplicadoBuscaInterface} from "../_models/cadastro-duplicado-busca.interface";




@Component({
  selector: 'app-cadastro-incluir-listaexistente',
  templateUrl: './cadastro-incluir-listaexistente.component.html',
  styleUrls: ['./cadastro-incluir-listaexistente.component.css']
})
export class CadastroIncluirListaexistenteComponent implements OnInit {

  @Input() cad: CadastroDuplicadoBuscaInterface[];

  loading = false;

  constructor() {}

  ngOnInit() {
  }

}
