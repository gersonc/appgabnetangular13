import {Component, OnInit, Input} from '@angular/core';
import {CadastroDuplicadoI} from "../_models/cadastro-duplicado-i";




@Component({
  selector: 'app-cadastro-incluir-listaexistente',
  templateUrl: './cadastro-incluir-listaexistente.component.html',
  styleUrls: ['./cadastro-incluir-listaexistente.component.css']
})
export class CadastroIncluirListaexistenteComponent implements OnInit {

  @Input() cad: CadastroDuplicadoI[];

  loading = false;

  constructor() {}

  ngOnInit() {
  }

}
