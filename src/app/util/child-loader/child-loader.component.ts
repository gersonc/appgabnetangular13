import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef, Input,
  OnInit,
  ViewContainerRef,
  OnDestroy
} from "@angular/core";
import { AuthenticationService } from "../../_services";

@Component({
  selector: 'app-child-loader',
  templateUrl: './child-loader.component.html'
})

export class ChildLoaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() componente: any;
  private readonly currentUser: any;
  constructor(
    private r: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
    ) {
    this.currentUser = sessionStorage.getItem('currentUser');

  }

  public windowReference: any;

  ngAfterViewInit() {
    setTimeout(() => {
      //create the component dynamically
      const factory = this.r.resolveComponentFactory(this.componente);
      const comp: ComponentRef<any> =
        this.viewContainerRef.createComponent(factory);
      //in case you also need to inject an input to the child,
      //like the windows reference
      //     comp.instance.someInputField = this.windowReference.document.body;

      //add you freshly baked component on the windows
      this.windowReference.document.body.appendChild(comp.location.nativeElement);
    });
  }

  ngOnInit() {
    //create the windows and save the reference
    this.windowReference = window.open(
      '',
      '_blank',
      'toolbar=0,width=1000,height=600,titlebar=yes,resizable=yes'
    );
    this.windowReference.sessionStorage.setItem('currentUser', this.currentUser);
  }

  ngOnDestroy(): void {
    this.windowReference.close();
  }
}
