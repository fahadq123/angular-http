import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() {
  }

  // method is run right before the request is made for all the requests.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // we can restrict the interceptor to only certain requests by using req.url

    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', 'Fahad')
    });

    // return next.handle(req) let the request continue its journey without this the request wont continue and app will break
    // return next.handle(modifiedRequest);

    //  i can also manipulate the response like following
    return next.handle(modifiedRequest);
  }
}
