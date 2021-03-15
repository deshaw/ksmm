import { ReactWidget } from '@jupyterlab/apputils';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/bootstrap-4";
import ClipLoader from "react-spinners/ClipLoader";
import SelectorComponent from "./selector";

/**
 * React component for listing the possible
 * ipykernel options.
 *
 *
 * @returns The React component
 */
const CounterComponent = (): JSX.Element => {
  const [data, setData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showFormSelector, setShowFormSelector] = useState(false);
  const [selectedKernel, setSelectedKernel] = useState(false);
  
  const ipyschema: JSONSchema7 = {"title": "ipykernel mm", "type": "object", "properties": {"argv": {"type": "array", "items": {"type": "string"}}, "env": {"type": "object"}, "display_name": {"type": "string"}, "language": {"type": "string"}, "interrupt_mode": {"type": "string"}, "metadata": {"type": "object"}}, "required": ["argv", "display_name", "env", "interrupt_mode", "language", "metadata"]};

  const handleSelectedKernel = ({formData}: {formData:any}, e: any) => {
	/* Sets the selected kernel from the
	 * environment
	 */
	console.log(e.formData);
	setSelectedKernel(e.formData);
	setShowFormSelector(false);
	setShowForm(true);
	console.log(selectedKernel);
  };

  useEffect(() => {
  const url  = 'http://localhost:8888/ks';
  const kernelSpec = async () => {
	const response = await fetch(url);
	const jsondata = await response.json();
	setData(jsondata);
	console.log(jsondata);
	setShowFormSelector(true);
  };

  const timer = setTimeout(() => {
	kernelSpec();
  }, 5000);

 
  return () => { 
       clearTimeout(timer);
  };
  }, [
	 data,
  ])

  return (
    <div>
	    {
	     showFormSelector ?
		     <SelectorComponent handleSubmit={handleSelectedKernel} values={Object.keys(data)}/>:<ClipLoader color={"9ef832"} loading={true} size={150}/>
	    }
	    {
	     showForm ?
		     <Form schema={ipyschema} />: null
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
