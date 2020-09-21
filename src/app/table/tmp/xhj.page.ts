import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperaService } from '../opera.service';

@Component({
  selector: 'app-xhj',
  templateUrl: './xhj.page.html'
})
export class XhjComponent implements OnInit {
  tempData = [];
  headData = [];
  dataSet: any = [];
  ObjectKeys = [];
  viewParam: any = {};
  tableCount = 33; // 除序号外总列数
  tableStartCol = 1; // 起始列
  viewId = 'column1,column32,column33'; // 非试验选项单元格
  viewName = '名称,备注,试验者';
  circleStatus = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ops: OperaService
  ) { }

  ngOnInit() {
    this.headData = [
      '操作', '序号', '名称', '安装位置及显示方向核对',
      '灯位及显示核对H', '灯位及显示核对U', '灯位及显示核对UU', '灯位及显示核对U闪U', '灯位及显示核对LU', '灯位及显示核对L', '灯位及显示核对LL', '灯位及显示核对HB', '灯位及显示核对A', '灯位及显示核对B',
      '主付丝（灯泡）转换1U', '主付丝（灯泡）转换L', '主付丝（灯泡）转换H', '主付丝（灯泡）转换2U', '主付丝（灯泡）转换B', '主付丝（灯泡）转换A',
      '断丝表示1U', '断丝表示L', '断丝表示H', '断丝表示2U', '断丝表示B', '断丝表示A',
      '进路表示器核对', '复示信号机核对',
      '灯光转移', '红灯断丝不能开放信号', '侧线出站红灯断丝能开放信号', '断路器作用试验', '同名端核对',
      '备注', '试验者'
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
