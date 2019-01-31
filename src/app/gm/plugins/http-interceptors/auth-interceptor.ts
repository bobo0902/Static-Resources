import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Cookie } from '../../../common/api/cookie';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }
  private cookie = new Cookie();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service.
    const authToken = this.cookie.getCookie('clientCliToken') || `token`;

    // Clone the request and set the new header in one step.
    const authReq = req.clone({ setHeaders: { token: authToken } });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
