import { Injectable } from '@angular/core';
import {BehaviorSubject, fromEvent, Observable, Subscription} from "rxjs";


function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class OnoffLineService {
  n = 0;
  m = 0;
  o = 0;
  ativo = false;
  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  onoffSubject: BehaviorSubject<boolean>;
  onoff: Observable<boolean>;
  subscriptions: Subscription[] = [];
  online: boolean = true;


  constructor() {
    this.handleAppConnectivityChanges();
    this.n++;
  }

  private static get nativeWindow(): any {
    return _window();
  }

  public handleAppConnectivityChanges(): void {
    this.m++;
    if (!this.ativo) {
      this.o++;
      this.onoffSubject = new BehaviorSubject<boolean>(true);
      this.onoff = this.onoffSubject.asObservable();
      this.ativo = true;
    }


    this.onlineEvent = fromEvent(OnoffLineService.nativeWindow, 'online');
    this.offlineEvent = fromEvent(OnoffLineService.nativeWindow, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      // handle online mode
      this.online = true;
      this.onoffSubject.next(true);
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.online = false;
      this.onoffSubject.next(false);
      // handle offline mode
    }));
  }


  get isOffline() {
    return !this.online;
  }

  get isOnline() {
    return this.online;
  }

  get disabled() {
    return !this.online;
  }

  get enabled() {
    return this.online;
  }

  ngOnDestroy(): void {
    this.onoffSubject.complete();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }













}
