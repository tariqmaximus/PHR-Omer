import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LogMessage{

    log(Msg:string){
        console.log(Msg);
    }
    showErrorMessage(Msg:string)
    {
        alert(Msg);
    }
    writeLoginDB(Msg:string)
    {

    }

}