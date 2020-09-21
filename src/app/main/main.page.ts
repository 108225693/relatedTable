import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})

export class MainPage implements OnInit {
  sgList: any = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.http.get(environment.project + '/interlock/experiment/query').subscribe((res: any) => {
      if (!res.code) {
        this.sgList = res.data;
      }
    });
  }

  listClick(item) {
    this.router.navigate(['main/list'], {
      queryParams: {
        eId: item.id,
        project: item.project,
        workDate: item.workDate,
        content: item.content
      }
    });
  }

}
