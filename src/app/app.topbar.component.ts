import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate, AnimationEvent } from '@angular/animations';
import { Subscription } from 'rxjs';
import { AppConfigService } from "./_services/appconfigservice";
import { AppConfig } from "./_models/appconfig";

@Component({
    selector: 'app-topbar',
    template: `
        <div class="layout-topbar" #containerElement>
            <a class="menu-button" (click)="onMenuButtonClick($event)">
                <i class="pi pi-bars"></i>
            </a>
            <div class="app-theme" [pTooltip]="config.theme" tooltipPosition="bottom">
                <img [src]="'assets/images/themes/' + logoMap[config.theme]" />
            </div>
            <ul #topbarMenu class="topbar-menu">
                <li class="topbar-submenu">
                    <a tabindex="0" (click)="toggleMenu($event, 0)">Themes</a>
                    <ul [@overlayMenuAnimation]="'visible'" *ngIf="activeMenuIndex === 0" (@overlayMenuAnimation.start)="onOverlayMenuEnter($event)">
                        <li class="topbar-submenu-header">THEMING</li>

                        <li class="topbar-submenu-header">BOOTSTRAP</li>
                        <li><a (click)="changeTheme($event, 'bootstrap4-light-blue', false)"><img src="assets/images/themes/bootstrap4-light-blue.svg" alt="Blue Light" /><span>Blue Light</span></a></li>
                        <li><a (click)="changeTheme($event, 'bootstrap4-light-purple', false)"><img src="assets/images/themes/bootstrap4-light-purple.svg" alt="Purple Light" /><span>Purple Light</span></a></li>
                        <li><a (click)="changeTheme($event, 'bootstrap4-dark-blue', true)"><img src="assets/images/themes/bootstrap4-dark-blue.svg" alt="Blue Dark" /><span>Blue Dark</span></a></li>
                        <li><a (click)="changeTheme($event, 'bootstrap4-dark-purple', true)"><img src="assets/images/themes/bootstrap4-dark-purple.svg" alt="Purple Dark" /><span>Purple Dark</span></a></li>

                        <li class="topbar-submenu-header">MATERIAL DESIGN</li>
                        <li><a (click)="changeTheme($event, 'md-light-indigo', false)"><img src="assets/images/themes/md-light-indigo.svg" alt="Indigo Light" /><span>Indigo Light</span></a></li>
                        <li><a (click)="changeTheme($event, 'md-light-deeppurple', false)"><img src="assets/images/themes/md-light-deeppurple.svg" alt="Deep Purple Light" /><span>Deep Purple Light</span></a></li>
                        <li><a (click)="changeTheme($event, 'md-dark-indigo', true)"><img src="assets/images/themes/md-dark-indigo.svg" alt="Indigo Dark" /><span>Indigo Dark</span></a></li>
                        <li><a (click)="changeTheme($event, 'md-dark-deeppurple', true)"><img src="assets/images/themes/md-dark-deeppurple.svg" alt="Deep Purple Dark" /><span>Deep Purple Dark</span></a></li>

                        <li class="topbar-submenu-header">MATERIAL DESIGN COMPACT</li>
                        <li><a (click)="changeTheme($event, 'mdc-light-indigo', false)"><img src="assets/images/themes/md-light-indigo.svg" alt="Indigo Light" /><span>Indigo Light</span></a></li>
                        <li><a (click)="changeTheme($event, 'mdc-light-deeppurple', false)"><img src="assets/images/themes/md-light-deeppurple.svg" alt="Deep Purple Light" /><span>Deep Purple Light</span></a></li>
                        <li><a (click)="changeTheme($event, 'mdc-dark-indigo', true)"><img src="assets/images/themes/md-dark-indigo.svg" alt="Indigo Dark" /><span>Indigo Dark</span></a></li>
                        <li><a (click)="changeTheme($event, 'mdc-dark-deeppurple', true)"><img src="assets/images/themes/md-dark-deeppurple.svg" alt="Deep Purple Dark" /><span>Deep Purple Dark</span></a></li>

                        <li class="topbar-submenu-header">TAILWIND</li>
                        <li><a (click)="changeTheme($event, 'tailwind-light', false)"><img src="assets/images/themes/tailwind-light.png" alt="Tailwind Light" /><span>Tailwind Light</span></a></li>

                        <li class="topbar-submenu-header">FLUENT UI</li>
                        <li><a (click)="changeTheme($event, 'fluent-light', false)"><img src="assets/images/themes/fluent-light.png" alt="Fluent Light" /><span>Fluent Light</span></a></li>

                        <li class="topbar-submenu-header">PRIMEONE - 2022</li>
                        <li><a (click)="changeTheme($event, 'lara-light-indigo', false)"><img src="assets/images/themes/lara-light-indigo.png" alt="Lara Light Indigo" /><span>Lara Light Indigo</span></a></li>
                        <li><a (click)="changeTheme($event, 'lara-dark-indigo', true)"><img src="assets/images/themes/lara-dark-indigo.png" alt="Lara Dark Indigo" /><span>Lara Dark Indigo</span></a></li>
                        <li><a (click)="changeTheme($event, 'lara-light-purple', false)"><img src="assets/images/themes/lara-light-purple.png" alt="Lara Light Indigo" /><span>Lara Light Purple</span></a></li>
                        <li><a (click)="changeTheme($event, 'lara-dark-purple', true)"><img src="assets/images/themes/lara-dark-purple.png" alt="Lara Dark Indigo" /><span>Lara Dark Purple</span></a></li>
                        <li><a (click)="changeTheme($event, 'lara-light-blue', false)"><img src="assets/images/themes/lara-light-blue.png" alt="Lara Light Blue" /><span>Lara Light Blue</span></a></li>
                        <li><a (click)="changeTheme($event, 'lara-dark-blue', true)"><img src="assets/images/themes/lara-dark-blue.png" alt="Lara Dark Blue" /><span>Lara Dark Blue</span></a></li>
                        <li><a (click)="changeTheme($event, 'lara-light-teal', false)"><img src="assets/images/themes/lara-light-teal.png" alt="Lara Light Teal" /><span>Lara Light Teal</span></a></li>
                        <li><a (click)="changeTheme($event, 'lara-dark-teal', true)"><img src="assets/images/themes/lara-dark-teal.png" alt="Lara Dark Teal" /><span>Lara Dark Teal</span></a></li>

                        <li class="topbar-submenu-header">PRIMEONE - 2021</li>
                        <li><a (click)="changeTheme($event, 'lara-light-indigo', false)"><img src="assets/images/themes/lara-light-indigo.png" alt="Lara Light Indigo" /><span>Lara Light Indigo</span></a></li>
                        <li><a (click)="changeTheme($event, 'lara-dark-indigo', true)"><img src="assets/images/themes/lara-dark-indigo.png" alt="Lara Dark Indigo" /><span>Lara Dark Indigo</span></a></li>
                        <li><a (click)="changeTheme($event, 'lara-light-purple', false)"><img src="assets/images/themes/lara-light-purple.png" alt="Lara Light Indigo" /><span>Lara Light Purple</span></a></li>
                        <li><a (click)="changeTheme($event, 'lara-dark-purple', true)"><img src="assets/images/themes/lara-dark-purple.png" alt="Lara Dark Indigo" /><span>Lara Dark Purple</span></a></li>
                        <li><a (click)="changeTheme($event, 'saga-blue', false)"><img src="assets/images/themes/saga-blue.png" alt="Saga Blue" /><span>Saga Blue</span></a></li>
                        <li><a (click)="changeTheme($event, 'saga-green', false)"><img src="assets/images/themes/saga-green.png" alt="Saga Green" /><span>Saga Green</span></a></li>
                        <li><a (click)="changeTheme($event, 'saga-orange', false)"><img src="assets/images/themes/saga-orange.png" alt="Saga Orange" /><span>Saga Orange</span></a></li>
                        <li><a (click)="changeTheme($event, 'saga-purple', false)"><img src="assets/images/themes/saga-purple.png" alt="Saga Purple" /><span>Saga Purple</span></a></li>
                        <li><a (click)="changeTheme($event, 'vela-blue', true)"><img src="assets/images/themes/vela-blue.png" alt="Vela Blue" /><span>Vela Blue</span></a></li>
                        <li><a (click)="changeTheme($event, 'vela-green', true)"><img src="assets/images/themes/vela-green.png" alt="Vela Green" /><span>Vela Green</span></a></li>
                        <li><a (click)="changeTheme($event, 'vela-orange', true)"><img src="assets/images/themes/vela-orange.png" alt="Vela Orange" /><span>Vela Orange</span></a></li>
                        <li><a (click)="changeTheme($event, 'vela-purple', true)"><img src="assets/images/themes/vela-purple.png" alt="Vela Purple" /><span>Vela Purple</span></a></li>
                        <li><a (click)="changeTheme($event, 'arya-blue', true)"><img src="assets/images/themes/arya-blue.png" alt="Arya Blue" /><span>Arya Blue</span></a></li>
                        <li><a (click)="changeTheme($event, 'arya-green', true)"><img src="assets/images/themes/arya-green.png" alt="Arya Green" /><span>Arya Green</span></a></li>
                        <li><a (click)="changeTheme($event, 'arya-orange', true)"><img src="assets/images/themes/arya-orange.png" alt="Arya Orange" /><span>Arya Orange</span></a></li>
                        <li><a (click)="changeTheme($event, 'arya-purple', true)"><img src="assets/images/themes/arya-purple.png" alt="Arya Purple" /><span>Arya Purple</span></a></li>

                        <li class="topbar-submenu-header">PREMIUM</li>
                        <li><a (click)="changeTheme($event, 'soho-light', false)"><img src="assets/images/themes/soho-light.png" alt="Soho Light" /><span>Soho Light</span></a></li>
                        <li><a (click)="changeTheme($event, 'soho-dark', true)"><img src="assets/images/themes/soho-dark.png" alt="Soho Dark" /><span>Soho Dark</span></a></li>
                        <li><a (click)="changeTheme($event, 'viva-light', false)"><img src="assets/images/themes/viva-light.svg" alt="Viva Light" /><span>Viva Light</span></a></li>
                        <li><a (click)="changeTheme($event, 'viva-dark', true)"><img src="assets/images/themes/viva-dark.svg" alt="Viva Dark" /><span>Viva Dark</span></a></li>
                        <li><a (click)="changeTheme($event, 'mira', false)"><img src="assets/images/themes/mira.jpg" alt="Mira" /><span>Mira</span></a></li>
                        <li><a (click)="changeTheme($event, 'nano', false)"><img src="assets/images/themes/nano.jpg" alt="Nano" /><span>Nano</span></a></li>

                        <li class="topbar-submenu-header">LEGACY</li>
                        <li><a (click)="changeTheme($event, 'nova', false)"><img src="assets/images/themes/nova.png" alt="Nova" /><span>Nova</span></a></li>
                        <li><a (click)="changeTheme($event, 'nova-alt', false)"><img src="assets/images/themes/nova-alt.png" alt="Nova Alt" /><span>Nova Alt</span></a></li>
                        <li><a (click)="changeTheme($event, 'nova-accent', false)"><img src="assets/images/themes/nova-accent.png" alt="Nova Accent" /><span>Nova Accent</span></a></li>
                        <li><a (click)="changeTheme($event, 'luna-amber', true)"><img src="assets/images/themes/luna-amber.png" alt="Luna Amber" /><span>Luna Amber</span></a></li>
                        <li><a (click)="changeTheme($event, 'luna-blue', true)"><img src="assets/images/themes/luna-blue.png" alt="Luna Blue" /><span>Luna Blue</span></a></li>
                        <li><a (click)="changeTheme($event, 'luna-green', true)"><img src="assets/images/themes/luna-green.png" alt="Luna Green" /><span>Luna Green</span></a></li>
                        <li><a (click)="changeTheme($event, 'luna-pink', true)"><img src="assets/images/themes/luna-pink.png" alt="Luna Pink" /><span>Luna Pink</span></a></li>
                        <li><a (click)="changeTheme($event, 'rhea', false)"><img src="assets/images/themes/rhea.png" alt="Rhea" /><span>Rhea</span></a></li>
                    </ul>
                </li>
                <li class="topbar-submenu">
                    <a tabindex="0" (click)="toggleMenu($event, 3)">{{versions ? versions[0].version : 'Latest'}}</a>
                    <ul [@overlayMenuAnimation]="'visible'" *ngIf="activeMenuIndex === 3" (@overlayMenuAnimation.start)="onOverlayMenuEnter($event)" style="width: 100%; min-width: 125px;">
                        <li *ngFor="let v of versions">
                            <a [href]="v.url">{{v.version}}</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    `,
    animations: [
        trigger('overlayMenuAnimation', [
            transition(':enter', [
                style({opacity: 0, transform: 'scaleY(0.8)'}),
                animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: '*' })),
              ]),
              transition(':leave', [
                animate('.1s linear', style({ opacity: 0 }))
              ])
        ])
    ]
})
export class AppTopBarComponent implements OnInit, OnDestroy {

