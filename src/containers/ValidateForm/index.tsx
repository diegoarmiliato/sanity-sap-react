import React, { ReactElement, useContext, FormEvent } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { InputType } from 'reactstrap/es/Input';
import { Context } from '@src/store';
import { sanityTriggerActions, sanityTriggerInitialState } from '@reducers/sanityTrigger';
import { apiFileUpload } from '@src/api/file.io';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { loadingActions } from '@src/store/reducers/loading';
import { messageBoxActions } from '@src/store/reducers/messageBox';
import { apiTriggerBuild, apiTriggerBuildType } from '@src/api/jenkins';

interface inputType {
  state: keyof typeof sanityTriggerInitialState;
  label: string;
  type: InputType;
  options: string[]
  placeholder: string;
  valid: boolean;
  required: boolean;
  regex?: RegExp;    
}

let inputs : inputType[] = [
  { state: 'buildExec', 
    label: 'Build App', 
    type: 'checkbox', 
    options: [],
    placeholder: '',
    required: true,
    valid: true},
  { state: 'dbUser', 
    label: 'Owner', 
    type: 'text', 
    options: [],
    placeholder: 'MasterData Schema (e.g TRSAP)',
    required: true,
    valid: true},
  { state: 'dbPass', 
    label: 'Password', 
    type: 'text', 
    options: [],
    placeholder: 'Password of the Schema',
    required: true,
    valid: true},
  { state: 'dbTNS', 
    label: 'TNS', 
    type: 'text', 
    options: [],
    placeholder: 'TNS Alias',
    required: true,
    valid: true},
  { state: 'osgtVersion', 
    label: 'OSGT Version', 
    type: 'text', 
    options: [],
    placeholder: 'Version of OSGT Modules',
    required: true,
    valid: true,
    regex: /[^0-9.]*/g},
  { state: 'itSapVersion', 
    label: 'SAP Version', 
    type: 'text', 
    options: [],
    placeholder: 'Version of SAP Interfaces',
    required: true,
    valid: true,
    regex: /[^0-9.]*/g},
  { state: 'wsURL', 
    label: 'WS Url', 
    type: 'url', 
    options: [],
    placeholder: 'URL of the Webservices',
    required: false,
    valid: true},
  { state: 'dataCenter', 
    label: 'Data Center', 
    type: 'select',
    options: [
      'Eagan',
      'Peapod'
    ],
    placeholder: 'Eagan / Peapod',
    required: true,
    valid: true},
  { state: 'environment', 
    label: 'Environment', 
    type: 'select',
    options: [
      'PROJ',
      'QA',
      'PROD'
    ],
    placeholder: 'PROJ / QA / PROD',
    required: true,
    valid: true},
  { state: 'mailTo', 
    label: 'Email To', 
    type: 'email', 
    options: [],
    placeholder: 'Email address for sending report',
    required: true,
    valid: true},
];

