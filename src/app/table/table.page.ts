import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table',
  template: `
    <router-outlet></router-outlet>
  `
})

export class TablePage implements OnInit {
  viewParam: any = {};

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((param: any) => {
      this.viewParam = param;
    });
  }
}
