import { actionType } from '..';

export interface loadingType {
  active: boolean
}

export const loadingActions = {
  LOADING_ON: 'LOADING_ON',
  LOADING_OFF: 'LOADING_OFF',
  LOADING_TOGGLE: 'LOADING_TOGGLE'
};

export const loadingInitialState: loadingType = {
  active: false
};

export const loadingReducer = (state: loadingType, action: actionType) : loadingType => {
  const { type } = action;
  switch(type) {
  case loadingActions.LOADING_ON:
    return { ...state, active: true };
  case loadingActions.LOADING_OFF:
    return { ...state, active: false };
  case loadingActions.LOADING_TOGGLE:
    return { ...state, active: !state.active };
  default:
    return { ...state };
  }
};