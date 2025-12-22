export class ChangePasswordModel{
    UserId:number;
    OldPassword:string;
    NewPassword:string;
    IsFirstChangePassword:boolean=false;
}