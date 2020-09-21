import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TablePage } from './table.page';

import { LsdujcbComponent } from './tmp/lsdujcb.page';
import { DcgnComponent } from './tmp/dcgn.page';
import { ZngdsybComponent } from './tmp/zngdsyb.page';
import { XhjComponent } from './tmp/xhj.page';
import { FdwsComponent } from './tmp/fdws.page';

const TMP = [
  LsdujcbComponent,
  DcgnComponent,
  ZngdsybComponent,
  XhjComponent,
  FdwsComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: TablePage,
        children: [
          { path: '站内轨道试验表(信联表4-1)', component: ZngdsybComponent, data: { title: '站内轨道试验表(信联表4-1)' } },
          { path: '信号联锁电路检查表(信联表1-1)', component: LsdujcbComponent, data: { title: '信号联锁电路检查表(信联表1-1)' } },
          { path: '道岔功能项目检查试验表(信联表14-2)', component: DcgnComponent, data: { title: '道岔功能项目检查试验表(信联表14-2)' } },
          { path: '信号机联锁试验表(信联表3)', component: XhjComponent, data: { title: '信号机联锁试验表(信联表3)' } },
          { path: '分动外锁闭道岔联锁试验表(信联表2-2)', component: FdwsComponent, data: { title: '分动外锁闭道岔联锁试验表(信联表2-2)' } },
        ]
      }
    ])
  ],
  declarations: [TablePage, ...TMP]
})
export class TableModule { }
