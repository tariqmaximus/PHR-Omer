import { Injectable, Inject } from '@angular/core';
import { AuthenticationCredentials } from './authenticationCredentials';
import { DateTimeUtil } from '../shared/date-time-util';

import { GeneralService } from '../services/general/general.service';
import { LookupList, LOOKUP_LIST } from '../providers/lookupList.module';
import { EncryptDecryptService } from '../shared/encrypt-decrypt';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private dateTime: DateTimeUtil,
        @Inject(LOOKUP_LIST) public lookupList: LookupList, public generalService: GeneralService,
        private encryptDecryptService: EncryptDecryptService) { }

    private jwt_token: string = ""; //eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6IndlYiIsImlhdCI6MTU0MzkxODUwMiwiZXhwIjoxNTc1NDU0NTAyfQ.dRJZyeCMvPEMdFNMA2DhQTacK40k93sMb0PmaS70JEI8XfPc2wOu9crw4U_curditsUyYnTc8X6N0EMHYJow2w
    //public jwt_token_iat;//token intialize at
    //public jwt_token_exp;//token expire
    public userId: number;
    public jwt_token_expiry;
    public jwt_token_creation_time;

    public setToken(token: string) {
        this.jwt_token = token;
    }

    public getAuthorizationHeader(): string {

        return "Bearer " + this.jwt_token;
    }
    // public setTokenExpiry(){
    //     this.jwt_token_expiry=this.jwt_token_exp-this.jwt_token_iat;
    // }

    public chkIsTokenExpire(currentDate): boolean {
        let diff = currentDate.getTime() - this.jwt_token_creation_time.getTime();
        if ((diff * .001) < this.jwt_token_expiry)//Miliseonns to seconds
            return true;
        else {
            this.jwt_token = null;
            this.jwt_token_creation_time = null
            this.jwt_token_expiry = null;
            return false;
        }
    }

    // public generateToken(){
    //     let auth:AuthenticationCredentials=new AuthenticationCredentials;
    //     auth.email=this.lookupList.logedInUser.user_name;
    //     auth.password=this.lookupList.logedInUser.password;
    //     this.generalService.getAccessToken(auth).subscribe(
    //       data => {//setToken
    //         let parseToken= this.decodeToken(data['token']);
    //         this.setToken(data['token'])
    //         this.jwt_token_expiry=parseToken.exp-parseToken.iat;
    //         this.jwt_token_creation_time=this.dateTime.getCurrentDateTimeDate();
    //       });
    // }

    private urlBase64Decode(str: string) {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                // tslint:disable-next-line:no-string-throw
                throw 'Illegal base64url string!';
        }
        return decodeURIComponent((<any>window).escape(window.atob(output)));
    }

    // public decodeToken(token: string = '') {
    //     if (token === null || token === '') { return { 'upn': '' }; }
    //     const parts = token.split('.');
    //     if (parts.length !== 3) {

    //         throw new Error('JWT must have 3 parts');
    //     }
    //     const decoded = this.urlBase64Decode(parts[1]);
    //     if (!decoded) {
    //         throw new Error('Cannot decode the token');
    //     }
    //     return JSON.parse(decoded);
    //}

    public decodeEncryptedToken(tokenEncrypted: string = '') {
        if (tokenEncrypted === null || tokenEncrypted === '') { return { 'upn': '' }; }

        // decrypt...
        let key = this.encryptDecryptService.getBasehKey() + "aNdRgUkXp2s5v8y/B?E(H+MbQeShVmYq";
        let tokenDecrypted = this.encryptDecryptService.decryptUsingAES256(key, tokenEncrypted);


        const parts = tokenDecrypted.split('.');
        if (parts.length !== 3) {

            throw new Error('JWT must have 3 parts');
        }
        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    }
}