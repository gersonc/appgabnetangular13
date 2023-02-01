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

    console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();

    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
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
