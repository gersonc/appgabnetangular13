import {ColunasI} from "../../_models/colunas-i";


export function helperAdicionaCamposTexto (busca: any, colunas: ColunasI[],  camposTexto: string[] = []): any {
  if (camposTexto.length === 0) {
    return busca;
  }
  const col: ColunasI[] = [];
  colunas.forEach((cl) => {
    col.push(cl);
    if (camposTexto.indexOf(cl.field) !== -1) {
      const novoCampoTxt: ColunasI = {
        field: cl.field + '_texto',
        header: cl.header,
        width: cl.width,
        sortable: cl.sortable
      };
      col.push(novoCampoTxt);
    }
  });
  busca.campos = col;
  return busca;
}

export function helperAdicionaCamposDelta (busca: any, colunas: ColunasI[],  camposTexto: string[] = []): any {
  if (camposTexto.length === 0) {
    return busca;
  }
  const col: ColunasI[] = [];
  colunas.forEach((cl) => {
    col.push(cl);
    if (camposTexto.indexOf(cl.field) !== -1) {
      const novoCampoDelta: ColunasI = {
        field: cl.field + '_delta',
        header: cl.header,
        width: cl.width,
        sortable: cl.sortable
      };
      col.push(novoCampoDelta);
    }
  });
  busca.campos = col;
  return busca;
}

export function helperAdicionaCamposTextoDelta (busca: any, colunas: ColunasI[],  camposTexto: string[] = []): any {
  if (camposTexto.length === 0) {
    return busca;
  }
  const col: ColunasI[] = [];
  colunas.forEach((cl) => {
    col.push(cl);
    if (camposTexto.indexOf(cl.field) !== -1) {
      const novoCampoTxt: ColunasI = {
        field: cl.field + '_texto',
        header: cl.header,
        width: cl.width,
        sortable: cl.sortable
      };
      col.push(novoCampoTxt);
      const novoCampoDelta: ColunasI = {
        field: cl.field + '_delta',
        header: cl.header,
        width: cl.width,
        sortable: cl.sortable
      };
      col.push(novoCampoDelta);
    }
  });
  busca.campos = col;
  return busca;
}
