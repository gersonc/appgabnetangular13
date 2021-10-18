import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { CoordenadaXY } from './coordenada-x-y';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root',
})
export class WindowsService {

  larguraMenuSubject: BehaviorSubject<number>;
  larguraMenu: Observable<number>;
  larguraMn!: number;
  alturaMenuSubject: BehaviorSubject<number>;
  alturaMenu: Observable<number>;
  alturaMn!: number;
  expandeMenuSubject: BehaviorSubject<boolean>;
  expandeMenu: Observable<boolean>;
  width!: number;
  height!: number;
  coorApp = new CoordenadaXY();
  coorTopo = new CoordenadaXY();
  coorMain = new CoordenadaXY();
  coorRodape = new CoordenadaXY();


  constructor() {
    this.larguraMenuSubject = new BehaviorSubject<number>(WindowsService.nativeWindow.innerWidth);
    this.larguraMenu = this.larguraMenuSubject.asObservable();
    this.alturaMenuSubject = new BehaviorSubject<number>(WindowsService.nativeWindow.innerHeight);
    this.alturaMenu = this.alturaMenuSubject.asObservable();
    this.expandeMenuSubject = new BehaviorSubject<boolean>(this.getExpandeMenu(WindowsService.nativeWindow.innerWidth));
    this.expandeMenu = this.expandeMenuSubject.asObservable();
  }

  public static get nativeWindow(): any {
    return _window();
  }

  public static getPrincial(): any {
    return  {
      altura: document.getElementById('principal')!.offsetHeight,
      largura: document.getElementById('principal')!.offsetWidth
    };
  }

  public static getMedidas(elemento: string): any {
    return  {
      altura: document.getElementById(elemento)!.offsetHeight,
      largura: document.getElementById(elemento)!.offsetWidth
    };
  }

  public static get altura(): number {
    return WindowsService.nativeWindow.innerHeight;
  }

  public static get largura(): number {
    return WindowsService.nativeWindow.innerWidth;
  }

  public static get pq(): boolean {
    return WindowsService.nativeWindow.innerHeight < 576;
  }

  public static get sm(): boolean {
    return WindowsService.nativeWindow.innerHeight >= 576 &&
      WindowsService.nativeWindow.innerHeight < 768;
  }

  public static get md(): boolean {
    return WindowsService.nativeWindow.innerHeight >= 768 &&
      WindowsService.nativeWindow.innerHeight < 992;
  }

  public static get lg(): boolean {
    return WindowsService.nativeWindow.innerHeight >= 992 &&
      WindowsService.nativeWindow.innerHeight < 1200;
  }

  public static get xl(): boolean {
    return WindowsService.nativeWindow.innerHeight > 1200;
  }

  public static get appX(): number | 'undefined' {
    return WindowsService.coorApp.x;
  }

  public static get coorApp(): CoordenadaXY {
    return WindowsService.coorApp;
  }

  public static get coorTopo(): CoordenadaXY {
    return WindowsService.coorTopo;
  }

  public static get coorMain(): CoordenadaXY {
    return WindowsService.coorMain;
  }

  public static get coorRodape(): CoordenadaXY {
    return WindowsService.coorRodape;
  }


  public changeLarguraMenu(horz: number) {
    this.larguraMenuSubject.next(horz);
    this.expandeMenuSubject.next(this.getExpandeMenu(horz));
  }

  public changeAlturaMenu(vert: number) {
    this.alturaMenuSubject.next(vert);
  }

  public changeScreen(horz: number, vert: number) {
    this.larguraMenuSubject.next(horz);
    this.alturaMenuSubject.next(vert);
  }

  private getExpandeMenu(larg: number) {
    return larg > 768;
  }






  public teste() {
    // const x = WindowsService.nativeWindow.
  }

}
