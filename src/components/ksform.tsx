import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import Form from "@rjsf/bootstrap-4";
import EnvVarForm from "./envvar";
import KsFormGroup from "./ksformgroup";

const TabMenu = (props: any): JSX.Element => {
  const [tab, setTab] = useState("General Settings");
  /*
   * Generate the tab titles for the schema.
   */
  var menuHeaders = [
    "General Settings",
    "Launch Arguments",
    "Environment Variables",
//    "Quick Params",
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
          <KsFormGroup
            mainprops={props}
            selectedTab={tab}
            properties={props.properties}
          />
        </Tab>
      ))}
    </Tabs>
  );
}

export const KsForm = (props: any): JSX.Element => {
  const uiSchema = {
    "ui:ObjectFieldTemplate": TabMenu,
    env: {
      "ui:autofocus": true,
      "ui:ObjectFieldTemplate": EnvVarForm,
      "ui:options": {
        expandable: true,
      },
    },
  }
  return (
    <>
      <Form
        schema={props.schema}
        uiSchema={uiSchema}
        formData={props.formData}
        onSubmit={props.onSubmit}
        formContext={{}}
      />
      <Button variant="secondary" onClick={() => props.onCancel()}>
        Cancel
      </Button>
    </>
  );
}
