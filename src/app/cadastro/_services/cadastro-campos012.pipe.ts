import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'campos012'})
export class CadastroCampos012Pipe implements PipeTransform {
  transform(value: any, campo: string): any {
    let resp: string;
    switch (campo) {
      case 'c012' : {
        switch (value) {
          case 0 : {
            resp = 'INATIVO';
            break;
          }
          case 1 : {
            resp = 'ATIVO';
            break;
          }
          case 2 : {
            resp = 'INATIVO';
            break;
          }
          case 'S' : {
            resp = 'ATIVO';
            break;
          }
          case 'N' : {
            resp = 'INATIVO';
            break;
          }
          default: {
            resp = 'INATIVO';
            break;
          }
        }
        break;
      }
      case 'c01' : {
        switch (value) {
          case 0 : {
            resp = 'INATIVO';
            break;
          }
          case 1 : {
            resp = 'ATIVO';
            break;
          }
          case 'S' : {
            resp = 'ATIVO';
            break;
          }
          case 'N' : {
            resp = 'INATIVO';
            break;
          }
          default: {
            resp = 'INATIVO';
            break;
          }
        }
        break;
      }
      case 'cadastro_jornal' : {
        switch (value) {
          case 0 : {
            resp = 'INATIVO';
            break;
          }
          case 1 : {
            resp = 'ATIVO';
            break;
          }
          case 2 : {
            resp = 'INATIVO';
            break;
          }
          case 'S' : {
            resp = 'ATIVO';
            break;
          }
          case 'N' : {
            resp = 'INATIVO';
            break;
          }
          default: {
            resp = 'INATIVO';
            break;
          }
        }
        break;
      }
      case 'cadastro_mala' : {
        switch (value) {
          case 0 : {
            resp = 'INATIVO';
            break;
          }
          case 1 : {
            resp = 'ATIVO';
            break;
          }
          case 2 : {
            resp = 'INATIVO';
            break;
          }
          case 'S' : {
            resp = 'ATIVO';
            break;
          }
          case 'N' : {
            resp = 'INATIVO';
            break;
          }
          default: {
            resp = 'INATIVO';
            break;
          }
        }
        break;
      }
      case 'cadastro_agenda' : {
        switch (value) {
          case 0 : {
            resp = 'INATIVO';
            break;
          }
          case 1 : {
            resp = 'ATIVO';
            break;
          }
          case 2 : {
            resp = 'INATIVO';
            break;
          }
          case 'S' : {
            resp = 'ATIVO';
            break;
          }
          case 'N' : {
            resp = 'INATIVO';
            break;
          }
          default: {
            resp = 'INATIVO';
            break;
          }
        }
        break;
      }
      case 'cadastro_sigilo' : {
        switch (value) {
          case 0 : {
            resp = 'INATIVO';
            break;
          }
          case 1 : {
            resp = 'ATIVO';
            break;
          }
          case 'S' : {
            resp = 'ATIVO';
            break;
          }
          case 'N' : {
            resp = 'INATIVO';
            break;
          }
          default: {
            resp = 'INATIVO';
            break;
          }
        }
        break;
      }
      default: {
        resp = value;
        break;
      }
    }
    return resp;
  }
}
