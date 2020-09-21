import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperaService } from '../opera.service';

@Component({
  selector: 'app-fdws',
  templateUrl: './fdws.page.html'
})
export class FdwsComponent implements OnInit {
  tempData = [];
  headData = [];
  dataSet: any = [];
  ObjectKeys = [];
  viewParam: any = {};
  tableCount = 47; // 除序号外总列数
  tableStartCol = 1; // 起始列
  viewId = 'column1,column47'; // 非试验选项单元格
  viewName = '号码,试验者';
  circleStatus = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ops: OperaService
  ) { }

  ngOnInit() {
    // for (let i = 0; i < 49; i++) {
    //   this.headData.push(i);
    // }
    this.headData = [
      '操作', '序号', '号码',
      '核对位置定位', '核对位置反位', '道岔断表示接点定位Ⅰ', '道岔断表示接点定位Ⅱ', '道岔断表示接点定位Ⅲ', '道岔断表示接点定位Ⅳ', '道岔断表示接点反位Ⅰ', '道岔断表示接点反位Ⅱ', '道岔断表示接点反位Ⅲ', '道岔断表示接点反位Ⅳ',
      '断相保护	A', '断相保护	B', '断相保护	C', '四毫米试验定位', '四毫米试验反位', '五、六、十毫米试验定位', '五、六、十毫米试验反位', '2DQJ、D（F）BJ及道岔表示一致定位', '2DQJ、D（F）BJ及道岔表示一致反位',
      '道岔锁闭单独', '道岔锁闭区段', '道岔锁闭进路', '道岔锁闭引导总锁', '断遮断器定位', '断遮断器反位',
      '多机牵引总保护', '多机牵引总表示及双断检查', '道岔自闭电路试验', '道岔间互锁	', '挤岔断表示报警', '13、30S切断',
      '密贴检查器断表示接点定位密贴Ⅰ', '密贴检查器断表示接点定位密贴Ⅱ', '密贴检查器断表示接点定位斥离Ⅰ', '密贴检查器断表示接点定位斥离Ⅱ', '密贴检查器断表示接点反位密贴Ⅰ', '密贴检查器断表示接点反位密贴Ⅱ', '密贴检查器断表示接点反位斥离Ⅰ', '密贴检查器断表示接点反位斥离Ⅱ',
      '断表示保险试验', '下拉装置试验', '道岔区段前接点接入启动电路', '道岔被阻后转换试验', 'DKJ、DWJ试验',
      '副机不到位主机不停转', '试验者'
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
