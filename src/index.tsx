import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from './store';

import '@assets/vendor/css/normalize.css';
import '@assets/css/styles.css';
import ValidateForm from './containers/ValidateForm';
import Loading from './containers/Loading';
import MessageBox from './containers/MessageBox';

ReactDOM.render(
  <Provider>
    <Loading/>
    <MessageBox/>
    <ValidateForm/>
  </Provider>,
  document.getElementById('root')
);