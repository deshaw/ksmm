import React, { useState } from "react";
//import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/bootstrap-4";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { EnvVarForm, IPythonFormGroup } from "./ipythonformgroup";

export const IPyForm = (props: any): JSX.Element => {
    console.log(props.schema);
//	const EnvironmentWidget =  (props: any): JSX.Element => {
//		return(
//			<div>
//			<p> Variable Name: </p><input type="string"/>
//			<p> Value: </p><input type="string"/>
//			</div>
//		)
//	}
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
              <IPythonFormGroup selecteditem={tab} properties={props.properties} handleAdditionalProperties={props.onAddClick} mainprops={props}/>
            </Tab>
          ))}
        </Tabs>
      </div>
    );
  };

  const uiSchema = {
    "ui:ObjectFieldTemplate": TabMenu,
    env: {
      "ui:autofocus": true,
      "ui:field": EnvVarForm,
      "ui:options":  {
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
