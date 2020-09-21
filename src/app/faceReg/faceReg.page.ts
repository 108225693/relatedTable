import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';
import { Router } from '@angular/router';
import { LocalStorage } from '../local.storage';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-facereg',
  templateUrl: 'faceReg.page.html',
  styleUrls: ['faceReg.page.scss']
})

export class FaceRegPage implements OnInit {
  userInfo: any = {};
  cameraStatus = true;
  cameraPreviewOpts: CameraPreviewOptions = {
    x: window.innerWidth / 2 - 150,
    y: 70,
    width: 300,
    height: 300,
    camera: 'front',
    tapPhoto: false,
    previewDrag: false,
    toBack: false,
    alpha: 1
  };
  pictureOpts: CameraPreviewPictureOptions = {
    width: 300,
    height: 300,
    quality: 35
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    public ls: LocalStorage,
    private cameraPreview: CameraPreview,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.userInfo = JSON.parse(this.ls.get('loginInfo'));
    this.startCamera();
  }
  startCamera() {
    if (this.cameraStatus) {
      this.cameraPreview.startCamera(this.cameraPreviewOpts).then((res) => {
        this.cameraStatus = false;
      });
    }
    setTimeout(() => {
      this.cameraPreview.takeSnapshot(this.pictureOpts).then((imageData) => {
        const formData = new FormData();
        formData.append('userId', this.userInfo.id);
        formData.append('loginName', this.userInfo.loginName);
        formData.append('faceImage', imageData[0]);
        this.http.post(environment.project + '/interlock/face/register', formData).subscribe((res: any) => {
          if (!res.code) {
            this.cameraPreview.stopCamera();
            this.presentToast('注册成功');
            this.router.navigate(['main']);
          } else {
            this.presentToast(res.msg);
            this.startCamera();
          }
        });
      });
    }, 1500);
  }
  closeCamera() {
    this.cameraPreview.stopCamera();
    history.go(-1);
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      position: 'top',
      message: msg,
      duration: 500
    });
    toast.present();
  }
}
