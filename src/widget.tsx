import { ReactWidget } from '@jupyterlab/apputils';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/core";

/**
 * React component for listing the possible
 * ipykernel options.
 *
 * @returns The React component
 */
const CounterComponent = (): JSX.Element => {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const ipyschema: JSONSchema7 = {"title": "ipykernel mm", "type": "object", "properties": {"argv": {"type": "array", "items": {"type": "string"}}, "env": {"type": "object"}, "display_name": {"type": "string"}, "language": {"type": "string"}, "interrupt_mode": {"type": "string"}, "metadata": {"type": "object"}}, "required": ["argv", "display_name", "env", "interrupt_mode", "language", "metadata"]};

  useEffect(() => {

  const url  = 'http://localhost:8888/ks';
  const kernelSpec = async () => {
	  const response = await fetch(url);
	  const jsondata = response.json();
	  console.log(jsondata);
	  setData(jsondata);
	  setShowForm(true);
  };

  const timer = setTimeout(() => {
	  kernelSpec();
  }, 3000);

 
  return () => clearTimeout(timer);
  }, [
	 data
  ]);

  return (
    <div>
	    {showForm ?
		    <Form schema={ipyschema} /> :
		    <p> Loading... </p>
	    }
    </div>
  );
};

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class CounterWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  constructor() {
    super();
    this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    return <CounterComponent />;
  }
}
