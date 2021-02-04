import React, { ReactElement, useContext } from 'react';
import { Context } from '@src/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loading = () : ReactElement => {

  const { state } = useContext(Context);

  const { loading } = state;

  return (loading.active)
    ?  (<div className='loading'><FontAwesomeIcon icon={faSpinner} size='2x' spin/></div>)
    : (<></>);
};

export default Loading;
