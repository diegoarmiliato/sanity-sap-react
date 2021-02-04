import { actionType } from '..';

export interface sanityTriggerType {
  dbUser: string,
  dbPass: string,
  dbTNS: string,
  osgtVersion: string,
  itSapVersion: string,
  wsURL: string,
  dataCenter: string,
  mailTo: string,
  fileUploaded: string,
  fileUrl: string
}

export const sanityTriggerActions = {
  SANITY_CHANGE_FORMDATA: 'SANITY_CHANGE_FORMDATA',
  SANITY_FILE_UPLOAD: 'SANITY_FILE_UPLOAD',
  SANITY_FILE_REMOVE: 'SANITY_FILE_REMOVE'
};

// export const sanityTriggerInitialState: sanityTriggerType = {
//   dbUser: '',
//   dbPass: '',
//   dbTNS: '',
//   osgtVersion: '',
//   itSapVersion: '',
//   wsURL: '',
//   dataCenter: '',
//   mailTo: '',
//   fileUploaded: '',
//   fileUrl: ''
// };

export const sanityTriggerInitialState: sanityTriggerType = {
  dbUser: 'SFWSAP',
  dbPass: 'SFWSAP',
  dbTNS: 'ORCL',
  osgtVersion: '5.0.1',
  itSapVersion: '5.0.1',
  wsURL: 'http://c698kxksappi.intqa.thomsonreuters.com:8080',
  dataCenter: 'Eagan',
  mailTo: 'diegoarmiliato@gmail.com',
  fileUploaded: '1',
  fileUrl: 'http://1.com'
};

export const sanityTriggerReducer = (state: sanityTriggerType, action: actionType) : sanityTriggerType => {
  const { payload, type } = action;
  switch(type) {
  case sanityTriggerActions.SANITY_CHANGE_FORMDATA:
    return { ...state, [payload.param]: payload.value };
  case sanityTriggerActions.SANITY_FILE_UPLOAD:
    return { ...state, fileUploaded: payload.file, fileUrl: payload.url };
  case sanityTriggerActions.SANITY_FILE_REMOVE:
    return { ...state, fileUploaded: '', fileUrl: '' };
  default:
    return { ...state };
  }
};