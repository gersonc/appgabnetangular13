import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor, ErrorInterceptor } from '../_helpers';

// import { FullCalendarModule } from 'primeng/fullcalendar';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import luxonPlugin from '@fullcalendar/luxon';
import rrulePlugin from '@fullcalendar/rrule';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ListboxModule } from 'primeng/listbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { ChipsModule } from 'primeng/chips';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { SpinnerModule } from 'primeng/spinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';


import { CalendarioComponent } from './calendario.component';
import { CalendarioRoutingModule } from './calendario-routing.module';
import { CalendarioFormularioComponent } from './calendario-formulario/calendario-formulario.component';
import { UtilModule } from '../util/util.module';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { CalendarioTooltipComponent } from './calendario-tooltip/calendario-tooltip.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { CalendarioDetalheComponent } from './calendario-detalhe/calendario-detalhe.component';
import { CalendarioExibirComponent } from './calendario-exibir/calendario-exibir.component';
import { CalendarioExcluirComponent } from './calendario-excluir/calendario-excluir.component';
import { CalendarioImprimirComponent } from './calendario-imprimir/calendario-imprimir.component';
import { CalendarioFormComponent } from './calendario-form/calendario-form.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
  luxonPlugin,
  rrulePlugin
]);

@NgModule({
  declarations: [
    CalendarioComponent,
    CalendarioFormularioComponent,
    CalendarioFormComponent,
    CalendarioTooltipComponent,
    CalendarioDetalheComponent,
    CalendarioExibirComponent,
    CalendarioExcluirComponent,
    CalendarioImprimirComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule,
    CalendarioRoutingModule,

    UtilModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    DynamicDialogModule,
    InputTextModule,
    ScrollPanelModule,
    CalendarModule,
    ListboxModule,
    InputSwitchModule,
    ChipsModule,
    TooltipModule,
    SelectButtonModule,
    ToastModule,
    InputTextareaModule,
    CheckboxModule,
    SpinnerModule,
    RadioButtonModule,
    PanelModule,
    CardModule,
    MultiSelectModule,
    ColorPickerModule,
    FileUploadModule,
    InputNumberModule,
    SidebarModule,
    RippleModule,
    AngularResizeEventModule
  ],
  entryComponents: [
    CalendarioFormularioComponent,
    CalendarioFormComponent,
    CalendarioExibirComponent,
    CalendarioExcluirComponent,
    CalendarioImprimirComponent
  ],
  exports: [
    CalendarioComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class CalendarioModule { }
