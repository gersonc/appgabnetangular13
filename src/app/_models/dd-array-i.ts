import {SelectItem, SelectItemGroup} from "primeng/api";

export interface DdArrayI {
  [index: string]: any[]
}
export interface DdsI {
  idx: number | null;
  indice: string | null;
  selectItem: SelectItem[] | SelectItemGroup[] | null;
}


/*

export interface ObjDdArrayI {
  nome: string;
  valor: SelectItem[] | SelectItemGroup[];
}

*/

export function parceDdsToSelectItem(dds: DdsI): SelectItem[] | SelectItemGroup[] {
  return dds.selectItem;
}


export function parceToDdArray(val: any): DdArrayI[] {
  const k: string[] = Object.keys(val);
  console.log('teste0', k);
  return  k.map(s => {
    return {
      [s]: val[s]
    };
  })
}

export function parceDdArrayToSelectItemArray(val: DdArrayI[]): DdsI[] {
  return val.map((v, i) => {
    const n: string[] = Object.keys(v);
    const d: DdsI = {
      idx: i,
      indice: n[0],
      selectItem: v[n[0]],
    }
    return d;
  });
}

export function parceSelectItemArrayToDds(dds: DdsI[], indice: any, val: any[]): DdsI {
  return {
      idx: dds.length,
      indice: indice,
      selectItem: val
    };
}

/*

export function parceFromDdArray(val: DdArrayI[]): ObjDdArrayI[] {
  return val.map((v, i) => {
    // const p = v as DdArrayI;
    const n: string[] = Object.keys(v);
    return {
      nome: n[0],
      valor: v[n[0]]
    }
  });
}

*/


export function parceDdsArrayToDdArrayI(val: DdsI[]): DdArrayI[] {
  return val.map((v) => {
    return {
      [v.indice]: v.selectItem
    };
  });
}

export function parceDdArrayToObj(obj: any, dds: DdsI[]): any {
  const n: number = dds.length - 1;
  let a = 0;
  dds.forEach(d => {
    const ind: any = d.indice;
    obj[ind as keyof typeof obj] = d.selectItem;
    a++;
    if (a === n) {
      return obj;
    }
  });
}

export function getDdsFromIndice(indice: string, dds: DdsI[]): DdsI {
  const n = dds.findIndex(d => d.indice === indice);
  return dds[n];
}


