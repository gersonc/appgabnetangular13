import { Injectable } from '@angular/core';
import {OnoffLineService} from "../shared/onoff-line/onoff-line.service";

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  constructor(private ols: OnoffLineService) { }

  get isOffline() {
    return !this.ols.online;
  }

  get isOnline() {
    return this.ols.online;
  }

  get disabled() {
    return !this.ols.online;
  }

  get enabled() {
    return this.ols.online;
  }
}
