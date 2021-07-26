import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import Form from "@rjsf/bootstrap-4";
import { KeyValueWidget } from "./keyval";
import { EnvVarForm } from "./envvar";
import { IKsFormGroup } from "./ksmenu";

const TabMenu = (props: any): JSX.Element => {
  const [tab, setTab] = useState("General Settings");
  /*
   * Generate the menu titles for the schema.
   */
  var menuHeaders = [
    "General Settings",
    "Launch Arguments",
    "Quick Params",
//    "Environment Variables",
//    "Compute Parameters",
//    "Metadata",
  ];
  return (
    <Tabs
      defaultActiveKey={menuHeaders[0]}
      onSelect={(k: string) => setTab(k)}
    >
      {menuHeaders.map((menuHeader: string) => (
        <Tab eventKey={menuHeader} key={menuHeader} title={menuHeader}>
          <IKsFormGroup
            selecteditem={tab}
            properties={props.properties}
            handleAdditionalProperties={props.onAddClick}
            mainprops={props}
          />
        </Tab>
      ))}
    </Tabs>
  );
}

export const IKsForm = (props: any): JSX.Element => {
  const uiSchema = {
    "ui:ObjectFieldTemplate": TabMenu,
    env: {
      "ui:widget": KeyValueWidget,
      "ui:autofocus": true,
      "ui:ObjectFieldTemplate": EnvVarForm,
      "ui:options": {
        expandable: true,
      },
    },
  }
    console.log('IKSF', props)
  return (
    <>
      <Form
        schema={props.schema}
        uiSchema={uiSchema}
        formData={props.formData}
        onSubmit={props.onSubmit}
      />
      <Button variant="secondary" onClick={() => props.onCancel()}>Cancel</Button>
    </>
  );

}
