import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperaService } from '../opera.service';

@Component({
  selector: 'app-lsdujcb',
  templateUrl: './lsdujcb.page.html',
  styles: [`
    .block{min-width:90px;display:block}
  `]
})

export class LsdujcbComponent implements OnInit {
  tempData = [];
  headData = ['操作', '序号', '进路号码', '进路始端', '进路变通', '进路终端', '正常开放信号',
    '道岔位置不对不能开放信号', '道岔无表示关闭信号', '区段占用不能开放信号', '带动道岔', '防护道岔',
    '信号开放后锁闭道岔', '敌对信号', '敌对照查', '随时关闭信号', '接近锁闭及区段核对',
    '取消进路解锁', '人工限时解锁', '区段人工解锁', '防止自动重复开放信号', '进路正常解锁',
    '局部控制', '进路表示器', '调车中途返回解锁', '自闭离去区段占用或区间空闲检查', '半自动闭塞（自动站间闭塞）',
    '引导信号', '机务段同意', '超限绝缘条件', '6‰下坡道', '到发线出岔',
    '非进路调车', '其他联系电路', '防止迎面解锁', '全站轨道停电恢复', '跳信号报警',
    '道口通知及遮断试验', '调车白灯保留检查', '改变运行方向', '排列长调车进路', '备注'];
  dataSet: any = [];
  ObjectKeys = [];
  viewParam: any = {};
  tableCount = 39; // 除序号外总列数
  tableStartCol = 1; // 起始列
  viewId = 'column1,column2,column3,column4,column40'; // 非试验选项单元格
  viewName = '进路号码,进路始端,进路变通,进路终端,备注';
  circleStatus = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ops: OperaService
  ) { }

  ngOnInit() {
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

