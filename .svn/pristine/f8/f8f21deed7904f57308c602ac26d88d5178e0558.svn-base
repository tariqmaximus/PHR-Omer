import { NgModule, InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  appVersion:string;
  apiEndpoint: string;
  authServiceEndpoint: string;
}

export const APP_DI_CONFIG: AppConfig = {
  appVersion: environment.AppVersion,
  authServiceEndpoint:environment.AuthServerEndpoint,  
  apiEndpoint : environment.APIEndpoint  
};

@NgModule({
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})
export class AppConfigModule { }