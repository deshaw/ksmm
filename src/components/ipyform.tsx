import React from "react";
//import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/bootstrap-4";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

//const iPyArgumentControl = (props: any): JSX.Element => {
//  return (
//    <div>
//      <h1> Hello </h1>
//    </div>
//  );
//};
//
//const iPyEnvironmentControl = (props: any): JSX.Element => {
//  return (
//    <div>
//      <p>{JSON.stringify(props)}</p>
//    </div>
//  );
//};

export const IPyForm = (props: any): JSX.Element => {
  /*
   * This function will generate tabs for the
   * keys in the main iPySchema Widget to be edited by the user
   */
  const TabMenu = (props: any): JSX.Element => {
    /*
     * Generate the menu titles for the schema
     */
    var menuTitles = [
      "General Settings",
      "Launch Arguments",
      "Environmennt Variables",
      "Compute Parameters",
      "Metadata",
    ];
    return (
      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
        <Tab eventKey="home" title="Home">
          <p> {JSON.stringify(props)} </p>
        </Tab>
        <Tab eventKey="profile" title="Profile">
          <p> hello </p>
        </Tab>
        {menuTitles.map((menuName: string) => (
          <Tab eventKey={menuName.toLowerCase()} title={menuName}></Tab>
        ))}
      </Tabs>
    );
  };

  const fields = {
    myCustomWidget: TabMenu,
  };

  const uiSchema = {
    "ui:field": "myCustomWidget",
  };

  return (
    <div>
      <Form
        schema={props.schema}
        uiSchema={uiSchema}
        fields={fields}
        formData={props.formData}
        onSubmit={props.onSubmit}
      />
    </div>
  );
};
