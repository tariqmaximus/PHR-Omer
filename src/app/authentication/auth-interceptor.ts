import { Injectable, Inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable ,  Operator } from 'rxjs';
import { AuthService } from './auth-service';

import { debounce,tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
            //"http://maximusare-04:8080/ems-secure-jwt/auth"
        if (req.url.endsWith("/auth/token")
        || req.url.endsWith("/api/CustomAccount/LoginPhr")
        || req.url.endsWith("/api/CustomAccount/GenerateResetPasswordLink")
        || req.url.endsWith("/api/CustomAccount/ResetPasswordByToken") ) {

            return next.handle(req);
        }
        else {

            //debugger;

            // if(this.auth.jwt_token_creation_time!=undefined)
            // {
            //     if(this.auth.chkIsTokenExpire(new Date())==false)
            //     {
            //         
            //         this.auth.generateToken();
            //     }
            // }
           // 
            // Get the auth header from the service.
            const authHeader = this.auth.getAuthorizationHeader();


            //req.headers.set('Access-Control-Allow-Origin','*');
            // Clone the request to add the new header.
            const authReq = req.clone({ headers: req.headers.set('Authorization', authHeader)});
            
            console.log(authReq);

            // Pass on the cloned request instead of the original request.
            return next.handle(authReq).pipe(tap(
                (err: any) => {
                  if (err instanceof HttpErrorResponse) {
                    console.log(err);
                    console.log('req url :: ' + req.url);
                    if (err.status === 401) {
                        // redirect to the login route
                        // or show a modal                       
                    }
                  }
                }
              ));
              /*
            return next.handle(authReq).tap((event: HttpEvent<any>) => {
             //   
                console.log(event);
                if (event instanceof HttpResponse) {                    
                    // do stuff with response if you want
                }
            }, (err: any) => {
               // 
                console.log(err);
                
                if (err instanceof HttpErrorResponse) {
                    
                    if (err.status === 401) {
                        // redirect to the login route
                        // or show a modal                       
                    }
                }
            });
            */
        }  
       
    }
}