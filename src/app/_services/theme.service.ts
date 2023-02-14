import { Injectable } from '@angular/core';
import { AppConfigService } from "./appconfigservice";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private ap: AppConfigService
  ) { }

  get dark(): boolean {
    return this.ap.config.dark;
  }

  get filedVF(): boolean {
    return !(this.ap.config.inputStyle === "outlined");
  }

}
