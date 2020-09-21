import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse,
    HttpProgressEvent, HttpResponse, HttpUserEvent, HttpResponseBase, HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { LocalStorage } from './local.storage';
import { ToastController } from '@ionic/angular';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    constructor(
        public ls: LocalStorage,
        private router: Router,
        public toastController: ToastController
    ) { }

    private handleData(ev: HttpResponseBase): Observable<any> {
        switch (ev.status) {
            case 200:
                if (ev instanceof HttpResponse) {
                    const body: any = ev.body;
                    if (body) {
                        switch (body.code) {
                            case 1:
                            case '1':
                                this.presentToast(body.msg);
                                break;
                            case 401:
                            case '401':
                                this.ls.set('loginInfo', '');
                                this.router.navigate(['login']);
                                break;
                            case 403:
                            case '403':
                                this.presentToast('没有权限');
                                break;
                        }
                    }
                }
                break;
        }
        if (ev instanceof HttpErrorResponse) {
            return throwError(ev);
        } else {
            return of(ev);
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<| HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        let newReq: any = '';
        const reqUrl: any = req.url;
        const auth: any = this.ls.get('authorization');

        newReq = auth ? req.clone({ url: requrl, headers: req.headers.set('authorization', this.ls.get('authorization')), withCredentials: true }) : req.clone({ url: requrl, withCredentials: true });
        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
                if (event instanceof HttpResponse && event.url.indexOf('/system/sys/login') !== -1 && event.status === 200) {
                    this.ls.set('authorization', event.headers.get('authorization'));
                    switch (event.status) {
                        case 200:

                            break;
                        default:
                            this.router.navigate(['/']);
                            this.ls.set('authorization', null);
                            break;
                    }
                }
                if (event instanceof HttpResponseBase) {
                    return this.handleData(event);
                }
                // 若一切都正常，则后续操作
                return of(event);
            }),
            catchError((err: HttpErrorResponse) => this.handleData(err))
        );
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
