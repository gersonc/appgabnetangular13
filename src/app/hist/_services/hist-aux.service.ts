import { Injectable } from '@angular/core';
import {HistFormI, HistI, HistListI} from "../_models/hist-i";

@Injectable({
  providedIn: 'root'
})
export class HistAuxService {
  hist: HistI;
  histListI: HistListI;
  histFormI: HistFormI;
  constructor() { }
}


