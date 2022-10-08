import { Injectable } from '@angular/core';
import {AuthenticationService} from "../../_services";

@Injectable({
  providedIn: 'root'
})
export class CadastroPermissaoService {
  autSol = false;
  autOfi = false;
  autPro = false;
  autEme = false;
  solVer = 0;
  userVip = false;

  constructor(
    public aut: AuthenticationService,
  ) { }

  criaPermissao() {
    this.solVer = this.aut.solicitacaoVersao;
    this.userVip = (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    if (this.aut.solicitacao_listar) {
      this.autSol = true;
    }
    if (this.aut.emenda_listar) {
      this.autEme = true;
    }
    if(this.solVer === 1) {
      if (this.aut.oficio_listar) {
        this.autOfi = true;
      }
      if (this.aut.processo_listar) {
        this.autPro = true;
      }
      if(this.userVip) {
        this.autSol = true;
        this.autOfi = true;
        this.autPro = true;
        this.autEme = true;
      }
    } else {
      if(this.userVip) {
        this.autEme = true;
      }
    }
  }

  getPermissao(vinculos: number, snum: number, pnum: number, onum: number, enu: number): boolean {
    let ct = 0;
    if (vinculos !== 1) {
      return false
    }
    if (enu > 0) {
      if (!this.userVip && !this.autEme) {
        ct++;
      }
    }
    if (snum > 0) {
      if (!this.userVip && !this.autSol) {
        ct++;
      } else {
        if (this.solVer === 1) {
          if (pnum > 0) {
            if (!this.userVip && !this.autPro) {
              ct++;
            }
          }
          if (onum > 0) {
            if (!this.userVip && !this.autOfi) {
              ct++;
            }
          }
        }
      }
    }
    return (vinculos === 1 && ct === 0);
  }


}
