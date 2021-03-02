import axios from 'axios';

const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost';

export interface apiTriggerBuildType {
  buildExec: boolean,
  sUser: string,
  sPass: string,
  tns: string,
  dbConn: string,
  osgtVersion: string,
  itSapVersion: string,
  wsUrl: string,
  parentBuild: string,
  dataCenter: string,
  mailTo: string,
  environment: string,
  logUrl: string
}

const api = axios.create({
  headers: { 
    'Content-Type': 'application/json; charset=utf-8'
  }
});

export const apiTriggerBuild = (data: apiTriggerBuildType, callback: (header: string, body: string) => void) => {
  if (API_HOST) {
    const apiUrl = `${API_HOST}/jenkinsBuild`;
    api.post(apiUrl, null, { params: data })
      .then(res => {
        const { status, message } = res.data;
        if (status) {
          callback('Success', message);     
        } else {
          callback('Error', message);     
        }
      })
      .catch(err => callback('Error', `${err}`));
  } else {
    callback('Error', 'API call configuration not Found');
  }
};