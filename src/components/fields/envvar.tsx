import React from 'react';

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