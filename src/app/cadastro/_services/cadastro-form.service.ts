import { Injectable } from '@angular/core';
import {CadastroFormI} from "../_models/cadastro-form-i";
import {CadastroI} from "../_models/cadastro-i";

@Injectable({
  providedIn: 'root'
})
export class CadastroFormService {
  url = '';
  cadastroListar: CadastroI | null = null;
  cadastro: CadastroFormI | null = null;
  acao?: string | null = null;
  btnEnviar = true;


  constructor() { }

  resetCadastro() {

  }

  parceForm(cadastro: CadastroI): CadastroFormI {
    this.cadastro = null;
    // @ts-ignore
    let r: CadastroFormI = {
      cadastro_agenda: true
    };

    return r;
  }

  criaFormIncluir() {

  }
}
