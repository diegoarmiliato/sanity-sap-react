import React, { createContext, ReactElement, useReducer, Dispatch} from 'react';
import { testInitialState, testReducer, testType } from './reducers/test';
import { sanityTriggerInitialState, sanityTriggerReducer, sanityTriggerType } from './reducers/sanityTrigger';
import { loadingInitialState, loadingReducer, loadingType } from './reducers/loading';
import { messageBoxInitialState, messageBoxReducer, messageBoxType } from './reducers/messageBox';

export interface actionType {
  payload: any;
  type: string;
}

export interface stateType {
  test: testType,
  sanityTrigger: sanityTriggerType,
  loading: loadingType,
  messageBox: messageBoxType
}

export const INITIAL_STATE = {
  test: testInitialState,
  sanityTrigger: sanityTriggerInitialState,
  loading: loadingInitialState,
  messageBox: messageBoxInitialState
};

const Context = createContext<{
  state: stateType;
  dispatch: Dispatch<any>;
}>({
  state: INITIAL_STATE,
  dispatch: () => null
});

const mainReducer = ( {test, sanityTrigger, loading, messageBox} : stateType, action : any) => ({
  test: testReducer(test, action),
  sanityTrigger: sanityTriggerReducer(sanityTrigger, action),
  loading: loadingReducer(loading, action),
  messageBox: messageBoxReducer(messageBox, action)
});

const Provider = ( { children } : any ) : ReactElement => {
  const [state, dispatch] = useReducer(mainReducer, INITIAL_STATE);
  return (
    <Context.Provider value={{state, dispatch}}>
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };