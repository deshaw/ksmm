import React, { useState } from "react";

/*
 * This function has a callback to mutate the formData to
 * add a new 'string':'string' type to the dictionary.
 * 
 * Renders a widget for a dict of
 * { 'string':'string', 'string':'string' }
 */
const KeyValueWidget = (props: any) => {
  const [formKey, setFormKey] = useState(props.formKey);
  const [formVal, setFormVal] = useState(props.formData[formKey]);
  /*
   * Function to handle a change of key values in a key value store
   */
  const handleKeyChange = (oldKey: string, newKey: string) => {
    props.formData[newKey] = props.formData[oldKey];
    delete props.formData[oldKey];
    setFormKey(newKey);
  };
  /*
   * Function to handle any changing values
   */
  const handleValueChange = (key: string, newValue: string) => {
    props.formData[key] = newValue;
    setFormVal(newValue);
  }
  return (
    <>
      <input
        type="string"
        value={formKey}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleKeyChange(formKey, e.target.value);
        }}
      />
      <input
        type="string"
        value={formVal}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleValueChange(formKey, e.target.value);
        }}
      />
    </>
  );
}

export default KeyValueWidget;
