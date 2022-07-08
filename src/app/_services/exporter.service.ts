import { Injectable } from '@angular/core';
import {CelulaI} from "../_models/celula-i";
import {ExporterViewI} from "../_models/exporter-view-i";
import {CAMPOSCOMUNICACAO} from "../shared/email-telefone-celular/email-telefone-celular-i";
import {CAMPOSTEXTOS} from "../shared/functions/constantes";

@Injectable({
  providedIn: 'root'
})
export class ExporterService {

  celula: CelulaI | null = null;
  camposTextos: string[] = []
  showCampoTexto = false;
  modulo: string | null = null;
  exporterView: ExporterViewI | null = null;
  showView = false;

  html: any = null;
  tipo: string = '';
  gerarSN = false;
  nome: string | null = null

  constructor() { }

  mostraTexto(celula: CelulaI) {
    this.celula = celula;
    this.showCampoTexto = true;
  }

  fecharTexto() {
    this.celula = null;
    this.showCampoTexto = false;
  }

  mostraView(view: ExporterViewI) {
    this.exporterView = view;
    this.showView = true;
  }

  fechaView() {
    this.exporterView = null;
    this.showView = false;
  }

  inicio(html: any, tipo: string, nome: string | null = null) {
    this.html = html;
    this.tipo = tipo;
    this.nome = nome;
    this.gerarSN = true;
  }

  fim() {
    this.gerarSN = false;
    this.html = null;
    this.tipo = '';
    this.nome = null;
  }

  getDestino(field): number {
    if (CAMPOSCOMUNICACAO.indexOf(field) !== -1) {
      return 2;
    } else {
      return 1;
    }
  }

  exportWord(html: any, nome: string | null = null) {
    this.html = html;
    this.tipo = 'docx';
    this.nome = nome;
    this.gerarSN = true;
  }

  exportPdf(html: any, nome: string | null = null) {
    this.html = html;
    this.tipo = 'pdf';
    this.nome = nome;
    this.gerarSN = true;
  }

}