    @Output() menuButtonClick: EventEmitter<any> = new EventEmitter();

    @ViewChild('topbarMenu') topbarMenu: ElementRef;

    @ViewChild('containerElement') containerElement: ElementRef;

    activeMenuIndex: number;

    outsideClickListener: any;

    config: AppConfig;

    subscription: Subscription;

    logoMap = {
        'bootstrap4-light-blue': 'bootstrap4-light-blue.svg',
        'bootstrap4-light-purple': 'bootstrap4-light-purple.svg',
        'bootstrap4-dark-blue': 'bootstrap4-dark-blue.svg',
        'bootstrap4-dark-purple': 'bootstrap4-dark-purple.svg',
        'md-light-indigo': 'md-light-indigo.svg',
        'md-light-deeppurple': 'md-light-deeppurple.svg',
        'md-dark-indigo': 'md-dark-indigo.svg',
        'md-dark-deeppurple': 'md-dark-deeppurple.svg',
        'mdc-light-indigo': 'md-light-indigo.svg',
        'mdc-light-deeppurple': 'md-light-deeppurple.svg',
        'mdc-dark-indigo': 'md-dark-indigo.svg',
        'mdc-dark-deeppurple': 'md-dark-deeppurple.svg',
        'lara-light-indigo': 'lara-light-indigo.png',
        'lara-light-purple': 'lara-light-purple.png',
        'lara-light-blue': 'lara-light-blue.png',
        'lara-light-teal': 'lara-light-teal.png',
        'lara-dark-indigo': 'lara-dark-indigo.png',
        'lara-dark-purple': 'lara-dark-purple.png',
        'lara-dark-blue': 'lara-dark-blue.png',
        'lara-dark-teal': 'lara-dark-teal.png',
        'saga-blue': 'saga-blue.png',
        'saga-green': 'saga-green.png',
        'saga-orange': 'saga-orange.png',
        'saga-purple': 'saga-purple.png',
        'vela-blue': 'vela-blue.png',
        'vela-green': 'vela-green.png',
        'vela-orange': 'vela-orange.png',
        'vela-purple': 'vela-purple.png',
        'arya-blue': 'arya-blue.png',
        'arya-green': 'arya-green.png',
        'arya-orange': 'arya-orange.png',
        'arya-purple': 'arya-purple.png',
        'nova': 'nova.png',
        'nova-alt': 'nova-alt.png',
        'nova-accent': 'nova-accent.png',
        'nova-vue': 'nova-vue.png',
        'luna-blue': 'luna-blue.png',
        'luna-green': 'luna-green.png',
        'luna-pink': 'luna-pink.png',
        'luna-amber': 'luna-amber.png',
        'rhea': 'rhea.png',
        'fluent-light': 'fluent-light.png',
        'soho-light': 'soho-light.png',
        'soho-dark': 'soho-dark.png',
        'viva-light': 'viva-light.svg',
        'viva-dark': 'viva-dark.svg',
        'mira': 'mira.jpg',
        'nano': 'nano.jpg',
        'tailwind-light': 'tailwind-light.png'
    };

