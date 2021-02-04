import { actionType } from '..';

export interface testType {
    value: string
}

export const testActions = {
  TEST_DO: 'TEST_DO'
};

export const testInitialState: testType = {
  value: 'diego'
};

export const testReducer = (state: testType, action: actionType) : testType => {
  const { payload, type } = action;
  switch(type) {
  default:
    return { ...state, value: payload };
  }
};