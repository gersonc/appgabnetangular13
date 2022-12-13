import { Injectable } from '@angular/core';
import {Spinkit} from 'ng-http-loader';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  /*skChasingDots: string;
  skCubeGrid: string;
  skDoubleBounce: string;
  skRotatingPlane: string;
  skSpinnerPulse: string;
  skThreeBounce: string;
  skWanderingCubes: string;
  skWave: string;*/
  semSpinner: string[] = ['sugest','mensagem'];
  vf = true;
  modelo = Spinkit.skWave;
  _fundo = '#777777';
  fsn = true;

  constructor(
  ) { }

  get fundo() {
    return this._fundo;
  }

  liga() {
    this.vf = true;
    this.modelo = Spinkit.skWave;
  }

  desliga() {
    this.vf = false;
    this.modelo = Spinkit.skCubeGrid;
  }

  fundoSN(vf?: boolean) {
    if (vf === undefined) {
      this.fsn = !this.fsn;
    } else {
      this.fsn = vf;
    }
    this._fundo = (this.fsn) ? '#777777' : 'transparente';
  }



}
