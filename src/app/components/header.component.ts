import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { LocalStorage } from '../local.storage';

@Injectable({ providedIn: 'root' })

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent implements OnInit {
  title: any = '';
  backTitle: any = '';
  loginInfo: any = {};

  constructor(
    public router: Router,
    public ls: LocalStorage,
    private activatedRoute: ActivatedRoute,
    private cameraPreview: CameraPreview,
    private menu: MenuController,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.setTitle();
  }
  backClick() {
    this.menuClose('close');
    history.go(-1);
  }
  infoClick() {
    this.menuClose('open');
    this.loginInfo = JSON.parse(this.ls.get('loginInfo'));
  }
  faceReg() {
    this.menuClose('close');
    this.router.navigate(['main/faceReg']);
  }
  switchAccount() {
    this.menuClose('close');
    this.ls.set('loginInfo', '');
    // setTimeout(() => {
    this.router.navigate(['login']);
    // }, 500);
  }
  logout() {
    navigator['app'].exitApp();
  }
  menuClose(type) {
    this.cameraPreview.stopCamera();
    switch (type) {
      case 'open':
        this.menu.enable(true, 'userInfo');
        this.menu.open('userInfo');
        break;
      case 'close':
        this.menu.enable(false, 'userInfo');
        this.menu.close('userInfo');
        break;
    }
  }
  setTitle() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const url = event.url.split('?')[0].replace('/', '');
          switch (url) {
            case 'main':
              this.title = '首页';
              this.backTitle = '';
              break;
            case 'main/list':
              this.title = '施工信息';
              this.backTitle = '首页';
              break;
            case 'main/table/' + encodeURI(params.tbName):
              this.title = params.tbName;
              this.backTitle = '施工信息';
              break;
            case 'main/trial':
              this.title = '联锁试验';
              this.backTitle = params.tbName;
              break;
            case 'main/faceAuth':
              this.title = '人脸认证';
              this.backTitle = '联锁试验';
              break;
            case 'main/faceReg':
              this.title = '人脸注册';
              this.backTitle = '返回';
              break;
          }
        }
      });
    });
  }
}
