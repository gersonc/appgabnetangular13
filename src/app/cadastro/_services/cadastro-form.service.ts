import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CadastroFormService {
  url = '';
  public acao?: string | null = null;
  public btnEnviar = true;
  constructor() { }
}
