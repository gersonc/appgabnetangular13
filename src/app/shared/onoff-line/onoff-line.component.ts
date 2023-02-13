import { Component, OnInit } from '@angular/core';
import { IsOffLineService } from "./is-off-line.service";

@Component({
  selector: 'app-onoff-line',
  templateUrl: './onoff-line.component.html',
  styleUrls: ['./onoff-line.component.css']
})
export class OnoffLineComponent implements OnInit {

  onOdff: boolean;

  constructor(public off: IsOffLineService) {
    this.onOdff = this.off.IsOffLineService;
  }

  ngOnInit(): void {
  }

}
