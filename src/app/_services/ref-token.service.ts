import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefTokenService {

  expiresRef = 0;
  reflesh_token = '';
  expires = 0;
  token = '';

  constructor() { }

  vfRefExp(): boolean {
    if (!localStorage.getItem("expiresRef") || !localStorage.getItem("reflesh_token")) {
      return false;
    } else {
      const n: number = +localStorage.getItem("expiresRef");
      return n > Math.floor((+Date.now()) / 1000);
    }
  }

  vfExp(): boolean {
    if (!localStorage.getItem("expires") || !localStorage.getItem("access_token")) {
      return false;
    } else {
      const n: number = +localStorage.getItem("expires");
      return n > Math.floor((+Date.now()) / 1000);
    }
  }

  refleshToken(): string {
    if (!localStorage.getItem("reflesh_token")) {
      return '';
    } else {
      return localStorage.getItem("reflesh_token");
    }
  }

  Token(): string {
    if (localStorage.getItem("access_token")) {
      return '';
    } else {
      return localStorage.getItem("access_token");
    }
  }

}
