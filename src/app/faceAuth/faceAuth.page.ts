import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-faceauth',
  templateUrl: 'faceAuth.page.html',
  styleUrls: ['faceAuth.page.scss']
})

export class FaceAuthPage implements OnInit {
  viewParam: any;
  cameraStatus = true;
  reReg = false;
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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cameraPreview: CameraPreview,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((param: any) => {
      this.viewParam = param;
      this.startCamera();
    });
  }
  startCamera() {
    if (this.cameraStatus) {
      this.cameraPreview.startCamera(this.cameraPreviewOpts).then((res) => {
        this.cameraStatus = false;
      });
    }
    setTimeout(() => {
      this.cameraPreview.takeSnapshot(this.pictureOpts).then((imageData) => {
        const param = {
          tbName: this.viewParam.dbTbName,
          tbInfoId: this.viewParam.id,
          tbRowId: this.viewParam.rowId,
          identifier: this.viewParam.userName,
          state: this.viewParam.examState,
          faceImage: imageData[0]
        };
        this.http.post(environment.project + '/interlock/experIdentify/identify', param).subscribe((res: any) => {
          switch (res.code) {
            case 0:
              this.presentToast('认证成功');
              this.closeCamera();
              break;
            case 1:
              this.presentToast(res.msg);
              this.cameraPreview.stopCamera();
              this.reReg = true;
              break;
            case 2:
              this.presentToast(res.msg);
              this.startCamera();
              break;
          }
        });
      });
    }, 2000);
  }
  closeCamera() {
    this.cameraPreview.stopCamera();
    history.go(-1);
  }
  reload() {
    this.cameraStatus = true;
    this.startCamera();
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
