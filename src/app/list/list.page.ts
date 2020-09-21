import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})

export class ListPage implements OnInit {
  viewParam: any = {};
  sgList = [];

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((param: any) => {
      this.viewParam = param;

      this.http.get(environment.project + '/interlock/experimentTbInfo/queryByEid?eid=' + param.eId).subscribe((res: any) => {
        if (!res.code) {
          this.sgList = res.data;
        }
      });
    });
  }
  listClick(item) {
    this.router.navigate(['main/table/' + item.tbName], {
      queryParams: {
        eId: this.viewParam.eId,
        id: item.id,
        state: item.state,
        dbTbName: item.dbTbName,
        tbName: item.tbName,
        project: this.viewParam.project,
        workDate: this.viewParam.workDate,
        content: this.viewParam.content
      }
    });
  }
}
