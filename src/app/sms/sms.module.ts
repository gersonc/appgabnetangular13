import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsEnvioComponent } from './sms-envio/sms-envio.component';
import { SmsService } from './_services/sms.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {RippleModule} from 'primeng/ripple';

@NgModule({
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        RippleModule
    ],
  declarations: [
    SmsEnvioComponent
  ],
  entryComponents: [
    SmsEnvioComponent
  ],
  exports: [
    SmsEnvioComponent
  ],
  providers: [
    SmsService
  ]
})
export class SmsModule { }
