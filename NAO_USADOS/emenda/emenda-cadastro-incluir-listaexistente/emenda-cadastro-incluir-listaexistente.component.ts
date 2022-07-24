import {Component, OnInit, Input} from '@angular/core';
import { CadastroDuplicadoBuscaInterface } from '../../cadastro/_models';

@Component({
  selector: 'app-emenda-cadastro-incluir-listaexistente',
  templateUrl: './emenda-cadastro-incluir-listaexistente.component.html',
  styleUrls: ['./emenda-cadastro-incluir-listaexistente.component.css']
})
export class EmendaCadastroIncluirListaexistenteComponent implements OnInit {

  @Input() cad: CadastroDuplicadoBuscaInterface[];

  loading = false;

  constructor() {}

  ngOnInit() {
  }

}
