import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { WindowsService } from './_service';

@Directive({
  selector: '[appJanela]'
})
export class JanelaDirective {
  @Output() largura = new EventEmitter<number>();
  @Output() altura = new EventEmitter<number>();
  constructor(private el: ElementRef, private windowsService: WindowsService) {
    this.onResize();
  }
  @HostListener('window:resize')
  onResize() {
    this.largura.emit(this.el.nativeElement.clientWidth);
    this.windowsService.changeLarguraMenu(this.el.nativeElement.clientWidth);
    this.altura.emit(this.el.nativeElement.clientHeight);
    this.windowsService.changeAlturaMenu(this.el.nativeElement.clientHeight);
  }
}