    versions: any[];

    scrollListener: any;

    constructor(private configService: AppConfigService) {}

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => this.config = config);
        this.bindScrollListener();
    }

    bindScrollListener() {
        if (!this.scrollListener) {
          this.scrollListener = () => {
            if (window.scrollY > 0) {
              this.containerElement.nativeElement.classList.add('layout-topbar-sticky');
            } else {
              this.containerElement.nativeElement.classList.remove('layout-topbar-sticky');
            }
          }
        }

        window.addEventListener('scroll', this.scrollListener);
      }

    onMenuButtonClick(event: Event) {
        this.menuButtonClick.emit();
        event.preventDefault();
    }

    changeTheme(event: Event, theme: string, dark: boolean) {
        this.configService.updateConfig({...this.config, ...{theme, dark}});
        this.activeMenuIndex = null;
        event.preventDefault();
    }

    bindOutsideClickListener() {
        if (!this.outsideClickListener) {
            this.outsideClickListener = (event) => {
                if (this.isOutsideTopbarMenuClicked(event)) {
                    this.activeMenuIndex =  null;
                }
            };

            document.addEventListener('click', this.outsideClickListener);
        }
    }

    unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            document.removeEventListener('click', this.outsideClickListener);
            this.outsideClickListener = null;
        }
    }

    unbindScrollListener() {
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
            this.scrollListener = null;
        }
    }

    toggleMenu(event: Event, index: number) {
        this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
        event.preventDefault();
    }

    isOutsideTopbarMenuClicked(event): boolean {
        return !(this.topbarMenu.nativeElement.isSameNode(event.target) || this.topbarMenu.nativeElement.contains(event.target));
    }

    onOverlayMenuEnter(event: AnimationEvent) {
        switch(event.toState) {
            case 'visible':
                this.bindOutsideClickListener();
            break;

            case 'void':
                this.unbindOutsideClickListener();
            break;
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.unbindScrollListener();
    }
}
