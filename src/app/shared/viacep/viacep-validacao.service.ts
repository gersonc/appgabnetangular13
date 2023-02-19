import { Injectable } from "@angular/core";
import { CEPErrorCode } from "./model/cep-error-code";
import { UFS_VALIDAS } from "./model/constantes";
import { EnderecoPesquisa } from "./model/endereco";

@Injectable({
  providedIn: "root"
})
export class ViacepValidacaoService {

  constructor() { }

  ehStringValida(data: string): boolean {
    return !!data && data.trim() !== "";
  }

  hasMinLength(data: string, minLength: number): boolean {
    return data.trim().length >= minLength;
  }

  hasMaxLength(data: string, maxLength: number): boolean {
    return data.trim().length <= maxLength;
  }

  validarMunicipio(municipio: string): number {
    if (!this.ehStringValida(municipio)) {
      return CEPErrorCode.MUNICIPIO_VAZIO;
    } else {
      if (!this.hasMinLength(municipio, 3)) {
        return CEPErrorCode.MUNICIPIO_MUITO_CURTO;
      } else {
        return 100;
      }
    }
  };

  validarLogradouro(logradouro: string): number {
    if (!this.ehStringValida(logradouro)) {
      return CEPErrorCode.LOGRADOURO_VAZIO;
    } else {
      if (!this.hasMinLength(logradouro, 3)) {
        return CEPErrorCode.LOGRADOURO_MUITO_CURTO;
      } else {
        return 100;
      }
    }
  };

  validarUF(uf: string): number {
    if (!this.ehStringValida(uf)) {
      return CEPErrorCode.UF_VAZIA;
    } else {
      if (!this.hasMinLength(uf, 2)) {
        return CEPErrorCode.UF_MUITO_CURTA;
      } else {
        if (!this.hasMaxLength(uf, 2)) {
          return CEPErrorCode.UF_MUITO_LONGA;
        } else {
          if (!UFS_VALIDAS.some((it) => it.toLowerCase() === uf.toLowerCase())) {
            return CEPErrorCode.UF_NAO_EXISTE;
          } else {
            return 100;
          }
        }
      }
    }
  }

  validarCEP(cep: string): number {
    const regex = new RegExp(/^[0-9]+$/);
    if (!this.ehStringValida(cep)) {
      return CEPErrorCode.CEP_VAZIO;
    } else {
      if (!regex.test(cep)) {
        return CEPErrorCode.CEP_INVALIDO;
      } else {
        if (cep.length < 8) {
          return CEPErrorCode.CEP_MUITO_CURTO;
        } else {
          if (cep.length > 8) {
            return CEPErrorCode.CEP_MUITO_LONGO;
          } else {
            return 100;
          }
        }
      }
    }
  }

  validarEndereco(end: EnderecoPesquisa): number {
    const n0: number = this.validarUF(end.uf);
    const n1: number = this.validarMunicipio(end.municipio);
    const n2: number = this.validarLogradouro(end.logradouro);
    if (n0 < 100) {
      return n0;
    } else {
      if (n1 < 100) {
        return n1;
      } else {
        if (n2 < 100) {
          return n2;
        } else {
          return 100;
        }
      }
    }
  }

}
