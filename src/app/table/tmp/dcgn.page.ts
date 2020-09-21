import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperaService } from '../opera.service';

@Component({
  selector: 'app-dcgn',
  templateUrl: './dcgn.page.html'
})
export class DcgnComponent implements OnInit {
  tempData = [];
  headData = [];
  dataSet: any = [];
  ObjectKeys = [];
  viewParam: any = {};
  tableCount = 12; // 除序号外总列数
  tableStartCol = 1; // 起始列
  viewId = 'column1,column11,column12'; // 非试验选项单元格
  viewName = '设备名称,备注,试验者';
  circleStatus = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ops: OperaService
  ) { }

  ngOnInit() {
    this.headData = ['操作', '序号', '设备名称', '总定', '总反', '单锁',
      '单解', '岔封', '岔解', '总锁', '尖轨故障',
      '心轨故障', '备注', '试验者'];
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
