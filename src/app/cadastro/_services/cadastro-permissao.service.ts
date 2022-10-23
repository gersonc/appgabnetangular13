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
  autApagarCad = false;
  autApagarSol = false;
  autApagarOfi = false;
  autApagarPro = false;
  autApagarEme = false;
  autArqAtivo = false;
  autArqApagar = false;
  autArqBaixar = false;

  constructor(
    public aut: AuthenticationService,
  ) { }

  criaPermissao() {
    this.solVer = this.aut.solicitacaoVersao;
    this.autArqAtivo = this.aut.arquivos;
    this.autArqApagar = this.aut.arquivos_apagar;
    this.autArqBaixar = this.aut.arquivos_baixar;
    this.autApagarCad = this.aut.cadastro_apagar;
    this.userVip = (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    if (this.aut.solicitacao_listar) {
      this.autSol = true;
    }
    if (this.aut.solicitacao_apagar) {
      this.autApagarSol = true;
    }
    if (this.aut.emenda_listar) {
      this.autEme = true;
    }
    if (this.aut.emenda_apagar) {
      this.autApagarEme = true;
    }

    if(this.solVer === 1) {
      if (this.aut.oficio_listar) {
        this.autOfi = true;
      }
      if (this.aut.oficio_apagar) {
        this.autApagarOfi = true;
      }
      if (this.aut.processo_listar) {
        this.autPro = true;
      }
      if (this.aut.processo_apagar) {
        this.autApagarPro = true;
      }
      if(this.userVip) {
        this.autSol = true;
        this.autOfi = true;
        this.autPro = true;
        this.autEme = true;
        this.autApagarCad = true;
        this.autApagarSol = true;
        this.autApagarOfi = true;
        this.autApagarPro = true;
        this.autApagarEme = true;
      }
    } else {
      if(this.userVip) {
        this.autEme = true;
        this.autApagarCad = true;
        this.autApagarSol = true;
        this.autApagarEme = true;
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

  getPermissaoApager(vinculos: number, snum: number, pnum: number, onum: number, enu: number, tarq: number): boolean {
    let ct = 0;
    if (!this.autApagarCad) {
      return false;
    }
    if (this.autArqAtivo && tarq > 0) {
      if (!this.userVip && !this.autArqApagar) {
        ct++;
      }
    }
    if (vinculos === 1) {
      if (enu > 0) {
        if (!this.userVip && !this.autApagarEme) {
          ct++;
        }
      }
      if (snum > 0) {
        if (!this.userVip && !this.autApagarSol) {
          ct++;
        } else {
          if (this.solVer === 1) {
            if (pnum > 0) {
              if (!this.userVip && !this.autApagarPro) {
                ct++;
              }
            }
            if (onum > 0) {
              if (!this.userVip && !this.autApagarOfi) {
                ct++;
              }
            }
          }
        }
      }
    }
    return (ct === 0);
  }


}
