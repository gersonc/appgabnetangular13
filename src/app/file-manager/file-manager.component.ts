import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FileElement } from './model/element';
// import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import {Observable, Subscription} from 'rxjs';
// import { MatDialog } from '@angular/material/dialog';
// import { NewFolderDialogComponent } from './modals/newFolderDialog/newFolderDialog.component';
// import { RenameDialogComponent } from './modals/renameDialog/renameDialog.component';
import { MenuItem } from "primeng/api";
import { FileManagerService } from "./_services/file-manager.service";
import {take} from "rxjs/operators";
import {CarregadorService} from "../_services";
import {ArquivoPastaInterface} from "./_services/arquivo-pasta.interface";

@Component({
  selector: 'file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnChanges, OnInit, OnDestroy {




  fileElements: FileElement[] = [];
  canNavigateUp = 'yes'
  path = 'root';
  /*@Input() fileElements: FileElement[];
  @Input() canNavigateUp: string;
  @Input() path: string;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedUp = new EventEmitter();*/

  diretorios: ArquivoPastaInterface[] = [];

  sub: Subscription[] = [];
  items: MenuItem[];
  items2: MenuItem[];

  displayRanamePasta: boolean = false;
  displayNovaPasta: boolean = false;

  value1: string;
  value2: string;

  constructor(
    public fms: FileManagerService,
    private cs: CarregadorService
  ) {}

  showDialog() {
    this.displayRanamePasta = true;
  }

  ngOnInit() {
    this.sub.push(this.fms.getTodas()
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.diretorios = [...dados];
          console.log('todas', dados);
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.cs.escondeCarregador();
        }
      })
    );





    this.items = [
      {
        label: 'File',
        items: [{
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            {label: 'Project'},
            {label: 'Other'},
          ]
        },
          {label: 'Open'},
          {label: 'Quit'}
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {label: 'Delete', icon: 'pi pi-fw pi-trash'},
          {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
        ]
      }
    ];

    this.items2 = [
      {
        label: 'File',
        items: [{
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            {label: 'Project'},
            {label: 'Other'},
          ]
        },
          {label: 'Open'},
          {label: 'Quit'}
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {label: 'Delete', icon: 'pi pi-fw pi-trash'},
          {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
        ]
      }
    ];
  }


  ngOnChanges(changes: SimpleChanges): void {}

  deleteElement(element: FileElement) {
    // this.elementRemoved.emit(element);
  }

  navigate(element: ArquivoPastaInterface) {
    /*if (element.isFolder) {
      this.navigatedDown.emit(element);
    }*/
  }

  navigateUp() {
   //  this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    // this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openNewFolderDialog() {
    /*let dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });*/
  }

  openRenameDialog(element: FileElement) {
    /*let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });*/
  }

  openMenu(event: MouseEvent, element: FileElement, viewChild: any) {
    /*event.preventDefault();
    viewChild.openMenu();*/
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
