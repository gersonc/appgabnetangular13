import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';


@Injectable({
  providedIn: 'root'
})
export class DispositivoService {
  deviceInfo: any = null;

  private _dispositivo = '';
  constructor(private deviceService: DeviceDetectorService) {
    this.epicFunction();
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
  }

  get dispositivo(): string {
    if (this._dispositivo === '') {
      this._dispositivo =  this.deviceService.isDesktop() ? 'desktop' : 'mobile';
      return  this._dispositivo;
    } else {
      return  this._dispositivo;
    }
  }

  set dispositivo(d: string) {
    this._dispositivo = d;
  }




}
