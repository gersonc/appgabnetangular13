import { Component, OnInit } from '@angular/core';
import { IsOffLineService } from "./is-off-line.service";

@Component({
  selector: 'app-onoff-line',
  templateUrl: './onoff-line.component.html',
  styleUrls: ['./onoff-line.component.css']
})
export class OnoffLineComponent implements OnInit {

  onOdff: boolean;
  path: string = "../assets/icons/Work-Offline-154.ico";
  alttext: string="first image"

  constructor(public off: IsOffLineService) {
    this.onOdff = this.off.IsOffLineService;
  }

  ngOnInit(): void {
  }

}
