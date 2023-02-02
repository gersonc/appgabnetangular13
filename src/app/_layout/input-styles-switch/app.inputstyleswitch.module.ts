import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { DomHandler } from "primeng/dom";
import { AppConfigService } from "../../_services/appconfigservice";


@Component({
  selector: "app-inputStyleSwitch",
  template: `
    <div class="app-inputstyleswitch">
      <h4>Input Style</h4>
      <div class="formgroup-inline">
        <div class="field-radiobutton">
          <p-radioButton #sw1 name="inputstyle" value="outlined" [(ngModel)]="valor"
                         (onClick)="onChange()" inputId="input_outlined" [disabled]="!ativo"></p-radioButton>
          <label for="input_outlined">Outlined</label>
        </div>
        <div class="field-radiobutton">
          <p-radioButton #sw2 name="inputstyle" value="filled" [(ngModel)]="valor" (onClick)="onChange()"
                         inputId="input_filled" [disabled]="!ativo"></p-radioButton>
          <label for="input_filled">Filled</label>
        </div>
      </div>
    </div>
  `
})
export class AppInputStyleSwitchComponent implements OnInit, OnDestroy {

  ativo = true;
  valor: string = "outlined";
  inputStyle: string = "outlined";

  public subscription: Subscription[] = [];

  constructor(private configService: AppConfigService) {
    this.setStiloInit(this.configService.config.inputStyle);
  }

  ngOnInit() {
    this.subscription.push(this.configService.configUpdate$.subscribe(config => {
        if (config.inputStyle !== this.inputStyle) {
          this.inputStyle = config.inputStyle;
          this.mudaStyle(this.inputStyle);
        }
      })
    );
  }

  onChange() {
    this.ativo = false;
    const s: string = (this.inputStyle === 'outlined') ? 'filled' : 'outlined';
    this.configService.setInputStyle(s);
  }

  mudaStyle(sw: string) {
    if (sw === "filled") {
      DomHandler.addClass(document.body, "p-input-filled");
    } else {
      DomHandler.removeClass(document.body, "p-input-filled");
    }
    this.ativo = true;
  }

  setStiloInit(s: string) {
    this.valor = s;
  }

  ngOnDestroy() {
    this.subscription.forEach(s => s.unsubscribe());
  }
}
