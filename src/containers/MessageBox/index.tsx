import React, { ReactElement, useContext, useState } from 'react';
import { Context } from '@src/store';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { messageBoxActions } from '@src/store/reducers/messageBox';

const MessageBox = () : ReactElement => {

  const { state, dispatch } = useContext(Context);

  const { messageBox } = state;

  const MsgHeader = () => {
    return (messageBox.header)
      ? (<ModalHeader >{messageBox.header}</ModalHeader>)
      : (<></>);
  };

  const MsgBody = () => {
    return (messageBox.body)
      ? (<ModalBody >{messageBox.body}</ModalBody>)
      : (<></>);
  };

  const onClick = () => {
    if (messageBox.callback) messageBox.callback();
    dispatch({ type: messageBoxActions.MESSAGEBOX_CLOSE});
  };

  return (messageBox.active)
    ? (<Modal isOpen={true}>
      <MsgHeader/>
      <MsgBody/>
      <ModalFooter>
        <Button color="primary" onClick={onClick}>Ok</Button>
      </ModalFooter>
    </Modal>)
    : (<></>);
};

export default MessageBox;
