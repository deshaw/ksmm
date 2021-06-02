import React, {useState} from 'react';
/*
 * Renders a widget for a python dict of
 * { 'string':'string', 'string':'string' }
 */
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