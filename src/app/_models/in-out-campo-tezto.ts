export interface CpoEditor {
  delta: any;
  html: string;
  text: string;
}
export interface InOutCampoTextoI {
  format: 'html' | 'object' | 'text' | 'json';
  valor: any | null;
  vf: boolean;
}
export function InOutCampoTexto ( html: string|null|undefined, delta: any|null|undefined ): InOutCampoTextoI {
  if (typeof delta === 'undefined' || delta === null ) {
    if (typeof html === 'undefined' || html === null) {
      return {
        format: 'html',
        valor: null,
        vf: false
      };
    } else {
      return {
        format: 'html',
        valor: html,
        vf: true
      };
    }

  } else {
    return {
      format: 'json',
      valor: delta,
      vf: true
    };
  }

}
