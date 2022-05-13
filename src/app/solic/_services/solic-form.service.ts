import { Injectable } from '@angular/core';
import { SolicFormI} from "../_models/solic-form-i";
import {SolicForm} from "../_models/solic-form";

@Injectable({
  providedIn: 'root'
})
export class SolicFormService {
  public solicitacao = new SolicForm();

  constructor() { }

  resetSolicitacao() {
    this.solicitacao = new SolicForm();
  }
}
