import React, { useState } from "react";
import KeyValueWidget from "./keyval";

const EnvVarForm = (props: any) => {
  const [toggle, setToggle] = useState(true);
  const formData = props.formData;
  const keys = Object.keys(formData);
  return (
    <>
      {
      keys.map((key: any) => {
        return (
          <div>
            <KeyValueWidget
              formKey={key}
              formData={formData}
              key={toggle}
            />
            <button
              type="button"
              onClick={(e: any) => {
                delete formData[key]
                setToggle(!toggle);
              }}
            >
              Delete
            </button>
          </div>
         );
        })
      }
      <button
        type="button"
        onClick={(e: any) => { 
          formData['NEW_ENV'] = 'new_value';
          setToggle(!toggle);
        }}
      >
        Add
      </button>
    </>
  );

}

export default EnvVarForm;
