import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UrlService {
  // private url = `${environment.apiUrl}`;

  url = (location.hostname === 'localhost') ? 'http://slimgn08.dv/' : 'api/';



  // url = location.hostname !== ('gn5.gabnet.com.br' || 'localhost') ? '/gn5/api/' : '/api/';
  // url = 'http://gn5.gabnet.com.br/api/';
  // url = this.hst + '/api/';
  // url = 'http://slimgn08.dv/';
  dropdown = this.url + 'dropdown';
  autocompleteservice = this.url + 'autocomplete';
  cadastro = this.url + 'cadastro';
  solicitacao = this.url + 'solicitacao';
  oficio = this.url + 'oficio';
  processo = this.url + 'processo';
  login = this.url + 'login';
  autologin = this.url + 'autoloagin';
  municipio = this.url + 'auxiliar/municipio';
  aux = this.url + 'auxiliar';
  etiqueta = this.url + 'auxiliar/etiqueta';
  etiquetaconfig = this.url + 'etiqueta';
  sms = this.url + 'sms';
  proposicao = this.url + 'proposicao';
  emenda = this.url + 'emenda';
  andamentoproposicao = this.url + 'andamentoproposicao';
  arquivo = this.url + 'arquivo';
  telefone = this.url + 'telefone';
  conta = this.url + 'conta';
  nucleo = this.url + 'nucleo';
  passagem = this.url + 'passagem';
  calendario = this.url + 'calendario';
  tarefa = this.url + 'tarefa';
  configuracao = this.url + 'configuracao';
  usuario = this.url + 'usuario';
  grafico = this.url + 'grafico';
  filemanager = this.url + 'filemanager';
  uploadlocal = this.url + 'arquivo2';
  historicoProcesso = this.url + 'historicoprocesso';
  historicoSolicitacao = this.url + 'historicosolicitacao';
  ping = this.url + 'ping';
  explorer = this.url + 'pasta';


  constructor() {
    console.log('location.hostname', location.hostname);
  }
}
