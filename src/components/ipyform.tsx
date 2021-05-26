import React, { useState } from "react";
//import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/bootstrap-4";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { IPythonFormGroup } from "./ipythonformgroup";

export const IPyForm = (props: any): JSX.Element => {
  /*
   * This function will generate tabs for the
   * keys in the main iPySchema Widget to be edited by the user
   */

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
              <IPythonFormGroup selecteditem={tab} data={props.properties} />
            </Tab>
          ))}
        </Tabs>
      </div>
    );
  };

  const uiSchema = {
    "ui:ObjectFieldTemplate": TabMenu,
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
