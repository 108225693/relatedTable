import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperaService } from '../opera.service';

@Component({
  selector: 'app-zngdsyb',
  templateUrl: './zngdsyb.page.html',
  styles: [`
    .block{min-width:60px;display:block}
  `]
})
export class ZngdsybComponent implements OnInit {
  tempData = [];
  headData = [];
  dataSet: any = [];
  ObjectKeys = [];
  viewParam: any = {};
  tableCount = 16; // 除序号外总列数
  tableStartCol = 1; // 起始列
  viewId = 'column1,column15,column16'; // 非试验选项单元格
  viewName = '名称,备注,试验者';
  circleStatus = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ops: OperaService
  ) { }

  ngOnInit() {
    this.headData = [
      '操作', '序号', '名称',
      '一送一受', '多1', '多2', '多3',
      '一送一受', '多1', '多2', '多3',
      '一送一受', '多1', '多2', '多3',
      '绝缘节侵限检查', '备注', '试验者'
    ];
    this.tempData = this.ops.get_tempData(this.tableCount);
    this.activatedRoute.queryParams.subscribe((param: any) => {
      this.viewParam = JSON.parse(JSON.stringify(param));
      this.ObjectKeys = this.tempData;
      this.viewParam.stateName = this.ops.get_state(this.viewParam.state);
      this.circleStatus = this.ops.get_circleStatus(this.viewParam.state);
      this.loadList();
    });
  }
  loadList() {
    this.ops.get_loadList(this.viewParam.dbTbName, this.viewParam.id, (data) => {
      this.dataSet = data;
    });
  }
  trial(index) {
    this.ops.get_trial(this.dataSet, index, this.viewParam, this.viewId, this.viewName, this.headData, this.tableStartCol);
  }
}
