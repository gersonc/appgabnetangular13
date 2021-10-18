import { Injectable } from '@angular/core';
// import { v1 as uuidv1 } from 'uuid/dist';

@Injectable({
  providedIn: 'root'
})
export class UuidService {

  static getUuid() {
    const { v1: uuidv1 } = require('uuid');
    return uuidv1();
  }
}
