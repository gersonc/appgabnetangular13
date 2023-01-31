import { Component, NgModule, OnInit, OnDestroy } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DomHandler } from 'primeng/dom';
import { AppConfig } from "../_models/appconfig";
import { AppConfigService } from "../_services/appconfigservice";


@Component({
    selector: 'app-inputStyleSwitch',
    template: `
        <div class="app-inputstyleswitch">
            <h4>Input Style</h4>
            <div class="formgroup-inline">
                <div class="field-radiobutton">
                    <p-radioButton #sw1 name="inputstyle" value="outlined" [(ngModel)]="inputStyle" (onClick)="onChange(sw1.value)" inputId="input_outlined"></p-radioButton>
                    <label for="input_outlined">Outlined</label>
                </div>
                <div class="field-radiobutton">
                    <p-radioButton #sw2 name="inputstyle" value="filled" [(ngModel)]="inputStyle" (onClick)="onChange(sw1.value)" inputId="input_filled"></p-radioButton>
                    <label for="input_filled">Filled</label>
                </div>
            </div>
        </div>
    `
})
export class AppInputStyleSwitchComponent  implements OnInit, OnDestroy {

    value: string;

    inputStyle: string =  'outlined';

    public subscription: Subscription;

    constructor(private configService: AppConfigService) {
      this.inputStyle = this.configService.config.inputStyle;
    }

    ngOnInit() {
        // this.config = this.configService.config;
      this.subscription = this.configService.configUpdate$.subscribe(config => {
        if(config.inputStyle !== this.inputStyle) {
          this.inputStyle = config.inputStyle;
          this.mudaStyle(this.inputStyle);
        }
      });
      // this.subscription = this.configService.configUpdate$.subscribe(config => this.config = config);
    }

    onChange(sw: string) {
      console.log('AppInputStyleSwitchComponent',sw);
      this.configService.setInputStyle(sw);
    }

    mudaStyle(sw: string) {
      if (sw === 'filled') {
        DomHandler.addClass(document.body, 'p-input-filled');
      } else {
        DomHandler.removeClass(document.body, 'p-input-filled');
      }

    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@NgModule({
    imports: [RadioButtonModule, FormsModule],
    exports: [AppInputStyleSwitchComponent],
    declarations: [AppInputStyleSwitchComponent]
})
export class AppInputStyleSwitchModule { }
