import React, { useState } from "react";
import Form from "@rjsf/bootstrap-4";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { KeyValueWidget } from "./widgets/keyval";
import { EnvVarForm } from "./fields/envvar";
import { 
  IPythonFormGroup,
} from "./fields/ipymenu";

export const IPyForm = (props: any): JSX.Element => {
  const TabMenu = (props: any): JSX.Element => {
    const [tab, setTab] = useState("General Settings");
    /*
     * Generate the menu titles for the schema
     */
    var menuHeaders = [
      "General Settings",
      "Launch Arguments",
      "Environment Variables",
      "Compute Parameters",
      "Metadata",
    ];

    return (
      <div>
        <Tabs
          defaultActiveKey={menuHeaders[0]}
          onSelect={(k: string) => setTab(k)}
        >
          {menuHeaders.map((menuHeader: string) => (
            <Tab eventKey={menuHeader} key={menuHeader} title={menuHeader}>
              <IPythonFormGroup
                selecteditem={tab}
                properties={props.properties}
                handleAdditionalProperties={props.onAddClick}
                mainprops={props}
              />
            </Tab>
          ))}
        </Tabs>
      </div>
    );
  };

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
  };

  return (
    <div>
      <Form
        schema={props.schema}
        uiSchema={uiSchema}
        formData={props.formData}
        onSubmit={props.onSubmit}
      />
    </div>
  );
};
