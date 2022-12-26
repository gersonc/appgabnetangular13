import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private url = `${environment.apiUrl}`;
  ok = false;
  dropdown = this.url + 'dropdown';
  autocompleteservice = this.url + 'autocomplete';
  cadastro = this.url + 'cadastro';
  solicitacao = this.url + 'solicitacao';
  solic = this.url + 'solic';
  solicitacaot2 = this.url + 'solicitacaot2';
  oficio = this.url + 'oficio';
  processo = this.url + 'processo';
  proce = this.url + 'proce';
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
  historicoProcesso = this.url + 'historico/processo';
  historicoSolicitacao = this.url + 'historico/solicitacao';
  historicoEmenda = this.url + 'historico/emenda';
  ping = this.url + 'ping';
  explorer = this.url + 'pasta';
  dd = this.url + 'dd';
  mensagem = this.url + 'mensagem';
  msg = this.url + 'msg';

  constructor() {
    if(!this.ok) {
      this.getUrl();
    }
  }

  getUrl() {
    this.url = `${environment.apiUrl}`;
    this.dropdown = this.url + 'dropdown';
    this.autocompleteservice = this.url + 'autocomplete';
    this.cadastro = this.url + 'cadastro';
    this.solicitacao = this.url + 'solicitacao';
    this.solic = this.url + 'solic';
    this.solicitacaot2 = this.url + 'solicitacaot2';
    this.oficio = this.url + 'oficio';
    this.processo = this.url + 'processo';
    this.proce = this.url + 'proce';
    this.login = this.url + 'login';
    this.autologin = this.url + 'autoloagin';
    this.municipio = this.url + 'auxiliar/municipio';
    this.aux = this.url + 'auxiliar';
    this.etiqueta = this.url + 'auxiliar/etiqueta';
    this.etiquetaconfig = this.url + 'etiqueta';
    this.sms = this.url + 'sms';
    this.proposicao = this.url + 'proposicao';
    this.emenda = this.url + 'emenda';
    this.andamentoproposicao = this.url + 'andamentoproposicao';
    this.arquivo = this.url + 'arquivo';
    this.telefone = this.url + 'telefone';
    this.conta = this.url + 'conta';
    this.nucleo = this.url + 'nucleo';
    this.passagem = this.url + 'passagem';
    this.calendario = this.url + 'calendario';
    this.tarefa = this.url + 'tarefa';
    this.configuracao = this.url + 'configuracao';
    this.usuario = this.url + 'usuario';
    this.grafico = this.url + 'grafico';
    this.filemanager = this.url + 'filemanager';
    this.uploadlocal = this.url + 'arquivo2';
    this.historicoProcesso = this.url + 'historico/processo';
    this.historicoSolicitacao = this.url + 'historico/solicitacao';
    this.historicoEmenda = this.url + 'historico/emenda';
    this.ping = this.url + 'ping';
    this.explorer = this.url + 'pasta';
    this.dd = this.url + 'dd';
    this.mensagem = this.url + 'mensagem';
    this.msg = this.url + 'msg';
    this.ok = true;
  }




  getModulo(modulo: string) {
    switch (modulo) {
      case 'solicitacao':
        return this.solic;
      case 'processo':
        return this.proce;
      default:
        return this[modulo];
    }
  }
}
