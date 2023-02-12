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
  // onoffSubject: BehaviorSubject<boolean>;
  // onoff: Observable<boolean>;
  subscriptions: Subscription[] = [];
  online = true;
  onoffSubject = new BehaviorSubject<boolean>(true);
  onoff = this.onoffSubject.asObservable();

  constructor() {
    this.onlineEvent = fromEvent(OnoffLineService.nativeWindow, 'online');
    this.offlineEvent = fromEvent(OnoffLineService.nativeWindow, 'offline');
    this.handleAppConnectivityChanges();
    this.n++;
  }

  private static get nativeWindow(): any {
    return _window();
  }

  public handleAppConnectivityChanges(): void {
    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      // handle online mode
      this.online = true;
      console.log('online');
      this.onoffSubject.next(true);
    }));
    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.online = false;
      console.log('offline');
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

/*

  checkinterent:any;
  checkConnection:string = '';
  therichpost$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }
  ngOnInit(){
    this.therichpost$().subscribe(isOnline => this.checkinterent = isOnline);
    //checking internet connection
    if(this.checkinterent == true)
    {
      //show success alert if internet is working
      this.checkConnection = 'Your internet is working';

    }
    else{
      //show danger alert if net internet not working
      this.checkConnection = 'Your internet is not working';
    }
  }
*/

}
