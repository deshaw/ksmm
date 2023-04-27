import React, { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Form from '@rjsf/core';
import Validator from '@rjsf/validator-ajv8';
import EnvVarForm from './envvar';
import KsFormGroup from './ksformgroup';

const TabMenu = (props: any): JSX.Element => {
  const [tab, setTab] = useState('General Settings');
  /*
   * Generate the tab titles for the schema.
   */
  const menuHeaders = [
    'General Settings',
    'Launch Arguments',
    'Environment Variables',
  ];
  return (
    <Tabs
      defaultActiveKey={menuHeaders[0]}
      onSelect={(k: string | null) => {
        if (k) {
          setTab(k);
        }
      }}
    >
      {menuHeaders.map((menuHeader: string) => (
        <Tab
          eventKey={menuHeader}
          key={menuHeader}
          title={menuHeader}
          tabClassName="ksmm-tab-button"
        >
          <KsFormGroup
            mainprops={props}
            selectedTab={tab}
            properties={props.properties}
          />
        </Tab>
      ))}
    </Tabs>
  );
};

export const KsForm = (props: any): JSX.Element => {
  const uiSchema = {
    'ui:ObjectFieldTemplate': TabMenu,
    env: {
      'ui:autofocus': true,
      'ui:ObjectFieldTemplate': EnvVarForm,
      'ui:options': {
        expandable: true,
        inline: true,
      },
    },
  };
  return (
    <>
      <Form
        schema={props.schema}
        uiSchema={uiSchema}
        formData={props.formData}
        onSubmit={props.onSubmit}
        formContext={{}}
        validator={Validator}
      >
        <div className="ksmm-button-container">
          <Button
            type="submit"
            variant="primary"
            style={{ marginRight: '5px' }}
          >
            Submit
          </Button>
          <Button variant="secondary" onClick={() => props.onCancel()}>
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
};
