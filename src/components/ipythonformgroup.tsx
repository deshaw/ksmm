import React, { useState } from "react";

/*
 * This is a nested comoponenet in the FieldTemplate, and
 * does all the work for rendering the different optins in their
 * respective places.
 *
 * props:
 *
 * 	 data -> The data to render - namely, the data as defined in the schema
 */
export const IPythonFormGroup = (props: {
  properties: any;
  selecteditem: string;
  mainprops: any;
  handleAdditionalProperties: any;
}) => {
  const fg: any = generateFormGroupMap(props.properties);
  return (
    <div>
      {fg[props.selecteditem].map((index: number) => (
        <div className="property-wrapper" key={index}>
          {props.properties[index].content}
        </div>
      ))}
    </div>
  );
};

export const KeyValueWidget = (props: any) => {
  const [key, setKey] = useState(props.value.name);
  const [val, setVal] = useState(props.formData[props.value.name]);
  return (
    <div>
      <input
        type="string"
        value={key}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          props.handleKey(key, e.target.value);
          setKey(e.target.value);
        }}
      />
      <input
        type="string"
        value={val}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          props.handleVal(key, e.target.value);
          setVal(e.target.value);
        }}
      />
    </div>
  );
};

/*
 * This function is a field
 * that is rendered for the environment variable.
 */
export const EnvVarForm = (props: any) => {
  /*
   * Function to handle a change of key values in a key value store
   */
  const handleKeyChange = (key: string, newkey: string) => {
    props.formData[newkey] = props.formData[key];
    delete props.formData[key];
    console.log(props.formData);
  };

  /*
   * Function to handle any changing values
   */
  const handleValueChange = (key: string, newvalue: string) => {
    props.formData[key] = newvalue;
    console.log(props.formData);
  };

  const widget: (props: any) => JSX.Element = props.uiSchema["ui:widget"];
  const formData = props.formData;
  return (
    <div>
      {props.properties.map((item: any) =>
        widget(
          (props = {
            value: item,
            formData: formData,
            handleKey: handleKeyChange,
            handleVal: handleValueChange,
          })
        )
      )}
      <button
        type="button"
        onClick={(e: any) => {
          alert(props.onAddClick);
        }}
      >
        Add New
      </button>
    </div>
  );
};

/*
 * Grab the location of the element in the array,
 * returning a value of the postions in the array.
 */
function generateFormGroupMap(dataArr: any) {
  const GeneralSettingsArray: Array<number> = [];
  const LaunchArgumentsArray: Array<number> = [];
  const EnvironmentVariableArray: Array<number> = [];
  const ComputeParametersArray: Array<number> = [];
  const MetadataArray: Array<number> = [];
  dataArr.forEach((element: any) => {
    if (
      element.name == "display_name" ||
      element.name == "interrupt_mode" ||
      element.name == "language"
    ) {
      GeneralSettingsArray.push(dataArr.indexOf(element));
    } else if (element.name == "argv") {
      LaunchArgumentsArray.push(dataArr.indexOf(element));
    } else if (element.name == "env") {
      EnvironmentVariableArray.push(dataArr.indexOf(element));
    } else if (element.name == "parameters") {
      ComputeParametersArray.push(dataArr.indexOf(element));
    } else if (element.name == "metadata") {
      MetadataArray.push(dataArr.indexOf(element));
    } else {
      console.log("oopsies");
    }
  });
  return {
    ["General Settings"]: GeneralSettingsArray,
    ["Launch Arguments"]: LaunchArgumentsArray,
    ["Environment Variables"]: EnvironmentVariableArray,
    ["Compute Parameters"]: ComputeParametersArray,
    ["Metadata"]: MetadataArray,
  };
}
