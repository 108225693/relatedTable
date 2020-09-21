import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LocalStorage } from '../local.storage';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})

export class LoginPage implements OnInit {
  loginName = '';
  loginPwd = '';
  autoLoginView = false;

  constructor(
    public toastController: ToastController,
    private http: HttpClient,
    public ls: LocalStorage,
    public router: Router
  ) { }

  ngOnInit() {
    // const loginInfo = JSON.parse(this.ls.get('loginInfo'));
    // if (loginInfo && loginInfo.loginName) {
    //   this.toMain();
    // } else {
    //   this.autoLoginView = true;
    // }
  }

  // toMain() {
  //   setTimeout(() => {
  //     this.router.navigate(['main']);
  //   }, 500);
  // }

  login() {
    if (!this.loginName || !this.loginPwd) {
      this.presentToast('请输入用户名或密码');
    }
    this.http.post(environment.apiBase + '/system/sys/login',
      { loginName: this.loginName, password: this.loginPwd }
    ).subscribe((res: any) => {
      if (!res.code) {
        this.ls.set('loginInfo', JSON.stringify(res.data[0]));
        this.router.navigate(['main']);
      } else {
        this.presentToast('用户名或密码错误');
        this.ls.set('loginInfo', '');
      }
      this.loginName = '';
      this.loginPwd = '';
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      position: 'top',
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
