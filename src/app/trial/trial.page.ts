import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-trial',
  templateUrl: 'trial.page.html',
  styleUrls: ['trial.page.scss']
})

export class TrialPage implements OnInit {
  viewParam: any = {};
  info: any = {};
  trialInfo: any = {};
  trialObj = [];
  examine: any = {};
  completUser = '';

  dataSet = [];
  userList = [];
  radioList = [];
  newData: any = {};
  complet = false;
  radioDisabled = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public toastController: ToastController,
    public modalController: ModalController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.radioList = [
      { id: '3', name: '√' },
      { id: '4', name: '×' }
    ];
    this.activatedRoute.queryParams.subscribe((param: any) => {
      this.viewParam = JSON.parse(JSON.stringify(param));
      this.http.get(environment.project + '/interlock/experimentTbInfo/query/' + this.viewParam.id).subscribe((res: any) => {
        if (!res.code) {
          this.info = res.data[0];
          this.userList = [
            { name: this.info.experHost, disabled: false },
            { name: this.info.experAssit, disabled: false },
            { name: this.info.approver, disabled: false }
          ];
        }
      });
      this.http.get(environment.project + '/interlock/tbData/query?tbName=' + this.viewParam.dbTbName +
        '&tbInfoId=' + this.viewParam.id).subscribe((res: any) => {
          if (!res.code) {
            this.newData = res.data[this.viewParam.rowIndex];
            delete this.newData.id;
            delete this.newData.norder;
            delete this.newData.state;
            delete this.newData.tb_info_id;

            switch (this.viewParam.state) {
              case '3':
                this.radioDisabled = false;
                break;
              case '5':
                this.radioDisabled = false;
                break;
              case '6':
                this.complet = true;
                break;
              case '8':
                this.complet = true;
                this.radioDisabled = false;
                break;
            }
            let newDataSort = [];
            for (const item of Object.keys(this.newData)) {
              const vId = this.viewParam.viewId.split(',');
              const vName = this.viewParam.viewName.split(',');
              for (let j = 0; j < vId.length; j++) {
                if (item === vId[j]) {
                  // 筛选出文字内容和下拉框内容
                  this.trialInfo[vName[j]] = this.newData[item];
                }
              }
              newDataSort.push(Number(item.replace('column', '')));
            }
            // 排序
            newDataSort = newDataSort.sort(this.sortNumber);
            newDataSort.forEach((item, index) => {
              newDataSort[index] = 'column' + Number(index + 1);
            });
            this.trialInfo['状态'] = this.viewParam.stateName;
            this.trialObj.push('状态');
            this.userList.push({ name: this.trialInfo['试验者'], disabled: false })
            this.trialObj = Object.keys(this.trialInfo);
            const tName = this.viewParam.trialName.split(',');
            // 还原数据
            newDataSort.forEach((item) => {
              this.viewParam.trialId.split(',').forEach((list, index) => {
                if (item === list) {
                  this.dataSet.push({
                    value: this.newData[item],
                    id: item,
                    name: tName[index]
                  });
                }
              });
            });
          }
        });
      this.http.get(environment.project + '/interlock/experIdentify/getByTbRowId?tbRowId=' + this.viewParam.rowId).subscribe((res: any) => {
        if (!res.code) {
          let count = 0;
          for (const item of res.data) {
            for (const list of this.userList) {
              if (list.name === item.identifier) {
                count++;
                list.disabled = true;
                break;
              }
            }
          }
          // console.log(res.data);
          // console.log(this.userList);
          this.completUser = count + '/' + this.userList.length;
          // if (count === this.userList.length) {
          //   this.router.navigate(['main/list'], {
          //     queryParams: {
          //       eId: this.viewParam.eId,
          //       project: this.viewParam.project,
          //       workDate: this.viewParam.workDate,
          //       content: this.viewParam.content
          //     }
          //   });
          // }
        }
      });
    });
  }
  sortNumber(a, b) {
    return a - b;
  }
  enter() {
    const param: any = { tbName: this.viewParam.dbTbName, tbInfoId: this.viewParam.id, objData: { id: this.viewParam.rowId } };
    Object.assign(param.objData, this.newData);
    for (const item of this.dataSet) {
      if (!item.value || item.value === '1') {
        this.presentToast('请选择完所有试验');
        return;
      }
      param.objData[item.id] = item.value;
    }
    this.radioDisabled = true;
    this.http.post(environment.project + '/interlock/tbData/finish', param).subscribe((res: any) => {
      if (!res.code) {
        this.complet = true;
      }
    });
  }
  loseFace(item) {
    this.examine.name = item.name;
    item.disabled = true;
    this.presentAlert();
  }
  faceFinish() {
    // 刷脸this.info.state=3,5,8可以，其他都不行
    switch (this.info.state) {
      case '3':
      case '5':
      case '6':
      case '8':
        this.router.navigate(['main/faceAuth'], {
          queryParams: {
            examState: this.examine.state,
            dbTbName: this.viewParam.dbTbName,
            id: this.viewParam.id,
            rowId: this.viewParam.rowId,
            userName: this.examine.name
          }
        });
        break;
      default:
        this.presentToast('当前状态不允许人脸识别');
        break;
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'myCustom',
      header: '审核',
      buttons: [
        {
          text: '批准',
          handler: () => {
            this.examine.state = '1';
            this.faceFinish();
          }
        },
        {
          text: '驳回',
          handler: () => {
            this.examine.state = '0';
            this.faceFinish();
          }
        }
      ]
    });
    await alert.present();
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