const ValidateForm = () : ReactElement => {

  const { state, dispatch } = useContext(Context);

  const { sanityTrigger, loading } = state;

  let fileInput : HTMLInputElement | null;

  const renderInput = (input: inputType) => {
    switch (input.type) {
    case 'select':
      return(
        <Input id={input.state}
          type={input.type} 
          placeholder={input.placeholder}
          value={sanityTrigger[input.state]}                 
          onChange={handleChange}
          disabled={loading.active}>
          <option hidden/>
          {input.options.map(it => {
            return (
              <option key={it}>{it}</option>
            );})}
        </Input>
      );        
    case 'checkbox':
      return(
        <Input id={input.state}
          type={input.type} 
          placeholder={input.placeholder}
          checked={(sanityTrigger[input.state] === 'true') ? true : false}                 
          onChange={handleChange}
          disabled={loading.active}/>
      );           
    default:
      return(
        <Input id={input.state}
          type={input.type} 
          placeholder={input.placeholder}
          value={sanityTrigger[input.state]}                
          onChange={handleChange}
          disabled={loading.active}/>
      );
    }
  };

  const renderFileMessage = () => {
    if (sanityTrigger.fileUploaded.length == 0) {
      return (<p className="noselect"><b>Choose a .zip file</b> or drag it here</p>);
    } else {
      return (<p className="noselect">File <b>{sanityTrigger.fileUploaded}</b>
        <FontAwesomeIcon onClick={fileDownloadClear} icon={faTrash}/></p>);
    }
  };

  const handleChange = (evt: FormEvent<HTMLInputElement>) => {
    const { currentTarget } = evt;
    const { id, value, checked, type } = currentTarget;    
    // Regex replaceAll
    const input = inputs.filter(it => it.state === id);
    const regex = input[0]['regex'];
    const newValue = (typeof regex !== 'undefined') ? value.replaceAll(regex, '') : value;    
    //
    if (type !== 'checkbox') {
      setInputError(id, newValue);
      dispatch( { type: sanityTriggerActions.SANITY_CHANGE_FORMDATA, 
        payload: {
          param: id,
          value: newValue.replaceAll(' ','')
        } });
    } else {
      dispatch( { type: sanityTriggerActions.SANITY_CHANGE_FORMDATA, 
        payload: {
          param: id,
          value: (checked) ? 'true' : 'false'
        } });      
    }
  };

  const setInputError = (id: string, value: string) => {
    const currentStatus = () => {
      return (value) 
        ? ((value.length > 0) 
          ? true 
          : false) 
        : false;
    };
    inputs = inputs.map(input => {
      if (input.state === id) if (input.required) input.valid = currentStatus(); 
      return input;
    });
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch( { type: loadingActions.LOADING_ON } );    
    const apiCallback = (header: string, body: string) => {
      dispatch( { type: messageBoxActions.MESSAGEBOX_OPEN, 
        payload: {
          header,
          body,
          callback: () => dispatch( { type: loadingActions.LOADING_OFF } )
        } });
      if (header === 'Success') dispatch( { type: sanityTriggerActions.SANITY_FILE_REMOVE } );
    };
    const apiData : apiTriggerBuildType = {
      buildExec: (sanityTrigger.buildExec === 'true') ? true : false,
      sUser: sanityTrigger.dbUser,
      sPass: sanityTrigger.dbPass,
      tns: sanityTrigger.dbTNS,
      dbConn: '',
      osgtVersion: sanityTrigger.osgtVersion,
      itSapVersion: sanityTrigger.itSapVersion,
      wsUrl: sanityTrigger.wsURL.replace(/\/+$/, ''),
      parentBuild: '0',
      dataCenter: sanityTrigger.dataCenter,
      mailTo: sanityTrigger.mailTo,
      environment: sanityTrigger.environment,
      logUrl: sanityTrigger.fileUrl
    };
    apiTriggerBuild(apiData, apiCallback);
  };

  const handleFileDivDrag = (evt: React.DragEvent<HTMLDivElement>) => { 
    evt.preventDefault();   
    if (sanityTrigger.fileUploaded.length == 0) {
      const { type, currentTarget, dataTransfer } = evt; 
      const fileValidation = (type: string, target: EventTarget & HTMLDivElement, dataTransfer: DataTransfer) => {
        return (dataTransfer.items[0])
          ? (dataTransfer.items.length > 1 || dataTransfer.items[0].type !== 'application/x-zip-compressed')
            ? true
            : false
          : false;
      };
      const validated = fileValidation(type, currentTarget, dataTransfer);
      switch (evt.type) {
      case 'dragover':
        if (validated) {
          evt.currentTarget.style.backgroundColor = 'hsl(0, 77%, 90%)'; 
          evt.dataTransfer.dropEffect = 'none';
        } else {
          evt.currentTarget.style.backgroundColor = 'hsl(208, 100%, 97%)'; 
          evt.dataTransfer.dropEffect = 'copy';  
        }      
        break;
      case 'drop':
        evt.currentTarget.style.backgroundColor = 'inherit';
        triggerFileUpload(evt.dataTransfer.files);
        break;
      default:
        evt.currentTarget.style.backgroundColor = 'inherit';
      }    
    }
  };

  const fileDownloadOnClick = () => { 
    if (sanityTrigger.fileUploaded.length == 0) {
      const file = document.getElementById('file');
      if (file) file.click();
    }
  };

  const fileDownloadOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    triggerFileUpload(evt.currentTarget.files);
  };

  const triggerFileUpload = (files: FileList | null) => {
    if (files?.length == 1) {      
      const callback = (url?: string) => {   
        dispatch( { type: sanityTriggerActions.SANITY_FILE_UPLOAD, 
          payload: {
            file: files[0].name,
            url: url
          } 
        });
      };
      apiFileUpload(files[0], callback);
    }
  };

  const fileDownloadClear = () => {
    dispatch({ type: sanityTriggerActions.SANITY_FILE_REMOVE });
    if (fileInput) { fileInput.files = null; fileInput.value = '';}
  };

  const formIsValid = () => {
    const inputsValid = inputs.filter(input => (sanityTrigger[input.state].length == 0 && input.required));
    const specificInputsValid = inputs.filter(input => {
      if (input.type === 'email' || input.type === 'url') {    
        const element = document.getElementById(input.state) as HTMLInputElement;
        if (element) if (!element.validity.valid) return input;
      }
    });
    return (inputsValid.length == 0 && specificInputsValid.length == 0 && sanityTrigger.fileUrl.length > 0) ? true : false;
  };

  return (
    <Form id="form" className="main-app-box" onSubmit={handleSubmit}>
      {inputs.map((input) => {
        return (
          <div key={input.state} className="row">
            <FormGroup className={`form-input ${input.valid ? '' : 'error'}`}>
              <Label>{input.label}</Label>        
              {renderInput(input)}
            </FormGroup>
          </div>
        );
      })}
      <div className="row">
        <div className="upload" onClick={fileDownloadOnClick} onDrop={handleFileDivDrag} onDragOver={handleFileDivDrag} onDragLeave={handleFileDivDrag}> 
          {renderFileMessage()}
          <input type="file" id="file" accept=".zip" disabled={loading.active} onChange={fileDownloadOnChange} ref={(ref) => fileInput = ref}/>
        </div>
      </div>
      <div className="row">
        <FormGroup className="form-input" disabled={loading.active}>
          <Button id="submit" type="submit" disabled={!formIsValid()}>Validate</Button>
        </FormGroup>
      </div>
    </Form>
  );
};

export default ValidateForm;
