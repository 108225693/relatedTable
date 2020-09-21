import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class OperaService {
  constructor(
    public toastController: ToastController,
    private router: Router,
    private http: HttpClient
  ) { }

  get_tempData(count) {
    const data = [];
    data.push('opera');
    data.push('norder');
    for (let i = 0; i < count; i++) {
      data.push('column' + Number(i + 1));
    }
    return data;
  }
  get_loadList(tbName, cId, callback) {
    this.http.get(environment.project + '/interlock/tbData/query?tbName=' + tbName + '&tbInfoId=' + cId).subscribe((res: any) => {
      if (!res.code) {
        const newData = res.data;
        for (const item of newData) {
          delete item.state;
          delete item.tb_info_id;
        }
        callback(newData);
      }
    });
  }
  get_trialStatus(state) {
    switch (state) {
      case '3':
      case '5':
      case '8':
        return false;
      default:
        return true;
    }
  }
  get_circleStatus(state) {
    switch (state) {
      case '6':
      case '8':
        return true;
      default:
        return false;
    }
  }
  get_trial(dataSet, index, viewParam, viewId, viewName, headData, tableStartCol) {
    const newData = JSON.parse(JSON.stringify(dataSet[index]));
    delete newData.id;
    delete newData.norder;

    const param: any = {
      eId: viewParam.eId,
      id: viewParam.id,
      dbTbName: viewParam.dbTbName,
      tbName: viewParam.tbName,
      stateName: viewParam.stateName,
      state: viewParam.state,
      viewId: [],
      viewName: [],
      trialId: [],
      trialName: [],
      rowIndex: index,
      rowId: dataSet[index].id,
      project: viewParam.project,
      workDate: viewParam.workDate,
      content: viewParam.content
    };
    // 找出要展示数据
    for (let i = 0; i < viewId.split(',').length; i++) {
      param.viewId.push(viewId.split(',')[i]);
      param.viewName.push(viewName.split(',')[i]);
      delete newData[viewId.split(',')[i]];
    }
    param.viewId = param.viewId.join();
    param.viewName = param.viewName.join();
    viewParam.rowIndex = index;
    // 找出要试验的数据
    const objData = Object.keys(newData);
    let count = [];
    for (const item of objData) {
      if (newData[item] !== '0') {
        count.push(Number(item.replace('column', '')));
      }
    }
    count = count.sort();
    // 找出对应表头文字
    for (let i = 0; i < headData.length; i++) {
      for (const item of count) {
        if (Number(i - tableStartCol) === item) {
          param.trialId.push('column' + item);
          param.trialName.push(headData[i]);
        }
      }
    }
    param.trialId = param.trialId.join();
    param.trialName = param.trialName.join();
    this.router.navigate(['main/trial'], {
      queryParams: param
    });
  }
  get_state(type) {
    let data = '';
    switch (type) {
      case '1':
        data = '车间编制中';
        break;
      case '2':
        data = '车间已提交';
        break;
      case '3':
        data = '段审批';
        break;
      case '4':
        data = '段驳回';
        break;
      case '5':
        data = '工区试验中';
        break;
      case '6':
        data = '工区已完成';
        break;
      case '7':
        data = '车间确认完成';
        break;
      case '8':
        data = '车间确认未完成';
        break;
    }
    return data;
  }
}
