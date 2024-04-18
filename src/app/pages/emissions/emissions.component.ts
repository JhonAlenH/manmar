import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emissions',
  templateUrl: './emissions.component.html',
  styleUrls: ['./emissions.component.scss']
})
export class EmissionsComponent implements OnInit {
  public copy: string;
  constructor() { }

  ngOnInit(): void {
  }

}
