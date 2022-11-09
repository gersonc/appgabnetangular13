import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { CoordenadaXY } from './coordenada-x-y';

interface MedidaI {
  altura?: number,
  largura?: number
}

interface JanelaI {
  app?: MedidaI,
  topoprincipal? :MedidaI,
  main?: MedidaI,
  menuprincipal?:MedidaI,
  principal?: MedidaI
}

function _window(): any {
  // return the global native browser window object
  return window;
}



@Injectable({
  providedIn: 'root',
})
export class WindowsService {

  janela: JanelaI = {};
  larguraMenuSubject: BehaviorSubject<number>;
  larguraMenu: Observable<number>;
  larguraMn!: number;
  alturaMenuSubject: BehaviorSubject<number>;
  alturaMenu: Observable<number>;
  alturaMn!: number;
  expandeMenuSubject: BehaviorSubject<boolean>;
  expandeMenu: Observable<boolean>;
  width!: number;
  // height!: number;
  coorApp = new CoordenadaXY();
  coorTopo = new CoordenadaXY();
  coorMain = new CoordenadaXY();
  coorRodape = new CoordenadaXY();


  constructor() {
    this.larguraMenuSubject = new BehaviorSubject<number>(WindowsService.nativeWindow.innerWidth);
    this.larguraMenu = this.larguraMenuSubject.asObservable();
    this.alturaMenuSubject = new BehaviorSubject<number>(WindowsService.nativeWindow.innerHeight);
    this.alturaMenu = this.alturaMenuSubject.asObservable();
    this.expandeMenuSubject = new BehaviorSubject<boolean>(WindowsService.getExpandeMenu(WindowsService.nativeWindow.innerWidth));
    this.expandeMenu = this.expandeMenuSubject.asObservable();
  }

  public static get nativeWindow(): any {
    return _window();
  }

  public static get doc(): Document {
    return WindowsService.nativeWindow.document;
  }

  public static all(): JanelaI {
    return  {
      app: WindowsService.getApp(),
      topoprincipal: WindowsService.getTopo(),
      main: WindowsService.main,
      menuprincipal: WindowsService.getMenuPrincipal(),
      principal: WindowsService.getPrincial(),
    };
  }

  public static getPrincial(): any {
    return  {
      altura: WindowsService.doc.getElementById('topoprincipal')!.offsetHeight,
      largura: WindowsService.doc.getElementById('principal')!.offsetWidth
    };
  }

  public static getTopo(): any {
    return  {
      altura: document.getElementById('topoprincipal')!.offsetHeight,
      largura: document.getElementById('topoprincipal')!.offsetWidth
    };
  }

  public static getMenuPrincipal(): MedidaI {
    return  {
      altura: document.getElementById('menuPrincipal')!.offsetHeight,
      largura: document.getElementById('menuPrincipal')!.offsetWidth
    };
  }

  public static get alturaTabela(): string {
    const doc: Document = WindowsService.doc;
    const m: number = doc.getElementById('main')!.clientHeight;
    const t: number = doc.getElementById('topoprincipal')!.clientHeight * 3.68;
    return  (+m - t) + 'px';
  }

  public static get alturaTabelaNumber(): number {
    const doc: Document = WindowsService.doc;
    const m: number = doc.getElementById('main')!.clientHeight;
    const t: number = doc.getElementById('topoprincipal')!.clientHeight * 3.68;
    return  (+m - t);
  }

  public static getApp(): any {
    return  {
      altura: document.getElementById('app')!.offsetHeight,
      largura: document.getElementById('app')!.offsetWidth
    };
  }

  public static get main(): MedidaI {
    const doc: Document = WindowsService.doc;
    return  {
      altura: doc.getElementById('main')!.offsetHeight,
      largura: doc.getElementById('main')!.offsetWidth
    };
  }


  public static getMain(): any {
    return  {
      altura: document.getElementById('main')!.offsetHeight,
      largura: document.getElementById('main')!.offsetWidth
    };
  }

  public static getCorpo(): any {
    return  {
      altura: +WindowsService.nativeWindow.document.offsetHeight - (+WindowsService.nativeWindow.document.getElementById('topoprincipal').innerHeight + WindowsService.nativeWindow.document.getElementById('principal')!.offsetHeight),
      largura: +WindowsService.nativeWindow.document.innerWidth
    };
  }

  public static getMedidas(elemento: string): any {
    return  {
      altura: +WindowsService.nativeWindow.document.getElementById(elemento)!.offsetHeight,
      largura: +WindowsService.nativeWindow.document.getElementById(elemento)!.offsetWidth
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
    this.expandeMenuSubject.next(WindowsService.getExpandeMenu(horz));
  }

  public changeAlturaMenu(vert: number) {
    this.alturaMenuSubject.next(vert);
  }

  public changeScreen(horz: number, vert: number) {
    this.larguraMenuSubject.next(horz);
    this.alturaMenuSubject.next(vert);
  }

  private static getExpandeMenu(larg: number) {
    return larg > 768;
  }






  public teste() {
    // const x = WindowsService.nativeWindow.
  }

}
