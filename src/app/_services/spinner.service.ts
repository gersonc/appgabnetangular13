import { Injectable } from '@angular/core';
import { Spinkit } from 'ng-http-loader';

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

  vf = true;
  modelo = Spinkit.skWave;

  constructor() { }

  liga() {
    this.vf = true;
    this.modelo = Spinkit.skWave;
  }

  desliga() {
    this.vf = false;
    this.modelo = Spinkit.skCubeGrid;
  }

}
