import { Injectable } from '@angular/core';
import {OnoffLineService} from "./onoff-line.service";

@Injectable({
  providedIn: 'root'
})
export class IsOffLineService {

  constructor(private ols: OnoffLineService) { }

  get isOffline() {
    return !this.ols.online;
  }

  get isOnline() {
    return this.ols.online;
  }

}
