import {CelulaI} from "../../_models/celula-i";
import {limpaTexto150Null} from "./limpa-texto";

export function montaCelula(
  field: string,
  header: string,
  txtVF = false,
  valor: any = null,
  cphtml: any = null,
  cpdelta: any = null,
  cptexto: any = null
): CelulaI {
  let c: CelulaI = {
    field: field,
    header: header,
    txtVF: txtVF,
    valor: null
  }
  if (!txtVF) {
    c.valor = valor;
    return c;
  }
  if (cptexto !== undefined && cptexto !== null && cptexto.toString().length > 0) {
    c.cptexto = cptexto;
    c.valor = valor;
  }
  if (cphtml !== undefined && cphtml !== null && cphtml.toString().length > 0) {
    c.cphtml = cphtml;
    c.valor(c.valor !== null) ? c.valor : c.cphtml = cphtml;
  }
  if (cpdelta !== undefined && cpdelta !== null && cpdelta.toString().length > 0) {
    c.cpdelta = cpdelta;
  }

  c.valor = limpaTexto150Null(valor);
  return c;
}
