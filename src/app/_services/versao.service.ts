import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VersaoService {

  versao = 0;
  solicitacaoVersao = 0;
  powerUser = false;

  constructor() { }
}
