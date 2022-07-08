import {html_entity_decode} from "./html-entity";
import {striptags} from "striptags";

export function limpaTexto(valor: string): string {
  return html_entity_decode(striptags(valor), 'HTML_SPECIALCHARS');
}

export function limpaTextoNull(valor: undefined | null | string): string | null {
  return (valor === undefined || valor === null) ? null : html_entity_decode(striptags(valor), 'HTML_SPECIALCHARS');
}

export function limpaTexto150Null(valor: undefined | null | string, n: number = 150): string | null {
  return (valor === undefined || valor === null) ? null : html_entity_decode(striptags(valor), 'HTML_SPECIALCHARS').substr(0, n);
}

export function limpaTextoNotNull(valor: undefined | null | string): string {
  return (valor === undefined || valor === null) ? '' : html_entity_decode(striptags(valor), 'HTML_SPECIALCHARS');
}
