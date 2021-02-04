import { actionType } from '..';

export interface messageBoxType {
  active: boolean,
  header: string,
  body: string,
  callback?: () => void
}

export const messageBoxActions = {
  MESSAGEBOX_OPEN: 'MESSAGEBOX_OPEN',
  MESSAGEBOX_CLOSE: 'MESSAGEBOX_CLOSE'
};

export const messageBoxInitialState: messageBoxType = {
  active: false,
  header: '',
  body: '',
  callback: () => void 0
};

export const messageBoxReducer = (state: messageBoxType, action: actionType) : messageBoxType => {
  const { type, payload } = action;
  switch(type) {
  case messageBoxActions.MESSAGEBOX_OPEN:
    return { ...state, active: true, header: payload.header, body: payload.body, callback: payload.callback };
  case messageBoxActions.MESSAGEBOX_CLOSE:
    return { ...state, ...messageBoxInitialState };
  default:
    return { ...state };
  }
};