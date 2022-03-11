import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FileElement} from "./model/element";
import {NewFolderDialogComponent} from "./modals/new-folder-dialog/new-folder-dialog.component";
import {RenameDialogComponent} from "./modals/rename-dialog/rename-dialog.component";
import {DialogService} from 'primeng/dynamicdialog'
import {MenuItem} from "primeng/api";
import {Menu} from "primeng/menu/menu";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css'],
  providers: [DialogService]
})
export class FileManagerComponent implements OnInit, OnChanges {
  items: MenuItem[] = [
    {
      label:'File',
      icon:'pi pi-fw pi-file',
      items:[
        {
          label:'New',
          icon:'pi pi-fw pi-plus',
          items:[
            {
              label:'Bookmark',
              icon:'pi pi-fw pi-bookmark'
            },
            {
              label:'Video',
              icon:'pi pi-fw pi-video'
            },

          ]
        },
        {
          label:'Delete',
          icon:'pi pi-fw pi-trash'
        },
        {
          separator:true
        },
        {
          label:'Export',
          icon:'pi pi-fw pi-external-link'
        }
      ]
    },
    {
      label:'Edit',
      icon:'pi pi-fw pi-pencil',
      items:[
        {
          label:'Left',
          icon:'pi pi-fw pi-align-left'
        },
        {
          label:'Right',
          icon:'pi pi-fw pi-align-right'
        },
        {
          label:'Center',
          icon:'pi pi-fw pi-align-center'
        },
        {
          label:'Justify',
          icon:'pi pi-fw pi-align-justify'
        },

      ]
    },
    {
      label:'Users',
      icon:'pi pi-fw pi-user',
      items:[
        {
          label:'New',
          icon:'pi pi-fw pi-user-plus',

        },
        {
          label:'Delete',
          icon:'pi pi-fw pi-user-minus',

        },
        {
          label:'Search',
          icon:'pi pi-fw pi-users',
          items:[
            {
              label:'Filter',
              icon:'pi pi-fw pi-filter',
              items:[
                {
                  label:'Print',
                  icon:'pi pi-fw pi-print'
                }
              ]
            },
            {
              icon:'pi pi-fw pi-bars',
              label:'List'
            }
          ]
        }
      ]
    },
    {
      label:'Events',
      icon:'pi pi-fw pi-calendar',
      items:[
        {
          label:'Edit',
          icon:'pi pi-fw pi-pencil',
          items:[
            {
              label:'Save',
              icon:'pi pi-fw pi-calendar-plus'
            },
            {
              label:'Delete',
              icon:'pi pi-fw pi-calendar-minus'
            },

          ]
        },
        {
          label:'Archieve',
          icon:'pi pi-fw pi-calendar-times',
          items:[
            {
              label:'Remove',
              icon:'pi pi-fw pi-calendar-minus'
            }
          ]
        }
      ]
    },
    {
      label:'Quit',
      icon:'pi pi-fw pi-power-off'
    }
  ];

  rootMenu: MenuItem[] = [
    {
      label:'mover',
      icon:'pi pi-fw pi-bookmark'
    },
    {
      label:'renomear',
      icon:'pi pi-fw pi-video'
    },
    {
      label:'apagar',
      icon:'pi pi-fw pi-paperclip'
    },
  ];

  moveToMenu: MenuItem[] = [
    {
      label:'apagar',
      icon:'pi pi-fw pi-download'
    },
  ];

  constructor(
    // public dialog: MatDialog
    public dialog: DialogService
  ) {}

  ngOnInit() {
  }

  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: boolean;
  @Input() path: string;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedUp = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {}

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent, {
      header: 'Choose a Car',
      width: '70%'
    });
    dialogRef.onClose.subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openRenameDialog(element: FileElement) {
    let dialogRef = this.dialog.open(RenameDialogComponent, {
      header: 'Choose a Car',
      width: '70%'
    });
    dialogRef.onClose.subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }

  openMenu(event: MouseEvent, element: FileElement, viewChild: Menu) {
    event.preventDefault();
    viewChild.show(event);
  }
}
