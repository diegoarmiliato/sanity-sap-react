import React, { ReactElement, useContext, FormEvent } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { InputType } from 'reactstrap/es/Input';
import { Context } from './store';
import { sanityTriggerActions } from './store/reducers/sanityTrigger';

const App = () : ReactElement => {

  const { state, dispatch } = useContext(Context);

  const { sanityTrigger } = state;

  interface inputType {
    state: keyof typeof sanityTrigger;
    label: string;
    type: InputType;
    options: string[]
    placeholder: string;
    regex?: RegExp;
  }

  const inputs : inputType[] = [
    { state: 'dbUser' as keyof typeof sanityTrigger, 
      label: 'Owner', 
      type: 'text', 
      options: [],
      placeholder: 'MasterData Schema (e.g TRSAP)'},
    { state: 'dbPass' as keyof typeof sanityTrigger, 
      label: 'Password', 
      type: 'text', 
      options: [],
      placeholder: 'Password of the Schema'},
    { state: 'dbTNS' as keyof typeof sanityTrigger, 
      label: 'TNS', 
      type: 'text', 
      options: [],
      placeholder: 'TNS Alias'},
    { state: 'osgtVersion' as keyof typeof sanityTrigger, 
      label: 'OSGT Version', 
      type: 'text', 
      options: [],
      placeholder: 'Version of OSGT Modules',
      regex: /[^0-9.]*/g},
    { state: 'itSapVersion' as keyof typeof sanityTrigger, 
      label: 'SAP Version', 
      type: 'text', 
      options: [],
      placeholder: 'Version of SAP Interfaces'},
    { state: 'wsURL' as keyof typeof sanityTrigger, 
      label: 'WS Url', 
      type: 'url', 
      options: [],
      placeholder: 'URL of the Webservices'},
    { state: 'dataCenter' as keyof typeof sanityTrigger, 
      label: 'Data Center', 
      type: 'select',
      options: [
        'Eagan',
        'Peapod'
      ],
      placeholder: 'Eagan / Peapod'},
    { state: 'mailTo' as keyof typeof sanityTrigger, 
      label: 'Email To', 
      type: 'text', 
      options: [],
      placeholder: 'Email address for sending report'}
  ];

  const renderInput = (input: inputType) => {
    if (input.type === 'select') {
      return(
        <Input id={input.state}
          type={input.type} 
          placeholder={input.placeholder}
          value={sanityTrigger[input.state]}                
          onChange={handleChange}>
          <option hidden selected/>
          {input.options.map(it => {
            return (
              <option key={it}>{it}</option>
            );})}
        </Input>
      );
    } else {
      return(
        <Input id={input.state}
          type={input.type} 
          placeholder={input.placeholder}
          value={sanityTrigger[input.state]}                
          onChange={handleChange}/>
      );
    }
  };

  const handleChange = (evt: FormEvent<HTMLInputElement>) => {
    const { currentTarget } = evt;
    const { id, value } = currentTarget;
    // Regex replaceAll
    const input = inputs.filter(it => it.state === id);
    const regex = input[0]['regex'];
    const newValue = (typeof regex !== 'undefined') ? value.replaceAll(regex, '') : value;    
    //
    dispatch( { type: sanityTriggerActions.SANITY_CHANGE_FORMDATA, 
      payload: {
        param: id,
        value: newValue.replaceAll(' ','')
      } });
  };

  return (
    <Form className="main-app-box">
      {inputs.map((input) => {
        return (
          <div key={input.state} className="row">
            <FormGroup className="form-input">
              <Label>{input.label}</Label>
              {renderInput(input)}
            </FormGroup>
          </div>
        );
      })}
      <div className="row">
        <FormGroup className="form-input">
          <Button type="submit">Validate</Button>
        </FormGroup>
      </div>
    </Form>
  );
};

export default App;
