import axios from 'axios';

const JENKINS_URL = process.env.REACT_APP_JENKINS_URL;
const JENKINS_JOB_NAME = process.env.REACT_APP_JENKINS_JOB_NAME;
const API_USERNAME = process.env.REACT_APP_JENKINS_USERNAME || '';
const API_KEY = process.env.REACT_APP_JENKINS_APIKEY || '';

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
  mailTo: string
}

const api = axios.create({
  headers: { 
    'Content-Type': 'application/json; charset=utf-8'
  },
  withCredentials: true,
  auth: {
    username: API_USERNAME, 
    password: API_KEY 
  }
});

export const apiTriggerBuild = (data: apiTriggerBuildType, callback: (header: string, body: string) => void) => {
  if (JENKINS_URL && JENKINS_JOB_NAME && API_USERNAME && API_KEY) {
    const apiUrl = `${JENKINS_URL}/job/${JENKINS_JOB_NAME}/buildWithParameters`;
    api.post(apiUrl, data)
      .then(res => {
        const { location } = res.headers;
        if (location) {
          apiQueueCall(location, callback);
        } else {
          callback('Error', 'Job Queue URL could not be found');          
        }
      })
      .catch(err => callback('Error', `${err}`));
  } else {
    callback('Error', 'API call configuration not Found');
  }
};

const apiQueueCall = async (apiQueueUrl: string, callback: (header: string, body: string) => void) => {
  let status = false;
  for await (const val of Array(10)) {
    if (!status) {
      await api.get(`${apiQueueUrl}api/json`)
        .then(res => {
          const { executable } = res.data;
          if (executable) {   
            apiJobBuildLogCall(executable.number, callback);
            status = true;      
          }
        })
        .catch(err => callback('Error', `${err}`));
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  if (!status) callback('Error', 'Job Build URL could not be found');
};

const apiJobBuildLogCall = async (buildId: string, callback: (header: string, body: string) => void) => {
  let status = false;
  const apiUrl = `${JENKINS_URL}/job/${JENKINS_JOB_NAME}/${buildId}/api/json`;
  for await (const val of Array(60)) {
    if (!status) {
      await api.get(apiUrl)
        .then(res => {
          const { building, result } = res.data;
          if (!building) {
            if (result) {
              callback('Success', `Build Id ${buildId} of Job ${JENKINS_JOB_NAME} finished with ${result}`);
              status = true;      
            }
          }
        })
        .catch(err => callback('Error', `${err}`));
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  if (!status) callback('Error', 'Job Build Log could not be found');
};