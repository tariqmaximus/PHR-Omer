export const environment = {
  production: true,  
  AppVersion: require('../../package.json').version, // <major>.<minor>.<yymmdd>.<build> | "1.0.250417.1 -- Build No defatul 1. Increment for each build on same date.
  AuthServerEndpoint:'https://apiauth.maximus.care',      
  APIEndpoint: 'https://ehr.maximus.care/pre.prod.maximus/',  
};
